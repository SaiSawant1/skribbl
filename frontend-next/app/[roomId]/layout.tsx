import { NavBar } from "@/components/nav-bar";
import type { Metadata } from "next";

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
    <div className="min-h-screen h-screen">
      <NavBar />
      {children}
    </div>
  );
}
