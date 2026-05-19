export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  verified: boolean;
  bio: string;
  followers: number;
  following: number;
  posts: number;
  walletAddress: string;
  channel?: string;
}

export interface Post {
  id: string;
  user: User;
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  reposts: number;
  replies: number;
  bookmarks: number;
  liked: boolean;
  reposted: boolean;
  bookmarked: boolean;
  channel?: string;
  tags?: string[];
}

export interface Notification {
  id: string;
  type: "like" | "repost" | "follow" | "mention" | "reply" | "airdrop";
  user: User;
  content: string;
  timestamp: string;
  read: boolean;
  postPreview?: string;
}

export interface Message {
  id: string;
  user: User;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  members: number;
  posts: number;
  icon: string;
  color: string;
  trending: boolean;
  joined: boolean;
}

export interface Collectible {
  id: string;
  name: string;
  collection: string;
  image: string;
  floorPrice: string;
  owned: number;
}

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Mehedi Hasan",
    username: "mehedi7510",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mehedi",
    verified: true,
    bio: "Building the onchain future 🌐 | Web3 dev | Base enthusiast",
    followers: 2841,
    following: 412,
    posts: 847,
    walletAddress: "0x1a2b...3c4d",
    channel: "farcaster",
  },
  {
    id: "2",
    name: "memeceo.eth",
    username: "memeceo",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=memeceo",
    verified: true,
    bio: "Meme lord | DeFi degen | NFA",
    followers: 18420,
    following: 891,
    posts: 3201,
    walletAddress: "0x5e6f...7g8h",
    channel: "farcaster",
  },
  {
    id: "3",
    name: "nimaleophotos.eth",
    username: "nimaleophotos",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=nimale",
    verified: true,
    bio: "Onchain photographer 📸 | Collecting moments as NFTs",
    followers: 5621,
    following: 234,
    posts: 1092,
    walletAddress: "0x9i0j...1k2l",
  },
  {
    id: "4",
    name: "basegirl.eth",
    username: "basegirl",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=basegirl",
    verified: true,
    bio: "Base maxi | USDC believer | Building on L2",
    followers: 9103,
    following: 567,
    posts: 2140,
    walletAddress: "0x3m4n...5o6p",
  },
  {
    id: "5",
    name: "0xbuilder.eth",
    username: "0xbuilder",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=builder",
    verified: false,
    bio: "Solidity dev | Open source | GM every day",
    followers: 1204,
    following: 890,
    posts: 432,
    walletAddress: "0x7q8r...9s0t",
  },
  {
    id: "6",
    name: "cryptosage.eth",
    username: "cryptosage",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sage",
    verified: true,
    bio: "Macro thinker | On-chain analyst | 10y in crypto",
    followers: 34200,
    following: 120,
    posts: 8901,
    walletAddress: "0x1u2v...3w4x",
  },
];

export const currentUser = mockUsers[0];

export const mockPosts: Post[] = [
  {
    id: "1",
    user: mockUsers[1],
    content:
      "2024 was a peak year for Farcaster and airdrops.\n\nAnd I was so fking dumb at 19 years old. Didn't book profits, didn't withdraw any big amount from crypto to my bank, and kept buying shitty altcoins.\n\nI haven't touched zero, and I know I'll recover.",
    timestamp: "2h",
    likes: 24,
    reposts: 1,
    replies: 8,
    bookmarks: 3,
    liked: false,
    reposted: false,
    bookmarked: false,
    channel: "farcaster",
  },
  {
    id: "2",
    user: mockUsers[2],
    content: "GM GM fam! 🧡",
    timestamp: "2h",
    likes: 41,
    reposts: 5,
    replies: 12,
    bookmarks: 2,
    liked: true,
    reposted: false,
    bookmarked: false,
  },
  {
    id: "3",
    user: mockUsers[3],
    content:
      "Base just settled $10B in transactions this week alone 🔵\n\nWe're not early anymore. We're RIGHT ON TIME.\n\nThe onchain economy is here.",
    timestamp: "4h",
    likes: 892,
    reposts: 134,
    replies: 67,
    bookmarks: 201,
    liked: false,
    reposted: true,
    bookmarked: true,
    tags: ["base", "onchain", "web3"],
  },
  {
    id: "4",
    user: mockUsers[5],
    content:
      "Thread: Why I think we're entering the longest bull market in crypto history 🧵\n\n1/ The regulatory clarity is finally here. Congress passed the first major crypto bill. This removes the single biggest institutional blocker.",
    timestamp: "6h",
    likes: 2341,
    reposts: 891,
    replies: 234,
    bookmarks: 1204,
    liked: true,
    reposted: false,
    bookmarked: false,
    tags: ["analysis", "macro"],
  },
  {
    id: "5",
    user: mockUsers[4],
    content:
      "Just deployed my first smart contract on Base mainnet. Fees: $0.0003. Time: 0.8 seconds.\n\nThis is why we build on L2s. Never going back to mainnet for user-facing apps.",
    timestamp: "8h",
    likes: 187,
    reposts: 43,
    replies: 29,
    bookmarks: 88,
    liked: false,
    reposted: false,
    bookmarked: false,
    tags: ["base", "dev", "solidity"],
  },
  {
    id: "6",
    user: mockUsers[3],
    content:
      "The USDC 4.1% APY on Base App is genuinely the most underrated thing in crypto right now.\n\nYour stablecoins sitting in a CEX earning 0% while you could be onchain earning passively. Wake up.",
    timestamp: "10h",
    likes: 654,
    reposts: 112,
    replies: 88,
    bookmarks: 320,
    liked: false,
    reposted: false,
    bookmarked: false,
  },
];

