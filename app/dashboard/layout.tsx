import Footer from "@/components/Footer";
import Header from "@/components/Header";
import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-between">
      <Header />
      {children}
      {/* <div className="bg-white rounded-md p-5 border-t w-full shadow-2xl text-sm">
        <Footer />
      </div> */}
    </div>
  );
}

export default layout;
