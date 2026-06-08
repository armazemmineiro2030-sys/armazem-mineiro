import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Armazém Mineiro — Produtos Artesanais de Minas",
  description:
    "Produtos artesanais mineiros: queijos, doces, temperos, bebidas e muito mais. Faça seu pedido online!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} font-sans min-h-screen`}>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#3a1b0d",
              color: "#fdf8f0",
              borderRadius: "12px",
              padding: "12px 20px",
            },
          }}
        />
      </body>
    </html>
  );
}
