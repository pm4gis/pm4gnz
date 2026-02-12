import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ProjectHub",
  description: "Project management platform for waterfall and agile delivery"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-NZ">
      <body>{children}</body>
    </html>
  );
}
