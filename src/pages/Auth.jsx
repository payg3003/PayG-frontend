import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'

const BASE = import.meta.env.VITE_API_BASE_URL

// ─── Determines if we have a real backend to talk to ─────────────────────────
const hasBackend = () => Boolean(BASE && BASE !== 'https://payg-mvp2-backend.onrender.com' || false)

// ─── Generate a local mock OTP for dev/demo mode ─────────────────────────────
const mockOtp = () => String(Math.floor(1000 + Math.random() * 9000))

export default function Auth() {
  const [mode, setMode]         = useState('phone')
  const [step, setStep]         = useState('input')   // input | otp
  const [value, setValue]       = useState('')
  const [otp, setOtp]           = useState(['', '', '', ''])
  const [devCode, setDevCode]   = useState(null)       // shown in amber banner in dev mode
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [resendTimer, setResendTimer] = useState(0)
  const refs = [useRef(), useRef(), useRef(), useRef()]
  const timerRef = useRef(null)
  const navigate = useNavigate()
  const { login } = useApp()

  // ─── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    if (mode === 'phone') {
      const clean = value.replace(/\s/g, '')
      if (!/^0[789]\d{9}$/.test(clean))
        return 'Enter a valid Nigerian number — e.g. 08012345678'
    }
    if (mode === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        return 'Enter a valid email address'
    }
    return null
  }

  // ─── Start resend countdown (60 seconds) ───────────────────────────────────
  const startCountdown = () => {
    setResendTimer(60)
    timerRef.current = setInterval(() => {
      setResendTimer(t => {
        if (t <= 1) { clearInterval(timerRef.current); return 0 }
        return t - 1
      })
    }, 1000)
  }

  // ─── Send OTP ──────────────────────────────────────────────────────────────
  const handleSend = async () => {
    const err = validate()
    if (err) { setError(err); return }
    setError('')
    setLoading(true)

    try {
      if (hasBackend()) {
        // ── Real backend ─────────────────────────────────────────────────────
        const res = await fetch(`${BASE}/auth/send-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            mode === 'phone' ? { phone: value } : { email: value }
          ),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'Failed to send code')

        if (data.devOtp) setDevCode(data.devOtp)
        else setDevCode(null)

      } else {
        // ── No backend — generate local code and show it on screen ───────────
        const code = mockOtp()
        setDevCode(code)
        console.log(`[PAYG DEV] OTP for ${value}: ${code}`)
        await new Promise(r => setTimeout(r, 900))
      }

      setStep('otp')
      startCountdown()
    } catch (e) {
      setError(e.message || 'Could not send code. Check your connection.')
    } fill {
      setLoading(false)
    }
  }

  // ─── Resend ────────────────────────────────────────────────────────────────
  const handleResend = async () => {
    if (resendTimer > 0) return
    setOtp(['', '', '', ''])
    setDevCode(null)
    setError('')
    await handleSend()
  }

  // ─── OTP input handling ────────────────────────────────────────────────────
  const handleOtpChange = (i, val) => {
    if (!/^\d*$/.test(val)) return
    const n = [...otp]; n[i] = val; setOtp(n)
    if (val && i < 3) refs[i + 1].current?.focus()
  }
  const handleOtpKey = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs[i - 1].current?.focus()
  }

  // ─── Auto-fill from dev banner ────────────────────────────────────────────
  const autoFill = () => {
    if (!devCode) return
    const digits = devCode.split('')
    setOtp(digits)
    setTimeout(() => refs[3].current?.focus(), 50)
  }

  // ─── Verify OTP ───────────────────────────────────────────────────────────
  const handleVerify = async () => {
    const code = otp.join('')
    if (code.length < 4) { setError('Enter the 4-digit code'); return }
    setError('')
    setLoading(true)

    try {
      if (hasBackend()) {
        // ── Real backend verification ────────────────────────────────────────
        const payload = mode === 'phone'
          ? { phone: value, otp: code }
          : { email: value, otp: code }

        const res = await fetch(`${BASE}/auth/verify-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'Verification failed')

        if (data.token) localStorage.setItem('payg_token', data.token)

        login({
          id:          data.user.id,
          phone:       data.user.phone,
          email:       data.user.email,
          firstName:   data.user.firstName,
          lastName:    data.user.lastName,
          isOnboarded: data.user.isOnboarded,
        })
        navigate(data.isNew ? '/onboarding' : '/dashboard')

      } else {
        // ── Dev mode: accept the shown code ──────────────────────────────────
        if (code !== devCode) {
          throw new Error(`Wrong code. The dev code is ${devCode} — click it to auto-fill.`)
        }
        await new Promise(r => setTimeout(r, 700))
        const isNew = !localStorage.getItem('payg_returning')
        if (isNew) localStorage.setItem('payg_returning', '1')
        login({
          phone: mode === 'phone' ? value : null,
          email: mode === 'email' ? value : null,
          firstName: null,
        })
        navigate(isNew ? '/onboarding' : '/dashboard')
      }
    } catch (e) {
      setError(e.message || 'Verification failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0D1117] flex flex-col max-w-lg mx-auto px-5 text-[#F0F6FC]">

      {/* Back Link */}
      <div className="pt-10">
        <Link to="/" className="inline-flex items-center gap-1.5 text-[#8B949E] text-sm hover:text-[#2DD4BF] transition-colors group">
          <span className="icon-o text-xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
          <span className="font-display font-medium">Back</span>
        </Link>
      </div>

      {/* Application Branding Header */}
      <div className="flex items-center gap-2.5 mt-6 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#2DD4BF] to-[#0D9488] flex items-center justify-center shadow-[0_0_20px_rgba(45,212,191,0.2)]">
          <span className="text-[#0D1117] text-xl icon">shield</span>
        </div>
        <span className="font-display font-black text-xl text-[#F0F6FC] tracking-wide">PAYG</span>
      </div>

      {/* ── STEP 1: Identification Input (Phone/Email Selector) ────────────────── */}
      {step === 'input' && (
        <div className="animate-[fadeIn_0.3s_ease-out]">
          <h1 className="font-display font-black text-3xl text-[#F0F6FC] mb-1">Welcome! 👋</h1>
          <p className="text-[#8B949E] text-sm mb-6">Sign in or create your automated insurance account</p>

          {/* Custom Mode Segment Switch */}
          <div className="flex bg-[#161B22] border border-[#30363D] rounded-2xl p-1 mb-6">
            {[
              ['phone', 'smartphone', 'Phone'],
              ['email', 'mail', 'Email']
            ].map(([m, ic, lb]) => (
              <button key={m} onClick={() => { setMode(m); setValue(''); setError('') }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-display font-semibold text-sm transition-all ${
                  mode === m 
                    ? 'bg-[#21262D] text-[#2DD4BF] shadow-[0_0_15px_rgba(45,212,191,0.1)] border border-[#30363D]' 
                    : 'text-[#8B949E] hover:text-[#F0F6FC]'
                }`}>
                <span className={`text-lg ${mode === m ? 'icon text-[#2DD4BF]' : 'icon-o'}`}>{ic}</span>
                {lb}
              </button>
            ))}
          </div>

          <label className="block text-[10px] font-display font-bold text-[#8B949E] uppercase tracking-wider mb-2">
            {mode === 'phone' ? 'Phone Number' : 'Email Address'}
          </label>

          {mode === 'phone' ? (
            <div className="flex gap-2 mb-1">
              <div className="flex items-center bg-[#161B22] border border-[#30363D] rounded-2xl px-3 h-14 text-sm font-display font-semibold text-[#8B949E] gap-1 flex-shrink-0">
                🇳🇬 +234
              </div>
              <input
                type="tel"
                value={value}
                onChange={e => { setValue(e.target.value.replace(/\D/g, '')); setError('') }}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="08012345678"
                maxLength={11}
                autoFocus
                className={`flex-1 bg-[#161B22] border-2 rounded-2xl h-14 px-4 text-lg font-display font-bold text-[#F0F6FC] transition-all outline-none ${
                  error ? 'border-red-500/50 focus:border-red-500' : 'border-[#30363D] focus:border-[#2DD4BF]'
                }`}
              />
            </div>
          ) : (
            <input
              type="email"
              value={value}
              onChange={e => { setValue(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="you@example.com"
              autoFocus
              className={`w-full bg-[#161B22] border-2 rounded-2xl h-14 px-4 text-base font-display font-bold text-[#F0F6FC] transition-all outline-none ${
                error ? 'border-red-500/50 focus:border-red-500' : 'border-[#30363D] focus:border-[#2DD4BF]'
              }`}
            />
          )}

          {error && (
            <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
              <span className="icon-o text-base">error</span>{error}
            </p>
          )}

          <button
            onClick={handleSend}
            disabled={loading}
            className="w-full mt-6 bg-gradient-to-r from-[#2DD4BF] to-[#0D9488] text-[#0D1117] font-display font-bold py-4 rounded-3xl shadow-[0_4px_20px_rgba(45,212,191,0.2)] hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-base">
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-[#0D1117]/30 border-t-[#0D1117] rounded-full animate-spin block"/>
                Sending code…
              </>
            ) : (
              <>
                <span className="icon-o text-xl">send</span>
                Send Verification Code
              </>
            )}
          </button>

          {/* Explainer Tip Card */}
          <div className="mt-5 p-4 bg-[#161B22] border border-[#2DD4BF]/10 rounded-2xl flex gap-3 items-start">
            <span className="icon text-[#2DD4BF] text-lg flex-shrink-0 mt-0.5">info</span>
            <p className="text-xs text-[#8B949E] font-display leading-relaxed">
              New to PAYG? We'll provision your profile balance automatically — <span className="text-[#2DD4BF] font-semibold">no passwords required</span>.
            </p>
          </div>
        </div>
      )}

      {/* ── STEP 2: One-Time Password Verification ──────────────────────────── */}
      {step === 'otp' && (
        <div className="animate-[fadeIn_0.3s_ease-out]">
          <h1 className="font-display font-black text-3xl text-[#F0F6FC] mb-1">
            {mode === 'phone' ? 'Check your SMS 📱' : 'Check your inbox 📧'}
          </h1>
          <p className="text-[#8B949E] text-sm mb-6">
            We sent a validation token to{' '}
            <span className="font-display font-bold text-[#2DD4BF]">{value}</span>
          </p>

          {/* Dev Simulated Sandboxed Gateway Banner */}
          {devCode && (
            <button
              onClick={autoFill}
              className="w-full mb-6 p-4 bg-[#1C1A14] border-2 border-amber-500/30 rounded-2xl text-left hover:bg-[#262218] transition-colors group">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="icon text-amber-400 text-lg">construction</span>
                  <p className="text-xs font-display font-bold text-amber-300/90">Sandbox Environment Mode:</p>
                </div>
                <span className="text-[10px] font-display font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full group-hover:bg-amber-400/20 transition-colors">
                  Tap to auto-fill →
                </span>
              </div>
              <p className="font-display font-black text-3xl text-amber-400 tracking-[0.3em] ml-7">
                {devCode}
              </p>
              <p className="text-[10px] text-amber-500/80 mt-1.5 ml-7 leading-normal">
                Simulated carrier loop. Tap this card to seamlessly forward the credentials into inputs.
              </p>
            </button>
          )}

          <label className="block text-[10px] font-display font-bold text-[#8B949E] uppercase tracking-wider mb-3">
            Verification Token
          </label>

          <div className="flex gap-3 mb-1">
            {otp.map((d, i) => (
              <input
                key={i}
                ref={refs[i]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={e => handleOtpChange(i, e.target.value)}
                onKeyDown={e => handleOtpKey(i, e)}
                className={`flex-1 aspect-square text-center font-display font-black text-2xl border-2 rounded-2xl transition-all outline-none ${
                  d 
                    ? 'border-[#2DD4BF] bg-[#2DD4BF]/10 text-[#2DD4BF] shadow-[0_0_15px_rgba(45,212,191,0.15)]' 
                    : 'border-[#30363D] bg-[#161B22] text-[#F0F6FC]'
                }`}
              />
            ))}
          </div>

          {error && (
            <p className="text-red-400 text-xs mt-3 mb-1 flex items-center gap-1">
              <span className="icon-o text-base">error</span>{error}
            </p>
          )}

          {/* Interactive Countdown/Resend Control */}
          <div className="flex items-center justify-between mt-4 mb-6">
            <p className="text-xs text-[#8B949E]">Didn't receive code?</p>
            {resendTimer > 0 ? (
              <p className="text-xs font-display text-[#8B949E]">
                Resend window opens in <span className="font-bold text-[#2DD4BF]">{resendTimer}s</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                className="text-xs font-display font-black text-[#2DD4BF] hover:underline bg-transparent border-none outline-none cursor-pointer">
                Resend Request
              </button>
            )}
          </div>

          <button
            onClick={handleVerify}
            disabled={loading || otp.join('').length < 4}
            className="w-full bg-gradient-to-r from-[#2DD4BF] to-[#0D9488] text-[#0D1117] font-display font-bold py-4 rounded-3xl shadow-[0_4px_20px_rgba(45,212,191,0.2)] hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 flex items-center justify-center gap-2 text-base mb-4">
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-[#0D1117]/30 border-t-[#0D1117] rounded-full animate-spin block"/>
                Authorizing session…
              </>
            ) : (
              <>
                <span className="icon-o">verified</span>
                Verify & Continue
              </>
            )}
          </button>

          <button
            onClick={() => { setStep('input'); setOtp(['', '', '', '']); setDevCode(null); setError(''); clearInterval(timerRef.current) }}
            className="w-full text-[#8B949E] text-xs font-display py-2 hover:text-[#F0F6FC] transition-colors bg-transparent border-none outline-none">
            ← Change address entry details
          </button>
        </div>
      )}

      {/* Footer Legal Terms Agreement Links */}
      <p className="mt-auto py-6 text-center text-[11px] text-[#8B949E] leading-relaxed">
        By authentication, you consent to our{' '}
        <Link to="/terms" className="text-[#2DD4BF] font-semibold hover:underline">Terms of Service</Link>{' '}
        and confirm access configuration under our{' '}
        <Link to="/privacy" className="text-[#2DD4BF] font-semibold hover:underline">Privacy Policy</Link>.
      </p>
    </div>
  )
}