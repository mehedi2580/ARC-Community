"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, Compass, Bell, MessageSquare, Bookmark,
  Star, Users, Settings, Zap, Edit3, BadgeCheck
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

interface SidebarProps {
  onCreatePost: () => void;
}

export default function Sidebar({ onCreatePost }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-64 xl:w-72 glass border-r border-white/[0.07] z-50 py-6 px-4">
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 mb-8">
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center glow-accent-sm">
          <span className="text-white font-bold text-sm">A</span>
        </div>
        <span className="text-lg font-extrabold tracking-tight gradient-text">ARC</span>
        <span className="ml-auto">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse-slow" title="Online" />
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {navItems.map(({ href, icon: Icon, label, badge }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group relative",
                active
                  ? "bg-accent/10 text-accent border border-accent/20"
                  : "text-muted hover:text-text-primary hover:bg-surface2"
              )}
            >
              <Icon size={18} className={clsx("flex-shrink-0 transition-transform group-hover:scale-110", active && "text-accent")} />
              <span>{label}</span>
              {badge && !active && (
                <span className="ml-auto bg-accent text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {badge}
                </span>
              )}
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Create button */}
      <button
        onClick={onCreatePost}
        className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-accent hover:bg-accent-light rounded-xl font-bold text-white text-sm transition-all duration-200 hover:shadow-accent hover:-translate-y-0.5 active:translate-y-0 mb-6"
      >
        <Edit3 size={16} />
        Cast
      </button>

      {/* Profile */}
      <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface2 transition-colors group cursor-pointer">
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-cyan overflow-hidden border-2 border-accent/30 flex items-center justify-center text-white font-bold text-sm">
            {currentUser.name[0]}
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-bg" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <p className="text-sm font-bold truncate text-text-primary">{currentUser.name}</p>
            {currentUser.verified && <BadgeCheck size={12} className="text-accent flex-shrink-0" />}
          </div>
          <p className="text-xs text-muted font-mono truncate">@{currentUser.username}</p>
        </div>
        <div className="text-right text-xs text-muted opacity-0 group-hover:opacity-100 transition-opacity">
          <div>{formatNumber(currentUser.followers)}</div>
          <div className="text-[10px]">followers</div>
        </div>
      </Link>
    </aside>
  );
}
