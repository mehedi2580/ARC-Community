"use client";

import { useState } from "react";
import { Star, ExternalLink, TrendingUp } from "lucide-react";
import { mockCollectibles } from "@/lib/mockData";

const tabs = ["owned", "created", "activity"];

export default function CollectiblesPage() {
  const [activeTab, setActiveTab] = useState("owned");

  return (
    <div className="max-w-2xl mx-auto lg:max-w-none px-4 py-4 lg:px-6 lg:py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Star size={20} className="text-accent" />
        <h1 className="font-extrabold text-xl">Collectibles</h1>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Total Owned", value: "5 NFTs" },
          { label: "Est. Value", value: "0.83 ETH" },
          { label: "Collections", value: "4" },
        ].map(({ label, value }) => (
          <div key={label} className="bg-surface border border-white/[0.07] rounded-xl p-4 text-center">
            <div className="font-extrabold text-lg gradient-text">{value}</div>
            <div className="text-xs text-muted mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface2 rounded-xl p-1 mb-5 w-fit">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-sm font-bold capitalize transition-all ${
              activeTab === tab ? "bg-accent text-white" : "text-muted hover:text-text-primary"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid */}
      {activeTab === "owned" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
          {mockCollectibles.map(nft => (
            <div
              key={nft.id}
              className="group bg-surface border border-white/[0.07] rounded-2xl overflow-hidden hover:border-accent/30 hover:-translate-y-1 transition-all cursor-pointer"
            >
              {/* Image placeholder */}
              <div className="aspect-square bg-gradient-to-br from-accent/20 via-surface3 to-cyan/10 flex items-center justify-center text-4xl relative overflow-hidden">
                <span>🖼</span>
                <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-2">
                  <ExternalLink size={14} className="text-white" />
                </div>
              </div>
              <div className="p-3">
                <p className="font-bold text-xs truncate mb-0.5">{nft.name}</p>
                <p className="text-[10px] text-muted truncate mb-2">{nft.collection}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-muted">Floor</p>
                    <p className="text-xs font-bold text-accent">{nft.floorPrice}</p>
                  </div>
                  {nft.owned > 1 && (
                    <span className="text-[10px] bg-surface2 px-1.5 py-0.5 rounded-md text-muted">
                      x{nft.owned}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab !== "owned" && (
        <div className="flex flex-col items-center justify-center py-20 text-muted">
          <TrendingUp size={32} className="mb-4 opacity-30" />
          <p className="text-sm font-semibold">Coming soon</p>
        </div>
      )}
    </div>
  );
}
