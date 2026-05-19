"use client";

import { useAuth } from "@/lib/auth";
import { AlertCircle, Loader2, ExternalLink } from "lucide-react";

export default function ConnectWallet() {
  const { connectWallet, isConnecting, error, clearError } = useAuth();

  const hasMetaMask =
    typeof window !== "undefined" && Boolean(window.ethereum?.isMetaMask);

  return (
    <div className="animate-fade-in">
      {/* Logo */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 border border-accent/30 mb-5 shadow-accent">
          <span className="text-3xl font-extrabold gradient-text">A</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">
          Welcome to <span className="gradient-text">ARC</span>
        </h1>
        <p className="text-muted text-sm">
          The onchain social community. Connect your wallet to get started.
        </p>
      </div>

      {/* Card */}
      <div className="bg-surface border border-white/[0.08] rounded-2xl p-6 shadow-card">
        {/* MetaMask button */}
        {hasMetaMask ? (
          <button
            onClick={() => { clearError(); connectWallet(); }}
            disabled={isConnecting}
            className="w-full flex items-center justify-center gap-3 py-4 px-5 bg-gradient-to-r from-[#F6851B] to-[#E4760A] hover:from-[#F6851B]/90 hover:to-[#E4760A]/90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 active:translate-y-0"
          >
            {isConnecting ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <MetaMaskFox />
            )}
            {isConnecting ? "Connecting…" : "Connect MetaMask"}
          </button>
        ) : (
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-3 py-4 px-5 border border-[#F6851B]/40 text-[#F6851B] hover:bg-[#F6851B]/10 font-bold rounded-xl transition-all"
          >
            <MetaMaskFox />
            Install MetaMask
            <ExternalLink size={14} />
          </a>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-white/[0.07]" />
          <span className="text-xs text-muted">How it works</span>
          <div className="flex-1 h-px bg-white/[0.07]" />
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {[
            { n: "1", text: "Connect your MetaMask wallet" },
            { n: "2", text: "Sign a message to verify ownership" },
            { n: "3", text: "First time? Set your name & username" },
            { n: "4", text: "Returning? You're in instantly" },
          ].map(({ n, text }) => (
            <div key={n} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-bold text-accent">{n}</span>
              </div>
              <p className="text-sm text-text-secondary">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer note */}
      <p className="text-center text-xs text-muted/50 mt-5">
        No password. No email. Your wallet is your account.
      </p>
    </div>
  );
}

function MetaMaskFox() {
  return (
    <svg width="24" height="24" viewBox="0 0 318 318" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M274.1 35.5l-99.7 74.1 18.4-43.6 81.3-30.5z" fill="#E2761B" stroke="#E2761B" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M44.4 35.5l98.9 74.8-17.5-44.3-81.4-30.5z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M238.3 206.8l-26.5 40.6 56.7 15.6 16.3-55.3-46.5-.9z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M33.9 207.7l16.2 55.3 56.7-15.6-26.5-40.6-46.4.9z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M103.6 138.2l-15.8 23.9 56.3 2.5-2-60.5-38.5 34.1z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M214.9 138.2l-39-34.8-1.3 61.2 56.2-2.5-15.9-23.9z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M106.8 247.4l33.8-16.5-29.2-22.8-4.6 39.3z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M177.9 230.9l33.9 16.5-4.7-39.3-29.2 22.8z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
