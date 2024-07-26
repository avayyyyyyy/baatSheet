import Footer from "@/components/Footer";
import Header from "@/components/Header";
import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-between">
      <Header />
      {children}
    </div>
  );
}

export default layout;
