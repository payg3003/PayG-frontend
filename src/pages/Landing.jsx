import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import logo from '../assets/logo.png'

// ✅ LOCAL IMAGES
import heroImg from '../assets/images/hero.jpg'
import walletImg from '../assets/images/wallet.jpg'
import hospitalImg from '../assets/images/hospital.jpg'
import claimsImg from '../assets/images/claims.jpg'
import secureImg from '../assets/images/secure.jpg'
import trustedImg from '../assets/images/trusted.jpg'
import mobileImg from '../assets/images/mobile.jpg'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } }
}

const insuranceTypes = [
  { icon: '🏥', label: 'Health' },
  { icon: '🚗', label: 'Auto' },
  { icon: '🏠', label: 'Home' },
  { icon: '✈️', label: 'Travel' },
  { icon: '💼', label: 'Business' },
  { icon: '❤️', label: 'Life' },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen text-base md:text-lg relative" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      
      {/* Background Ambience Glow Matrix */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.03] pointer-events-none filter blur-[120px]" style={{ background: 'var(--primary)' }}></div>
      <div className="absolute top-[40%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-[0.02] pointer-events-none filter blur-[120px]" style={{ background: 'var(--teal)' }}></div>

      {/* NAV */}
      <header className="fixed top-0 w-full z-50 border-b backdrop-blur-xl" style={{ backgroundColor: 'rgba(10, 10, 12, 0.8)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between px-6 h-18 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <img src={logo} className="w-8 h-8 object-contain" />
            <span className="font-extrabold text-white text-2xl tracking-tight">PAYG health</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/auth" className="text-sm font-bold tracking-wide hover:opacity-80 transition-opacity" style={{ color: 'var(--text-muted)' }}>
              Sign In
            </Link>
            <button
              onClick={() => navigate('/auth')}
              className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-white transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ background: 'linear-gradient(90deg, var(--primary), var(--primary-light))' }}
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      <main className="pt-24 relative z-10">

        {/* HERO */}
        <section className="px-6 py-24">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={stagger}
              className="text-center md:text-left"
            >
              <motion.span
                variants={fadeUp}
                className="inline-block border px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-6 shadow-xl"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--teal)' }}
              >
                📱 Pay for Insurance with Your Airtime
              </motion.span>

              <motion.h1
                variants={fadeUp}
                className="text-5xl md:text-6xl font-display font-black tracking-tight leading-tight mb-6 text-white"
              >
                PAYG
                <br />
                <span style={{ color: 'var(--primary-light)' }}>Paid with Airtime.</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-sm leading-relaxed mb-8 max-w-md mx-auto md:mx-0"
                style={{ color: 'var(--text-muted)' }}
              >
                PAYG lets you buy health, auto, home, travel, and more — using the airtime already on your phone. No bank account needed.
              </motion.p>

              {/* Insurance type pills */}
              <motion.div
                variants={fadeUp}
                className="flex flex-wrap gap-2 justify-center md:justify-start mb-8"
              >
                {insuranceTypes.map((type) => (
                  <span
                    key={type.label}
                    className="flex items-center gap-1.5 border px-4 py-1.5 rounded-full text-xs font-bold transition-colors hover:border-white/10"
                    style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
                  >
                    {type.icon} {type.label}
                  </span>
                ))}
              </motion.div>

              <motion.div variants={fadeUp} className="flex gap-4 justify-center md:justify-start">
                <button
                  onClick={() => navigate('/auth')}
                  className="px-7 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider text-white transition-all hover:opacity-90 active:scale-[0.98]"
                  style={{ background: 'linear-gradient(90deg, var(--primary), var(--primary-light))' }}
                >
                  Start with Airtime
                </button>
                <button
                  onClick={() => navigate('/auth')}
                  className="border px-7 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider text-white transition-all hover:bg-white/5 active:scale-[0.98]"
                  style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
                >
                  Sign In
                </button>
              </motion.div>
            </motion.div>

            {/* HERO IMAGE */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-transparent opacity-50 z-10 rounded-3xl pointer-events-none" />
              <img
                src={heroImg}
                className="rounded-3xl shadow-2xl h-[460px] w-full object-cover grayscale-[20%] border"
                style={{ borderColor: 'var(--border)' }}
              />
              {/* Floating airtime badge */}
              <div 
                className="absolute bottom-6 left-6 z-20 rounded-2xl shadow-2xl px-5 py-3 flex items-center gap-3 border"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
              >
                <span className="text-3xl">📱</span>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Paid with airtime</p>
                  <p className="text-xs font-bold text-white">MTN · Airtel · Glo · 9mobile</p>
                </div>
              </div>
            </motion.div>

          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="px-6 py-20 border-y" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="max-w-5xl mx-auto text-center"
          >
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-display font-black tracking-tight mb-3 text-white">
              How PAYG Works
            </motion.h2>
            <motion.p variants={fadeUp} className="text-xs mb-12 max-w-md mx-auto" style={{ color: 'var(--text-muted)' }}>
              Get covered in three simple steps — no paperwork, no bank visits.
            </motion.p>

            <div className="grid md:grid-cols-3 gap-8 text-left">
              {[
                {
                  step: '01',
                  title: 'Choose Your Coverage',
                  desc: 'Pick from health, auto, home, travel, life insurance, and more — all in one place.'
                },
                {
                  step: '02',
                  title: 'Pay with Airtime',
                  desc: 'Deduct your premium directly from your airtime balance. Works on all major Nigerian networks.'
                },
                {
                  step: '03',
                  title: 'Stay Protected',
                  desc: 'Your policy activates instantly. File claims, track coverage, and renew — all from your phone.'
                }
              ].map((item) => (
                <motion.div
                  key={item.step}
                  variants={fadeUp}
                  className="rounded-2xl p-6 border"
                  style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}
                >
                  <span className="text-4xl font-display font-black block mb-2" style={{ color: 'var(--teal)' }}>{item.step}</span>
                  <h3 className="font-display font-black text-sm text-white mb-2">{item.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* FEATURES */}
        <section className="px-6 py-28">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="max-w-6xl mx-auto"
          >
            <motion.div variants={fadeUp} className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-display font-black tracking-tight mb-3 text-white">Everything You Need</h2>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Built for Nigerians who want real coverage without the complexity.</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { img: walletImg, title: "Airtime Wallet", desc: "Top up anytime using your phone credit. No bank card, no stress — just your SIM." },
                { img: hospitalImg, title: "All Insurance Types", desc: "One app for health, motor, home, travel, and life insurance from trusted providers." },
                { img: claimsImg, title: "Instant Claims", desc: "Submit and track claims from your phone. Get updates in real time." }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="rounded-2xl overflow-hidden border shadow-xl transition-all hover:border-white/10"
                  style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
                >
                  <img src={item.img} className="h-52 w-full object-cover grayscale-[15%]" />
                  <div className="p-6">
                    <h3 className="font-display font-black text-sm text-white mb-2">{item.title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* TRUST */}
        <section className="px-6 py-24 border-t" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8"
          >
            {[
              { img: secureImg, title: "Secure Transactions", desc: "Every airtime payment is encrypted and verified before your policy is issued." },
              { img: trustedImg, title: "Licensed Providers", desc: "All insurance plans are from NAICOM-licensed Nigerian insurers you can trust." },
              { img: mobileImg, title: "100% Mobile", desc: "Buy, manage, and claim your insurance entirely from your phone — anytime, anywhere." }
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="rounded-2xl overflow-hidden border shadow-md transition-all hover:border-white/10"
                style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}
              >
                <img src={item.img} className="h-44 w-full object-cover grayscale-[15%]" />
                <div className="p-6">
                  <h3 className="font-display font-black text-sm text-white mb-2">{item.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* NETWORK LOGOS / SOCIAL PROOF */}
        <section className="px-6 py-14 border-t" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-[10px] font-black uppercase tracking-widest mb-6" style={{ color: 'var(--text-muted)' }}>
              Works with all Nigerian networks
            </p>
            <div className="flex flex-wrap items-center justify-center gap-12">
              {['MTN', 'Airtel', 'Glo', '9mobile'].map((network) => (
                <span key={network} className="text-xl font-mono font-black opacity-30 hover:opacity-60 transition-opacity text-white tracking-widest">
                  {network}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-28 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.05] pointer-events-none filter blur-[100px]" style={{ background: 'var(--primary)' }}></div>
          <div 
            className="max-w-5xl mx-auto text-center p-12 md:p-16 rounded-3xl border shadow-2xl relative z-10"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <span className="text-5xl block mb-6">📱</span>
            <h2 className="text-4xl md:text-5xl font-display font-black tracking-tight mb-4 text-white">
              Protected in minutes.
              <br />
              <span style={{ color: 'var(--teal)' }}>Paid with airtime.</span>
            </h2>
            <p className="text-xs mb-8 max-w-sm mx-auto leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Join thousands of Nigerians who already cover themselves — no bank account, no paperwork, just your phone.
            </p>
            <button
              onClick={() => navigate('/auth')}
              className="px-10 py-4 rounded-xl text-xs font-black uppercase tracking-wider text-white transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ background: 'linear-gradient(90deg, var(--primary), var(--primary-light))' }}
            >
              Get Covered with Airtime →
            </button>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t px-6 py-12 text-center text-xs" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
        <div className="flex items-center justify-center gap-2 mb-3">
          <img src={logo} className="w-5 h-5 object-contain" />
          <span className="font-extrabold text-white tracking-tight">PAYG</span>
        </div>
        <p className="font-medium">© {new Date().getFullYear()} PAYG. Pay-as-you-go insurance, powered by airtime.</p>
      </footer>

    </div>
  )
}