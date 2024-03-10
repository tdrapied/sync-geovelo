import React from "react";
import Navbar from "@/components/navbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-full flex flex-col">
      <Navbar />
      {children}
    </div>
  );
}
