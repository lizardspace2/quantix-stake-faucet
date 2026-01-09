
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QuantumBanner } from "@/components/QuantumBanner";
import { Logo } from "@/components/Logo";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QUANTIX Faucet",
  description: "Claim your QUANTIX coins for running a node.",
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
        <footer className="border-t border-slate-800/50 p-8 text-center text-slate-500 text-sm">
          <div className="flex flex-col items-center gap-4">
            <Logo className="opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300" iconClassName="h-8 w-8" showText={true} />
            <p>&copy; 2026 QUANTIX. Quantum Resistance Enabled.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
