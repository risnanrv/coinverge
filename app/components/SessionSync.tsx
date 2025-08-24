"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/lib/store/authStore";

export default function SessionSync() {
  const { data: session, status } = useSession();
  const { setSession, setIsLoading } = useAuthStore();

  useEffect(() => {
    if (status === "loading") {
      setIsLoading(true);
    } else {
      setSession(session);
    }
  }, [session, status, setSession, setIsLoading]);

  return null;
}
