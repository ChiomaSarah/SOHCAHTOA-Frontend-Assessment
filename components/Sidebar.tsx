"use client";

import Image from "next/image";
import { ChevronRight, ChevronDown } from "lucide-react";

const navItems = [
  {
    id: "home",
    label: "Home",
    icon: "/icons/home.svg",
  },
  {
    id: "calculator",
    label: "Calculator",
    icon: "/icons/calculator.svg",
  },
  {
    id: "transactions",
    label: "Transactions",
    icon: "/icons/transactions.svg",
  },
  {
    id: "cards",
    label: "Cards",
    icon: "/icons/card.svg",
    badge: 2,
  },
];

interface SidebarProps {
  activeNav: string;
  onNavChange: (nav: string) => void;
}

export default function Sidebar({ activeNav, onNavChange }: SidebarProps) {
  return (
    <aside className="w-56 min-w-56 h-full bg-white border-r border-gray-200 flex flex-col py-5">
      <div className="flex items-center justify-between px-4 pb-6">
        <Image
          src="/icons/logo.svg"
          alt="SohCahToa Payout BDC"
          width={80}
          height={32}
          priority
        />
        <ChevronRight size={14} className="text-gray-400" />
      </div>

      <nav className="flex-1 px-2">
        {navItems.map(({ id, label, icon, badge }) => {
          const active = activeNav === id;
          return (
            <button
              key={id}
              onClick={() => onNavChange(id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border-none cursor-pointer mb-0.5 text-sm transition-all
                ${
                  active
                    ? "bg-orange-50 text-orange-500 font-semibold"
                    : "bg-transparent text-gray-500 font-normal hover:bg-gray-50"
                }`}
            >
              <Image
                src={icon}
                alt={`${label} icon`}
                width={16}
                height={16}
                className={`shrink-0 transition-opacity ${
                  active ? "opacity-100" : "opacity-70"
                }`}
                style={{
                  filter: active
                    ? "brightness(0) saturate(100%) invert(54%) sepia(98%) saturate(3332%) hue-rotate(360deg) brightness(101%) contrast(96%)" // Orange color
                    : "brightness(0) saturate(100%) invert(64%) sepia(8%) saturate(203%) hue-rotate(169deg) brightness(91%) contrast(86%)", // Gray color
                }}
              />
              <span className="flex-1 text-left">{label}</span>
              {badge && (
                <span className="bg-orange-500 text-white rounded-full w-4 h-4 text-[10px] font-bold flex items-center justify-center">
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="px-2">
        <div className="border-t border-gray-200 mb-3" />

        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border-none cursor-pointer bg-transparent text-gray-500 text-sm mb-3 hover:bg-gray-50 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
            <Image
              src="/icons/support.svg"
              alt="Support icon"
              width={16}
              height={16}
              className="shrink-0 opacity-70"
            />
          </div>
          <span className="flex-1 text-left">Support</span>
        </button>

        {/* User Profile Dropdown */}
        <button className="w-full flex items-center gap-3 p-2 rounded-2xl border border-gray-200 cursor-pointer bg-white hover:bg-gray-50 transition-colors shadow-sm">
          <Image
            src="/icons/avatar.svg"
            alt="Emmanuel Israel"
            width={40}
            height={40}
            priority
            className="rounded-full shrink-0 object-cover"
          />
          <div className="overflow-hidden flex-1 text-left">
            <p className="text-sm font-semibold text-gray-900 truncate">
              Emmanuel Israel
            </p>
            <p className="text-sm text-gray-400 truncate">emmanuel.e.israel</p>
          </div>
          <ChevronDown size={16} className="text-gray-400 shrink-0" />
        </button>
      </div>
    </aside>
  );
}
