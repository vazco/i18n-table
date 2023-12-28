import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Playground",
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
