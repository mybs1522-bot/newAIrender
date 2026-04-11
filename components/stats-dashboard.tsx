"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { MarketingDashboard } from "@/components/ui/dashboard-1";

export function StatsDashboard() {
  const router = useRouter();
  const [userCount, setUserCount] = useState(32550);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const delay = 2500 + Math.random() * 2000; // 2.5 – 4.5 s
      timeout = setTimeout(() => {
        setUserCount((n) => n + Math.floor(Math.random() * 2) + 2); // +2 or +3
        schedule();
      }, delay);
    };
    schedule();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex justify-center">
      <MarketingDashboard
        title="Fastest Growing AI Rendering Engine"
        team={{
          memberCount: userCount,
          label: "Downloads",
          members: [
            {
              id: "1",
              name: "Aria Shah",
              avatarUrl: "https://i.pravatar.cc/150?u=ariashah",
            },
            {
              id: "2",
              name: "Leo Park",
              avatarUrl: "https://i.pravatar.cc/150?u=leopark",
            },
            {
              id: "3",
              name: "Maya Torres",
              avatarUrl: "https://i.pravatar.cc/150?u=mayatorres",
            },
            {
              id: "4",
              name: "James Okafor",
              avatarUrl: "https://i.pravatar.cc/150?u=jamesokafor",
            },
          ],
        }}
        cta={{
          text: "Join thousands of designers using AI to redesign spaces",
          buttonText: "Get Started",
          onButtonClick: () => router.push("/render"),
        }}
      />
    </div>
  );
}
