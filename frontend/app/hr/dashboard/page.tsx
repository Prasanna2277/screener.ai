"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authFetch } from "@/lib/auth";

interface Job {
  id: number;
  title: string;
  created_at?: string;
}

interface Application {
  id: number;
  job_id: number;
  status: string;
}

export default function HrDashboard() {
  const router = useRouter();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🚪 Logout logic
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    router.push("/");
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        const jobsRes = await authFetch("http://127.0.0.1:8000/jobs");
        const appsRes = await authFetch("http://127.0.0.1:8000/applications");

        if (!jobsRes.ok || !appsRes.ok) {
          throw new Error("Failed to load dashboard data");
        }

        setJobs(await jobsRes.json());
        setApplications(await appsRes.json());
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-medium">
        Loading HR Dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 🔝 Header */}
      <header className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">HR Dashboard</h1>

        <div className="flex gap-4">
          <button
            onClick={() => router.push("/hr/create_job")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition"
          >
            ➕ Create Job
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* 📊 Stats */}
      <section className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500 text-sm">Total Jobs</h3>
          <p className="text-3xl font-bold text-indigo-600 mt-2">
            {jobs.length}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500 text-sm">Total Applications</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {applications.length}
          </p>
        </div>
      </section>

      {/* 📋 Jobs Table */}
      <section className="px-8 pb-8">
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">
              Job Listings
            </h2>
          </div>

          {jobs.length === 0 ? (
            <p className="p-6 text-gray-500">No jobs created yet.</p>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-sm text-gray-600">
                    Job Title
                  </th>
                  <th className="text-left px-6 py-3 text-sm text-gray-600">
                    Applications
                  </th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => {
                  const count = applications.filter(
                    (a) => a.job_id === job.id
                  ).length;

                  return (
                    <tr
                      key={job.id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {job.title}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {count}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
