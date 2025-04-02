"use client"
import { SessionProvider } from "next-auth/react";
import "./globals.css"
import AppbarClient from "../Components/AppbarClient";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
      <SessionProvider>
      <AppbarClient/>
      {children}
      </SessionProvider>
      </body>
     
    </html>
  );
}