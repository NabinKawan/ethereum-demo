"use client";

import { ThirdwebProvider } from "thirdweb/react";
import React from "react";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: React.PropsWithChildren<{}>) {
  return (
    <ThirdwebProvider>
      {children}
      <Toaster />
    </ThirdwebProvider>
  );
}
