import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Client Portal System",
  description: "A client potal that enables users to browse for jobs and place bids",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="bg-white p-4 flex justify-between items-center">
  
      <Link href="/" className="flex items-center gap-2">
    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
      <span className="text-white font-bold text-xl">W</span>
    </div>
    <span className="text-2xl font-bold text-gray-800">WriteHub</span>
    </Link>


  <div className="flex items-center gap-4">
    <Link href="/SignUp" className="font-bold text-blue-500 hover:text-blue-600 transition">
      Sign Up
    </Link>
    <Link href="/Login" className="font-bold text-blue-500 hover:text-blue-600 transition">
      Login
    </Link>
  </div>
  </nav>
        {children}
      </body>
    </html>
  );
}
