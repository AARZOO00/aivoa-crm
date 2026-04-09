import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const SERVICE_STRIP = ['CRM Analytics', 'AI Assistant', 'Voice Logging', 'HCP Management']

const SERVICE_CARDS = [
  {
    title: 'Interaction Logging',
    description: 'Capture every call, meeting, and field visit with AI-assisted structure.',
    icon: '📝',
  },
  {
    title: 'Analytics Dashboard',
    description: 'Monitor territory performance, trends, and opportunity scores in one view.',
    icon: '📈',
  },
  {
    title: 'Voice Transcription',
    description: 'Turn voice conversations into searchable CRM records instantly.',
    icon: '🎙️',
  },
  {
    title: 'AI Insights',
    description: 'Surface next-best actions, sentiment and clinical opportunity signals.',
    icon: '💡',
  },
]

const PROCESS_STEPS = [
  { step: '01', title: 'Capture Interaction', description: 'Log visits, calls and meetings instantly.' },
  { step: '02', title: 'AI Processing', description: 'Analyze language, sentiment and intent automatically.' },
  { step: '03', title: 'Data Structuring', description: 'Convert notes to clean CRM records.' },
  { step: '04', title: 'Insights Generated', description: 'Deliver actions, trends and recommendations.' },
]

const TESTIMONIALS = [
  {
    quote: 'AIVOA CRM transformed our field team’s productivity with intelligent follow-ups and insight tracking.',
    name: 'Priya Sharma',
    role: 'Regional Sales Director',
  },
  {
    quote: 'The voice logging and AI summarization cut our admin burden in half.',
    name: 'Dr. Ethan Cole',
    role: 'MSL Lead',
  },
]

const CLIENTS = ['Pfizer', 'Novartis', 'Roche', 'GSK', 'J&J']

