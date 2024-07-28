"use server";

import { adminDB, adminStorage } from "@/firebaseAdmin";
import { indexName } from "@/lib/Langchain";
import pineconeClient from "@/lib/pincone";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function deleteDocument(docId: string) {
  auth().protect();

  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found");
  }

  await adminDB
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(docId)
    .delete();

  await adminStorage
    .bucket(process.env.FIREBASE_STORAGE_BUCKET)
    .file(`users/${userId}/files/${docId}`)
    .delete();

  const index = pineconeClient.index(indexName);
  await index.namespace(docId).deleteAll();

  // console.log("Deleted document with id: ", docId);

  revalidatePath("/dashboard");
}
