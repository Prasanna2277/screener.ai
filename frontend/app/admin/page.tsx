"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken, logout } from "@/lib/auth";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    if (!getToken()) router.push("/login");
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Panel</h1>

      <button
        className="mt-4 bg-red-500 text-white px-4 py-2"
        onClick={() => {
          logout();
          router.push("/login");
        }}
      >
        Logout
      </button>
    </div>
  );
}
