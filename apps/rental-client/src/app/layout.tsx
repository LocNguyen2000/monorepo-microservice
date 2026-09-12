import type { Metadata } from "next";
import "../App.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Rental Client",
  description: "Rental management client",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}