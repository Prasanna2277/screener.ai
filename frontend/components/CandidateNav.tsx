"use client";

import Link from "next/link";

export default function CandidateNav() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-white">
          <Link href="/candidate/dashboard">Screener.AI</Link>
        </div>
        
        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold shadow hover:bg-slate-100 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}