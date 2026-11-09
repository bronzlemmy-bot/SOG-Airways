import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/public/ThemeProvider";

export const metadata: Metadata = {
  title: "SOG Airways",
  description: "Book flights and travel around the world with SOG Airways.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}