import { Zap } from "lucide-react";

const updates = [
  {
    version: "v0.3.0",
    date: "May 18, 2026",
    badge: "Latest",
    items: [
      "🎉 Launched ARC Community beta to 140+ countries",
      "⚡ Instant USDC payments with zero fees",
      "📡 Farcaster-powered social feed integration",
      "🔔 Real-time notifications for likes, reposts, and follows",
    ],
  },
  {
    version: "v0.2.0",
    date: "April 30, 2026",
    badge: null,
    items: [
      "💬 Encrypted direct messages",
      "🖼 Collectibles & NFT gallery",
      "👥 Referral program with 25 ARC rewards",
      "🔍 Explore channels and trending topics",
    ],
  },
  {
    version: "v0.1.0",
    date: "April 1, 2026",
    badge: null,
    items: [
      "🚀 Initial private beta launch",
      "🏠 Home feed with onchain social posts",
      "👤 User profiles with wallet connect",
      "🔖 Bookmarks and post interactions",
    ],
  },
];

const roadmap = [
  { label: "AI Agents in DMs", status: "In Progress" },
  { label: "Creator Coin minting", status: "In Progress" },
  { label: "Mini Apps marketplace", status: "Planned" },
  { label: "Cross-chain swaps", status: "Planned" },
  { label: "ARC token airdrop", status: "Coming Soon" },
];

export default function UpdatesPage() {
  return (
    <div className="max-w-2xl mx-auto lg:max-w-xl px-4 py-6 lg:px-6">
      <div className="flex items-center gap-3 mb-6">
        <Zap size={20} className="text-accent" />
        <h1 className="font-extrabold text-xl">Updates</h1>
      </div>

      {/* Changelog */}
      <div className="mb-8">
        <p className="text-xs font-bold text-muted uppercase tracking-wider mb-4">Changelog</p>
        <div className="space-y-5">
          {updates.map(u => (
            <div key={u.version} className="relative pl-5 border-l border-white/[0.07]">
              <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-accent border-2 border-bg" />
              <div className="flex items-center gap-2 mb-2">
                <span className="font-extrabold text-sm">{u.version}</span>
                {u.badge && (
                  <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full border border-accent/30">
                    {u.badge}
                  </span>
                )}
                <span className="text-xs text-muted ml-auto">{u.date}</span>
              </div>
              <ul className="space-y-1.5">
                {u.items.map((item, i) => (
                  <li key={i} className="text-sm text-text-secondary">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Roadmap */}
      <div>
        <p className="text-xs font-bold text-muted uppercase tracking-wider mb-4">Roadmap</p>
        <div className="space-y-2">
          {roadmap.map(r => (
            <div key={r.label} className="flex items-center gap-3 bg-surface border border-white/[0.07] rounded-xl px-4 py-3">
              <div className="flex-1 text-sm font-semibold">{r.label}</div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                r.status === "In Progress"
                  ? "text-yellow-400 bg-yellow-400/10 border border-yellow-400/20"
                  : r.status === "Coming Soon"
                  ? "text-accent bg-accent/10 border border-accent/20"
                  : "text-muted bg-surface2 border border-white/[0.05]"
              }`}>
                {r.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
