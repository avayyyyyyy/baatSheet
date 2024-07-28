import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Uploadpdf } from "@/components/uploadpdf";
import { adminDB } from "@/firebaseAdmin";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import byteSize from "byte-size";
import Notification from "@/components/Notification";
import { Eye } from "lucide-react";
import DeleteButton from "@/components/DeleteButton";

type SearchParams = {
  upgrade: string | null;
};

const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
  auth().protect();

  const upgrade = searchParams.upgrade;

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
      <div className="my-5 rounded-md shadow-lg bg-zinc-100 p-4 border-[#fe640b]">
        <p className="text-3xl font-semibold text-[#fe640b]">My Documents...</p>
        <div className="flex flex-wrap justify-evenly md:justify-start m-auto items-center mt-5 w-full">
          <Uploadpdf />
          {documentSnapshot.docs.map((doc) => {
            const { name, size, url } = doc.data();

            return (
              <Card
                key={doc.id}
                className="min-w-64 max-w-sm min-h-80 mx-2 mt-4 transition-transform transform hover:scale-105 hover:bg-zinc-200"
              >
                <CardContent className="p-4">
                  <div>
                    <Link href={`/dashboard/files/${doc.id}`} passHref>
                      <div className="p-2 rounded-md border border-orange-500 transition-colors hover:bg-orange-200">
                        <h3 className="text-sm font-semibold bg-orange-100 p-2 rounded-md border border-orange-500 transition-colors hover:bg-orange-300">
                          {name.slice(0, 20)}...
                        </h3>
                        <p className="bg-orange-100 p-1 mt-2 rounded-md border border-orange-500 transition-colors hover:bg-orange-300">
                          {byteSize(size).value} KB
                        </p>
                      </div>
                    </Link>
                    <div className="flex gap-2 items-center mt-4">
                      <Button asChild variant={"default"} size={"icon"}>
                        <Link
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="z-20"
                        >
                          <Eye size={18} />
                        </Link>
                      </Button>
                      <DeleteButton docId={doc.id} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      <Notification upgrade={upgrade} />
    </div>
  );
};

export default Page;
