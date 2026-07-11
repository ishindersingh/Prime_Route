import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PrimeRoute Logistics | Premium Moving Services",
  description: "Reliable local moving services across Toronto, Brampton, Mississauga and Etobicoke.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
