"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Nav() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("access_token"));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setToken(null);
    router.push("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 p-4 shadow-md flex justify-between items-center">
      <div
        className="text-white text-2xl font-bold cursor-pointer"
        onClick={() => router.push("/")}
      >
        Screener.AI
      </div>

      <div className="space-x-4">
        <button
          onClick={() => router.push("/")}
          className="text-white font-semibold hover:underline"
        >
          Home
        </button>
        <button
          onClick={() => router.push("/jobs")}
          className="text-white font-semibold hover:underline"
        >
          Jobs
        </button>
        {token ? (
          <button
            onClick={handleLogout}
            className="text-white font-semibold hover:underline"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="text-white font-semibold hover:underline"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
