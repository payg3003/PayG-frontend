import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import AppLayout from '../components/AppLayout.jsx'

// ─── LOCAL COMPONENTS ───────────────────────────────────────
function CoverageBar({ wallet, price }) {
  const pct = price > 0 ? Math.min((wallet / price) * 100, 100) : 0

  return (
    <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ 
          width: `${pct}%`,
          background: 'linear-gradient(90deg, var(--teal), var(--primary-light))'
        }}
      />
    </div>
  )
}

function StatusBadge({ status }) {
  const cfg = {
    active:   { bg: 'rgba(20,184,166,0.1)',   text: 'var(--teal)',          dot: 'var(--teal)',          label: 'Active' },
    pending:  { bg: 'rgba(249,115,22,0.1)',   text: 'var(--orange)',        dot: 'var(--orange)',        label: 'Pending' },
    inactive: { bg: 'rgba(255,255,255,0.05)', text: 'var(--text-muted)',    dot: 'var(--text-muted)',    label: 'Inactive' },
  }

  const current = cfg[status] || cfg.inactive

  return (
    <span 
      className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-xl flex items-center gap-1.5 border"
      style={{ backgroundColor: current.bg, color: current.text, borderColor: 'transparent' }}
    >
      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: current.dot }} />
      {current.label}
    </span>
  )
}

// ─── MAIN COMPONENT ──────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate()
  const { user, subscription, walletBalance, transactions, claims } = useApp()

  const currentPlan = subscription?.planName || 'Standard'
  const planPrice = subscription?.price || 1000
  const status = subscription?.status || 'inactive'

  const formatDate = (iso) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <AppLayout>
      <div className="min-h-screen py-8 px-6 lg:px-10 pb-24 relative" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
        {/* Ambient Top Glow Portal */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-10 pointer-events-none filter blur-[100px]" style={{ background: 'linear-gradient(90deg, var(--primary), var(--teal))' }}></div>

        <div className="max-w-5xl mx-auto relative z-10 flex flex-col gap-6">
          
          {/* Dashboard Context Greeting Banner */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4">
            <div>
              <h1 className="font-display font-black text-2xl lg:text-3xl text-white tracking-tight leading-none mb-1.5">
                Welcome back, {user?.firstName || 'Operator'}
              </h1>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                System Node ID: <span className="font-mono tracking-wider opacity-70">{user?.phone || 'Unknown'}</span> · Framework status stable.
              </p>
            </div>
            <StatusBadge status={status} />
          </div>

          {/* Grid Layout Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Main Insurance Wallet Component */}
            <div 
              className="p-6 rounded-2xl border md:col-span-2 flex flex-col justify-between shadow-xl"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                    Insurance Balance Wallet
                  </span>
                  <span className="icon text-white/40">account_balance_wallet</span>
                </div>
                <div className="flex items-baseline gap-1.5 mb-4">
                  <span className="text-4xl font-black text-white tracking-tight">
                    ₦{Number(walletBalance || 0).toLocaleString()}
                  </span>
                  <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>NGN</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-4">
                <div className="flex justify-between text-xs font-semibold">
                  <span style={{ color: 'var(--text-muted)' }}>Cycle Allocation Level ({currentPlan} Tier)</span>
                  <span className="text-white">₦{Number(walletBalance || 0).toLocaleString()} / ₦{planPrice.toLocaleString()}</span>
                </div>
                <CoverageBar wallet={walletBalance || 0} price={planPrice} />
                <button
                  onClick={() => navigate('/payment')}
                  className="w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-wider text-white transition-all hover:opacity-90 active:scale-[0.99] mt-2"
                  style={{ background: 'linear-gradient(90deg, var(--primary), var(--primary-light))' }}
                >
                  Fund Coverage Core Node
                </button>
              </div>
            </div>

            {/* Coverage Configuration Summary Card */}
            <div 
              className="p-6 rounded-2xl border flex flex-col justify-between shadow-xl relative overflow-hidden"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                    Active Protocols
                  </span>
                  <span className="icon text-white/40">shield</span>
                </div>
                <h3 className="font-display font-black text-2xl text-white tracking-tight mb-1">{currentPlan}</h3>
                <p className="text-xs leading-normal" style={{ color: 'var(--text-muted)' }}>
                  Micro-billing parameters extract exactly ₦{(planPrice).toLocaleString()} per validation interval.
                </p>
              </div>

              <button
                onClick={() => navigate('/plans')}
                className="w-full py-3.5 rounded-xl border text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-white/5 active:scale-[0.99] mt-6"
                style={{ backgroundColor: 'var(--surface-2)', borderColor: 'var(--border)' }}
              >
                Modify Tier Policy
              </button>
            </div>

          </div>

          {/* Ledger Splits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Claims Settlement Center Ledger Fragment */}
            <div 
              className="rounded-2xl border shadow-xl overflow-hidden"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              <div className="p-5 border-b flex justify-between items-center" style={{ borderColor: 'var(--border)' }}>
                <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  Claims Routing Pipelines
                </p>
                <button
                  onClick={() => navigate('/claims')}
                  className="text-xs font-black uppercase tracking-wider transition-all hover:opacity-80"
                  style={{ color: 'var(--primary-light)' }}
                >
                  Enter Portal
                </button>
              </div>

              <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {!claims || claims.length === 0 ? (
                  <p className="p-6 text-xs text-center font-medium" style={{ color: 'var(--text-muted)' }}>
                    No claims parsed for this token node.
                  </p>
                ) : (
                  claims.slice(0, 3).map(item => (
                    <div key={item.id} className="flex justify-between items-center px-5 py-4 transition-colors hover:bg-white/[0.01]">
                      <div>
                        <p className="text-xs font-bold text-white mb-0.5">{item.type} Case</p>
                        <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{formatDate(item.createdAt || item.date)}</p>
                      </div>
                      <span className="text-xs font-mono font-black" style={{ color: 'var(--orange)' }}>
                        ₦{Number(item.amount).toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Historical Extraction Payments Ledger */}
            <div 
              className="rounded-2xl border shadow-xl overflow-hidden"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              <div className="p-5 border-b flex justify-between items-center" style={{ borderColor: 'var(--border)' }}>
                <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  Recent Billings Ledger
                </p>
                <button
                  onClick={() => navigate('/payment')}
                  className="text-xs font-black uppercase tracking-wider transition-all hover:opacity-80"
                  style={{ color: 'var(--primary-light)' }}
                >
                  Review Invoices
                </button>
              </div>

              <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {!transactions || transactions.length === 0 ? (
                  <p className="p-6 text-xs text-center font-medium" style={{ color: 'var(--text-muted)' }}>
                    No payment historical logs parsed.
                  </p>
                ) : (
                  transactions.slice(0, 3).map(tx => (
                    <div key={tx.id} className="flex justify-between items-center px-5 py-4 transition-colors hover:bg-white/[0.01]">
                      <div>
                        <p className="text-xs font-bold text-white mb-0.5">{tx.type}</p>
                        <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{formatDate(tx.date)}</p>
                      </div>
                      <span className="text-xs font-mono font-black" style={{ color: 'var(--teal)' }}>
                        +₦{Number(tx.amount).toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </AppLayout>
  )
}