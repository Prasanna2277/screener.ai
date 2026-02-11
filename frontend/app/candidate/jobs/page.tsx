"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "@/components/nav";

interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  experience_level: string;
  company_name: string;
  created_by: number;
}

export default function CandidateJobs() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication
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

    // Fetch jobs
    fetchJobs();
  }, [router]);

  const fetchJobs = async () => {
    try {
      setError(null);
      const response = await fetch("http://127.0.0.1:8000/jobs");
      
      if (!response.ok) {
        throw new Error(`Failed to fetch jobs: ${response.status}`);
      }
      
      const data = await response.json();
      setJobs(data);
    } catch (error: any) {
      console.error("Error fetching jobs:", error);
      setError(error.message || "Failed to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (jobId: number) => {
    // For now, just show an alert. You can implement actual application logic later.
    alert(`Applying for job ID: ${jobId}`);
    // You can add actual application logic here, like:
    // router.push(`/candidate/apply/${jobId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Nav />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-white text-lg">Loading jobs...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Nav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Available Jobs</h1>
            <p className="text-gray-300">
              Browse and apply for jobs that match your skills
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push("/candidate/dashboard")}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition"
            >
              ← Dashboard
            </button>
            <button
              onClick={fetchJobs}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg">
            <div className="flex items-center">
              <span className="text-red-400 mr-2">⚠️</span>
              <p className="text-red-300">{error}</p>
            </div>
            <button
              onClick={fetchJobs}
              className="mt-2 text-red-300 hover:text-red-100 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Jobs Count */}
        <div className="mb-6 text-white">
          <span className="text-gray-300">Found</span>{" "}
          <span className="font-bold text-indigo-300">{jobs.length}</span>{" "}
          <span className="text-gray-300">job{jobs.length !== 1 ? "s" : ""}</span>
        </div>

        {/* Jobs List */}
        {jobs.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 text-center">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-white mb-2">No Jobs Available</h3>
            <p className="text-gray-400 mb-6">
              There are no job openings at the moment. Please check back later.
            </p>
            <button
              onClick={fetchJobs}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Refresh Jobs
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div 
                key={job.id} 
                className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:border-indigo-500/50 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex flex-col h-full">
                  {/* Job Header */}
                  <div className="mb-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-white line-clamp-1">
                          {job.title}
                        </h3>
                        <p className="text-indigo-300 font-medium mt-1">
                          {job.company_name}
                        </p>
                      </div>
                      <span className="bg-indigo-900/40 text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full border border-indigo-700/50">
                        {job.experience_level}
                      </span>
                    </div>
                    
                    {/* Location */}
                    <div className="flex items-center text-gray-300 text-sm mb-3">
                      <span className="mr-1">📍</span>
                      <span>{job.location}</span>
                    </div>
                  </div>

                  {/* Job Description */}
                  <div className="flex-grow mb-6">
                    <p className="text-gray-300 line-clamp-4">
                      {job.description}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="mt-auto">
                    <button
                      onClick={() => handleApply(job.id)}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition shadow-lg hover:shadow-indigo-500/25"
                    >
                      Apply Now
                    </button>
                    
                    {/* Optional: View Details Button */}
                    <button
                      onClick={() => {
                        // You can implement a detailed view modal or page
                        alert(`Job Details:\n\nTitle: ${job.title}\nCompany: ${job.company_name}\nLocation: ${job.location}\nLevel: ${job.experience_level}\n\nDescription:\n${job.description}`);
                      }}
                      className="w-full mt-3 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 rounded-lg font-medium transition text-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination or Load More (Optional) */}
        {jobs.length > 0 && (
          <div className="mt-10 text-center">
            <div className="inline-flex items-center gap-2">
              <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition">
                ← Previous
              </button>
              <span className="text-gray-300 mx-4">Page 1 of 1</span>
              <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition">
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Filter/Search Section (Optional - for future enhancement) */}
        <div className="mt-10 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Looking for something specific?</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search by job title or company..."
              className="flex-grow px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <select className="px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">All Experience Levels</option>
              <option value="Entry">Entry Level</option>
              <option value="Mid">Mid Level</option>
              <option value="Senior">Senior Level</option>
            </select>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition">
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}