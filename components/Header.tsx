"use client";
import { SignedIn, UserButton } from "@clerk/nextjs";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { FilePlus2, FileText, Loader } from "lucide-react";
import useSubscription from "./hooks/useSubscription";

function Header() {
  const { hasActiveSubscription, fetching } = useSubscription();

  return (
    <div className="border-b flex items-center justify-between px-9 py-2">
      <div className="md:text-3xl text-xl px-4 py-2">
        <Link href={"/"} className="flex items-center space-x-1">
          बात<span className="text-[#fe640b] font-bold">Sheet</span>
          <FileText className="h-6 w-6" />
        </Link>
      </div>
      <div className="flex items-center gap-x-2">
        <Button asChild variant={"outline"} className="md:block hidden">
          <Link href="/dashboard/pricing">
            {fetching ? (
              <>
                <Loader className="animate-spin " size={18} />
              </>
            ) : (
              <>{hasActiveSubscription ? "Pro Member 🚀" : "Buy Pro ✨"}</>
            )}
          </Link>
        </Button>
        <Button
          asChild
          variant={"outline"}
          size={"sm"}
          className="md:hidden flex"
        >
          <Link href="/dashboard/pricing">
            {fetching ? (
              <>
                <Loader className="animate-spin " size={18} />
              </>
            ) : (
              <>{hasActiveSubscription ? "Pro 🚀" : "Buy Pro ✨"}</>
            )}
          </Link>
        </Button>
        <Button asChild variant={"outline"}>
          <Link href="/dashboard">My Documents</Link>
        </Button>
        {/* <Button asChild variant={"outline"} className="border-[#fe640b]">
          <Link href="/dashboard/uploads">
            <FilePlus2 className="text-[#fe640b]" />
          </Link>
        </Button> */}
        <div className="flex">
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </div>
  );
}

export default Header;
