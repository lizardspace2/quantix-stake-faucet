
import type { Metadata } from "next";
import "./globals.css";
import { QuantumBanner } from "@/components/QuantumBanner";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = {
  title: "QUANTIX Faucet | Claim Quantum-Resistant Node Rewards",
  description: "Secure your portal to the future. Claim your QUANTIX (QTX) node rewards on our quantum-resistant Layer 1 infrastructure powered by Crystals-Dilithium cryptography.",
  keywords: ["Quantix", "QTX", "Faucet", "Crypto Faucet", "Quantum Resistant", "Crystals-Dilithium", "Post-Quantum Cryptography", "Layer 1", "Blockchain", "Node Rewards"],
  authors: [{ name: "QUANTIX FOUNDATION" }],
  openGraph: {
    title: "QUANTIX Faucet | Quantum-Resistant Node Rewards",
    description: "Claim your QUANTIX (QTX) coins on our hyper-secure post-quantum blockchain infrastructure.",
    url: "https://faucet.quantumresistantcoin.com",
    siteName: "QUANTIX Faucet",
    images: [
      {
        url: "https://quantumresistantcoin.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "QUANTIX Faucet - Quantum Resistant Blockchain",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QUANTIX Faucet | Quantum-Resistant Node Rewards",
    description: "Claim QTX coins on the world's first post-quantum secure Layer 1.",
    images: ["https://quantumresistantcoin.com/twitter-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://faucet.quantumresistantcoin.com",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "QUANTIX Faucet",
  "url": "https://faucet.quantumresistantcoin.com",
  "description": "Claim your QUANTIX (QTX) node rewards on our quantum-resistant Layer 1 infrastructure.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://faucet.quantumresistantcoin.com/?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-slate-950 text-slate-100 selection:bg-teal-500/30 overflow-x-hidden antialiased" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Quantum Background */}
        <div className="quantum-bg">
          <div className="quantum-mesh-node top-[-10%] left-[-10%] bg-teal-500/10" />
          <div className="quantum-mesh-node bottom-[-10%] right-[-10%] bg-purple-500/10 [animation-delay:-5s]" />
          <div className="quantum-mesh-node top-[20%] right-[10%] bg-blue-500/5 [animation-delay:-10s]" />

          {/* Subtle Grid Overlay */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150 brightness-100 mix-blend-overlay pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>

        <nav className="relative z-50 border-b border-white/5 bg-slate-950/10 backdrop-blur-md px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <a href="/" className="hover:opacity-80 transition-opacity">
              <Logo showText={true} iconClassName="h-8 w-8" />
            </a>
            <div className="flex items-center gap-4 md:gap-6">
              <a
                href="https://quantumresistantcoin.com"
                className="hidden md:block text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-[0.2em]"
              >
                Website
              </a>
              <a
                href="https://quantumresistantcoin.com#roadmap"
                className="hidden md:block text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-[0.2em]"
              >
                Roadmap
              </a>
              <div className="hidden md:block h-4 w-[1px] bg-white/10" />
              <a
                href="https://quantumresistantcoin.com"
                className="group px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-slate-800/50 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-teal-500/50 text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all flex items-center"
              >
                {/* Shorten text on very small screens if needed, but for now we just make button smaller */}
                <span className="hidden sm:inline flex items-center gap-2">
                  <svg className="w-3 h-3 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                  Back to Main Site
                </span>
                <span className="sm:hidden flex items-center gap-2">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                  Main Site
                </span>
              </a>
            </div>
          </div>
        </nav>

        <QuantumBanner />

        <main className="flex flex-col min-h-screen relative z-10">
          {children}
        </main>

        <footer className="relative z-10 border-t border-white/5 bg-slate-950/20 backdrop-blur-md p-8 md:p-12 text-center text-slate-500 text-sm">
          <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">
            <a
              href="https://quantumresistantcoin.com"
              className="group block"
            >
              <Logo
                className="opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 transform group-hover:scale-105"
                iconClassName="h-8 w-8 md:h-10 md:w-10"
                showText={true}
              />
            </a>

            <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-[9px] md:text-[10px] font-black tracking-widest uppercase">
              <a href="https://quantumresistantcoin.com" className="hover:text-teal-400 transition-colors">Main Website</a>
              <a href="https://quantumresistantcoin.com/whitepaper" className="hover:text-teal-400 transition-colors">Whitepaper</a>
              <a href="https://github.com/quantix-project" className="hover:text-teal-400 transition-colors">Github</a>
            </div>

            <div className="space-y-2 px-6">
              <p className="font-medium text-slate-400 tracking-wide uppercase text-[9px] md:text-[10px]">&copy; 2026 QUANTIX FOUNDATION</p>
              <p className="opacity-60 text-[11px] md:text-[13px] leading-relaxed">Architecting Hyper-Secure Quantum-Resistant Infrastructure</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
