"use client";

import { useState } from "react";
import {
  Settings, User, Bell, Shield, Palette, Wallet,
  Globe, LogOut, ChevronRight, BadgeCheck, Moon, Volume2
} from "lucide-react";
import { currentUser } from "@/lib/mockData";
import clsx from "clsx";

const settingSections = [
  {
    title: "Account",
    items: [
      { icon: User, label: "Edit Profile", desc: "Name, bio, avatar" },
      { icon: BadgeCheck, label: "Verified Status", desc: "ARC verified member", badge: "Active" },
      { icon: Wallet, label: "Connected Wallet", desc: currentUser.walletAddress },
    ],
  },
  {
    title: "Preferences",
    items: [
      { icon: Bell, label: "Notifications", desc: "Push, email, in-app" },
      { icon: Moon, label: "Appearance", desc: "Dark mode (AMOLED)" },
      { icon: Volume2, label: "Sounds", desc: "App sounds & haptics" },
      { icon: Globe, label: "Language", desc: "English (US)" },
    ],
  },
  {
    title: "Privacy & Security",
    items: [
      { icon: Shield, label: "Privacy", desc: "Who can see your content" },
      { icon: Shield, label: "Security", desc: "2FA, sessions, passkeys" },
    ],
  },
];

interface Toggle {
  label: string;
  desc: string;
  defaultOn: boolean;
}

const toggles: Toggle[] = [
  { label: "Push Notifications", desc: "Likes, reposts, mentions", defaultOn: true },
  { label: "Email Digest", desc: "Weekly summary", defaultOn: false },
  { label: "Airdrop Alerts", desc: "Token drops & rewards", defaultOn: true },
  { label: "Show Online Status", desc: "Let others see when you're active", defaultOn: true },
];

export default function SettingsPage() {
  const [toggleState, setToggleState] = useState<Record<string, boolean>>(
    Object.fromEntries(toggles.map(t => [t.label, t.defaultOn]))
  );

  return (
    <div className="max-w-2xl mx-auto lg:max-w-xl px-4 py-6 lg:px-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Settings size={20} className="text-accent" />
        <h1 className="font-extrabold text-xl">Settings</h1>
      </div>

      {/* Profile preview */}
      <div className="bg-surface border border-white/[0.07] rounded-2xl p-4 flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent to-cyan flex items-center justify-center text-white font-extrabold text-xl">
          {currentUser.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold">{currentUser.name}</span>
            {currentUser.verified && <BadgeCheck size={14} className="text-accent" />}
          </div>
          <p className="text-sm text-muted font-mono">@{currentUser.username}</p>
          <p className="text-xs text-muted/60 mt-0.5 truncate">{currentUser.walletAddress}</p>
        </div>
        <ChevronRight size={16} className="text-muted flex-shrink-0" />
      </div>

      {/* Setting sections */}
      {settingSections.map(section => (
        <div key={section.title} className="mb-5">
          <p className="text-xs font-bold text-muted uppercase tracking-wider mb-2 px-1">{section.title}</p>
          <div className="bg-surface border border-white/[0.07] rounded-2xl overflow-hidden divide-y divide-white/[0.05]">
            {section.items.map(({ icon: Icon, label, desc, badge }) => (
              <button
                key={label}
                className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-surface2 transition-colors text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={15} className="text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="text-xs text-muted truncate">{desc}</p>
                </div>
                {badge && (
                  <span className="text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full border border-green-400/20">
                    {badge}
                  </span>
                )}
                <ChevronRight size={15} className="text-muted/40 group-hover:text-muted transition-colors flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Toggles */}
      <div className="mb-5">
        <p className="text-xs font-bold text-muted uppercase tracking-wider mb-2 px-1">Notifications</p>
        <div className="bg-surface border border-white/[0.07] rounded-2xl overflow-hidden divide-y divide-white/[0.05]">
          {toggles.map(toggle => (
            <div key={toggle.label} className="flex items-center gap-3 px-4 py-3.5">
              <div className="flex-1">
                <p className="text-sm font-semibold">{toggle.label}</p>
                <p className="text-xs text-muted">{toggle.desc}</p>
              </div>
              <button
                onClick={() => setToggleState(p => ({ ...p, [toggle.label]: !p[toggle.label] }))}
                className={clsx(
                  "relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0",
                  toggleState[toggle.label] ? "bg-accent" : "bg-surface3"
                )}
                aria-label={toggle.label}
              >
                <span className={clsx(
                  "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300",
                  toggleState[toggle.label] ? "translate-x-5" : "translate-x-0.5"
                )} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-3.5 bg-surface border border-white/[0.07] rounded-2xl hover:bg-red-500/5 hover:border-red-500/20 transition-all text-red-400 group">
          <LogOut size={18} />
          <span className="font-semibold text-sm">Log Out</span>
        </button>
      </div>

      <p className="text-center text-xs text-muted/40 font-mono mt-8">ARC Community v0.1.0 · Built on Base</p>
    </div>
  );
}
