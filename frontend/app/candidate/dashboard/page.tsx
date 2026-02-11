"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CandidateNav from "@/components/CandidateNav";

export default function CandidateDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      router.replace("/login");
      return;
    }

    if (role !== "candidate") {
      router.replace("/login");
      return;
    }

    setLoading(false);
  }, []); // Empty dependency array

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <CandidateNav />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-white text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <CandidateNav />
      
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Welcome */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-10">
          <h2 className="text-3xl font-bold text-gray-800">
            Welcome, Candidate 👋
          </h2>
          <p className="text-gray-600 mt-2">
            Browse jobs, apply, and track your applications.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-sm font-semibold text-gray-500">
              Applications Submitted
            </h3>
            <p className="text-3xl font-bold text-indigo-600 mt-2">5</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-sm font-semibold text-gray-500">
              Under Review
            </h3>
            <p className="text-3xl font-bold text-yellow-600 mt-2">2</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-sm font-semibold text-gray-500">
              Job Offers
            </h3>
            <p className="text-3xl font-bold text-green-600 mt-2">1</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Quick Actions
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => router.push("/candidate/jobs")}
              className="bg-indigo-600 text-white py-3 rounded-lg font-semibold shadow hover:bg-indigo-700 transition"
            >
              🔍 Browse Jobs
            </button>

            <button
              onClick={() => router.push("/candidate/applications")}
              className="bg-purple-600 text-white py-3 rounded-lg font-semibold shadow hover:bg-purple-700 transition"
            >
              📄 My Applications
            </button>

            <button
              onClick={() => {
                localStorage.clear();
                router.push("/login");
              }}
              className="bg-red-600 text-white py-3 rounded-lg font-semibold shadow hover:bg-red-700 transition"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}