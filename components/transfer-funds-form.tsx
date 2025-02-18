"use client";

import {
  TypographyDestructive,
  TypographyH3,
  TypographyP,
  TypographySmall,
} from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWallet } from "@/hooks/useWallet";
import { sendTransaction } from "@/lib/walletService";
import React from "react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Link from "next/link";

export default function TransferFundsForm() {
  const [recipient, setRecipient] = React.useState<string | null>(null);
  const [amount, setAmount] = React.useState<string | null>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [transactionHash, setTransactionHash] = React.useState<string | null>(
    null
  );
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const { wallet } = useWallet();

  const handleTransferFunds = async () => {
    if (!wallet || !recipient || !amount) {
      toast.error("All fields are required.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setTransactionHash(null);

    try {
      const txHash = await sendTransaction(wallet, recipient, amount);
      setTransactionHash(txHash);
      setRecipient(null);
      setAmount(null);
      toast.success("Transaction successful.");
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Transaction failed.";
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
      setOpenDialog(true);
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow-xl space-y-6">
      <TypographyH3>Transfer Funds</TypographyH3>
      <Input
        placeholder="Enter recipient's wallet address"
        onChange={(event) => {
          setRecipient(event.target.value);
        }}
      />
      <Input
        placeholder="Enter amount"
        type="number"
        onChange={(event) => {
          setAmount(event.target.value);
        }}
      />
      <Button
        disabled={loading}
        onClick={handleTransferFunds}
        variant="outline"
        className="w-full py-3 text-white bg-blue-600 hover:bg-blue-700 border-0 rounded-md"
      >
        {loading ? "Transferring..." : "Transfer"}
      </Button>

      <Dialog open={openDialog} onOpenChange={() => setOpenDialog(!openDialog)}>
        <DialogContent>
          <DialogHeader className="flex items-center justify-between mb-2">
            {transactionHash ? (
              <DialogTitle className="text-xl font-semibold text-green-600 flex items-center">
                <FaCheckCircle className="text-green-500 text-2xl mr-2" />
                Transaction Completed Successfully
              </DialogTitle>
            ) : (
              <DialogTitle className="text-xl font-semibold text-red-600 flex items-center">
                <FaTimesCircle className="text-red-500 text-2xl mr-2" />
                Transaction Failed
              </DialogTitle>
            )}
          </DialogHeader>
          <DialogDescription className="text-lg text-gray-700 text-center">
            {transactionHash ? (
              <>
                <TypographySmall>
                  Transaction Hash:{" "}
                  <Link
                    href={`https://etherscan.io/tx/${transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {transactionHash}
                  </Link>
                </TypographySmall>
              </>
            ) : (
              <TypographyDestructive>{errorMessage}</TypographyDestructive>
            )}
          </DialogDescription>
          <DialogClose asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">Close</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
}
