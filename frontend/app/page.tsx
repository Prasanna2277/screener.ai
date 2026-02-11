"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "../components/nav"; // <- root components folder

export default function HomePage() {
  const [jobs, setJobs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/jobs")
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error(err));
  }, []);

  const handleApply = (jobId: number) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
    } else {
      router.push(`/candidate/apply/${jobId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />

      <header className="text-center mt-10 mb-12">
        <h1 className="text-4xl font-extrabold text-gray-800">
          Explore Opportunities at Screener.AI
        </h1>
        <p className="text-gray-600 mt-2">
          Find your dream job and apply in just a click.
        </p>
      </header>

      <div className="px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {jobs.map((job: any) => (
          <div
            key={job.id}
            className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 rounded-2xl p-6 shadow-xl transform hover:scale-105 transition duration-300 cursor-pointer"
          >
            <h2 className="text-2xl font-bold text-white">{job.title}</h2>
            <p className="text-white mt-1 font-semibold">{job.company_name}</p> {/* Company name */}

            <div className="mt-4 space-y-1 text-white">
              <p><b>Experience:</b> {job.experience_level}</p>
              <p><b>Location:</b> {job.location}</p>
            </div>

            <button
              onClick={() => handleApply(job.id)}
              className="mt-6 w-full bg-white text-purple-600 font-bold py-2 rounded-xl hover:bg-purple-600 hover:text-white transition"
            >
              Apply
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
