import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "SARIF Dashboard: Visualize and Analyze Your Code's Health",
  description:
    "Dive into SARIF files with ease using our interactive dashboard. Gain actionable insights, spot vulnerabilities, and keep your code secure with advanced visualization tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
