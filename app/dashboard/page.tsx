import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Uploadpdf } from "@/components/uploadpdf";
import { adminDB } from "@/firebaseAdmin";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import byteSize from "byte-size";
import Notification from "@/components/Notification";
import { Download, Eye, Trash, Trash2, Trash2Icon } from "lucide-react";
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

            console.log("doc.data(): ", doc.data());

            return (
              <Card
                className="min-w-64 max-w-sm min-h-80 mx-2 mt-4 hover:bg-zinc-200 "
                key={doc.id}
              >
                <CardContent className="p-4">
                  <div>
                    <h3 className="text-sm font-semibold">
                      {name.slice(0, 20)}...
                    </h3>
                    <p>{byteSize(size).value} KB</p>
                  </div>
                  <div className="flex gap-2 items-center mt-4">
                    <Button asChild variant={"default"} size={"icon"}>
                      <Link
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Eye size={18} />
                      </Link>
                    </Button>
                    <DeleteButton docId={doc.id} />
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
