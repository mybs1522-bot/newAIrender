"use client";

import { useRouter } from "next/navigation";
import { MarketingDashboard } from "@/components/ui/dashboard-1";

export function StatsDashboard() {
  const router = useRouter();

  return (
    <div className="flex justify-center">
      <MarketingDashboard
        title="Platform at a Glance"
        team={{
          memberCount: 32550,
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
