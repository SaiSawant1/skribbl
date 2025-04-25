import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DoodleBackground } from "@/components/dooble-background";
import { ThemeProvider } from "@/components/theme-provider";
import { UserStoreProvider } from "@/components/user-store-provider";
import { GameStoreProvider } from "@/components/game-store-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DoodleDuel",
  description: "Fun Game to play with friends",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute={"class"}
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <DoodleBackground />
          <GameStoreProvider>
            <UserStoreProvider>
              {children}
            </UserStoreProvider>
          </GameStoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
