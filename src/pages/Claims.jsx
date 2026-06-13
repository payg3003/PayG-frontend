import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import AppLayout from '../components/AppLayout.jsx'
import PageHeader from '../components/PageHeader.jsx'

const CLAIM_TYPES = ['Outpatient', 'Inpatient', 'Pharmacy', 'Lab', 'Dental', 'Optical', 'Emergency', 'Other']

const STATUS_CFG = {
  submitted:    { label: 'Submitted',    bg: 'rgba(59,130,246,0.1)',   text: 'var(--primary-light)', icon: 'schedule' },
  under_review: { label: 'Under Review', bg: 'rgba(249,115,22,0.1)',   text: 'var(--orange)',        icon: 'manage_search' },
  approved:     { label: 'Approved',     bg: 'rgba(20,184,166,0.1)',   text: 'var(--teal)',          icon: 'check_circle' },
  rejected:     { label: 'Rejected',     bg: 'rgba(239,68,68,0.1)',    text: '#f87171',              icon: 'cancel' },
  paid:         { label: 'Paid',         bg: 'rgba(20,184,166,0.15)',  text: 'var(--teal)',          icon: 'payments' },
}

export default function Claims() {
  const { claims, submitClaim, subscription } = useApp()
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ type: '', description: '', amount: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.type) e.type = 'Please select a claims category branch'
    if (!form.description.trim()) e.description = 'Operational description statement required'
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) {
      e.amount = 'Valid numerical extraction matrix value required'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    setSubmitting(true)
    
    setTimeout(() => {
      submitClaim({
        type: form.type,
        description: form.description,
        amount: Number(form.amount)
      })
      setSubmitting(false)
      setSubmitted(true)
      setTimeout(() => {
        setShowForm(false)
        setSubmitted(false)
        setForm({ type: '', description: '', amount: '' })
      }, 1000)
    }, 1500)
  }

  const formatDate = (iso) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <AppLayout>
      <PageHeader 
        title="Claims Settlement Center" 
        subtitle="File real-time medical reimbursement requests directly against your active insurance matrix." 
      />

      <div className="min-h-screen py-8 px-6 lg:px-10 pb-24 relative" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
        {/* Background Decorative Element */}
        <div className="absolute top-[30%] right-5 w-[350px] h-[350px] rounded-full opacity-5 pointer-events-none filter blur-[100px]" style={{ background: 'var(--primary)' }}></div>

        <div className="max-w-4xl mx-auto relative z-10">
          
          {/* Main action block trigger */}
          {!showForm && (
            <div 
              className="p-6 rounded-2xl border mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-white mb-1">Initiate New Claims Ticket</h2>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Upload receipts and match diagnostics parameters for instantaneous settlement logic review.</p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider text-white transition-all active:scale-95 flex items-center gap-2 w-full md:w-auto justify-center shadow-lg"
                style={{ background: 'linear-gradient(90deg, var(--primary), var(--primary-light))' }}
              >
                <span className="icon text-sm">add_circle</span> File New Request
              </button>
            </div>
          )}

          {/* Form Node Block */}
          {showForm && (
            <div 
              className="p-6 rounded-2xl border mb-8 shadow-2xl animate-fade-in"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              <h3 className="font-display font-black text-lg text-white mb-5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--teal)' }}></span>
                Claims Parameter Configurations
              </h3>

              <div className="flex flex-col gap-5">
                {/* Field: Category Selector */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Claims Type Category</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {CLAIM_TYPES.map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => set('type', t)}
                        className={`py-3 px-2 text-xs font-bold rounded-xl border transition-all text-center ${
                          form.type === t ? 'border-none text-white' : 'text-white'
                        }`}
                        style={{
                          backgroundColor: form.type === t ? 'var(--primary)' : 'var(--surface-2)',
                          borderColor: form.type === t ? 'transparent' : 'var(--border)'
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  {errors.type && <p className="text-[10px] font-bold mt-0.5" style={{ color: 'var(--orange)' }}>{errors.type}</p>}
                </div>

                {/* Field: Currency Amount */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Total Financial Invoice (₦)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold opacity-50">₦</span>
                    <input
                      type="number"
                      value={form.amount}
                      onChange={e => set('amount', e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-9 pr-4 py-3.5 text-sm font-bold rounded-xl border text-white focus:outline-none transition-all"
                      style={{ backgroundColor: 'var(--surface-2)', borderColor: errors.amount ? 'var(--orange)' : 'var(--border)' }}
                    />
                  </div>
                  {errors.amount && <p className="text-[10px] font-bold mt-0.5" style={{ color: 'var(--orange)' }}>{errors.amount}</p>}
                </div>

                {/* Field: Narrative block */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Incident Description & Medical Context</label>
                  <textarea
                    rows="3"
                    value={form.description}
                    onChange={e => set('description', e.target.value)}
                    placeholder="Provide full hospital diagnostics metrics, prescription timelines, or event logging variables..."
                    className="w-full px-4 py-3.5 text-xs font-medium rounded-xl border text-white focus:outline-none transition-all"
                    style={{ backgroundColor: 'var(--surface-2)', borderColor: errors.description ? 'var(--orange)' : 'var(--border)' }}
                  />
                  {errors.description && <p className="text-[10px] font-bold mt-0.5" style={{ color: 'var(--orange)' }}>{errors.description}</p>}
                </div>

                {/* Core Execution Footers */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => { setShowForm(false); setErrors({}); }}
                    className="flex-1 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white border transition-all hover:bg-white/5"
                    style={{ backgroundColor: 'var(--surface-2)', borderColor: 'var(--border)' }}
                  >
                    Abstain
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || submitted}
                    className="flex-1 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider text-white transition-all flex items-center justify-center gap-2 shadow-lg"
                    style={{ 
                      background: submitted ? 'var(--teal)' : 'linear-gradient(90deg, var(--primary), var(--primary-light))',
                      opacity: submitting ? 0.7 : 1
                    }}
                  >
                    {submitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Routing Data...
                      </>
                    ) : submitted ? (
                      <>
                        <span className="icon text-sm">check_circle</span> Ticket Logged!
                      </>
                    ) : (
                      <>
                        <span className="icon text-sm">publish</span> Commit Claim Ledger
                      </>
                    )}
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* Historical Log list rendering nodes */}
          <div>
            <h3 className="font-display font-black text-xs uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>Historical Claim Invoices Ledger</h3>
            
            {!claims || claims.length === 0 ? (
              <div className="text-center py-16 border border-dashed rounded-2xl" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
                <span className="icon text-4xl opacity-30 mb-3 block text-white">receipt_long</span>
                <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>No historical claims pipelines parsed for this profile variable node.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {claims.map(item => {
                  const status = STATUS_CFG[item.status] || STATUS_CFG.submitted
                  return (
                    <div 
                      key={item.id}
                      className="p-5 rounded-2xl border flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-all"
                      style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-black text-white">{item.type} Protocol</span>
                          <span className="text-xs font-mono font-black" style={{ color: 'var(--teal)' }}>
                            ₦{Number(item.amount).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs leading-normal" style={{ color: 'var(--text-muted)' }}>{item.description}</p>
                        <p className="text-[10px] font-mono tracking-wider" style={{ color: 'var(--text-muted)', opacity: 0.5 }}>Logged: {formatDate(item.createdAt || item.date)}</p>
                      </div>

                      <div className="flex-shrink-0 self-start sm:self-center">
                        <div 
                          className="px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-black"
                          style={{ backgroundColor: status.bg, borderColor: 'transparent', color: status.text }}
                        >
                          <span className="icon text-sm">{status.icon}</span>
                          {status.label}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </AppLayout>
  )
}