"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { CheckCircle2, AlertCircle, User, AtSign, Wallet } from "lucide-react";
import clsx from "clsx";

function shortenAddress(addr: string) {
  return addr.slice(0, 6) + "…" + addr.slice(-4);
}

function validateUsername(u: string) {
  if (u.length < 3) return "At least 3 characters";
  if (u.length > 20) return "Max 20 characters";
  if (!/^[a-z0-9_]+$/.test(u)) return "Only lowercase letters, numbers, underscores";
  return null;
}

function validateName(n: string) {
  if (n.trim().length < 2) return "At least 2 characters";
  if (n.trim().length > 40) return "Max 40 characters";
  return null;
}

export default function RegisterForm() {
  const { connectedAddress, completeRegistration } = useAuth();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [touched, setTouched] = useState({ name: false, username: false });
  const [submitting, setSubmitting] = useState(false);

  const nameError = touched.name ? validateName(name) : null;
  const usernameError = touched.username ? validateUsername(username) : null;
  const canSubmit =
    !validateName(name) && !validateUsername(username) && name && username;

  const handleUsernameChange = useCallback((val: string) => {
    setUsername(val.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 20));
  }, []);

  const handleSubmit = async () => {
    setTouched({ name: true, username: true });
    if (!canSubmit) return;
    setSubmitting(true);
    // Small delay for UX feel
    await new Promise(r => setTimeout(r, 600));
    completeRegistration(name, username);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 border border-accent/30 mb-5 shadow-accent">
          <span className="text-3xl font-extrabold gradient-text">A</span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight mb-1">
          Create your profile
        </h1>
        <p className="text-muted text-sm">One-time setup — you won&apos;t be asked again.</p>
      </div>

      {/* Wallet badge */}
      <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 mb-6">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse-slow" />
        <Wallet size={14} className="text-green-400" />
        <span className="text-sm font-mono text-green-400 font-semibold">
          {connectedAddress ? shortenAddress(connectedAddress) : ""}
        </span>
        <span className="text-xs text-green-400/60 ml-1">connected</span>
      </div>

      {/* Form */}
      <div className="bg-surface border border-white/[0.08] rounded-2xl p-6 shadow-card space-y-5">
        {/* Name */}
        <div>
          <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
            Display Name
          </label>
          <div className={clsx(
            "flex items-center gap-3 bg-surface2 border rounded-xl px-4 py-3 transition-all",
            nameError ? "border-red-500/40" : name && !nameError ? "border-green-500/40" : "border-white/[0.07] focus-within:border-accent/50"
          )}>
            <User size={16} className="text-muted flex-shrink-0" />
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              onBlur={() => setTouched(t => ({ ...t, name: true }))}
              placeholder="Satoshi Nakamoto"
              className="flex-1 bg-transparent text-sm text-text-primary placeholder-muted focus:outline-none"
              maxLength={40}
            />
            {name && !nameError && <CheckCircle2 size={15} className="text-green-400 flex-shrink-0" />}
          </div>
          {nameError && (
            <p className="flex items-center gap-1 mt-1.5 text-xs text-red-400">
              <AlertCircle size={11} /> {nameError}
            </p>
          )}
        </div>

        {/* Username */}
        <div>
          <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
            Username
          </label>
          <div className={clsx(
            "flex items-center gap-3 bg-surface2 border rounded-xl px-4 py-3 transition-all",
            usernameError ? "border-red-500/40" : username && !usernameError ? "border-green-500/40" : "border-white/[0.07] focus-within:border-accent/50"
          )}>
            <AtSign size={16} className="text-muted flex-shrink-0" />
            <input
              value={username}
              onChange={e => handleUsernameChange(e.target.value)}
              onBlur={() => setTouched(t => ({ ...t, username: true }))}
              placeholder="satoshi"
              className="flex-1 bg-transparent text-sm text-text-primary placeholder-muted focus:outline-none font-mono"
              maxLength={20}
            />
            {username && !usernameError && <CheckCircle2 size={15} className="text-green-400 flex-shrink-0" />}
          </div>
          {usernameError && (
            <p className="flex items-center gap-1 mt-1.5 text-xs text-red-400">
              <AlertCircle size={11} /> {usernameError}
            </p>
          )}
          {username && !usernameError && (
            <p className="mt-1.5 text-xs text-muted font-mono">@{username}.arc</p>
          )}
          <p className="mt-1.5 text-xs text-muted/50">
            Lowercase letters, numbers, underscores only. 3–20 chars.
          </p>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || submitting}
          className={clsx(
            "w-full py-3.5 rounded-xl font-bold text-sm transition-all",
            canSubmit && !submitting
              ? "bg-accent hover:bg-accent-light text-white shadow-accent hover:-translate-y-0.5 active:translate-y-0"
              : "bg-surface3 text-muted cursor-not-allowed"
          )}
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating account…
            </span>
          ) : (
            "Create Account →"
          )}
        </button>
      </div>

      <p className="text-center text-xs text-muted/50 mt-5">
        Your wallet address is your identity. No password needed.
      </p>
    </div>
  );
}
