import type { Metadata } from "next";
import "./globals.css";
import { Unbounded } from "next/font/google";
import Providers from "@/components/Providers";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SohCahToa – Payout BDC",
  description: "Foreign Exchange Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${unbounded.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
