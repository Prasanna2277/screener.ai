"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authFetch } from "@/lib/auth";

export default function CreateJob() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    experience_level: "",
    company_name: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await authFetch("http://127.0.0.1:8000/jobs", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to create job");
      }

      alert("Job created successfully");
      router.push("/hr/dashboard");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Create Job</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            placeholder="Job Title"
            required
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            name="company_name"
            placeholder="Company Name"
            required
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            name="location"
            placeholder="Location"
            required
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <select
            name="experience_level"
            required
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Experience</option>
            <option value="Entry">Entry</option>
            <option value="Mid">Mid</option>
            <option value="Senior">Senior</option>
          </select>

          <textarea
            name="description"
            placeholder="Job Description"
            required
            rows={4}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.push("/hr/dashboard")}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
              {submitting ? "Creating..." : "Create Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
