"use client";

import { Button } from "@/components/ui/button";
import { Uploadpdf } from "@/components/uploadpdf";
import { PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const router = useRouter();
  function handleClick() {
    //check is the user is on free tier or not, if not redirect to payment page

    router.push("/dashboard/upload");
  }

  return (
    <div className="w-[90%] md:w-[80%] mx-auto mt-10">
      <div className=" my-5 rounded-md shadow-lg  bg-[#fe640b]/10 p-4 border-[#fe640b]">
        <p className="text-3xl font-semibold text-[#fe640b]">My Documents...</p>
        <div className="flex space-x-3 mt-5">
          <Uploadpdf />
        </div>
      </div>
    </div>
  );
};

export default Page;
