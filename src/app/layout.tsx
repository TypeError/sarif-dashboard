import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SARIF Dashboard",
  description: "A dashboard for viewing SARIF files",
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
