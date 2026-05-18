"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import MobileHeader from "@/components/layout/MobileHeader";
import CreatePostModal from "@/components/feed/CreatePostModal";
import MobileDrawer from "@/components/layout/MobileDrawer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [createOpen, setCreateOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg grid-overlay flex">
      {/* Left Sidebar - desktop */}
      <Sidebar onCreatePost={() => setCreateOpen(true)} />

      {/* Mobile Drawer */}
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-64 xl:ml-72">
        {/* Mobile header */}
        <MobileHeader onMenuOpen={() => setDrawerOpen(true)} />

        {/* Page content */}
        <main className="flex-1 pb-20 lg:pb-0">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav onCreatePost={() => setCreateOpen(true)} />

      {/* Floating create button - tablet */}
      <button
        onClick={() => setCreateOpen(true)}
        className="hidden md:flex lg:hidden fixed bottom-8 right-6 w-14 h-14 bg-accent rounded-full items-center justify-center shadow-accent glow-accent z-40 transition-transform hover:scale-105 active:scale-95"
        aria-label="Create post"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>

      {/* Create post modal */}
      {createOpen && <CreatePostModal onClose={() => setCreateOpen(false)} />}
    </div>
  );
}
