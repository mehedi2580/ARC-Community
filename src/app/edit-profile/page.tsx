"use client";

import { useState, useRef, useCallback } from "react";
import { ArrowLeft, Camera, Check, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useSocial } from "@/lib/social";
import { useRouter } from "next/navigation";
import clsx from "clsx";

const AVATAR_GRADIENTS = [
  "from-purple-500 to-cyan-400",
  "from-pink-500 to-orange-400",
  "from-green-400 to-blue-500",
  "from-yellow-400 to-red-500",
  "from-indigo-500 to-purple-500",
  "from-teal-400 to-green-500",
  "from-rose-400 to-pink-600",
  "from-blue-400 to-indigo-600",
];

const COVER_GRADIENTS = [
  "from-accent/40 via-surface3 to-cyan/20",
  "from-purple-900/60 via-surface3 to-pink-900/40",
  "from-blue-900/60 via-surface3 to-teal-900/40",
  "from-orange-900/50 via-surface3 to-red-900/40",
  "from-green-900/50 via-surface3 to-teal-900/40",
  "from-yellow-900/40 via-surface3 to-orange-900/40",
];

export default function EditProfilePage() {
  const { user } = useAuth();
  const { updateUser } = useSocial();
  const router = useRouter();

  const [name, setName] = useState(user?.name || "");
  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatarGradient, setAvatarGradient] = useState(
    (user as { avatarGradient?: string })?.avatarGradient || AVATAR_GRADIENTS[0]
  );
  const [coverGradient, setCoverGradient] = useState(
    (user as { coverGradient?: string })?.coverGradient || COVER_GRADIENTS[0]
  );
  const [avatarEmoji, setAvatarEmoji] = useState(
    (user as { avatarEmoji?: string })?.avatarEmoji || ""
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const validateUsername = (u: string) => {
    if (u.length < 3) return "At least 3 characters";
    if (u.length > 20) return "Max 20 characters";
    if (!/^[a-z0-9_]+$/.test(u)) return "Lowercase letters, numbers, underscores only";
    return "";
  };

  const validateName = (n: string) => {
    if (n.trim().length < 2) return "At least 2 characters";
    if (n.trim().length > 40) return "Max 40 characters";
    return "";
  };

  const nameError = name ? validateName(name) : "";
  const usernameError = username ? validateUsername(username) : "";
  const canSave = !nameError && !usernameError && name.trim() && username.trim();

  const handleSave = async () => {
    if (!canSave || !user) return;
    const ne = validateName(name);
    const ue = validateUsername(username);
    if (ne || ue) { setError(ne || ue); return; }

    setSaving(true);
    await new Promise(r => setTimeout(r, 600));

    const updated = {
      ...user,
      name: name.trim(),
      username: username.trim().toLowerCase(),
      bio: bio.trim(),
      avatarGradient,
      coverGradient,
      avatarEmoji,
    };

    updateUser(updated);
    // Also update auth session user in localStorage
    const usersRaw = localStorage.getItem("arc_users");
    if (usersRaw) {
      const users = JSON.parse(usersRaw);
      users[user.walletAddress.toLowerCase()] = updated;
      localStorage.setItem("arc_users", JSON.stringify(users));
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => {
      router.push("/profile/" + username.trim().toLowerCase());
    }, 800);
  };

  const emojiOptions = ["", "🦊", "🐉", "🦁", "🐺", "🦅", "🐬", "🦋", "⚡", "🔥", "🌙", "💎", "🚀"];

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto lg:max-w-xl">
      {/* Header */}
      <div className="sticky top-0 z-30 glass border-b border-white/[0.07] px-4 py-3 flex items-center justify-between">
        <button onClick={() => router.back()} className="p-1.5 rounded-lg text-muted hover:text-text-primary hover:bg-surface2 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <span className="font-extrabold">Edit Profile</span>
        <button
          onClick={handleSave}
          disabled={!canSave || saving || saved}
          className={clsx(
            "flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold transition-all",
            saved ? "bg-green-500 text-white" :
            canSave ? "bg-accent hover:bg-accent-light text-white" :
            "bg-surface2 text-muted cursor-not-allowed"
          )}
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> :
           saved ? <><Check size={14} /> Saved!</> : "Save"}
        </button>
      </div>

      {/* Cover preview */}
      <div className={clsx("h-28 lg:h-36 bg-gradient-to-br relative overflow-hidden", coverGradient)}>
        <div className="absolute inset-0 grid-overlay opacity-20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white/30 text-xs font-bold uppercase tracking-widest">Cover Photo</span>
        </div>
      </div>

      {/* Avatar preview — fixed overlap */}
      <div className="px-4 pb-4 relative">
        <div className="flex items-end justify-between mb-4" style={{ marginTop: "-32px" }}>
          <div className="relative">
            <div className={clsx(
              "w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br border-4 border-bg flex items-center justify-center text-white font-extrabold text-2xl shadow-lg",
              avatarGradient
            )}>
              {avatarEmoji || (user.name[0] || "?").toUpperCase()}
            </div>
          </div>
        </div>

        {/* Cover gradient picker */}
        <div className="mb-5">
          <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-2">Cover Photo</label>
          <div className="grid grid-cols-6 gap-2">
            {COVER_GRADIENTS.map(g => (
              <button key={g} onClick={() => setCoverGradient(g)}
                className={clsx("h-10 rounded-lg bg-gradient-to-br border-2 transition-all", g,
                  coverGradient === g ? "border-accent scale-105" : "border-transparent hover:border-white/20")}>
              </button>
            ))}
          </div>
        </div>

        {/* Avatar gradient picker */}
        <div className="mb-5">
          <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-2">Avatar Color</label>
          <div className="grid grid-cols-8 gap-2">
            {AVATAR_GRADIENTS.map(g => (
              <button key={g} onClick={() => setAvatarGradient(g)}
                className={clsx("w-9 h-9 rounded-full bg-gradient-to-br border-2 transition-all", g,
                  avatarGradient === g ? "border-accent scale-110" : "border-transparent hover:border-white/20")}>
              </button>
            ))}
          </div>
        </div>

        {/* Avatar emoji picker */}
        <div className="mb-6">
          <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-2">Avatar Icon</label>
          <div className="flex flex-wrap gap-2">
            {emojiOptions.map(e => (
              <button key={e || "letter"} onClick={() => setAvatarEmoji(e)}
                className={clsx(
                  "w-9 h-9 rounded-xl flex items-center justify-center text-lg border-2 transition-all",
                  avatarEmoji === e ? "border-accent bg-accent/10" : "border-white/[0.07] bg-surface2 hover:border-white/20"
                )}>
                {e || <span className="text-sm font-bold text-muted">{(user.name[0] || "A").toUpperCase()}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Form fields */}
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1.5">Display Name</label>
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="Your name"
              className={clsx(
                "w-full bg-surface2 border rounded-xl px-4 py-3 text-sm text-text-primary placeholder-muted focus:outline-none transition-all",
                nameError ? "border-red-500/40" : name && !nameError ? "border-green-500/40" : "border-white/[0.07] focus:border-accent/50"
              )} />
            {nameError && <p className="flex items-center gap-1 mt-1 text-xs text-red-400"><AlertCircle size={11} />{nameError}</p>}
          </div>

          {/* Username */}
          <div>
            <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1.5">Username</label>
            <div className={clsx(
              "flex items-center bg-surface2 border rounded-xl px-4 py-3 transition-all",
              usernameError ? "border-red-500/40" : username && !usernameError ? "border-green-500/40" : "border-white/[0.07] focus-within:border-accent/50"
            )}>
              <span className="text-muted text-sm mr-1">@</span>
              <input value={username}
                onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 20))}
                placeholder="username"
                className="flex-1 bg-transparent text-sm text-text-primary placeholder-muted focus:outline-none font-mono" />
            </div>
            {usernameError && <p className="flex items-center gap-1 mt-1 text-xs text-red-400"><AlertCircle size={11} />{usernameError}</p>}
          </div>

          {/* Bio */}
          <div>
            <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1.5">Bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)}
              placeholder="Tell the world who you are..."
              rows={3} maxLength={160}
              className="w-full bg-surface2 border border-white/[0.07] focus:border-accent/50 rounded-xl px-4 py-3 text-sm text-text-primary placeholder-muted resize-none focus:outline-none transition-all" />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-muted/50">Optional</span>
              <span className={clsx("text-xs font-mono", bio.length > 140 ? "text-yellow-400" : "text-muted/50")}>{bio.length}/160</span>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
              <AlertCircle size={14} />{error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
