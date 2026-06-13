import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import AppLayout from '../components/AppLayout.jsx'
import PageHeader from '../components/PageHeader.jsx'

const HEALTH_PLANS = [
  { id:1, name:'Basic',    price:500,  tagline:'Essential protection',          icon:'local_hospital',   iconBg:'bg-blue-light',  iconColor:'text-blue-brand',   accentBorder:'border-blue-muted',
    features:['Clinic visits & consultations','Basic lab tests','Digital health records','SMS health alerts'] },
  { id:2, name:'Standard', price:1000, tagline:'Comprehensive care',            icon:'health_and_safety', iconBg:'bg-blue-brand',  iconColor:'text-white',        accentBorder:'border-blue-brand', featured:true,
    features:['Everything in Basic','24/7 virtual consultations','Specialized lab tests','Pharmacy discounts (20%)','Specialist referrals','Mental health support'] },
  { id:3, name:'Premium',  price:2000, tagline:'Full coverage, no compromises', icon:'workspace_premium', iconBg:'bg-amber-50',    iconColor:'text-amber-600',    accentBorder:'border-amber-300',
    features:['Everything in Standard','Private hospital ward','International coverage','Dedicated health concierge','Annual full-body checkup','Dental & optical care'] },
]

const LIFE_PLANS = [
  { id:4, name:'Basic',    price:800,  tagline:'Core life coverage',            icon:'shield',           iconBg:'bg-blue-light',  iconColor:'text-blue-brand',   accentBorder:'border-blue-muted',
    features:['₦2M death benefit','Accidental death cover','Beneficiary payout','Annual policy review'] },
  { id:5, name:'Standard', price:1500, tagline:'Family financial security',     icon:'family_restroom',  iconBg:'bg-blue-brand',  iconColor:'text-white',        accentBorder:'border-blue-brand', featured:true,
    features:['Everything in Basic','₦5M death benefit','Critical illness rider','Disability cover','Education fund for kids','Monthly family stipend'] },
  { id:6, name:'Premium',  price:3000, tagline:'Wealth & legacy protection',    icon:'workspace_premium', iconBg:'bg-amber-50',   iconColor:'text-amber-600',    accentBorder:'border-amber-300',
    features:['Everything in Standard','₦15M death benefit','Investment-linked savings','International coverage','Estate planning support','Priority claims processing'] },
]

const INSURANCE_TYPES = [
  { id: 'health', label: 'Health Insurance', icon: 'health_and_safety', desc: 'Cover medical bills & hospital visits' },
  { id: 'life',   label: 'Life Insurance',   icon: 'shield',            desc: 'Protect your family\'s financial future' },
]

