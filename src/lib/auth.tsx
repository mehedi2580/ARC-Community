"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

export interface UserProfile {
  walletAddress: string;
  name: string;
  username: string;
  createdAt: number;
  avatar?: string;
  bio?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isConnecting: boolean;
  isNewUser: boolean;
  connectedAddress: string | null;
  error: string | null;
  connectWallet: () => Promise<void>;
  completeRegistration: (name: string, username: string) => void;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "arc_users";
const SESSION_KEY = "arc_session";

function getStoredUsers(): Record<string, UserProfile> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveUser(profile: UserProfile) {
  const users = getStoredUsers();
  users[profile.walletAddress.toLowerCase()] = profile;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function getUserByAddress(address: string): UserProfile | null {
  const users = getStoredUsers();
  return users[address.toLowerCase()] || null;
}

function saveSession(address: string) {
  localStorage.setItem(SESSION_KEY, address.toLowerCase());
}

function getSession(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SESSION_KEY);
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Restore session on mount
  useEffect(() => {
    setHydrated(true);
    const sessionAddress = getSession();
    if (sessionAddress) {
      const profile = getUserByAddress(sessionAddress);
      if (profile) {
        setUser(profile);
      } else {
        clearSession();
      }
    }
  }, []);

  // Listen for account changes in MetaMask
  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) return;
    const handleAccountsChanged = (...args: unknown[]) => {
      const accounts = args[0] as string[];
      if (!accounts || accounts.length === 0) {
        logout();
      }
    };
    window.ethereum.on("accountsChanged", handleAccountsChanged);
    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connectWallet = useCallback(async () => {
    setError(null);

    if (typeof window === "undefined" || !window.ethereum) {
      setError("MetaMask not detected. Please install the MetaMask extension.");
      return;
    }

    setIsConnecting(true);
    try {
      // Request accounts
      const accounts = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];

      if (!accounts || accounts.length === 0) {
        setError("No accounts found. Please unlock MetaMask.");
        setIsConnecting(false);
        return;
      }

      const address = accounts[0].toLowerCase();

      // Sign a message to verify ownership
      const message = `Welcome to ARC Community!\n\nSign this message to verify wallet ownership.\n\nWallet: ${address}\nTimestamp: ${Date.now()}`;

      try {
        await window.ethereum.request({
          method: "personal_sign",
          params: [message, address],
        });
      } catch {
        setError("Signature rejected. Please sign to verify wallet ownership.");
        setIsConnecting(false);
        return;
      }

      // Check if user already exists
      const existingUser = getUserByAddress(address);

      if (existingUser) {
        // Returning user — log in directly
        setUser(existingUser);
        saveSession(address);
        setIsNewUser(false);
      } else {
        // New user — need registration
        setConnectedAddress(address);
        setIsNewUser(true);
      }
    } catch (err: unknown) {
      const metamaskErr = err as { code?: number; message?: string };
      if (metamaskErr?.code === 4001) {
        setError("Connection rejected. Please approve the MetaMask request.");
      } else {
        setError("Failed to connect wallet. Please try again.");
      }
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const completeRegistration = useCallback(
    (name: string, username: string) => {
      if (!connectedAddress) return;

      const profile: UserProfile = {
        walletAddress: connectedAddress,
        name: name.trim(),
        username: username.trim().toLowerCase().replace(/[^a-z0-9_]/g, ""),
        createdAt: Date.now(),
      };

      saveUser(profile);
      saveSession(connectedAddress);
      setUser(profile);
      setIsNewUser(false);
      setConnectedAddress(null);
    },
    [connectedAddress]
  );

  const logout = useCallback(() => {
    setUser(null);
    setIsNewUser(false);
    setConnectedAddress(null);
    clearSession();
  }, []);

  const clearError = useCallback(() => setError(null), []);

  if (!hydrated) return null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isConnecting,
        isNewUser,
        connectedAddress,
        error,
        connectWallet,
        completeRegistration,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// Extend window for MetaMask
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
      isMetaMask?: boolean;
    };
  }
}

// Helper export for SocialProvider to sync users
export { getStoredUsers };
