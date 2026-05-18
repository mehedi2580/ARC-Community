"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  Home, Compass, Bell, MessageSquare, Bookmark,
  Star, Users, Settings, Zap, X, BadgeCheck, LogOut
} from "lucide-react";
import { currentUser, formatNumber } from "@/lib/mockData";
import clsx from "clsx";

const navItems = [
  { href: "/feed", icon: Home, label: "Home" },
  { href: "/explore", icon: Compass, label: "Explore" },
  { href: "/notifications", icon: Bell, label: "Notifications", badge: 3 },
  { href: "/messages", icon: MessageSquare, label: "Messages", badge: 4 },
  { href: "/bookmarks", icon: Bookmark, label: "Bookmarks" },
  { href: "/collectibles", icon: Star, label: "Collectibles" },
  { href: "/referrals", icon: Users, label: "Referrals" },
  { href: "/settings", icon: Settings, label: "Settings" },
  { href: "/updates", icon: Zap, label: "Updates" },
];

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="lg:hidden fixed left-0 top-0 h-full w-72 bg-surface border-r border-white/[0.07] z-50 flex flex-col py-6 px-4 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 px-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-white font-bold text-xs">A</span>
            </div>
            <span className="font-extrabold gradient-text">ARC Community</span>
          </div>
          <button onClick={onClose} className="text-muted hover:text-text-primary transition-colors p-1">
            <X size={18} />
          </button>
        </div>

        {/* Profile */}
        <Link href="/profile" onClick={onClose} className="flex items-center gap-3 px-3 py-3 rounded-xl bg-surface2 mb-5">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-cyan flex items-center justify-center text-white font-bold">
              {currentUser.name[0]}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-surface2" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <p className="text-sm font-bold truncate">{currentUser.name}</p>
              {currentUser.verified && <BadgeCheck size={12} className="text-accent" />}
            </div>
            <p className="text-xs text-muted font-mono">@{currentUser.username}</p>
          </div>
        </Link>

        {/* Stats */}
        <div className="flex gap-4 px-3 mb-5 text-sm">
          <div>
            <span className="font-bold">{formatNumber(currentUser.following)}</span>
            <span className="text-muted ml-1">Following</span>
          </div>
          <div>
            <span className="font-bold">{formatNumber(currentUser.followers)}</span>
            <span className="text-muted ml-1">Followers</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {navItems.map(({ href, icon: Icon, label, badge }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all",
                  active
                    ? "bg-accent/10 text-accent border border-accent/20"
                    : "text-muted hover:text-text-primary hover:bg-surface2"
                )}
              >
                <Icon size={18} />
                <span>{label}</span>
                {badge && !active && (
                  <span className="ml-auto bg-accent text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-muted hover:text-red-400 hover:bg-red-400/5 transition-colors mt-4">
          <LogOut size={18} />
          Log Out
        </button>
      </div>
    </>
  );
}
