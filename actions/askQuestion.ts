"use server";

import { Message } from "@/components/ChatComp";
import { adminDB } from "@/firebaseAdmin";
import { generateLangchainCompletion } from "@/lib/Langchain";
import { auth } from "@clerk/nextjs/server";

const FREE_LIMIT = 5;
const PRO_LIMIT = 100;

export async function askQuestion(id: string, ques: string) {
  auth().protect();
  const { userId } = await auth();

  const chatRef = adminDB
    .collection("users")
    .doc(userId!)
    .collection("files")
    .doc(id)
    .collection("chat");

  const chatSnapshot = await chatRef.get();

  const userMessages = chatSnapshot.docs.filter((e) => {
    return e.data().role === "human";
  });

  const userMessage: Message = {
    role: "human",
    message: ques,
    createdAt: new Date(),
  };

  await chatRef.add(userMessage);

  const reply = await generateLangchainCompletion(id, ques);

  const AIMessage: Message = {
    role: "bot",
    message: reply,
    createdAt: new Date(),
  };

  await chatRef.add(AIMessage);

  return { success: true, message: reply };
}
