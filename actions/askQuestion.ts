"use server";

import { Message } from "@/components/ChatComp";
import { adminDB } from "@/firebaseAdmin";
import { generateLangchainCompletion } from "@/lib/Langchain";
import { auth } from "@clerk/nextjs/server";

const FREE_LIMIT = 2;
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

  const userRef = await adminDB.collection("users").doc(userId!).get();

  if (!userRef.data()?.hasActiveSubscription) {
    // console.log("userMessages: " + userMessages.length);

    if (userMessages.length >= FREE_LIMIT) {
      return {
        success: false,
        message: `You have reached the free limit of **2** questions. Please upgrade to **PRO** to ask more questions. 🥲`,
      };
    }
    if (userMessages.length >= PRO_LIMIT) {
      return {
        success: false,
        message:
          "You have reached the premium limit of **100** questions per documents. 🥲",
      };
    }
  }

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
