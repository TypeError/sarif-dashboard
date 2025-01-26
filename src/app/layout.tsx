import type { Metadata } from "next";
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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
