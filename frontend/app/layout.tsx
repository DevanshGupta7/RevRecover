import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RevRecover",
  description: "Recover revenue that would otherwise be lost",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