export default function Plans() {
  const { subscription, changePlan, changeInsuranceType } = useApp()
  const navigate = useNavigate()

  const [insuranceType, setInsuranceType] = useState(subscription.insuranceType || 'health')
  const PLANS = insuranceType === 'health' ? HEALTH_PLANS : LIFE_PLANS

  const [selected, setSelected]   = useState(subscription.plan)
  const [expanded, setExpanded]   = useState(null)
  const [saving, setSaving]       = useState(false)
  const [saved, setSaved]         = useState(false)

  const selectedPlan = PLANS.find(p => p.name === selected)
  const currentPlan  = PLANS.find(p => p.name === subscription.plan)
  const isUpgrade    = selectedPlan && currentPlan && selectedPlan.price > currentPlan.price
  const isDowngrade  = selectedPlan && currentPlan && selectedPlan.price < currentPlan.price

  const handleTypeSwitch = (type) => {
    setInsuranceType(type)
    setSelected('Standard')
    setExpanded(null)
  }

  const handleConfirm = () => {
    if (selected === subscription.plan && insuranceType === (subscription.insuranceType || 'health')) {
      navigate('/dashboard'); return
    }
    setSaving(true)
    setTimeout(() => {
      changeInsuranceType(insuranceType)
      if (selectedPlan) changePlan(selectedPlan.id, selectedPlan.name, selectedPlan.price)
      setSaving(false); setSaved(true)
      setTimeout(() => navigate('/dashboard'), 1200)
    }, 1100)
  }

  const typeChanged = insuranceType !== (subscription.insuranceType || 'health')
  const planChanged = selected !== subscription.plan
  const hasChanges  = typeChanged || planChanged

  return (
    <>
      <AppLayout>
        <div className="pb-36 md:pb-20 md:pt-20">
          <PageHeader title="Choose a Plan" subtitle="Change takes effect next billing cycle"/>
          <div className="px-4 md:px-6 pt-4 flex flex-col gap-4">

            {/* Current plan info */}
            <div className="bg-blue-light border border-blue-muted rounded-2xl p-3 flex items-center gap-2">
              <span className="icon text-blue-brand text-lg">info</span>
              <p className="text-xs font-display font-semibold text-blue-brand">
                You're on the <span className="font-black">{subscription.plan}</span> plan · ₦{subscription.planPrice.toLocaleString()}/mo
              </p>
            </div>

            {/* Insurance Type Toggle */}
            <div>
              <p className="text-xs font-display font-bold text-ink-muted uppercase tracking-wider mb-2">Insurance Type</p>
              <div className="grid grid-cols-2 gap-3">
                {INSURANCE_TYPES.map(t => {
                  const isActive = insuranceType === t.id
                  const isCurrent = (subscription.insuranceType || 'health') === t.id
                  return (
                    <button key={t.id} onClick={() => handleTypeSwitch(t.id)}
                      className={`rounded-2xl border-2 p-4 text-left transition-all duration-200 flex flex-col gap-1.5
                        ${isActive ? 'border-blue-brand bg-blue-light' : 'border-ink-border bg-white hover:border-blue-muted'}`}>
                      <div className="flex items-center justify-between">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center
                          ${isActive ? 'bg-blue-brand' : 'bg-ink-faint'}`}>
                          <span className={`icon text-xl ${isActive ? 'text-white' : 'text-ink-muted'}`}>{t.icon}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {isCurrent && <span className="text-[9px] bg-green-light text-green-brand font-display font-bold px-2 py-0.5 rounded-full">Current</span>}
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all
                            ${isActive ? 'border-blue-brand bg-blue-brand' : 'border-ink-border'}`}>
                            {isActive && <span className="icon text-white text-[10px]">check</span>}
                          </div>
                        </div>
                      </div>
                      <p className={`font-display font-extrabold text-sm ${isActive ? 'text-blue-brand' : 'text-ink'}`}>{t.label}</p>
                      <p className="text-[11px] text-ink-muted leading-snug">{t.desc}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Plan Cards */}
            <div>
              <p className="text-xs font-display font-bold text-ink-muted uppercase tracking-wider mb-2">Select a Tier</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PLANS.map((p, idx) => {
                  const isSelected = selected === p.name
                  const isCurrent  = subscription.plan === p.name && !typeChanged
                  const isOpen     = expanded === p.name
                  return (
                    <div key={p.id}
                      className={`bg-white rounded-3xl border-2 overflow-hidden shadow-card transition-all duration-200 fu`}
                      style={{ animationDelay: `${idx * 0.08}s` }}>
                      <button className="w-full text-left p-5" onClick={() => { setSelected(p.name); setExpanded(isOpen ? null : p.name) }}>
                        {p.featured && (
                          <div className="flex justify-end mb-2">
                            <span className="text-[9px] bg-orange-brand text-white font-display font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">Most Popular</span>
                          </div>
                        )}
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-11 h-11 rounded-2xl ${p.iconBg} flex items-center justify-center flex-shrink-0`}>
                            <span className={`icon text-2xl ${p.iconColor}`}>{p.icon}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-display font-extrabold text-ink">{p.name}</span>
                              {isCurrent && <span className="text-[9px] bg-green-light text-green-brand font-display font-bold px-2 py-0.5 rounded-full">Current</span>}
                            </div>
                            <p className="text-xs text-ink-muted">{p.tagline}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-display font-black text-xl text-ink">₦{p.price.toLocaleString()}</p>
                            <p className="text-[10px] text-ink-muted">/month</p>
                          </div>
                        </div>
                        <div className={`flex items-center justify-between border-t pt-3 ${isSelected ? 'border-blue-brand' : 'border-ink-border'}`}>
                          <div className="flex items-center gap-2">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-blue-brand bg-blue-brand' : 'border-ink-border'}`}>
                              {isSelected && <span className="icon text-white text-xs">check</span>}
                            </div>
                            <span className={`text-xs font-display font-semibold ${isSelected ? 'text-blue-brand' : 'text-ink-muted'}`}>
                              {isSelected ? 'Selected' : 'Select this plan'}
                            </span>
                          </div>
                          <span className={`icon-o text-ink-muted text-xl transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
                        </div>
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 border-t border-ink-border bg-ink-faint scale-in">
                          <p className="text-[10px] font-display font-bold text-ink-muted uppercase tracking-wider mt-4 mb-3">What's included</p>
                          <div className="flex flex-col gap-2">
                            {p.features.map((f, i) => (
                              <div key={i} className="flex items-center gap-2.5 text-sm text-ink">
                                <span className="icon text-base text-green-brand flex-shrink-0">check_circle</span> {f}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Change notice */}
            {hasChanges && (
              <div className={`rounded-2xl p-4 flex gap-2 items-start border fu ${isUpgrade || typeChanged ? 'bg-green-light border-green-muted' : 'bg-orange-light border-orange-muted'}`}>
                <span className={`icon text-xl flex-shrink-0 ${isUpgrade || typeChanged ? 'text-green-brand' : 'text-orange-brand'}`}>
                  {typeChanged ? 'swap_horiz' : isUpgrade ? 'arrow_upward' : 'arrow_downward'}
                </span>
                <p className={`text-xs font-display font-semibold leading-relaxed ${isUpgrade || typeChanged ? 'text-green-brand' : 'text-orange-brand'}`}>
                  {typeChanged
                    ? `Switching to ${insuranceType === 'health' ? 'Health' : 'Life'} Insurance — ${selected} plan at ₦${selectedPlan?.price.toLocaleString()}/month. Change takes effect next billing cycle.`
                    : isUpgrade
                      ? `Upgrading to ${selected}. Your wallet will reset and you'll pay ₦${selectedPlan?.price.toLocaleString()}/month from next cycle.`
                      : `Downgrading to ${selected}. Change takes effect at the start of your next billing cycle.`}
                </p>
              </div>
            )}
          </div>

          {/* Confirm button */}
          <div className="fixed bottom-20 md:bottom-6 left-0 md:left-20 lg:left-56 right-0 px-4 md:px-6 z-30 max-w-3xl md:mx-auto">
            <button onClick={handleConfirm} disabled={saving || saved}
              className={`w-full font-display font-bold py-4 rounded-3xl text-white text-base transition-all active:scale-95 flex items-center justify-center gap-2 ${saved ? 'bg-green-brand' : 'bg-blue-brand hover:bg-blue-dark shadow-blue'} disabled:opacity-70`}>
              {saving ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full spin"/> Saving…</>
              : saved   ? <><span className="icon">check_circle</span> Plan Updated!</>
              : !hasChanges ? <><span className="icon-o">check</span> Keep {selected} Plan</>
              : <><span className="icon-o">save</span> Confirm — {selected} · ₦{selectedPlan?.price.toLocaleString()}/mo</>}
            </button>
          </div>
        </div>
      </AppLayout>
    </>
  )
}