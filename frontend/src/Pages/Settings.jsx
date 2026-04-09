import { useState } from "react";

const toggleItems = {
  notifications: [
    { id: "email", label: "Email notifications", desc: "Receive interaction reminders via email", default: true },
    { id: "push", label: "Push notifications", desc: "Get alerts for new HCP activity", default: false },
    { id: "weekly", label: "Weekly summary", desc: "Digest of your interactions every Monday", default: true },
  ],
  security: [
    { id: "2fa", label: "Two-factor authentication", desc: "Extra security on sign-in", default: false },
    { id: "activity", label: "Activity log", desc: "Track login and account changes", default: true },
  ],
  display: [
    { id: "compact", label: "Compact view", desc: "Reduce spacing in lists and tables", default: false },
  ],
};

function ToggleRow({ label, desc, defaultOn }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
      </div>
      <button
        onClick={() => setOn(!on)}
        className={`w-10 h-5 rounded-full relative transition-colors ${on ? "bg-green-300" : "bg-gray-200"}`}
      >
        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${on ? "right-0.5" : "left-0.5"}`} />
      </button>
    </div>
  );
}

export default function Settings() {
  return (
      <div className="bg-gray-50 p-6 max-w-3xl mx-auto pb-20">

      <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-1">Configuration</p>
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>

      {[
        { title: "Notifications", key: "notifications" },
        { title: "Privacy & Security", key: "security" },
        { title: "Display", key: "display" },
      ].map(({ title, key }) => (
        <div key={key} className="bg-white border border-gray-100 rounded-2xl p-5 mb-4">
          <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-3 pb-2 border-b border-gray-50">
            {title}
          </p>
          {toggleItems[key].map((item) => (
            <ToggleRow key={item.id} label={item.label} desc={item.desc} defaultOn={item.default} />
          ))}
        </div>
      ))}
    </div>
  );
}