export const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "like",
    user: mockUsers[3],
    content: "liked your post",
    timestamp: "2m",
    read: false,
    postPreview: "Building the onchain future requires...",
  },
  {
    id: "2",
    type: "follow",
    user: mockUsers[5],
    content: "started following you",
    timestamp: "15m",
    read: false,
  },
  {
    id: "3",
    type: "repost",
    user: mockUsers[1],
    content: "reposted your cast",
    timestamp: "1h",
    read: false,
    postPreview: "Base just settled $10B in transactions...",
  },
  {
    id: "4",
    type: "airdrop",
    user: mockUsers[0],
    content: "You received an airdrop! 🎉 +250 ARC tokens",
    timestamp: "3h",
    read: true,
  },
  {
    id: "5",
    type: "mention",
    user: mockUsers[4],
    content: "mentioned you in a post",
    timestamp: "5h",
    read: true,
    postPreview: "@mehedi7510 check this out...",
  },
  {
    id: "6",
    type: "reply",
    user: mockUsers[2],
    content: "replied to your post",
    timestamp: "8h",
    read: true,
    postPreview: "GM GM fam! 🧡",
  },
  {
    id: "7",
    type: "like",
    user: mockUsers[5],
    content: "liked your post",
    timestamp: "12h",
    read: true,
    postPreview: "Just deployed my first...",
  },
];

export const mockMessages: Message[] = [
  {
    id: "1",
    user: mockUsers[3],
    lastMessage: "gm! did you see the new Base update?",
    timestamp: "2m",
    unread: 3,
    online: true,
  },
  {
    id: "2",
    user: mockUsers[5],
    lastMessage: "The thread you wrote was 🔥",
    timestamp: "1h",
    unread: 0,
    online: true,
  },
  {
    id: "3",
    user: mockUsers[1],
    lastMessage: "lfg! when moon ser 🚀",
    timestamp: "3h",
    unread: 1,
    online: false,
  },
  {
    id: "4",
    user: mockUsers[2],
    lastMessage: "thanks for the follow back!",
    timestamp: "1d",
    unread: 0,
    online: false,
  },
  {
    id: "5",
    user: mockUsers[4],
    lastMessage: "can you review my contract?",
    timestamp: "2d",
    unread: 0,
    online: false,
  },
];

export const mockChannels: Channel[] = [
  {
    id: "1",
    name: "farcaster",
    description: "The decentralized social protocol",
    members: 284021,
    posts: 1203441,
    icon: "📡",
    color: "#8a63d2",
    trending: true,
    joined: true,
  },
  {
    id: "2",
    name: "base",
    description: "Coinbase L2 — fast, cheap, onchain",
    members: 198432,
    posts: 891203,
    icon: "🔵",
    color: "#0052ff",
    trending: true,
    joined: true,
  },
  {
    id: "3",
    name: "defi",
    description: "Decentralized finance protocols & strategies",
    members: 312841,
    posts: 2341092,
    icon: "💰",
    color: "#00c896",
    trending: true,
    joined: false,
  },
  {
    id: "4",
    name: "nfts",
    description: "Digital collectibles, art, and culture",
    members: 421093,
    posts: 3401220,
    icon: "🖼",
    color: "#ff6b6b",
    trending: false,
    joined: false,
  },
  {
    id: "5",
    name: "dev",
    description: "Smart contracts, Solidity, and web3 dev",
    members: 89432,
    posts: 412093,
    icon: "⚡",
    color: "#ffd166",
    trending: true,
    joined: true,
  },
  {
    id: "6",
    name: "memes",
    description: "The culture layer of crypto",
    members: 891203,
    posts: 9832041,
    icon: "🐸",
    color: "#7bed9f",
    trending: false,
    joined: false,
  },
  {
    id: "7",
    name: "macro",
    description: "Big picture crypto & market analysis",
    members: 143021,
    posts: 891204,
    icon: "📊",
    color: "#a29bfe",
    trending: false,
    joined: false,
  },
  {
    id: "8",
    name: "gaming",
    description: "Onchain games and GameFi",
    members: 67890,
    posts: 234012,
    icon: "🎮",
    color: "#fd79a8",
    trending: true,
    joined: false,
  },
];

export const mockCollectibles: Collectible[] = [
  {
    id: "1",
    name: "ARC Genesis #001",
    collection: "ARC Genesis",
    image: "https://picsum.photos/seed/nft1/400/400",
    floorPrice: "0.5 ETH",
    owned: 1,
  },
  {
    id: "2",
    name: "Base Punk #2841",
    collection: "Base Punks",
    image: "https://picsum.photos/seed/nft2/400/400",
    floorPrice: "0.12 ETH",
    owned: 1,
  },
  {
    id: "3",
    name: "Onchain Summer #77",
    collection: "Onchain Summer",
    image: "https://picsum.photos/seed/nft3/400/400",
    floorPrice: "0.08 ETH",
    owned: 2,
  },
  {
    id: "4",
    name: "Farcaster Frame #412",
    collection: "FC Frames",
    image: "https://picsum.photos/seed/nft4/400/400",
    floorPrice: "0.03 ETH",
    owned: 1,
  },
];

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}
