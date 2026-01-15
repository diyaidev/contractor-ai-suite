import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Contractor AI Suite",
  description: "AI-powered tools for modern contractors",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        {/* <Sidebar /> */}
        <main style={{ padding: '2rem', minHeight: '100vh', width: '100%' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
