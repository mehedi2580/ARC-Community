"use client";

import {
  createContext, useContext, useState, useEffect,
  useCallback, ReactNode,
} from "react";
import { UserProfile } from "./auth";

// ── Types ────────────────────────────────────────────────────
export interface Post {
  id: string;
  authorAddress: string;
  authorName: string;
  authorUsername: string;
  content: string;
  createdAt: number;
  likes: string[];        // wallet addresses
  reposts: string[];      // wallet addresses
  replyTo?: string;       // parent post id
  replyCount: number;
  channel?: string;
  tags: string[];
}

export interface DMessage {
  id: string;
  fromAddress: string;
  toAddress: string;
  content: string;
  createdAt: number;
  read: boolean;
}

export interface Tip {
  id: string;
  fromAddress: string;
  toAddress: string;
  amount: string;         // USDC amount string
  txHash: string;
  createdAt: number;
}

// ── Storage helpers ──────────────────────────────────────────
const POSTS_KEY   = "arc_posts";
const DMS_KEY     = "arc_dms";
const TIPS_KEY    = "arc_tips";
const USERS_KEY   = "arc_users";

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; }
  catch { return fallback; }
}
function save(key: string, val: unknown) {
  localStorage.setItem(key, JSON.stringify(val));
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// Seed demo posts if empty
function seedPosts(): Post[] {
  const seeds: Post[] = [
    {
      id: "seed1",
      authorAddress: "0xdemo0001",
      authorName: "memeceo.eth",
      authorUsername: "memeceo",
      content: "2024 was a peak year for Farcaster and airdrops.\n\nI didn't book profits and kept buying shitty altcoins.\n\nI haven't touched zero, and I know I'll recover. 🚀",
      createdAt: Date.now() - 7200000,
      likes: ["0xdemo0002", "0xdemo0003"],
      reposts: ["0xdemo0003"],
      replyCount: 3,
      channel: "farcaster",
      tags: ["crypto", "farcaster"],
    },
    {
      id: "seed2",
      authorAddress: "0xdemo0002",
      authorName: "basegirl.eth",
      authorUsername: "basegirl",
      content: "Base just settled $10B in transactions this week alone 🔵\n\nWe're not early anymore. We're RIGHT ON TIME.\n\nThe onchain economy is here.",
      createdAt: Date.now() - 14400000,
      likes: ["0xdemo0001", "0xdemo0003", "0xdemo0004"],
      reposts: ["0xdemo0001"],
      replyCount: 7,
      tags: ["base", "onchain"],
    },
    {
      id: "seed3",
      authorAddress: "0xdemo0003",
      authorName: "cryptosage.eth",
      authorUsername: "cryptosage",
      content: "Thread: Why we're entering the longest bull market in crypto history 🧵\n\n1/ Regulatory clarity is finally here. This removes the single biggest institutional blocker.",
      createdAt: Date.now() - 21600000,
      likes: ["0xdemo0001"],
      reposts: [],
      replyCount: 12,
      tags: ["analysis", "macro"],
    },
    {
      id: "seed4",
      authorAddress: "0xdemo0004",
      authorName: "nimaleophotos.eth",
      authorUsername: "nimaleophotos",
      content: "GM GM fam! 🧡\n\nPosting my first onchain photo collection today. Every frame is a memory minted forever.",
      createdAt: Date.now() - 3600000,
      likes: [],
      reposts: [],
      replyCount: 2,
      tags: ["nft", "photography"],
    },
  ];
  save(POSTS_KEY, seeds);
  return seeds;
}

function seedUsers(): Record<string, UserProfile> {
  const demos: Record<string, UserProfile> = {
    "0xdemo0001": { walletAddress: "0xdemo0001", name: "memeceo.eth", username: "memeceo", createdAt: Date.now() - 86400000 * 30 },
    "0xdemo0002": { walletAddress: "0xdemo0002", name: "basegirl.eth", username: "basegirl", createdAt: Date.now() - 86400000 * 20 },
    "0xdemo0003": { walletAddress: "0xdemo0003", name: "cryptosage.eth", username: "cryptosage", createdAt: Date.now() - 86400000 * 60 },
    "0xdemo0004": { walletAddress: "0xdemo0004", name: "nimaleophotos.eth", username: "nimaleophotos", createdAt: Date.now() - 86400000 * 10 },
  };
  const existing = load<Record<string, UserProfile>>(USERS_KEY, {});
  const merged = { ...demos, ...existing };
  save(USERS_KEY, merged);
  return merged;
}

// ── Context ──────────────────────────────────────────────────
interface SocialContextType {
  posts: Post[];
  dms: DMessage[];
  tips: Tip[];
  allUsers: Record<string, UserProfile>;
  createPost: (content: string, channel?: string, replyTo?: string) => Post;
  toggleLike: (postId: string, address: string) => void;
  toggleRepost: (postId: string, address: string) => void;
  deletePost: (postId: string, address: string) => void;
  sendDM: (fromAddress: string, toAddress: string, content: string) => void;
  markDMsRead: (myAddress: string, otherAddress: string) => void;
  recordTip: (from: string, to: string, amount: string, txHash: string) => void;
  getThread: (postId: string) => Post[];
  getPostsByUser: (address: string) => Post[];
  searchPosts: (query: string) => Post[];
  searchUsers: (query: string) => UserProfile[];
  getConversation: (a: string, b: string) => DMessage[];
  getConversationList: (address: string) => { user: UserProfile; lastMsg: DMessage; unread: number }[];
  unreadDMCount: (address: string) => number;
  getUserByUsername: (username: string) => UserProfile | null;
  getUserByAddress: (address: string) => UserProfile | null;
  registerUser: (profile: UserProfile) => void;
  getTipsFor: (address: string) => Tip[];
}

const SocialContext = createContext<SocialContextType | null>(null);

export function SocialProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts]     = useState<Post[]>([]);
  const [dms, setDms]         = useState<DMessage[]>([]);
  const [tips, setTips]       = useState<Tip[]>([]);
  const [allUsers, setAllUsers] = useState<Record<string, UserProfile>>({});
  const [ready, setReady]     = useState(false);

  useEffect(() => {
    const storedPosts = load<Post[]>(POSTS_KEY, []);
    setPosts(storedPosts.length ? storedPosts : seedPosts());
    setDms(load<DMessage[]>(DMS_KEY, []));
    setTips(load<Tip[]>(TIPS_KEY, []));
    setAllUsers(seedUsers());
    setReady(true);
  }, []);

  const persist = useCallback((newPosts: Post[]) => {
    setPosts(newPosts);
    save(POSTS_KEY, newPosts);
  }, []);

  const persistDms = useCallback((newDms: DMessage[]) => {
    setDms(newDms);
    save(DMS_KEY, newDms);
  }, []);

  const createPost = useCallback((content: string, channel?: string, replyTo?: string): Post => {
    const stored = load<Record<string, UserProfile>>(USERS_KEY, {});
    // We'll get author from session
    const sessionAddr = localStorage.getItem("arc_session") || "";
    const author = stored[sessionAddr];
    const post: Post = {
      id: uid(),
      authorAddress: sessionAddr,
      authorName: author?.name || "Unknown",
      authorUsername: author?.username || "unknown",
      content: content.trim(),
      createdAt: Date.now(),
      likes: [],
      reposts: [],
      replyCount: 0,
      channel,
      replyTo,
      tags: (content.match(/#(\w+)/g) || []).map(t => t.slice(1)),
    };
    setPosts(prev => {
      let updated = [post, ...prev];
      if (replyTo) {
        updated = updated.map(p =>
          p.id === replyTo ? { ...p, replyCount: p.replyCount + 1 } : p
        );
      }
      save(POSTS_KEY, updated);
      return updated;
    });
    return post;
  }, []);

  const toggleLike = useCallback((postId: string, address: string) => {
    setPosts(prev => {
      const updated = prev.map(p => {
        if (p.id !== postId) return p;
        const liked = p.likes.includes(address);
        return { ...p, likes: liked ? p.likes.filter(a => a !== address) : [...p.likes, address] };
      });
      save(POSTS_KEY, updated);
      return updated;
    });
  }, []);

  const toggleRepost = useCallback((postId: string, address: string) => {
    setPosts(prev => {
      const original = prev.find(p => p.id === postId);
      if (!original) return prev;
      const reposted = original.reposts.includes(address);
      let updated = prev.map(p => {
        if (p.id !== postId) return p;
        return { ...p, reposts: reposted ? p.reposts.filter(a => a !== address) : [...p.reposts, address] };
      });
      // Add a repost entry if not already reposted
      if (!reposted) {
        const sessionAddr = localStorage.getItem("arc_session") || "";
        const stored = load<Record<string, UserProfile>>(USERS_KEY, {});
        const reposter = stored[sessionAddr];
        const repostEntry: Post = {
          ...original,
          id: uid(),
          authorAddress: sessionAddr,
          authorName: reposter?.name || "Unknown",
          authorUsername: reposter?.username || "unknown",
          createdAt: Date.now(),
          likes: [],
          reposts: [],
          replyCount: 0,
          replyTo: undefined,
          // mark as repost
          content: `🔁 Reposted @${original.authorUsername}\n\n${original.content}`,
        };
        updated = [repostEntry, ...updated];
      }
      save(POSTS_KEY, updated);
      return updated;
    });
  }, []);

  const deletePost = useCallback((postId: string, address: string) => {
    setPosts(prev => {
      const updated = prev.filter(p => !(p.id === postId && p.authorAddress === address));
      save(POSTS_KEY, updated);
      return updated;
    });
  }, []);

  const sendDM = useCallback((from: string, to: string, content: string) => {
    const msg: DMessage = {
      id: uid(),
      fromAddress: from,
      toAddress: to,
      content: content.trim(),
      createdAt: Date.now(),
      read: false,
    };
    persistDms([...dms, msg]);
  }, [dms, persistDms]);

  const markDMsRead = useCallback((myAddress: string, otherAddress: string) => {
    setDms(prev => {
      const updated = prev.map(m =>
        m.toAddress === myAddress && m.fromAddress === otherAddress ? { ...m, read: true } : m
      );
      save(DMS_KEY, updated);
      return updated;
    });
  }, []);

  const recordTip = useCallback((from: string, to: string, amount: string, txHash: string) => {
    const tip: Tip = { id: uid(), fromAddress: from, toAddress: to, amount, txHash, createdAt: Date.now() };
    setTips(prev => {
      const updated = [...prev, tip];
      save(TIPS_KEY, updated);
      return updated;
    });
  }, []);

  const registerUser = useCallback((profile: UserProfile) => {
    setAllUsers(prev => {
      const updated = { ...prev, [profile.walletAddress.toLowerCase()]: profile };
      save(USERS_KEY, updated);
      return updated;
    });
  }, []);

  const getThread = useCallback((postId: string): Post[] => {
    return posts.filter(p => p.replyTo === postId).sort((a, b) => a.createdAt - b.createdAt);
  }, [posts]);

  const getPostsByUser = useCallback((address: string): Post[] => {
    return posts.filter(p => p.authorAddress === address).sort((a, b) => b.createdAt - a.createdAt);
  }, [posts]);

  const searchPosts = useCallback((query: string): Post[] => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return posts.filter(p =>
      p.content.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q)) ||
      p.authorUsername.toLowerCase().includes(q) ||
      p.channel?.toLowerCase().includes(q)
    ).sort((a, b) => b.createdAt - a.createdAt);
  }, [posts]);

  const searchUsers = useCallback((query: string): UserProfile[] => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return Object.values(allUsers).filter(u =>
      u.username.toLowerCase().includes(q) ||
      u.name.toLowerCase().includes(q)
    );
  }, [allUsers]);

  const getConversation = useCallback((a: string, b: string): DMessage[] => {
    return dms.filter(m =>
      (m.fromAddress === a && m.toAddress === b) ||
      (m.fromAddress === b && m.toAddress === a)
    ).sort((x, y) => x.createdAt - y.createdAt);
  }, [dms]);

  const getConversationList = useCallback((address: string) => {
    const partners = new Set<string>();
    dms.forEach(m => {
      if (m.fromAddress === address) partners.add(m.toAddress);
      if (m.toAddress === address) partners.add(m.fromAddress);
    });
    return Array.from(partners).map(partner => {
      const msgs = dms.filter(m =>
        (m.fromAddress === address && m.toAddress === partner) ||
        (m.fromAddress === partner && m.toAddress === address)
      ).sort((a, b) => b.createdAt - a.createdAt);
      const lastMsg = msgs[0];
      const unread = msgs.filter(m => m.toAddress === address && !m.read).length;
      const user = allUsers[partner] || { walletAddress: partner, name: partner.slice(0, 8), username: partner.slice(0, 6), createdAt: 0 };
      return { user, lastMsg, unread };
    }).filter(c => c.lastMsg).sort((a, b) => b.lastMsg.createdAt - a.lastMsg.createdAt);
  }, [dms, allUsers]);

  const unreadDMCount = useCallback((address: string): number => {
    return dms.filter(m => m.toAddress === address && !m.read).length;
  }, [dms]);

  const getUserByUsername = useCallback((username: string): UserProfile | null => {
    return Object.values(allUsers).find(u => u.username === username) || null;
  }, [allUsers]);

  const getUserByAddress = useCallback((address: string): UserProfile | null => {
    return allUsers[address.toLowerCase()] || allUsers[address] || null;
  }, [allUsers]);

  const getTipsFor = useCallback((address: string): Tip[] => {
    return tips.filter(t => t.toAddress === address || t.fromAddress === address);
  }, [tips]);

  if (!ready) return null;

  return (
    <SocialContext.Provider value={{
      posts, dms, tips, allUsers,
      createPost, toggleLike, toggleRepost, deletePost,
      sendDM, markDMsRead, recordTip,
      getThread, getPostsByUser, searchPosts, searchUsers,
      getConversation, getConversationList, unreadDMCount,
      getUserByUsername, getUserByAddress, registerUser, getTipsFor,
    }}>
      {children}
    </SocialContext.Provider>
  );
}

export function useSocial() {
  const ctx = useContext(SocialContext);
  if (!ctx) throw new Error("useSocial must be used within SocialProvider");
  return ctx;
}

// Time formatter
export function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60000) return "just now";
  if (diff < 3600000) return Math.floor(diff / 60000) + "m";
  if (diff < 86400000) return Math.floor(diff / 3600000) + "h";
  if (diff < 604800000) return Math.floor(diff / 86400000) + "d";
  return new Date(ts).toLocaleDateString();
}
