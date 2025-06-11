import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "3D Sphere",
  description: "Created with v0",
  generator: "3D.dev",
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
