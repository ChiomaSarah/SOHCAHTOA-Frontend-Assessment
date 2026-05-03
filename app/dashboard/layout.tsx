"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeNav, setActiveNav] = useState("home");

  return (
    <div className="flex h-screen bg-[#EFEFEF] overflow-hidden">
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />
      <div className="flex flex-col flex-1">
        <TopBar />
        <main className="flex-1 overflow-auto">
          <div className="p-6 w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
