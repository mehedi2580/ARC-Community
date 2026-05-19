"use client";

import { use, useState } from "react";
import { BadgeCheck, MessageSquare, Coins, Copy, Check, ArrowLeft, ExternalLink } from "lucide-react";
import { useSocial } from "@/lib/social";
import { useAuth } from "@/lib/auth";
import { useUSDCTip } from "@/lib/usdc";
import PostCard from "@/components/feed/PostCard";
import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";

const PRESET_AMOUNTS = ["1", "5", "10", "25"];

export default function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const { user: me } = useAuth();
  const { getUserByUsername, getPostsByUser, sendDM } = useSocial();
  const { sendTip, loading: tipLoading } = useUSDCTip();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("casts");
  const [showTip, setShowTip] = useState(false);
  const [tipAmount, setTipAmount] = useState("5");
  const [tipResult, setTipResult] = useState<{ success?: boolean; txHash?: string; error?: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const profileUser = getUserByUsername(username);
  const posts = profileUser ? getPostsByUser(profileUser.walletAddress) : [];
  const isOwn = me?.username === username;

  const handleCopyAddress = () => {
    if (!profileUser) return;
    navigator.clipboard.writeText(profileUser.walletAddress).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSendTip = async () => {
    if (!profileUser || !me) return;
    setTipResult(null);
    const result = await sendTip(profileUser.walletAddress, tipAmount);
    setTipResult(result);
    if (result.success && result.txHash) {
      sendDM(
        me.walletAddress,
        profileUser.walletAddress,
        `💸 I just sent you $${tipAmount} USDC! Tx: ${result.txHash.slice(0, 10)}...`
      );
    }
  };

  if (!profileUser) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-2xl font-extrabold mb-2">User not found</p>
        <p className="text-muted text-sm mb-6">@{username} doesn&apos;t exist on ARC</p>
        <Link href="/search" className="text-accent hover:underline text-sm">Search for someone else</Link>
      </div>
    );
  }

  const joinedDate = new Date(profileUser.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="max-w-2xl mx-auto lg:max-w-xl">
      {/* Back */}
      <div className="sticky top-0 lg:top-0 z-30 glass border-b border-white/[0.07] px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()} className="p-1.5 rounded-lg text-muted hover:text-text-primary hover:bg-surface2 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div>
          <p className="font-bold text-sm">{profileUser.name}</p>
          <p className="text-xs text-muted">{posts.length} casts</p>
        </div>
      </div>

      {/* Cover */}
      <div className="h-24 lg:h-32 bg-gradient-to-br from-accent/30 via-surface3 to-cyan/20 relative overflow-hidden">
        <div className="absolute inset-0 grid-overlay opacity-20" />
      </div>

      {/* Profile info */}
      <div className="px-4 lg:px-6">
        <div className="flex items-end justify-between -mt-8 mb-3">
          <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-accent to-cyan border-4 border-bg flex items-center justify-center text-white font-extrabold text-2xl">
            {(profileUser.name[0] || "?").toUpperCase()}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 flex-wrap justify-end">
            {isOwn ? (
              <Link href="/settings"
                className="px-4 py-2 border border-white/[0.15] rounded-xl text-sm font-bold hover:bg-surface2 transition-colors">
                Edit profile
              </Link>
            ) : me && (
              <>
                <Link
                  href={"/messages?dm=" + profileUser.walletAddress}
                  className="flex items-center gap-1.5 px-3 py-2 border border-white/[0.15] rounded-xl text-sm font-bold hover:bg-surface2 transition-colors"
                >
                  <MessageSquare size={14} />
                  <span className="hidden sm:inline">Message</span>
                </Link>
                <button
                  onClick={() => { setShowTip(true); setTipResult(null); }}
                  className="flex items-center gap-1.5 px-3 py-2 bg-accent hover:bg-accent-light text-white rounded-xl text-sm font-bold transition-colors shadow-accent-sm"
                >
                  <Coins size={14} />
                  Tip USDC
                </button>
              </>
            )}
          </div>
        </div>

        {/* Name */}
        <div className="flex items-center gap-2 mb-0.5">
          <h1 className="font-extrabold text-xl">{profileUser.name}</h1>
          <BadgeCheck size={18} className="text-accent" />
        </div>
        <p className="text-sm text-muted font-mono mb-2">@{profileUser.username}</p>
        {profileUser.bio && <p className="text-sm text-text-secondary leading-relaxed mb-3">{profileUser.bio}</p>}

        {/* Wallet */}
        <button onClick={handleCopyAddress}
          className="flex items-center gap-2 bg-surface2 hover:bg-surface3 border border-white/[0.07] rounded-xl px-3 py-2 text-xs font-mono text-muted transition-colors mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
          {profileUser.walletAddress.slice(0, 10)}…{profileUser.walletAddress.slice(-6)}
          {copied ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
        </button>

        {/* Joined */}
        <p className="text-xs text-muted mb-4">Joined {joinedDate}</p>

        {/* Tabs */}
        <div className="flex border-b border-white/[0.07] overflow-x-auto">
          {["casts", "likes"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={clsx("flex-shrink-0 px-4 py-3 text-sm font-bold capitalize transition-all border-b-2",
                activeTab === tab ? "border-accent text-accent" : "border-transparent text-muted hover:text-text-primary")}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div>
        {posts.length > 0
          ? posts.map(p => <PostCard key={p.id} post={p} />)
          : (
            <div className="text-center py-16 text-muted">
              <p className="text-sm">No casts yet</p>
            </div>
          )
        }
      </div>

      {/* Tip Modal */}
      {showTip && (
        <>
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" onClick={() => setShowTip(false)} />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-sm mx-auto animate-slide-up">
            <div className="bg-surface border border-white/[0.1] rounded-2xl shadow-card p-5">
              <div className="text-center mb-5">
                <div className="text-3xl mb-2">💸</div>
                <h2 className="font-extrabold text-lg">Tip {profileUser.name}</h2>
                <p className="text-xs text-muted font-mono mt-1">
                  {profileUser.walletAddress.slice(0, 8)}…{profileUser.walletAddress.slice(-6)}
                </p>
              </div>

              {tipResult ? (
                <div className={clsx("rounded-xl p-4 text-center mb-4",
                  tipResult.success ? "bg-green-500/10 border border-green-500/20" : "bg-red-500/10 border border-red-500/20")}>
                  {tipResult.success ? (
                    <>
                      <p className="font-bold text-green-400 mb-1">✅ Tip sent!</p>
                      <p className="text-xs text-green-400/80 font-mono break-all">{tipResult.txHash}</p>
                      {tipResult.txHash && (
                        <a href={"https://basescan.org/tx/" + tipResult.txHash} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-accent flex items-center justify-center gap-1 mt-2 hover:underline">
                          View on Basescan <ExternalLink size={11} />
                        </a>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-red-400">{tipResult.error}</p>
                  )}
                </div>
              ) : (
                <>
                  {/* Preset amounts */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {PRESET_AMOUNTS.map(a => (
                      <button key={a} onClick={() => setTipAmount(a)}
                        className={clsx("py-2.5 rounded-xl text-sm font-bold transition-all border",
                          tipAmount === a
                            ? "bg-accent border-accent text-white"
                            : "border-white/[0.1] text-muted hover:border-accent/50 hover:text-text-primary")}>
                        ${a}
                      </button>
                    ))}
                  </div>

                  {/* Custom amount */}
                  <div className="flex items-center gap-2 bg-surface2 border border-white/[0.07] rounded-xl px-4 py-3 mb-4 focus-within:border-accent/50 transition-all">
                    <span className="text-muted font-bold">$</span>
                    <input value={tipAmount} onChange={e => setTipAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                      placeholder="Custom amount"
                      className="flex-1 bg-transparent text-sm text-text-primary placeholder-muted focus:outline-none" />
                    <span className="text-xs text-muted font-mono">USDC</span>
                  </div>

                  <p className="text-xs text-muted/60 text-center mb-4">
                    Sent on Base network via MetaMask
                  </p>
                </>
              )}

              <div className="flex gap-2">
                <button onClick={() => setShowTip(false)}
                  className="flex-1 py-3 border border-white/[0.1] rounded-xl text-sm font-bold text-muted hover:bg-surface2 transition-colors">
                  {tipResult?.success ? "Close" : "Cancel"}
                </button>
                {!tipResult?.success && (
                  <button onClick={handleSendTip} disabled={tipLoading || !tipAmount || parseFloat(tipAmount) <= 0}
                    className="flex-1 py-3 bg-accent hover:bg-accent-light disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2">
                    {tipLoading ? (
                      <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending…</>
                    ) : (
                      <>Send ${tipAmount} USDC</>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
