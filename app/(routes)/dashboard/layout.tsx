import React from "react";
import AppHeader from "./_components/AppHeader";

function DashBoardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <AppHeader />
      {children}
    </div>
  );
}

export default DashBoardLayout;
