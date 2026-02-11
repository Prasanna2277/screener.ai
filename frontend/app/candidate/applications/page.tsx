"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "@/components/nav";
import { authFetch } from "@/lib/auth";

interface Application {
  id: number;
  job_id: number;
  job_title: string;
  company_name: string;
  status: "pending" | "reviewed" | "shortlisted" | "rejected" | "accepted";
  applied_at: string;
  resume_url: string;
  cover_letter?: string;
}

export default function CandidateApplications() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
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

    // Fetch applications
    fetchApplications();
  }, [router]);

  const fetchApplications = async () => {
    try {
      setError(null);
      const response = await authFetch("http://127.0.0.1:8000/applications/my-applications");
      
      if (!response.ok) {
        throw new Error(`Failed to fetch applications: ${response.status}`);
      }
      
      const data = await response.json();
      setApplications(data);
    } catch (error: any) {
      console.error("Error fetching applications:", error);
      setError(error.message || "Failed to load applications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800 border-green-300";
      case "shortlisted":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "reviewed":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-300";
      case "pending":
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "accepted":
        return "Accepted 🎉";
      case "shortlisted":
        return "Shortlisted ✅";
      case "reviewed":
        return "Under Review 🔍";
      case "rejected":
        return "Rejected ❌";
      case "pending":
      default:
        return "Pending ⏳";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleWithdraw = async (applicationId: number) => {
    if (!confirm("Are you sure you want to withdraw this application?")) {
      return;
    }

    try {
      const response = await authFetch(
        `http://127.0.0.1:8000/applications/${applicationId}/withdraw`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        alert("Application withdrawn successfully!");
        fetchApplications(); // Refresh the list
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail || "Failed to withdraw application"}`);
      }
    } catch (error: any) {
      alert(error.message || "Failed to withdraw application");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Nav />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-white text-lg">Loading your applications...</div>
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
            <h1 className="text-3xl font-bold text-white mb-2">My Applications</h1>
            <p className="text-gray-300">
              Track all your job applications in one place
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
              onClick={() => router.push("/candidate/jobs")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition"
            >
              + Find More Jobs
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
            <div className="text-2xl font-bold text-white">
              {applications.length}
            </div>
            <div className="text-sm text-gray-300">Total Applications</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
            <div className="text-2xl font-bold text-yellow-300">
              {applications.filter(app => app.status === "pending" || app.status === "reviewed").length}
            </div>
            <div className="text-sm text-gray-300">In Progress</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
            <div className="text-2xl font-bold text-green-300">
              {applications.filter(app => app.status === "shortlisted" || app.status === "accepted").length}
            </div>
            <div className="text-sm text-gray-300">Positive</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
            <div className="text-2xl font-bold text-red-300">
              {applications.filter(app => app.status === "rejected").length}
            </div>
            <div className="text-sm text-gray-300">Rejected</div>
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
              onClick={fetchApplications}
              className="mt-2 text-red-300 hover:text-red-100 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Applications List */}
        {applications.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-12 text-center">
            <div className="text-6xl mb-6">📭</div>
            <h3 className="text-2xl font-semibold text-white mb-4">
              No Applications Yet
            </h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              You haven't applied to any jobs yet. Start your job search and apply to positions that match your skills.
            </p>
            <button
              onClick={() => router.push("/candidate/jobs")}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
            >
              Browse Jobs
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <div 
                key={application.id}
                className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:border-indigo-500/50 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left side: Job info */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">
                          {application.job_title}
                        </h3>
                        <p className="text-indigo-300 font-medium">
                          {application.company_name}
                        </p>
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(application.status)}`}>
                          {getStatusText(application.status)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Application details */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-300 mb-4">
                      <div className="flex items-center">
                        <span className="mr-1">📅</span>
                        Applied: {formatDate(application.applied_at)}
                      </div>
                      {application.resume_url && (
                        <div className="flex items-center">
                          <span className="mr-1">📄</span>
                          <a 
                            href={application.resume_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-indigo-300 hover:text-indigo-200 underline"
                          >
                            View Resume
                          </a>
                        </div>
                      )}
                    </div>
                    
                    {application.cover_letter && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-400 mb-1">Cover Letter:</p>
                        <p className="text-gray-300 text-sm line-clamp-2">
                          {application.cover_letter}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Right side: Actions */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => router.push(`/candidate/jobs/${application.job_id}`)}
                      className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition text-sm"
                    >
                      View Job
                    </button>
                    {application.status === "pending" && (
                      <button
                        onClick={() => handleWithdraw(application.id)}
                        className="px-4 py-2 bg-red-900/40 hover:bg-red-800/60 text-red-300 rounded-lg font-medium transition text-sm border border-red-700/50"
                      >
                        Withdraw
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Application Tips */}
        {applications.length > 0 && (
          <div className="mt-10 p-6 bg-gradient-to-r from-indigo-900/20 to-purple-900/20 rounded-xl border border-indigo-700/30">
            <h3 className="text-lg font-semibold text-white mb-3">Application Tips</h3>
            <ul className="text-gray-300 space-y-2">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Check your application status regularly</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Withdraw applications if you're no longer interested</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Follow up with recruiters if your application is under review for a long time</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Keep your resume updated for future applications</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}