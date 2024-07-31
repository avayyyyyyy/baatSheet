import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCcwIcon, Send } from "lucide-react";
import PdfView from "@/components/pdfView";
import { adminDB } from "@/firebaseAdmin";
import { auth } from "@clerk/nextjs/server";
import Footer from "@/components/Footer";
import ChatComp from "@/components/ChatComp";

const Page = async ({ params: { id } }: { params: { id: string } }) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found");
  }

  const docRef = await adminDB
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(id)
    .get();

  const downloadURL = await docRef.data()?.url;

  return (
    <>
      <div className="flex flex-col lg:flex-row h-[96vh] w-screen">
        {/* PDF Comp */}
        <div className="flex flex-col lg:w-1/2 mx-auto bg-background p-6">
          <div className="flex h-full mx-auto min-w-96">
            <PdfView url={downloadURL} />
          </div>
        </div>
        {/* Chat Comp */}
        <div className="flex z-30 flex-col lg:w-1/2 border-t lg:border-l-2 lg:border-t-0 border-[#fe640b] bg-background p-6">
          <ChatComp id={id} />
        </div>
      </div>
    </>
  );
};

export default Page;
