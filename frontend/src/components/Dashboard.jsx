import React from 'react'
import { motion } from 'framer-motion'

const overviewCards = [
  { label: 'Total Interactions', value: '1,247', change: '+12%' },
  { label: 'Active HCPs', value: '89', change: '+5%' },
  { label: 'AI Insights', value: '342', change: '+18%' },
  { label: 'Voice Logs', value: '156', change: '+8%' },
]

const activity = [
  { title: 'Met with Dr. Smith', description: 'Cardiology follow-up and product recap', time: '2 hours ago', status: 'Positive' },
  { title: 'AI follow-up suggested', description: 'Follow-up email drafted for Dr. Patel', time: '4 hours ago', status: 'Pending' },
  { title: 'Voice log transcribed', description: 'Oncology call completed and converted', time: '6 hours ago', status: 'Completed' },
]

export default function Dashboard() {
  return (
    <motion.div
      className="min-h-screen bg-slate-100 p-8 lg:p-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35 }}
    >
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-[2rem] bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white shadow-2xl shadow-blue-500/20">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-blue-200">Overview</p>
              <h1 className="mt-4 text-4xl font-bold">Team performance snapshot</h1>
              <p className="mt-4 max-w-2xl text-sm text-blue-100/90 sm:text-base">
                AIVOA CRM helps you stay on top of interactions, HCP engagement, and AI-driven opportunities.
              </p>
            </div>
            <div className="rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-700/10">
              AI Status: Active
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {overviewCards.map((card) => (
            <motion.div
              key={card.label}
              className="rounded-[2rem] bg-white p-6 shadow-xl shadow-slate-200/70 border border-white"
              whileHover={{ y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">{card.label}</p>
              <p className="mt-4 text-4xl font-bold text-slate-950">{card.value}</p>
              <p className="mt-2 text-sm text-emerald-600">{card.change}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <motion.div
            className="col-span-2 rounded-[2rem] bg-white p-8 shadow-2xl shadow-slate-200/70 border border-white"
            whileHover={{ y: -6 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Recent activity</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-950">Latest interactions</h2>
              </div>
              <span className="rounded-full bg-indigo-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">Live feed</span>
            </div>
            <div className="mt-8 space-y-4">
              {activity.map((item) => (
                <div key={item.title} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-950">{item.title}</h3>
                      <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-4 text-sm text-slate-500">{item.time}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="rounded-[2rem] bg-gradient-to-br from-slate-950 to-slate-900 p-8 text-white shadow-2xl shadow-slate-950/20 border border-white/10"
            whileHover={{ y: -6 }}
            transition={{ duration: 0.25 }}
          >
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Insights</p>
            <h2 className="mt-4 text-2xl font-semibold">Actionable intelligence</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Quickly identify priority accounts and keep your team aligned with AI-prompted next steps.
            </p>
            <div className="mt-8 space-y-4">
              {['Best-performing regions', 'Follow-up reminders', 'Sentiment score'].map((item) => (
                <div key={item} className="rounded-3xl bg-white/10 p-4">
                  <p className="text-sm text-slate-200">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}