import { useEffect } from "react";
import {
  useConnect,
  useActiveWallet,
  useActiveAccount,
  useWalletInfo,
} from "thirdweb/react";
import { toast } from "react-hot-toast";
import { createWallet, WalletId } from "thirdweb/wallets";
import { createThirdwebClient } from "thirdweb";
import { atom, useAtom } from "jotai";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID as string,
});

const WALLETS: WalletId[] = [
  "io.metamask",
  "com.coinbase.wallet",
  "com.brave.wallet",
];
const LOCAL_WALLET_KEY = "walletId";

interface WalletState {
  isConnecting: boolean;
  walletId?: WalletId;
}
const walletStateAtom = atom<WalletState>({ isConnecting: false });

export const useWallet = () => {
  const [walletState, setWalletState] = useAtom(walletStateAtom);
  const wallet = useActiveWallet();
  const activeAccount = useActiveAccount();

  const { connect } = useConnect();
  const { data } = useWalletInfo(walletState.walletId);

  const connectWallet = async (walletId: WalletId) => {
    connect(async () => {
      setWalletState({ isConnecting: true, walletId });
      const walletInstance = createWallet(walletId);

      try {
        await walletInstance.connect({ client });
        localStorage.setItem(LOCAL_WALLET_KEY, walletId);
        return walletInstance;
      } catch (error: any) {
        toast.error("Failed to connect wallet. Please try again.");
        throw error;
      } finally {
        setWalletState((prev) => ({ ...prev, isConnecting: false }));
      }
    });
  };

  const disconnectWallet = async () => {
    try {
      await wallet?.disconnect();
      localStorage.removeItem(LOCAL_WALLET_KEY);
      toast.success("Wallet disconnected.");
    } catch (error) {
      console.error("Disconnection error:", error);
    }
  };

  // Auto-connect wallet, if already connected
  useEffect(() => {
    if (wallet) return;

    const walletId = localStorage.getItem(LOCAL_WALLET_KEY) as WalletId;
    if (walletId) {
      connectWallet(walletId);
    }
  }, []);

  return {
    wallet,
    isConnecting: walletState.isConnecting,
    walletId: walletState.walletId,
    walletName: data?.name,
    supportedWallets: WALLETS,
    account: activeAccount,
    connectWallet,
    disconnectWallet,
  };
};
