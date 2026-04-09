import { useSelector } from "react-redux";
import { useState } from "react";

export default function Profile() {
  const user = useSelector((state) => state.auth?.user);
  const [name, setName] = useState(user?.name || "Sales Rep");
  const [email, setEmail] = useState(user?.email || "");

  return (
      <div className="bg-gray-50 p-6 max-w-3xl mx-auto pb-20">

      <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-1">Settings</p>
      <h1 className="text-2xl font-semibold mb-6">Account & Security</h1>

      {/* Profile Header Card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-4 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-lg font-semibold flex-shrink-0">
          {user?.name?.[0]?.toUpperCase() || "S"}
          {user?.name?.split(" ")[1]?.[0]?.toUpperCase() || "R"}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-base">{user?.name || "Sales Rep"}</p>
          <p className="text-sm text-gray-400 mb-2">{user?.email || "google@gmail.com"}</p>
          <div className="flex gap-2">
            <span className="text-xs bg-purple-50 text-purple-600 px-3 py-1 rounded-full font-medium">
              {user?.role || "Rep"}
            </span>
            <span className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>
              Active
            </span>
          </div>
        </div>
        <button className="text-sm text-purple-500 font-medium">Edit photo</button>
      </div>

      {/* Personal Information */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-4">
        <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-4">Personal Information</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Full name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-300"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Email address</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-300"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Role</label>
            <input
              value={user?.role || "Rep"}
              readOnly
              className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm text-gray-400 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Territory</label>
            <input
              value={user?.territory || "Northeast"}
              readOnly
              className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm text-gray-400 cursor-not-allowed"
            />
          </div>
        </div>
        <button className="mt-4 px-5 py-2 bg-purple-50 text-purple-600 border border-purple-200 rounded-lg text-sm font-medium hover:bg-purple-100 transition">
          Save changes
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: "Role", value: user?.role || "Rep", color: "" },
          { label: "Territory", value: user?.territory || "Northeast", color: "" },
          { label: "Status", value: "Active", color: "text-green-600" },
        ].map((item) => (
          <div key={item.label} className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
            <p className={`font-medium ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Danger Zone */}
      <div className="bg-white border border-orange-100 rounded-2xl p-5">
        <p className="text-sm font-medium text-red-700 mb-1">Danger zone</p>
        <p className="text-sm text-gray-400 mb-3">Sign out of your account on this device.</p>
        <button className="px-5 py-2 bg-orange-50 text-red-600 border border-orange-200 rounded-lg text-sm font-medium hover:bg-orange-100 transition">
          Sign out
        </button>
      </div>
    </div>
  );
}