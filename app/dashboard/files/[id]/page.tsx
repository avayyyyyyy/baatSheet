import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCcwIcon, Send } from "lucide-react";
import PdfView from "@/components/pdfView";
import { adminDB } from "@/firebaseAdmin";
import { auth } from "@clerk/nextjs/server";

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
    <div className="flex flex-col md:flex-row h-[99vh] w-full">
      {/* PDF Comp */}
      <div className="flex mx-auto bg-background p-6">
        <div className="flex h-full w-full flex-col">
          <PdfView url={downloadURL} />
        </div>
      </div>
      {/* CHAT Comp */}
      <div className="flex flex-col md:border-l-2 border-t lg:border-l-2 lg:border-t-0 border-[#fe640b] bg-background p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Chat</h2>
          <Button variant="outline" size="icon">
            <div className="h-5 w-5">❤️</div>
            <span className="sr-only">Like</span>
          </Button>
        </div>
        <div className="flex-1 overflow-auto">
          <div className="grid gap-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-8 w-8 shrink-0 rounded-full">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>BS</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="font-medium">BaatSheet</div>
                <div className="rounded-lg bg-muted p-3 text-sm">
                  Hey, have you reviewed the PDF I sent earlier?
                </div>
              </div>
            </div>
            <div className="flex items-start gap-4 justify-end">
              <div className="grid gap-1">
                <div className="font-medium text-right">You</div>
                <div className="rounded-lg bg-primary p-3 text-sm text-primary-foreground">
                  Yes, I&apos;ve reviewed it. Looks good to me. Ill send you my
                  feedback shortly.
                </div>
              </div>
              <Avatar className="h-8 w-8 shrink-0 rounded-full">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>Y</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex items-start gap-4">
              <Avatar className="h-8 w-8 shrink-0 rounded-full">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>BS</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="font-medium">BaatSheet</div>
                <div className="rounded-lg bg-muted p-3 text-sm">
                  Great, thanks! Let me know if you have any other questions.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <Textarea
            placeholder="Type your message..."
            className="flex-1 rounded-lg border px-4 py-2 text-sm"
          />
          <Button>
            <div className="h-5 w-5">
              <Send />
            </div>
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
