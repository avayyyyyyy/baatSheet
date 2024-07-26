"use server";

import { generateEmbeddingsInPineconeVectorDB } from "@/lib/Langchain";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function generateEmbeddings(docID: string) {
  auth().protect();

  await generateEmbeddingsInPineconeVectorDB(docID);

  revalidatePath("/dashboard");

  return { Completed: true };
}
