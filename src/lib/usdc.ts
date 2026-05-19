"use client";

import { useCallback, useState } from "react";

// USDC contract on Base mainnet
const USDC_CONTRACT = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const USDC_DECIMALS = 6;

// ERC-20 transfer function selector: transfer(address,uint256)
const TRANSFER_SELECTOR = "0xa9059cbb";

function encodeTransfer(to: string, amount: string): string {
  // amount in human-readable USDC → raw units
  const raw = BigInt(Math.round(parseFloat(amount) * 10 ** USDC_DECIMALS));
  const toHex = to.replace("0x", "").toLowerCase().padStart(64, "0");
  const amountHex = raw.toString(16).padStart(64, "0");
  return TRANSFER_SELECTOR + toHex + amountHex;
}

export interface TipResult {
  success: boolean;
  txHash?: string;
  error?: string;
}

export function useUSDCTip() {
  const [loading, setLoading] = useState(false);

  const sendTip = useCallback(async (toAddress: string, amount: string): Promise<TipResult> => {
    if (!window.ethereum) return { success: false, error: "MetaMask not found" };
    if (!amount || parseFloat(amount) <= 0) return { success: false, error: "Invalid amount" };

    setLoading(true);
    try {
      const accounts = await window.ethereum.request({ method: "eth_accounts" }) as string[];
      if (!accounts?.length) return { success: false, error: "Wallet not connected" };

      const from = accounts[0];

      // Switch to Base (chainId 8453)
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x2105" }],
        });
      } catch (switchErr: unknown) {
        const err = switchErr as { code?: number };
        // Chain not added — add Base
        if (err?.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId: "0x2105",
              chainName: "Base",
              nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
              rpcUrls: ["https://mainnet.base.org"],
              blockExplorerUrls: ["https://basescan.org"],
            }],
          });
        } else {
          throw switchErr;
        }
      }

      const data = encodeTransfer(toAddress, amount);
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [{
          from,
          to: USDC_CONTRACT,
          data,
          gas: "0x186A0", // 100000
        }],
      }) as string;

      return { success: true, txHash };
    } catch (err: unknown) {
      const e = err as { code?: number; message?: string };
      if (e?.code === 4001) return { success: false, error: "Transaction rejected" };
      return { success: false, error: e?.message || "Transaction failed" };
    } finally {
      setLoading(false);
    }
  }, []);

  return { sendTip, loading };
}
