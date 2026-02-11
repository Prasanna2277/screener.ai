"use client";
import { useState } from "react";

interface ApplyJobProps {
  jobId: number;
  onClose: () => void;
}

export default function ApplyJob({ jobId, onClose }: ApplyJobProps) {
  const [resumeLink, setResumeLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!resumeLink) return alert("Please enter resume link");

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:8000/apply/${jobId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ resume_link: resumeLink }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.detail || "Failed to apply");
      } else {
        alert("Application submitted successfully");
        onClose();
      }
    } catch (err) {
      console.error(err);
      alert("Error applying");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 w-96 relative shadow-lg">
        <h2 className="text-xl font-bold mb-4">Apply for Job</h2>
        <input
          type="text"
          placeholder="Paste your resume link"
          value={resumeLink}
          onChange={(e) => setResumeLink(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
        />
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Apply"}
          </button>
        </div>
      </div>
    </div>
  );
}
