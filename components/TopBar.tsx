"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Search, Bell, Command, Menu, X } from "lucide-react";
import { TopBarProps } from "@/interface";

const Greeting = dynamic(() => import("@/components/Greeting"), {
  ssr: false,
});

export const TopBar = ({ onMenuClick }: TopBarProps) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setSearchOpen(false);
      }
    };

    if (searchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchOpen]);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 sm:px-6 gap-4 overflow-hidden">
      <div
        className={`flex items-center gap-2 sm:gap-3 min-w-0 shrink-0 ${searchOpen ? "hidden sm:flex" : "flex"}`}
      >
        <button
          onClick={onMenuClick}
          className="md:hidden w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center"
        >
          <Menu size={18} className="text-gray-600" />
        </button>

        <Image
          src="/icons/avatar.svg"
          alt="user avatar"
          width={40}
          height={40}
          className="rounded-full shrink-0"
        />

        <div className="hidden sm:block truncate">
          <Greeting />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-end min-w-0">
        <div
          className="sm:hidden flex items-center justify-end"
          ref={searchContainerRef}
        >
          {searchOpen ? (
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 shadow-sm rounded-xl px-3 py-2 w-full animate-[slideIn_0.2s_ease-out]">
              <Search size={14} className="text-gray-400 shrink-0" />
              <input
                ref={inputRef}
                placeholder="Search"
                className="flex-1 min-w-0 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
              />
              <button onClick={() => setSearchOpen(false)} className="shrink-0">
                <X size={14} className="text-gray-400" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 shadow-sm flex items-center justify-center shrink-0"
            >
              <Search size={16} className="text-gray-500" />
            </button>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-200 shadow-sm rounded-xl px-3 py-2 w-full max-w-xs min-w-0">
          <Search size={14} className="text-gray-400 shrink-0" />
          <input
            placeholder="Search"
            className="flex-1 min-w-0 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
          />
          <div className="flex items-center gap-0.5 bg-gray-200 rounded px-1 py-0.5 shrink-0">
            <Command size={10} className="text-gray-400" />
            <span className="text-[10px] text-gray-400">K</span>
          </div>
        </div>

        <div className="relative shrink-0">
          <button className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-100 transition-colors">
            <Bell size={16} className="text-gray-500" />
          </button>
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-orange-500 border-2 border-white flex items-center justify-center text-[9px] text-white font-medium leading-none">
            9
          </span>
        </div>
      </div>
    </header>
  );
};
