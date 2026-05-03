"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Search, Bell, Command } from "lucide-react";

const Greeting = dynamic(() => import("@/components/Greeting"), { ssr: false });

export default function TopBar() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 gap-4 shrink-0">
      <div className="flex items-center gap-3">
        <Image
          src="/icons/avatar.svg"
          alt="user avatar"
          width={40}
          height={40}
          priority
          className="rounded-full shrink-0"
        />
        <Greeting />
      </div>

      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 ml-auto w-64">
        <Search size={14} className="text-gray-400 shrink-0" />
        <input
          placeholder="Search"
          className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
        />
        <div className="flex items-center gap-0.5 bg-gray-200 rounded px-1 py-0.5">
          <Command size={10} className="text-gray-400" />
          <span className="text-[10px] text-gray-400">K</span>
        </div>
      </div>

      <div className="relative">
        <button className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors">
          <Bell size={16} className="text-gray-500" />
        </button>
        <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-orange-500 border-2 border-white" />
      </div>
    </header>
  );
}
