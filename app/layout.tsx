import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://next-table-bar-do-cofre-wireframe.ffidelis.chatgpt.site",
  ),
  title: "Nuvemshop Next no Bar do Cofre | 27.08",
  description:
    "Um jantar reservado no Bar do Cofre com executivos da Nuvemshop e líderes de marcas selecionadas que faturam milhões por ano. 27 de agosto, às 19h, em São Paulo.",
  icons: {
    icon: "/favicon-next.ico",
    shortcut: "/favicon-next.ico",
  },
  openGraph: {
    title: "Nuvemshop Next no Bar do Cofre | 27.08",
    description:
      "Você acaba de receber a chave para um momento exclusivo.",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Nuvemshop Next no Bar do Cofre, em 27 de agosto",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nuvemshop Next no Bar do Cofre | 27.08",
    description:
      "Você acaba de receber a chave para um momento exclusivo.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;1,6..96,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
