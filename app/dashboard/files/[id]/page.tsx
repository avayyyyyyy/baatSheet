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
      <div className="flex flex-col lg:flex-row w-screen">
        {/* PDF Comp */}
        <div className="flex flex-col lg:w-1/2 mx-auto bg-background p-6">
          <div className="flex h-fit m-auto min-w-96">
            <PdfView url={downloadURL} />
          </div>
        </div>
        {/* Chat Comp */}
        <div className="flex z-30 flex-col lg:w-1/2 border-t h-full lg:border-l-2 lg:border-t-0 border-[#fe640b] bg-background p-6">
          <ChatComp id={id} />
        </div>
      </div>
      <div className="bg-white rounded-md p-5 border-t w-full shadow-2xl text-sm">
        <Footer />
      </div>
    </>
  );
};

export default Page;
