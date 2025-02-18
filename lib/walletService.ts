import { ethers, formatEther } from "ethers";
import { injectedProvider, Wallet, WalletId } from "thirdweb/wallets";
import { getWalletProvider } from "./utils";

export const sendTransaction = async (
  wallet: Wallet<WalletId>,
  recipientAddress: string,
  amountInEther: string
) => {
  try {
    const provider = injectedProvider(wallet.id);
    if (!provider) {
      throw new Error("Failed to get the provider for the wallet.");
    }

    const ethersProvider = new ethers.BrowserProvider(provider);
    const signer = await ethersProvider.getSigner();

    const account = wallet.getAccount();
    if (!account) {
      throw new Error("Account not found.");
    }

    const amountInWei = ethers.parseUnits(amountInEther, 18);
    const tx = await signer.sendTransaction({
      to: recipientAddress,
      value: amountInWei,
    });

    await tx.wait();

    return tx.hash;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Transaction failed: ${error.message}`);
    } else {
      throw new Error("An unknown error occurred during the transaction.");
    }
  }
};

export const fetchWalletBalance = async (
  wallet: Wallet<WalletId>,
  addr: string
): Promise<string | null> => {
  const provider = getWalletProvider(wallet);
  if (!provider) {
    console.warn("No provider available for the given wallet.");
    return null;
  }
  try {
    const balance = await provider.getBalance(addr);
    return parseFloat(formatEther(balance)).toFixed(2);
  } catch (error) {
    console.error("Failed to fetch wallet balance:", error);
    return null;
  }
};
