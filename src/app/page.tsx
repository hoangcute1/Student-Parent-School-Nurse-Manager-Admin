"use client";

import { useEffect, useState } from "react";
import type { User as AppUser, UserProfile } from "@/lib/types";
import Header from "@/components/layout/header/header";
import { getAuthData } from "@/lib/auth";
import { PublicHomePage } from "./_components/public-home";

export default function Home() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authData = getAuthData();
    if (authData) {
      setUser(authData.user);
      setProfile(authData.profile);
    }
    setLoading(false);
  }, []);

  return (
    <div className="flex flex-col min-h-screen min-w-full">
      <Header />
      <main className="flex-1 w-full">
        {loading ? (
          <div className="flex items-center justify-center h-screen">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
          </div>
        ) : (
          <PublicHomePage />
        )}
      </main>
    </div>
  );
}
