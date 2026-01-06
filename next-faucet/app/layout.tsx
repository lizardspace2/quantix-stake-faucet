
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QuantumBanner } from "@/components/QuantumBanner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NaivecoinStake Faucet",
  description: "Claim your Dilithium coins for running a node.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-slate-950 text-slate-200 selection:bg-teal-500/30`}>
        <QuantumBanner />
        <main className="flex flex-col min-h-screen">
          {children}
        </main>
        <footer className="border-t border-slate-800/50 p-6 text-center text-slate-500 text-sm">
          <p>&copy; 2026 NaivecoinStake. Quantum Resistance Enabled.</p>
        </footer>
      </body>
    </html>
  );
}
