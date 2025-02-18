import { useWallet } from "@/hooks/useWallet";
import React from "react";
import { useWalletImage } from "thirdweb/react";

export default function WalletIcon() {
  const { walletId } = useWallet();
  const { data } = useWalletImage(walletId);
  return <img src={data} alt="wallet-icon" className="w-8 h-8" />;
}
