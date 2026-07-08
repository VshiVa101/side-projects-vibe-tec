import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PIP-FOLIO",
  description: "Portfolio inspired by Pip-Boy aesthetics."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