const LandingPage = () => {
  const navigate = useNavigate()
  const handleGetStarted = () => navigate('/login')

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/95 backdrop-blur-xl shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg shadow-indigo-300/20 flex items-center justify-center text-lg font-black text-white">
              A
            </div>
            <div className="text-base font-semibold tracking-tight text-slate-900">AIVOA CRM</div>
          </div>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">Features</a>
            <a href="#services" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">Services</a>
            <a href="#process" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">How it works</a>
            <a href="#contact" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">Contact</a>
          </nav>
          <div className="flex items-center gap-3">
            <button
              onClick={handleGetStarted}
              className="rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Login
            </button>
            <button
              onClick={handleGetStarted}
              className="rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-950 px-6 pb-32 pt-24 text-white sm:px-8 lg:px-12">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_left,_rgba(96,165,250,0.3),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.22),_transparent_20%)]" />
        <div className="absolute -left-20 top-16 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute right-0 top-28 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-16 lg:flex-row lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
            className="w-full max-w-2xl lg:w-1/2"
          >
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-200">
              AI-Driven Healthcare CRM
            </span>
            <h1 className="mt-8 text-5xl font-black tracking-tight sm:text-6xl">
              Build deeper connections with <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-fuchsia-300">intelligent patient engagement</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-200">
              Unlock instant insights, automate follow-ups, and equip your teams with the CRM platform built to accelerate healthcare relationships and revenue growth.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <button
                onClick={handleGetStarted}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-8 py-4 text-sm font-semibold text-white shadow-xl shadow-cyan-500/25 transition duration-200 hover:-translate-y-0.5"
              >
                Start your trial
              </button>
              <a href="#about" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-4 text-sm font-semibold text-white transition duration-200 hover:bg-white/15">
                Explore features
              </a>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/10 px-5 py-4">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Time Saved</p>
                <p className="mt-3 text-3xl font-semibold text-white">24%</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/10 px-5 py-4">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Engagement</p>
                <p className="mt-3 text-3xl font-semibold text-white">82%</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/10 px-5 py-4">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Growth</p>
                <p className="mt-3 text-3xl font-semibold text-white">+38%</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
            className="w-full lg:w-1/2"
          >
            <div className="relative mx-auto max-w-3xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/90 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
              <div className="absolute -left-12 top-12 h-28 w-28 rounded-full bg-cyan-500/20 blur-3xl" />
              <div className="absolute right-6 top-8 h-24 w-24 rounded-full bg-fuchsia-500/15 blur-3xl" />
              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900 p-6">
                <div className="flex flex-col gap-6">
                  <div className="rounded-[1.75rem] bg-slate-950/95 p-5 shadow-lg shadow-slate-950/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">AIVOA CRM</p>
                        <p className="mt-2 text-lg font-semibold text-white">Sales & outreach summary</p>
                      </div>
                      <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-cyan-500 to-fuchsia-500 flex items-center justify-center text-sm font-bold text-slate-950">
                        AI
                      </div>
                    </div>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-3xl bg-slate-900/90 p-4">
                        <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Response rate</p>
                        <p className="mt-3 text-2xl font-semibold text-white">72%</p>
                      </div>
                      <div className="rounded-3xl bg-slate-900/90 p-4">
                        <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Leads logged</p>
                        <p className="mt-3 text-2xl font-semibold text-white">1,920</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[1.5rem] bg-gradient-to-br from-cyan-500/15 to-fuchsia-500/15 p-5">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Patient followups</p>
                      <p className="mt-4 text-3xl font-semibold text-white">+130</p>
                      <p className="mt-2 text-sm text-slate-400">Automated suggestions every week</p>
                    </div>
                    <div className="rounded-[1.5rem] bg-slate-950/95 p-5">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Clinical insights</p>
                      <p className="mt-4 text-3xl font-semibold text-white">98%</p>
                      <p className="mt-2 text-sm text-slate-500">Accuracy across sentiment models</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-20 overflow-hidden rounded-t-full bg-[#F8FAFC] pt-6">
          <svg viewBox="0 0 1200 120" className="w-full" preserveAspectRatio="none">
            <path d="M0 0c80 0 120 58 240 58s160-58 280-58 160 58 280 58 160-58 280-58 160 58 240 58v120H0V0z" fill="#F8FAFC" />
          </svg>
        </div>
      </section>

      <section className="bg-blue-600 py-6 text-white">
        <div className="mx-auto flex max-w-7xl gap-4 overflow-x-auto px-6 sm:px-8 scrollbar-thin scrollbar-thumb-slate-400/40">
          {SERVICE_STRIP.map((item) => (
            <div key={item} className="min-w-[220px] rounded-3xl border border-white/10 bg-white/10 px-5 py-4 text-sm font-semibold shadow-lg shadow-slate-950/10 backdrop-blur transition hover:-translate-y-0.5">
              <div className="mb-2 text-3xl">✅</div>
              <div>{item}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="py-24 px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="relative flex justify-center"
          >
            <div className="absolute -left-8 top-10 h-40 w-40 rounded-[2.5rem] bg-gradient-to-br from-blue-500 to-violet-500 opacity-20 blur-3xl" />
            <div className="grid gap-6">
              <div className="h-72 w-72 rounded-[2.5rem] bg-white shadow-2xl shadow-slate-200/40" />
              <div className="-ml-8 mt-6 h-56 w-56 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 shadow-2xl shadow-blue-500/20" />
              <div className="absolute right-0 top-24 h-32 w-32 rounded-[2rem] bg-blue-500/20 blur-2xl" />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="space-y-8"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-blue-600">Transforming Healthcare with AI</p>
            <h2 className="text-4xl font-bold text-slate-950 sm:text-5xl">Transforming Healthcare with AI</h2>
            <p className="max-w-xl text-lg leading-8 text-slate-600">
              AIVOA CRM empowers healthcare teams with automated workflows, intelligent insights, and voice-driven data capture for faster, smarter engagement.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { value: '150+', label: 'Enterprise users' },
                { value: '2,000+', label: 'Interactions logged' },
                { value: '99%', label: 'Satisfaction rate' },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                  <p className="text-xl font-semibold text-slate-950">{item.value}</p>
                  <p className="mt-2 text-sm text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="py-24 px-6 lg:px-8 bg-[#F8FAFC]">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-14">
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">Features</p>
            <h2 className="mt-4 text-4xl font-bold text-slate-950">Services We Provide</h2>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">A premium suite of CRM capabilities that simplify engagement, intelligence, and execution for life sciences teams.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {SERVICE_CARDS.map((service) => (
              <motion.div
                key={service.title}
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="group rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-violet-500 text-2xl text-white shadow-lg shadow-blue-500/10">
                  {service.icon}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-slate-950">{service.title}</h3>
                <p className="mt-3 text-slate-600 leading-7">{service.description}</p>
                <div className="mt-6 text-sm font-semibold text-blue-600 group-hover:text-violet-600">Learn more →</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-14">
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">Work Process</p>
            <h2 className="mt-4 text-4xl font-bold text-slate-950">How AIVOA CRM Works</h2>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">A streamlined process from capture to insight designed to accelerate healthcare CRM outcomes.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-4">
            {PROCESS_STEPS.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.65, delay: index * 0.1 }}
                className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/50"
              >
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-violet-500 text-lg font-bold text-white shadow-lg shadow-blue-500/10">
                  {item.step}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-3 text-slate-600 leading-7">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-8 bg-[#F8FAFC]">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-end">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7 }}
              className="space-y-6"
            >
              <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">Trusted by clinical teams</p>
              <h2 className="text-4xl font-bold text-slate-950">Loved by teams across life sciences.</h2>
              <p className="max-w-xl text-slate-600 leading-8">AIVOA CRM is designed for field teams, medical science liaisons, and regional managers who need speed, insight, and compliance in every interaction.</p>
              <div className="space-y-4">
                {TESTIMONIALS.map((testimonial) => (
                  <div key={testimonial.name} className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
                    <p className="text-slate-700">“{testimonial.quote}”</p>
                    <p className="mt-4 text-sm font-semibold text-slate-900">{testimonial.name}</p>
                    <p className="text-xs text-slate-500">{testimonial.role}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7 }}
              className="rounded-[2rem] border border-slate-200 bg-slate-950 p-10 text-white shadow-2xl shadow-slate-950/20"
            >
              <p className="text-sm uppercase tracking-[0.3em] text-blue-300">Key outcomes</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  { value: '98%', label: 'Fast adoption' },
                  { value: '4.9/5', label: 'Review score' },
                  { value: '3x', label: 'Workflow velocity' },
                ].map((item) => (
                  <div key={item.label} className="rounded-3xl bg-slate-900/90 p-5">
                    <p className="text-3xl font-bold">{item.value}</p>
                    <p className="mt-2 text-sm text-slate-400">{item.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-3">
          {CLIENTS.map((client) => (
            <div key={client} className="flex items-center justify-center rounded-3xl border border-slate-200 bg-white py-6 text-sm font-semibold text-slate-600 shadow-sm">
              {client}
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="py-20 px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-violet-600 text-white">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-white/5 p-10 shadow-2xl shadow-slate-950/20">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-blue-200">Ready to modernize your CRM?</p>
              <h2 className="mt-3 text-4xl font-bold tracking-tight">Start your AI-driven healthcare CRM journey today.</h2>
              <p className="mt-4 text-slate-100 max-w-2xl">Talk to our team about onboarding, analytics integrations, and specialist workflows for life sciences.</p>
            </div>
            <button
              onClick={handleGetStarted}
              className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-sm font-semibold text-slate-950 shadow-xl shadow-slate-950/20 transition duration-200 hover:-translate-y-0.5"
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 text-white py-14 px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xl font-semibold">AIVOA CRM</p>
            <p className="mt-3 max-w-md text-slate-400">AI-powered CRM for healthcare teams that need modern workflows, intelligent insights, and effortless collaboration.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href="#" className="text-sm text-slate-400 transition hover:text-white">Terms</a>
            <a href="#" className="text-sm text-slate-400 transition hover:text-white">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage