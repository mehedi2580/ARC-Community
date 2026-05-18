"use client";

import { Menu, Search } from "lucide-react";
import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/feed": "Home",
  "/explore": "Explore",
  "/notifications": "Notifications",
  "/messages": "Messages",
  "/bookmarks": "Bookmarks",
  "/collectibles": "Collectibles",
  "/referrals": "Referrals",
  "/settings": "Settings",
  "/updates": "Updates",
  "/profile": "Profile",
};

interface MobileHeaderProps {
  onMenuOpen: () => void;
}

export default function MobileHeader({ onMenuOpen }: MobileHeaderProps) {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "ARC";

  return (
    <header className="lg:hidden sticky top-0 z-40 glass border-b border-white/[0.07] px-4 py-3 flex items-center justify-between">
      <button
        onClick={onMenuOpen}
        className="w-9 h-9 rounded-xl bg-surface2 flex items-center justify-center text-muted hover:text-text-primary transition-colors"
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center">
          <span className="text-white font-bold text-xs">A</span>
        </div>
        <span className="font-extrabold tracking-tight text-base">{title}</span>
      </div>

      <button
        className="w-9 h-9 rounded-xl bg-surface2 flex items-center justify-center text-muted hover:text-text-primary transition-colors"
        aria-label="Search"
      >
        <Search size={18} />
      </button>
    </header>
  );
}
