"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import MobileHeader from "@/components/layout/MobileHeader";
import CreatePostModal from "@/components/feed/CreatePostModal";
import MobileDrawer from "@/components/layout/MobileDrawer";
import AuthGuard from "@/components/auth/AuthGuard";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [createOpen, setCreateOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-bg grid-overlay flex">
        <Sidebar onCreatePost={() => setCreateOpen(true)} />
        <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
        <div className="flex-1 flex flex-col lg:ml-64 xl:ml-72">
          <MobileHeader onMenuOpen={() => setDrawerOpen(true)} />
          <main className="flex-1 pb-20 lg:pb-0">{children}</main>
        </div>
        <MobileNav onCreatePost={() => setCreateOpen(true)} />
        <button
          onClick={() => setCreateOpen(true)}
          className="hidden md:flex lg:hidden fixed bottom-8 right-6 w-14 h-14 bg-accent rounded-full items-center justify-center shadow-accent glow-accent z-40 transition-transform hover:scale-105 active:scale-95"
          aria-label="Create post"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
        {createOpen && <CreatePostModal onClose={() => setCreateOpen(false)} />}
      </div>
    </AuthGuard>
  );
}
