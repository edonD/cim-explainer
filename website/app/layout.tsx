import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Compute-in-Memory: How AI Runs Inside Memory",
  description:
    "An interactive animated explainer of how Compute-in-Memory chips perform neural network inference using analog physics — built from a real SKY130 chip design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0f1e] text-[#e2e8f0]`}
      >
        {children}
      </body>
    </html>
  );
}
