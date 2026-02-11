"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const useAuth = (requiredRole: string | null = null) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (!token) {
        router.replace("/login");
        return;
      }

      if (requiredRole && role !== requiredRole) {
        router.replace("/login");
        return;
      }

      setIsAuthenticated(true);
      setLoading(false);
    };

    checkAuth();
  }, [requiredRole]);

  return { isAuthenticated, loading };
};