import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Paikalla - Fast Attendance",
  description: "Minimal MVP web application for sports coaches and trainers to manage attendance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="h-full bg-background text-foreground flex flex-col selection:bg-secondary selection:text-foreground">
        {children}
      </body>
    </html>
  );
}
