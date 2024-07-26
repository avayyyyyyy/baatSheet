import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Uploadpdf } from "@/components/uploadpdf";
import { adminDB } from "@/firebaseAdmin";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import React from "react";
import { Document } from "react-pdf";
import byteSize from "byte-size";

const Page = async () => {
  auth().protect();

  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found");
  }

  const documentSnapshot = await adminDB
    .collection("users")
    .doc(userId)
    .collection("files")
    .get();

  return (
    <div className="w-[90%] md:w-[80%] mx-auto mt-10">
      <div className=" my-5 rounded-md shadow-lg  bg-zinc-100 p-4 border-[#fe640b]">
        <p className="text-3xl font-semibold text-[#fe640b]">My Documents...</p>
        <div className="flex flex-wrap justify-evenly md:justify-start m-auto items-center mt-5 w-full">
          <Uploadpdf />
          {documentSnapshot.docs.map((doc) => {
            const { name, downloadURL, size } = doc.data();

            return (
              <>
                <Link href={`/dashboard/files/${doc.id}`}>
                  <Card
                    className="min-w-60 max-w-sm min-h-80 mx-2 mt-4 hover:bg-zinc-200"
                    key={doc.id}
                  >
                    {/* <Image
                    src="/placeholder.svg"
                    alt="Product Image"
                    width={300}
                    height={300}
                    className="object-cover w-full rounded-t-lg aspect-square"
                  /> */}
                    <CardContent className="p-4">
                      <h3 className="text-sm font-semibold">
                        {name.slice(0, 20)}...
                      </h3>
                      <p>{byteSize(size).value} KB</p>
                    </CardContent>
                  </Card>
                </Link>
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Page;
