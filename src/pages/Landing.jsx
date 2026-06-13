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
    <div className="min-h-screen bg-white text-gray-900 text-base md:text-lg">

      {/* NAV */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="flex items-center justify-between px-6 h-18">
          <div className="flex items-center gap-3">
            <img src={logo} className="w-8 h-8 object-contain" />
            <span className="font-extrabold text-blue-600 text-2xl">PAYG</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/auth" className="text-base font-medium hover:text-blue-600">
              Sign In
            </Link>
            <button
              onClick={() => navigate('/auth')}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      <main className="pt-24">

        {/* HERO */}
        <section className="px-6 py-24 bg-gray-50">
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
                className="inline-block bg-white text-blue-600 px-5 py-1.5 rounded-full text-sm font-bold mb-6 shadow-sm"
              >
                📱 Pay for Insurance with Your Airtime
              </motion.span>

              <motion.h1
                variants={fadeUp}
                className="text-5xl md:text-6xl font-black leading-tight mb-6"
              >
                Any Insurance.
                <br />
                <span className="text-blue-600">Paid with Airtime.</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-gray-600 text-xl mb-8 max-w-md mx-auto md:mx-0"
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
                    className="flex items-center gap-1.5 bg-white border border-gray-200 px-4 py-1.5 rounded-full text-sm font-medium text-gray-700 shadow-sm"
                  >
                    {type.icon} {type.label}
                  </span>
                ))}
              </motion.div>

              <motion.div variants={fadeUp} className="flex gap-4 justify-center md:justify-start">
                <button
                  onClick={() => navigate('/auth')}
                  className="bg-blue-600 text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-blue-700"
                >
                  Start with Airtime
                </button>
                <button
                  onClick={() => navigate('/auth')}
                  className="border border-gray-300 px-7 py-3.5 rounded-xl font-semibold hover:border-blue-600"
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
              <img
                src={heroImg}
                className="rounded-3xl shadow-2xl h-[460px] w-full object-cover"
              />
              {/* Floating airtime badge */}
              <div className="absolute bottom-6 left-6 bg-white rounded-2xl shadow-xl px-5 py-3 flex items-center gap-3">
                <span className="text-3xl">📱</span>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Paid with airtime</p>
                  <p className="text-sm font-bold text-gray-900">MTN · Airtel · Glo · 9mobile</p>
                </div>
              </div>
            </motion.div>

          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="px-6 py-20 bg-blue-600 text-white">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="max-w-5xl mx-auto text-center"
          >
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black mb-3">
              How PAYG Works
            </motion.h2>
            <motion.p variants={fadeUp} className="text-blue-100 mb-12 text-lg">
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
                  className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm"
                >
                  <span className="text-5xl font-black text-white/20 block mb-4">{item.step}</span>
                  <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                  <p className="text-blue-100 text-base">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* FEATURES */}
        <section className="px-6 py-28 bg-white">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="max-w-6xl mx-auto"
          >
            <motion.div variants={fadeUp} className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-black mb-3">Everything You Need</h2>
              <p className="text-gray-500 text-lg">Built for Nigerians who want real coverage without the complexity.</p>
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
                  className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition"
                >
                  <img src={item.img} className="h-52 w-full object-cover" />
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-1">{item.title}</h3>
                    <p className="text-gray-500 text-base">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* TRUST */}
        <section className="px-6 py-24 bg-gray-50">
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
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition"
              >
                <img src={item.img} className="h-44 w-full object-cover" />
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                  <p className="text-gray-500 text-base">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* NETWORK LOGOS / SOCIAL PROOF */}
        <section className="px-6 py-14 bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gray-400 text-sm font-semibold uppercase tracking-widest mb-6">
              Works with all Nigerian networks
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {['MTN', 'Airtel', 'Glo', '9mobile'].map((network) => (
                <span key={network} className="text-2xl font-black text-gray-300 hover:text-gray-500 transition">
                  {network}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-28">
          <div className="max-w-5xl mx-auto bg-blue-600 text-white text-center p-16 rounded-3xl shadow-xl">
            <span className="text-5xl block mb-6">📱</span>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Protected in minutes.
              <br />
              Paid with airtime.
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-lg mx-auto">
              Join thousands of Nigerians who already cover themselves — no bank account, no paperwork, just your phone.
            </p>
            <button
              onClick={() => navigate('/auth')}
              className="bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition"
            >
              Get Covered with Airtime →
            </button>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 px-6 py-8 text-center text-gray-400 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img src={logo} className="w-5 h-5 object-contain" />
          <span className="font-bold text-gray-700">PAYG</span>
        </div>
        <p>© {new Date().getFullYear()} PAYG. Pay-as-you-go insurance, powered by airtime.</p>
      </footer>

    </div>
  )
}