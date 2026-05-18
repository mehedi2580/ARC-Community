"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Bell, MessageSquare, Edit3 } from "lucide-react";
import clsx from "clsx";

const mobileNav = [
  { href: "/feed", icon: Home, label: "Home" },
  { href: "/explore", icon: Compass, label: "Explore" },
  { href: "/notifications", icon: Bell, label: "Alerts", badge: 3 },
  { href: "/messages", icon: MessageSquare, label: "DMs", badge: 4 },
];

interface MobileNavProps {
  onCreatePost: () => void;
}

export default function MobileNav({ onCreatePost }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/[0.07] mobile-nav">
      <div className="flex items-center justify-around px-2 py-2">
        {mobileNav.slice(0, 2).map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors min-w-[60px]",
                active ? "text-accent" : "text-muted"
              )}
            >
              <Icon size={22} />
              <span className="text-[10px] font-semibold">{label}</span>
            </Link>
          );
        })}

        {/* Center create button */}
        <button
          onClick={onCreatePost}
          className="w-12 h-12 bg-accent rounded-full flex items-center justify-center shadow-accent glow-accent-sm transition-all active:scale-95 hover:bg-accent-light"
          aria-label="Create post"
        >
          <Edit3 size={20} className="text-white" />
        </button>

        {mobileNav.slice(2).map(({ href, icon: Icon, label, badge }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors min-w-[60px] relative",
                active ? "text-accent" : "text-muted"
              )}
            >
              <div className="relative">
                <Icon size={22} />
                {badge && !active && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
