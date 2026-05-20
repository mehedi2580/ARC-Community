"use client";

import { useState, useEffect } from "react";
import {
  Settings, User, Bell, Shield, Palette, Wallet,
  Globe, LogOut, ChevronRight, BadgeCheck, Moon,
  Volume2, Lock, Eye, EyeOff, Check, X, Info,
  Smartphone, Mail, Gift, Wifi, ArrowLeft
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useSocial, UserSettings, DEFAULT_SETTINGS } from "@/lib/social";
import Link from "next/link";
import clsx from "clsx";

type Section = "main" | "notifications" | "appearance" | "sounds" | "language" | "privacy" | "security";

const LANGUAGES = [
  { code: "en", label: "English (US)" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "ja", label: "日本語" },
  { code: "zh", label: "中文" },
  { code: "ko", label: "한국어" },
  { code: "pt", label: "Português" },
];

function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      onClick={() => onChange(!value)}
      aria-label={label}
      className={clsx(
        "relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-accent/50",
        value ? "bg-accent" : "bg-surface3 border border-white/[0.1]"
      )}
    >
      <span className={clsx(
        "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300",
        value ? "translate-x-5" : "translate-x-0.5"
      )} />
    </button>
  );
}

function SectionHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="sticky top-0 z-30 glass border-b border-white/[0.07] px-4 py-3 flex items-center gap-3">
      <button onClick={onBack} className="p-1.5 rounded-lg text-muted hover:text-text-primary hover:bg-surface2 transition-colors">
        <ArrowLeft size={18} />
      </button>
      <h2 className="font-extrabold">{title}</h2>
    </div>
  );
}

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { getUserSettings, updateUserSettings } = useSocial();
  const [section, setSection] = useState<Section>("main");
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    if (user) setSettings(getUserSettings(user.walletAddress));
  }, [user, getUserSettings]);

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    if (!user) return;
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    updateUserSettings(user.walletAddress, { [key]: value });
  };

  const walletDisplay = user
    ? user.walletAddress.slice(0, 6) + "••••••••••••••••" + user.walletAddress.slice(-4)
    : "";

  if (!user) return null;

  // ── Sub-sections ────────────────────────────────────────────

  if (section === "notifications") return (
    <div className="max-w-2xl mx-auto lg:max-w-xl">
      <SectionHeader title="Notifications" onBack={() => setSection("main")} />
      <div className="px-4 py-5 space-y-3">
        <p className="text-xs text-muted uppercase tracking-wider font-bold px-1 mb-3">Push Notifications</p>

        {[
          { key: "pushNotifications" as const, icon: Smartphone, label: "Push Notifications", desc: "Likes, reposts, mentions, follows" },
          { key: "emailDigest" as const, icon: Mail, label: "Email Digest", desc: "Weekly activity summary to your email" },
          { key: "airdropAlerts" as const, icon: Gift, label: "Airdrop Alerts", desc: "Token drops and onchain rewards" },
          { key: "showOnlineStatus" as const, icon: Wifi, label: "Show Online Status", desc: "Let others see when you're active" },
        ].map(({ key, icon: Icon, label, desc }) => (
          <div key={key} className="flex items-center gap-3 bg-surface border border-white/[0.07] rounded-xl px-4 py-3.5">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Icon size={15} className="text-accent" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">{label}</p>
              <p className="text-xs text-muted">{desc}</p>
            </div>
            <Toggle value={settings[key] as boolean} onChange={v => updateSetting(key, v)} label={label} />
          </div>
        ))}

        <div className="mt-4 bg-surface2 border border-white/[0.05] rounded-xl px-4 py-3">
          <p className="text-xs text-muted/70 leading-relaxed">
            <Info size={11} className="inline mr-1" />
            Push notification delivery depends on your device and browser permissions. Email digest requires a verified email address.
          </p>
        </div>
      </div>
    </div>
  );

  if (section === "appearance") return (
    <div className="max-w-2xl mx-auto lg:max-w-xl">
      <SectionHeader title="Appearance" onBack={() => setSection("main")} />
      <div className="px-4 py-5 space-y-4">
        <p className="text-xs text-muted uppercase tracking-wider font-bold px-1">Theme</p>
        <div className="grid grid-cols-2 gap-3">
          {(["amoled", "dark"] as const).map(t => (
            <button key={t} onClick={() => updateSetting("theme", t)}
              className={clsx("p-4 rounded-xl border-2 text-left transition-all",
                settings.theme === t ? "border-accent bg-accent/10" : "border-white/[0.07] bg-surface hover:border-white/20")}>
              <div className={clsx("w-full h-16 rounded-lg mb-3", t === "amoled" ? "bg-black" : "bg-[#0e1117]")} />
              <p className="text-sm font-bold capitalize">{t === "amoled" ? "AMOLED Black" : "Dark"}</p>
              <p className="text-xs text-muted">{t === "amoled" ? "Pure black, saves battery" : "Dark gray tones"}</p>
              {settings.theme === t && <Check size={14} className="text-accent mt-1" />}
            </button>
          ))}
        </div>
        <div className="bg-surface border border-white/[0.07] rounded-xl px-4 py-3.5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center"><Moon size={15} className="text-accent" /></div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Reduce Motion</p>
            <p className="text-xs text-muted">Minimize animations for accessibility</p>
          </div>
          <Toggle value={false} onChange={() => {}} label="Reduce Motion" />
        </div>
      </div>
    </div>
  );

  if (section === "sounds") return (
    <div className="max-w-2xl mx-auto lg:max-w-xl">
      <SectionHeader title="Sounds" onBack={() => setSection("main")} />
      <div className="px-4 py-5 space-y-3">
        <div className="bg-surface border border-white/[0.07] rounded-xl px-4 py-3.5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center"><Volume2 size={15} className="text-accent" /></div>
          <div className="flex-1">
            <p className="text-sm font-semibold">In-App Sounds</p>
            <p className="text-xs text-muted">Sound effects for interactions</p>
          </div>
          <Toggle value={settings.sounds} onChange={v => updateSetting("sounds", v)} label="Sounds" />
        </div>
        {[
          { label: "Message Notifications", desc: "Sound when receiving a DM" },
          { label: "Like & Repost Sounds", desc: "Sound on interactions" },
          { label: "Send Message Sound", desc: "Confirmation on send" },
        ].map(({ label, desc }) => (
          <div key={label} className="bg-surface border border-white/[0.07] rounded-xl px-4 py-3.5 flex items-center gap-3">
            <div className="flex-1">
              <p className="text-sm font-semibold">{label}</p>
              <p className="text-xs text-muted">{desc}</p>
            </div>
            <Toggle value={settings.sounds} onChange={v => updateSetting("sounds", v)} label={label} />
          </div>
        ))}
      </div>
    </div>
  );

  if (section === "language") return (
    <div className="max-w-2xl mx-auto lg:max-w-xl">
      <SectionHeader title="Language" onBack={() => setSection("main")} />
      <div className="px-4 py-5">
        <p className="text-xs text-muted uppercase tracking-wider font-bold px-1 mb-3">Select Language</p>
        <div className="bg-surface border border-white/[0.07] rounded-xl overflow-hidden divide-y divide-white/[0.05]">
          {LANGUAGES.map(({ code, label }) => (
            <button key={code} onClick={() => updateSetting("language", code)}
              className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-surface2 transition-colors text-left">
              <div className="flex items-center gap-3">
                <span className="text-lg">{code === "en" ? "🇺🇸" : code === "es" ? "🇪🇸" : code === "fr" ? "🇫🇷" : code === "de" ? "🇩🇪" : code === "ja" ? "🇯🇵" : code === "zh" ? "🇨🇳" : code === "ko" ? "🇰🇷" : "🇧🇷"}</span>
                <span className="text-sm font-semibold">{label}</span>
              </div>
              {settings.language === code && <Check size={16} className="text-accent" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (section === "privacy") return (
    <div className="max-w-2xl mx-auto lg:max-w-xl">
      <SectionHeader title="Privacy" onBack={() => setSection("main")} />
      <div className="px-4 py-5 space-y-5">
        {/* Profile visibility */}
        <div>
          <p className="text-xs text-muted uppercase tracking-wider font-bold px-1 mb-3">Profile Visibility</p>
          <div className="bg-surface border border-white/[0.07] rounded-xl overflow-hidden divide-y divide-white/[0.05]">
            {([
              { v: "public", label: "Public", desc: "Anyone can see your profile and posts", icon: Eye },
              { v: "followers", label: "Followers Only", desc: "Only your followers can see your posts", icon: Shield },
              { v: "private", label: "Private", desc: "Only you can see your content", icon: EyeOff },
            ] as const).map(({ v, label, desc, icon: Icon }) => (
              <button key={v} onClick={() => updateSetting("profileVisibility", v)}
                className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-surface2 transition-colors text-left">
                <Icon size={15} className="text-muted" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="text-xs text-muted">{desc}</p>
                </div>
                {settings.profileVisibility === v && <Check size={15} className="text-accent" />}
              </button>
            ))}
          </div>
        </div>

        {/* Legal agreements */}
        <div>
          <p className="text-xs text-muted uppercase tracking-wider font-bold px-1 mb-3">Legal & Agreements</p>
          <div className="bg-surface border border-white/[0.07] rounded-xl overflow-hidden divide-y divide-white/[0.05]">
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="flex-1">
                <p className="text-sm font-semibold">Privacy Policy</p>
                <p className="text-xs text-muted">
                  {settings.privacyPolicyAccepted
                    ? "Accepted on " + (settings.privacyPolicyAcceptedAt
                        ? new Date(settings.privacyPolicyAcceptedAt).toLocaleDateString()
                        : "account creation")
                    : "Not yet accepted"}
                </p>
              </div>
              {settings.privacyPolicyAccepted
                ? <span className="flex items-center gap-1 text-xs text-green-400 font-bold bg-green-400/10 border border-green-400/20 px-2 py-1 rounded-lg"><Check size={11} /> Agreed</span>
                : <button onClick={() => { updateSetting("privacyPolicyAccepted", true); updateSetting("privacyPolicyAcceptedAt", Date.now() as never); }}
                    className="text-xs text-accent border border-accent/30 px-3 py-1.5 rounded-lg hover:bg-accent/10 transition-colors font-bold">
                    Accept
                  </button>
              }
            </div>
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="flex-1">
                <p className="text-sm font-semibold">Terms of Service</p>
                <p className="text-xs text-muted">Accepted on account creation</p>
              </div>
              <span className="flex items-center gap-1 text-xs text-green-400 font-bold bg-green-400/10 border border-green-400/20 px-2 py-1 rounded-lg">
                <Check size={11} /> Agreed
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 text-xs text-muted/60">
          <a href="#" className="hover:text-accent transition-colors">View Privacy Policy</a>
          <a href="#" className="hover:text-accent transition-colors">View Terms</a>
        </div>
      </div>
    </div>
  );

  if (section === "security") return (
    <div className="max-w-2xl mx-auto lg:max-w-xl">
      <SectionHeader title="Security" onBack={() => setSection("main")} />
      <div className="px-4 py-5 space-y-5">
        {/* Wallet */}
        <div>
          <p className="text-xs text-muted uppercase tracking-wider font-bold px-1 mb-3">Connected Wallet</p>
          <div className="bg-surface border border-white/[0.07] rounded-xl px-4 py-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-xs font-bold text-green-400">Connected</span>
            </div>
            <p className="font-mono text-sm text-text-primary break-all">{walletDisplay}</p>
            <p className="text-xs text-muted mt-1">MetaMask · Base Network</p>
          </div>
        </div>

        {/* 2FA */}
        <div>
          <p className="text-xs text-muted uppercase tracking-wider font-bold px-1 mb-3">Authentication</p>
          <div className="bg-surface border border-white/[0.07] rounded-xl overflow-hidden divide-y divide-white/[0.05]">
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center"><Lock size={15} className="text-accent" /></div>
              <div className="flex-1">
                <p className="text-sm font-semibold">Two-Factor Authentication</p>
                <p className="text-xs text-muted">{settings.twoFactorEnabled ? "Enabled via authenticator app" : "Add extra security to your account"}</p>
              </div>
              <Toggle value={settings.twoFactorEnabled} onChange={v => updateSetting("twoFactorEnabled", v)} label="2FA" />
            </div>
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="w-8 h-8 rounded-lg bg-yellow-400/10 flex items-center justify-center"><Shield size={15} className="text-yellow-400" /></div>
              <div className="flex-1">
                <p className="text-sm font-semibold">Wallet Signature Required</p>
                <p className="text-xs text-muted">Always sign a message to log in</p>
              </div>
              <span className="text-[10px] font-bold text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-1 rounded-lg">Always On</span>
            </div>
          </div>
        </div>

        {/* Active sessions */}
        <div>
          <p className="text-xs text-muted uppercase tracking-wider font-bold px-1 mb-3">Active Sessions</p>
          <div className="bg-surface border border-white/[0.07] rounded-xl px-4 py-3.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Current Session</p>
                <p className="text-xs text-muted">This device · Just now</p>
              </div>
              <span className="text-[10px] font-bold text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-1 rounded-lg flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> Active
              </span>
            </div>
          </div>
        </div>

        {/* Danger */}
        <button onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3.5 bg-red-500/5 border border-red-500/20 rounded-xl hover:bg-red-500/10 transition-all text-red-400 group">
          <X size={16} />
          <span className="font-semibold text-sm">Disconnect Wallet & Log Out</span>
        </button>
      </div>
    </div>
  );

  // ── Main settings page ──────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto lg:max-w-xl px-4 py-6 lg:px-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings size={20} className="text-accent" />
        <h1 className="font-extrabold text-xl">Settings</h1>
      </div>

      {/* Profile card */}
      <Link href="/edit-profile" className="flex items-center gap-4 bg-surface border border-white/[0.07] rounded-2xl p-4 mb-6 hover:border-accent/30 hover:bg-surface2 transition-all group">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent to-cyan flex items-center justify-center text-white font-extrabold text-xl">
          {(user.name[0] || "?").toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold">{user.name}</span>
            <BadgeCheck size={14} className="text-accent" />
          </div>
          <p className="text-sm text-muted font-mono">@{user.username}</p>
          <p className="text-xs text-accent mt-0.5 group-hover:underline">Edit profile →</p>
        </div>
        <ChevronRight size={16} className="text-muted" />
      </Link>

      {/* Connected wallet */}
      <div className="mb-6">
        <p className="text-xs font-bold text-muted uppercase tracking-wider mb-2 px-1">Wallet</p>
        <div className="bg-surface border border-white/[0.07] rounded-2xl px-4 py-3.5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-400/10 flex items-center justify-center"><Wallet size={15} className="text-green-400" /></div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">Connected Wallet</p>
            <p className="text-xs text-muted font-mono truncate">{walletDisplay}</p>
          </div>
          <span className="text-[10px] font-bold text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-1 rounded-full flex-shrink-0">Connected</span>
        </div>
      </div>

      {/* Setting sections */}
      {[
        {
          title: "Preferences",
          items: [
            { icon: Bell, label: "Notifications", desc: "Push, email, alerts", key: "notifications" as Section, badge: settings.pushNotifications ? null : "Off" },
            { icon: Moon, label: "Appearance", desc: settings.theme === "amoled" ? "AMOLED Black" : "Dark", key: "appearance" as Section },
            { icon: Volume2, label: "Sounds", desc: settings.sounds ? "On" : "Off", key: "sounds" as Section },
            { icon: Globe, label: "Language", desc: LANGUAGES.find(l => l.code === settings.language)?.label || "English (US)", key: "language" as Section },
          ],
        },
        {
          title: "Privacy & Security",
          items: [
            { icon: Eye, label: "Privacy", desc: "Profile visibility, legal agreements", key: "privacy" as Section },
            { icon: Shield, label: "Security", desc: "2FA, sessions, wallet", key: "security" as Section },
          ],
        },
      ].map(section => (
        <div key={section.title} className="mb-5">
          <p className="text-xs font-bold text-muted uppercase tracking-wider mb-2 px-1">{section.title}</p>
          <div className="bg-surface border border-white/[0.07] rounded-2xl overflow-hidden divide-y divide-white/[0.05]">
            {section.items.map(({ icon: Icon, label, desc, key, badge }) => (
              <button key={key} onClick={() => setSection(key)}
                className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-surface2 transition-colors text-left group">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={15} className="text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="text-xs text-muted truncate">{desc}</p>
                </div>
                {badge && <span className="text-[10px] text-muted bg-surface3 border border-white/[0.07] px-2 py-0.5 rounded-full">{badge}</span>}
                <ChevronRight size={15} className="text-muted/40 group-hover:text-muted transition-colors flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Logout */}
      <button onClick={logout}
        className="w-full flex items-center gap-3 px-4 py-3.5 bg-surface border border-white/[0.07] rounded-2xl hover:bg-red-500/5 hover:border-red-500/20 transition-all text-red-400 mb-8">
        <LogOut size={18} />
        <span className="font-semibold text-sm">Log Out</span>
      </button>

      <p className="text-center text-xs text-muted/40 font-mono">ARC Community v0.1.0 · Built on Base</p>
    </div>
  );
}
