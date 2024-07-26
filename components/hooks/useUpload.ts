"use client";
import { generateEmbeddings } from "@/actions/generateEmbeddings";
import { db, storage } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { error } from "console";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export enum StatusText {
  UPLOADING = "Uploading file...",
  UPLOADED = "File Uploaded Successfully!",
  SAVING = "Saving your file in the DB...",
  GENERATING = "Generating AI Embedding, this will take some few seconds...",
  GENERATED = "AI Embedding Generated Successfully!",
}

export type Status = StatusText[keyof StatusText];

export function useUpload() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState(
    "These steps will take some time, Please sit back and relax!"
  );
  const [fileId, setFileId] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const handleUpload = async (file: File) => {
    // Free/PRO user can upload files

    if (!user || !file) return;

    setIsUploading(true);

    const fileIDToUpload = uuidv4();

    const storageRef = ref(storage, `users/${user.id}/files/${fileIDToUpload}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setStatus(StatusText.UPLOADING);
        setProgress(percent);
      },
      (error) => {
        console.error(error);
      },
      async () => {
        setStatus(StatusText.UPLOADED);
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setStatus(StatusText.SAVING);
        await setDoc(doc(db, "users", user.id, "files", fileIDToUpload), {
          name: file.name,
          url: downloadURL,
          size: file.size,
          type: file.type,
          ref: uploadTask.snapshot.ref.fullPath,
          createdAt: new Date(),
        });

        setStatus(StatusText.GENERATING);

        // Generate AI Embedding
        await generateEmbeddings(fileIDToUpload);

        setFileId(fileIDToUpload);
        setIsUploading(false);
        setStatus(StatusText.GENERATED);
      }
    );
  };

  return { progress, status, fileId, handleUpload, isUploading };
}
