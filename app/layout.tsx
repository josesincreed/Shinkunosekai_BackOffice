import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shinkunosekai BO",
  description: "Back office de anime para Shinkunosekai",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
