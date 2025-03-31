

import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Sidebar from "@/components/sidebar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "ChefMind",
  description: "AI-powered kitchen management system",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-screen flex flex-col lg:flex-row">
         
          
          {/* Main Content - Adaptive margin based on sidebar state */}
          <main className="flex-1 w-full lg: transition-all duration-300">
            {children}
          </main>
        </div>
      </body>
      </html>
    </ClerkProvider>
  );
}