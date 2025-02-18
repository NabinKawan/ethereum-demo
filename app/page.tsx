"use client";

import TransferFundsForm from "@/components/transfer-funds-form";
import {
  TypographyH1,
  TypographyH2,
  TypographyMuted,
  TypographyP,
} from "@/components/typography";
import WalletIcon from "@/components/wallet-icon";
import { useWallet } from "@/hooks/useWallet";
import React from "react";

export default function Home() {
  const { account, isConnecting, walletName } = useWallet();
  const isConnected = Boolean(account?.address);

  const renderWalletStatus = () => {
    if (isConnecting) {
      return (
        <div className="flex flex-col rounded-md p-6 shadow-md items-center justify-center space-y-2">
          <TypographyP>Connecting, please wait....</TypographyP>
          <div className="flex items-center space-x-4">
            <WalletIcon />
            <span>{walletName}</span>
          </div>
        </div>
      );
    }

    if (isConnected) {
      return (
        <div className="text-center space-y-4">
          <TypographyH1>Welcome Back</TypographyH1>
          <TypographyMuted>
            Wallet Address:{" "}
            <span className="font-medium">{account?.address}</span>
          </TypographyMuted>
        </div>
      );
    }

    return (
      <TypographyH2 className="text-center">Connect Your Wallet</TypographyH2>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-white p-6">
      <div className="w-full max-w-lg space-y-6">
        {renderWalletStatus()}
        {account?.address && <TransferFundsForm />}
      </div>
    </div>
  );
}
