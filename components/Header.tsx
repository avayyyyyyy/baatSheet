import { SignedIn, UserButton } from "@clerk/nextjs";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { FilePlus2 } from "lucide-react";

function Header() {
  return (
    <div className="border-b flex items-center justify-between px-9 py-2">
      <div className="text-3xl px-4 py-2">
        <Link href={"/"}>
          Baat<span className="text-[#fe640b] font-bold">Sheet</span>
        </Link>
      </div>
      <div className="flex items-center gap-x-2">
        <Button asChild variant={"outline"} className="hidden md:block">
          <Link href="/dashboard/pricing">Pricing</Link>
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
