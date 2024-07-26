"use client";
import React from "react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { Document, Page, pdfjs } from "react-pdf";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  RotateCw,
  ZoomInIcon,
  ZoomOutIcon,
  LoaderIcon,
  RefreshCcwIcon,
} from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PdfView = ({ url }: { url: string }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [file, setFile] = useState<Blob>();
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const fileRes = await response.blob();
        setFile(fileRes);
        console.log(fileRes);
      } catch (error) {
        console.error("Failed to fetch the PDF file:", error);
      }
    };
    fetchFile();
  }, [url]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  console.log("numPages: ", numPages);
  console.log("pageNumber: ", pageNumber);

  return (
    <div className="h-full w-full">
      {!file ? (
        <div className="flex w-full flex-col h-full justify-center items-center">
          <LoaderIcon className="animate-spin h-20 w-20 text-[#fe640b]" />
          <p className="animate-pulse mt-2">Loading your PDF...</p>
        </div>
      ) : (
        <div className="flex w-[90vw] md:w-[50vw] h-full mx-auto overflow-hidden flex-col">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="md:text-2xl text-xl font-semibold">
              Chat with your PDF your Way...
            </h2>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  if (pageNumber <= 1) {
                    setPageNumber(1);
                  } else {
                    setPageNumber(pageNumber - 1);
                  }
                }}
                variant="outline"
                size="icon"
              >
                <div className="h-5 w-5">-</div>
                <span className="sr-only">Next Page</span>
              </Button>
              <Button
                onClick={() => {
                  if (pageNumber >= (numPages ?? 0)) {
                    setPageNumber(numPages);
                  } else {
                    setPageNumber(pageNumber + 1);
                  }
                }}
                variant="outline"
                size="icon"
              >
                <div className="h-5 w-5">+</div>
                <span className="sr-only">Next Page</span>
              </Button>
              <Button
                onClick={() => {
                  setRotation((rotation + 90) % 360);
                }}
                variant="outline"
                size="icon"
              >
                <div className="h-5 w-5">
                  <RefreshCcwIcon size={16} className="m-auto" />
                </div>
                <span className="sr-only">Refresh</span>
              </Button>
            </div>
          </div>
          <div className="flex-1 rounded-lg p-2 border">
            <div className="mx-auto border-2 overflow-scroll">
              <Document
                file={file}
                loading={null}
                rotate={rotation}
                className={"m-4 w-full"}
                onLoadSuccess={onDocumentLoadSuccess}
              >
                <Page pageNumber={pageNumber} scale={scale} />
              </Document>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfView;
