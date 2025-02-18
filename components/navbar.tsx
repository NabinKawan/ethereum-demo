import React from "react";
import WalletConnectButton from "./wallet-connect-button";

export default function Navbar() {
  return (
    <div className="fixed top-0 h-12 flex w-full p-2 justify-end z-10">
      <WalletConnectButton />
    </div>
  );
}
