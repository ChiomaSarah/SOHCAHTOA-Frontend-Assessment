"use client";

import Image from "next/image";
import { ChevronRight, ChevronDown, ChevronLeft, LogOut } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { clearCredentials } from "@/app/appStore/authSlice";
import { RootState } from "@/app/appStore/store";
import { useDispatch, useSelector } from "react-redux";
import { SidebarProps } from "@/interface";

const navItems = [
  { id: "home", label: "Home", icon: "/icons/home.svg" },
  { id: "calculator", label: "Calculator", icon: "/icons/calculator.svg" },
  {
    id: "transactions",
    label: "Transactions",
    icon: "/icons/transactions.svg",
  },
  { id: "cards", label: "Cards", icon: "/icons/card.svg", badge: 2 },
];

export const Sidebar = ({
  activeNav,
  onNavChange,
  isOpen,
  onClose,
}: SidebarProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const [profileOpen, setProfileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    dispatch(clearCredentials());
    router.push("/login");
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed md:static top-0 left-0 z-40 h-full bg-white border-r border-gray-200 flex flex-col py-5 transition-all duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          ${collapsed ? "w-16 min-w-16" : "w-56 min-w-56"}
        `}
      >
        <div
          className={`flex items-center ${
            collapsed ? "justify-center pb-5 px-2" : "justify-between px-4"
          } border-b border-gray-200`}
        >
          {!collapsed && (
            <Image
              src="/icons/logo.svg"
              alt="logo"
              width={80}
              height={32}
              priority
              style={{ width: "auto", height: "auto" }}
            />
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        <nav className="flex-1 pt-4 px-2">
          {navItems.map(({ id, label, icon, badge }) => {
            const active = activeNav === id;

            return (
              <div key={id} className="relative group">
                <button
                  onClick={() => {
                    onNavChange(id);
                    onClose();
                  }}
                  className={`w-full flex items-center rounded-xl mb-1 text-sm transition-all
      ${collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2.5"}
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
                        ? "brightness(0) saturate(100%) invert(54%) sepia(98%) saturate(3332%) hue-rotate(360deg) brightness(101%) contrast(96%)"
                        : "brightness(0) saturate(100%) invert(64%) sepia(8%) saturate(203%) hue-rotate(169deg) brightness(91%) contrast(86%)",
                    }}
                  />

                  {!collapsed && <span>{label}</span>}

                  {!collapsed && badge && (
                    <span className="ml-auto bg-orange-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                      {badge}
                    </span>
                  )}
                </button>

                {/* Tooltip */}
                {collapsed && (
                  <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-orange-400 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    {label}
                  </span>
                )}
              </div>
            );
          })}
        </nav>

        <div className="px-2">
          <div className="border-t border-gray-200 mb-3" />

          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-full flex items-center gap-3 p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
          >
            <Image
              src="/icons/avatar.svg"
              alt="user"
              width={40}
              height={40}
              className="rounded-full"
            />

            {!collapsed && (
              <>
                <div className="text-left flex-1 overflow-hidden">
                  <p className="text-sm font-semibold truncate">
                    {user?.name ?? "Emmanuel Israel"}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {user?.email ?? "emmanuel.e.israel"}
                  </p>
                </div>

                <ChevronDown
                  size={14}
                  className={`transition-transform ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </>
            )}
          </button>

          {profileOpen && !collapsed && (
            <div className="mt-2 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
