import { clsx, type ClassValue } from "clsx";
import { ethers } from "ethers";
import { twMerge } from "tailwind-merge";
import { injectedProvider, Wallet, WalletId } from "thirdweb/wallets";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getWalletProvider(wallet: Wallet<WalletId>) {
  const providerInstance = injectedProvider(wallet.id);
  return providerInstance ? new ethers.BrowserProvider(providerInstance) : null;
}
