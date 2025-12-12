import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Utah Valley Tool Rental - Rent Tools Easily",
  description: "Rent high-quality tools with easy pickup via smart lock access. Power tools, lawn equipment, and more available for daily rental.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.className} antialiased bg-[var(--bg-deep)] text-white`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
