import type { Metadata } from "next";
import Overlay from "@/components/overlay";
import "./globals.css";

export const metadata: Metadata = {
  title: "Abou Murder Mystery",
  description: "Murder Mystery"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>
        {children}
        <Overlay />
      </body>
    </html>
  );
}
