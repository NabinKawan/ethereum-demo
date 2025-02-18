"use client";

import React, { useEffect, useState } from "react";
import { WalletIcon, WalletProvider, WalletName } from "thirdweb/react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { FaWallet } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useWallet } from "@/hooks/useWallet";
import { injectedProvider } from "thirdweb/wallets";
import { fetchWalletBalance } from "@/lib/walletService";

export default function WalletConnectButton() {
  const [walletBalance, setWalletBalance] = useState<string>("");

  const {
    wallet,
    account,
    isConnecting,
    supportedWallets,
    disconnectWallet,
    connectWallet,
  } = useWallet();

  useEffect(() => {
    if (!wallet || !account) return;

    fetchWalletBalance(wallet, account.address).then((balance) => {
      setWalletBalance(balance || "0.00");
    });
  }, [wallet, account]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          disabled={isConnecting}
          className="flex items-center gap-2 px-4 py-2 text-lg"
        >
          {wallet ? (
            <>
              <WalletProvider id={wallet.id}>
                <WalletIcon className="w-6 h-6" />
              </WalletProvider>
              {walletBalance ? `${walletBalance} ETH` : "Loading..."}
            </>
          ) : (
            <>
              <FaWallet className="text-xl text-white" />
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 shadow-lg rounded-lg p-2">
        {wallet ? (
          <DropdownMenuItem
            className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100 rounded-md"
            onClick={disconnectWallet}
          >
            <FiLogOut className="text-lg text-red-600" />
            Disconnect
          </DropdownMenuItem>
        ) : (
          supportedWallets.map((walletId) => (
            <WalletProvider key={walletId} id={walletId}>
              <DropdownMenuItem
                disabled={!injectedProvider(walletId)}
                className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100 rounded-md"
                onClick={() => connectWallet(walletId)}
              >
                <WalletIcon className="w-6 h-6" />
                <WalletName />
              </DropdownMenuItem>
            </WalletProvider>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
