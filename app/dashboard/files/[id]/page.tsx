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
    // {/* Parent Div */}
    <div className="flex flex-col lg:flex-row h-[95vh] w-full">
      {/* PDF Comp */}
      <div className="flex mx-auto bg-background p-6">
        <div className="flex h-full w-fit flex-col">
          <PdfView url={downloadURL} />
        </div>
      </div>
      {/* CHAT Comp */}
      <ChatComp id={id} />
    </div>
  );
};

export default Page;
