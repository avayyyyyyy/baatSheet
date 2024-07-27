"use client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ArrowDownNarrowWide,
  CircleCheckIcon,
  Frown,
  Loader,
  PlusCircleIcon,
  RocketIcon,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useCallback, useEffect, useRef } from "react";
import { StatusText, useUpload } from "./hooks/useUpload";
import { useRouter } from "next/navigation";
import useSubscription from "./hooks/useSubscription";

export function Uploadpdf() {
  const { progress, status, fileId, handleUpload, isUploading } = useUpload();
  const { hasActiveSubscription, isFileLimitOver, fetching } =
    useSubscription();
  const router = useRouter();

  useEffect(() => {
    if (fileId) {
      router.push(`/dashboard/files/${fileId}`);
    }
  }, [fileId, router]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        await handleUpload(file);
      }
      console.log(acceptedFiles[0]);
    },
    [handleUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      "application/pdf": [".pdf"],
    },
  });

  const stepsDoneRef = useRef(0);

  useEffect(() => {
    if (status === StatusText.UPLOADING) {
      stepsDoneRef.current = 1;
    } else if (status === StatusText.UPLOADED) {
      stepsDoneRef.current = 2;
    } else if (status === StatusText.SAVING) {
      stepsDoneRef.current = 3;
    } else if (status === StatusText.GENERATING) {
      stepsDoneRef.current = 4;
    } else if (status === StatusText.GENERATED) {
      stepsDoneRef.current = 5;
    }
  }, [status]);

  const stepsDone = stepsDoneRef.current;

  return (
    <div>
      {fetching ? (
        <Button
          disabled
          className="h-80 min-w-56 mr-3 mt-4 drop-shadow bg-[#fe640b]/10 border-2 border-[#fe640b] hover:bg-[#fe640b]/20 flex flex-col gap-y-1 text-[#fe640b]"
        >
          <div>
            <Loader className="animate-spin" />
          </div>
          <div className="text-[#fe640b]">
            Loading <br />
            Please wait for a moment.
          </div>
        </Button>
      ) : !hasActiveSubscription || isFileLimitOver ? (
        <Button
          disabled
          className="h-80 min-w-56 mr-3 mt-4 drop-shadow bg-[#fe640b]/10 border-2 border-[#fe640b] hover:bg-[#fe640b]/20 flex flex-col gap-y-1 text-[#fe640b]"
        >
          <div>
            <Frown />
          </div>
          <div className="text-[#fe640b]">
            Sorry! <br />
            You can&apos;t add more document.
          </div>
        </Button>
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="h-80 w-52 mr-3 mt-4 drop-shadow bg-[#fe640b]/10 border-2 border-[#fe640b] hover:bg-[#fe640b]/20 flex flex-col gap-y-1 text-[#fe640b]">
              <div>
                <PlusCircleIcon />
              </div>
              <div className="text-[#fe640b]">Add a new document</div>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            {isUploading || progress > 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 py-8">
                <div className="flex items-center gap-2">
                  <CircleCheckIcon
                    className={`size-12 ${
                      stepsDone >= 1 ? "text-orange-500" : "text-muted"
                    }`}
                  />
                  <CircleCheckIcon
                    className={`size-12 ${
                      stepsDone >= 2 ? "text-orange-500" : "text-muted"
                    }`}
                  />
                  <CircleCheckIcon
                    className={`size-12 ${
                      stepsDone >= 3 ? "text-orange-500" : "text-muted"
                    }`}
                  />
                  <CircleCheckIcon
                    className={`size-12 ${
                      stepsDone >= 4 ? "text-orange-500" : "text-muted"
                    }`}
                  />
                </div>
                <p className="text-lg font-medium">Deployment in Progress</p>
                <p className="text-sm text-center text-muted-foreground animate-pulse">
                  {status}
                </p>
              </div>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle>Upload PDF Files</DialogTitle>
                  <DialogDescription>
                    Drag and drop your PDF files here or click to select.
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-6 flex justify-center" {...getRootProps()}>
                  <div>
                    <div className="flex bg-[#fe640b]/10 h-48 w-full flex-col items-center justify-center rounded-md border-2 border-dashed border-[#fe640b] p-4 text-center">
                      <input {...getInputProps()} />
                      {isDragActive ? (
                        <div className="w-96 flex items-center flex-col justify-center">
                          <RocketIcon className="h-10 w-10 text-[#fe640b] animate-bounce" />
                          <p className="mt-4 text-sm font-medium text-[#fe640b]">
                            Drop the files here...
                          </p>
                          <p className="mt-2 text-xs text-[#fe640b]">
                            Excited to read your docs 😙
                          </p>
                        </div>
                      ) : (
                        <div className="w-96 flex items-center flex-col justify-center">
                          <CloudUploadIcon className="h-10 w-10 text-[#fe640b]" />
                          <p className="mt-4 text-sm font-medium text-[#fe640b]">
                            Drag and drop files or click to upload
                          </p>
                          <p className="mt-2 text-xs text-[#fe640b]">
                            Supported file types: PDF
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function CloudUploadIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M12 12v9" />
      <path d="m16 16-4-4-4 4" />
    </svg>
  );
}

function XIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
