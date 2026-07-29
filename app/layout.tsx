import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nuvemshop Next no Bar do Cofre",
  description:
    "Uma conversa reservada entre líderes de e-commerce no Bar do Cofre.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
