"use client";

import { useState } from "react";
import { Users, Copy, Check, Gift, TrendingUp, UserPlus } from "lucide-react";
import { currentUser } from "@/lib/mockData";

const referralCode = "ARC-" + currentUser.username.toUpperCase().slice(0, 6);
const referralLink = `https://arc.community/join?ref=${referralCode}`;

const mockReferrals = [
  { name: "basegirl.eth", joined: "2d ago", reward: "25 ARC" },
  { name: "0xbuilder.eth", joined: "5d ago", reward: "25 ARC" },
  { name: "cryptosage.eth", joined: "1w ago", reward: "25 ARC" },
];

export default function ReferralsPage() {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const copy = (text: string, setFn: (v: boolean) => void) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setFn(true);
    setTimeout(() => setFn(false), 1500);
  };

  return (
    <div className="max-w-2xl mx-auto lg:max-w-xl px-4 py-6 lg:px-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Users size={20} className="text-accent" />
        <div className="flex items-center gap-2">
          <h1 className="font-extrabold text-xl">Referrals</h1>
          <span className="text-xs font-bold bg-accent/20 text-accent px-2 py-0.5 rounded-full border border-accent/30">New</span>
        </div>
      </div>

      {/* Hero card */}
      <div className="relative bg-gradient-to-br from-accent/20 via-surface to-cyan/10 border border-accent/25 rounded-2xl p-6 mb-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <Gift size={16} className="text-accent" />
            <span className="text-xs font-bold text-accent uppercase tracking-wider">Earn rewards</span>
          </div>
          <h2 className="text-2xl font-extrabold mb-2">Get <span className="gradient-text">25 ARC</span> per referral</h2>
          <p className="text-sm text-muted leading-relaxed">
            Invite friends to ARC Community. When they sign up and post their first cast, you both earn 25 ARC tokens instantly.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Referred", value: mockReferrals.length.toString(), icon: UserPlus },
          { label: "Earned", value: "75 ARC", icon: Gift },
          { label: "Pending", value: "2", icon: TrendingUp },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-surface border border-white/[0.07] rounded-xl p-4 text-center">
            <Icon size={14} className="text-accent mx-auto mb-1.5" />
            <div className="font-extrabold text-lg">{value}</div>
            <div className="text-xs text-muted">{label}</div>
          </div>
        ))}
      </div>

      {/* Referral code */}
      <div className="bg-surface border border-white/[0.07] rounded-2xl p-5 mb-4">
        <p className="text-xs font-bold text-muted uppercase tracking-wider mb-3">Your Referral Code</p>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-surface2 rounded-xl px-4 py-3 font-mono font-bold text-lg tracking-widest text-accent border border-accent/20">
            {referralCode}
          </div>
          <button
            onClick={() => copy(referralCode, setCopiedCode)}
            className="flex items-center gap-2 px-4 py-3 bg-accent hover:bg-accent-light text-white font-bold text-sm rounded-xl transition-all"
          >
            {copiedCode ? <Check size={16} /> : <Copy size={16} />}
            {copiedCode ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* Referral link */}
      <div className="bg-surface border border-white/[0.07] rounded-2xl p-5 mb-6">
        <p className="text-xs font-bold text-muted uppercase tracking-wider mb-3">Referral Link</p>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-surface2 rounded-xl px-4 py-3 text-xs font-mono text-muted truncate border border-white/[0.07]">
            {referralLink}
          </div>
          <button
            onClick={() => copy(referralLink, setCopiedLink)}
            className="flex items-center gap-2 px-4 py-3 border border-white/[0.1] hover:bg-surface2 text-text-primary font-bold text-sm rounded-xl transition-all flex-shrink-0"
          >
            {copiedLink ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
            {copiedLink ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* Referral history */}
      <div>
        <p className="text-xs font-bold text-muted uppercase tracking-wider mb-3">Your Referrals</p>
        <div className="space-y-2">
          {mockReferrals.map((r, i) => (
            <div key={i} className="flex items-center gap-3 bg-surface border border-white/[0.07] rounded-xl px-4 py-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent/40 to-cyan/40 flex items-center justify-center text-white font-bold text-sm">
                {r.name[0].toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">{r.name}</p>
                <p className="text-xs text-muted">Joined {r.joined}</p>
              </div>
              <span className="text-sm font-bold text-accent">+{r.reward}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
