"use client";
import { Avatar } from "@radix-ui/react-avatar";
import React, { startTransition, useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { collection, orderBy, query } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { useUser } from "@clerk/nextjs";
import { db } from "@/firebase";
import { Button } from "./ui/button";
import { AvatarFallback, AvatarImage } from "./ui/avatar";
import { LoaderIcon, Send } from "lucide-react";
import Footer from "./Footer";
import { askQuestion } from "@/actions/askQuestion";
import "../app/globals.css";

export type Message = {
  role: "human" | "bot" | "placeholder";
  message: string;
  createdAt: Date;
};

const ChatComp = ({ id }: { id: string }) => {
  const { user } = useUser();

  // Ref for the chat container
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      message: "Hey, how can I help you?",
      createdAt: new Date(),
    },
  ]);
  const [message, setMessage] = useState<string>("");
  const [isPending, setIsPending] = useState<boolean>(false);

  const [snapshot, loading, error] = useCollection(
    user &&
      query(
        collection(db, "users", user?.id, "files", id, "chat"),
        orderBy("createdAt")
      )
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inp = message;

    setMessage("");

    setMessages((prev) => [
      ...prev,
      { role: "human", message: inp, createdAt: new Date() },
      { role: "bot", message: "Thinking...", createdAt: new Date() },
    ]);

    startTransition(async () => {
      const { success, message } = await askQuestion(id, inp);
      if (!success) {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            message:
              "Sorry, I couldn't understand that. Can you please rephrase?",
            createdAt: new Date(),
          },
        ]);
      }

      setMessages((prev) =>
        prev.slice(0, prev.length - 1).concat([
          {
            role: "bot",
            message,
            createdAt: new Date(),
          },
        ])
      );
    });

    console.log("Submitted", message);
  };

  useEffect(() => {
    if (!snapshot) return;

    const lastMessage = messages[messages.length - 1];

    if (lastMessage?.role === "bot" || lastMessage.message === "Thinking...") {
      return;
    }

    const newMessages = snapshot.docs.map((doc) => {
      const { role, message, createdAt } = doc.data();

      return {
        id: doc.id,
        role,
        message,
        createdAt: createdAt.toDate(),
      };
    });

    setMessages(newMessages);

    console.log("Updated snapshot list: ", snapshot.docs);
  }, [snapshot]);

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const RenderMessage = (msg: Message, index: number) => {
    const isHuman = msg.role === "human";
    const user = useUser();

    return (
      <div
        key={index}
        className={`flex items-start gap-4 ${isHuman ? "justify-end" : ""}`}
      >
        {!isHuman && (
          <Avatar className="h-8 w-8 shrink-0 rounded-full">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>BS</AvatarFallback>
          </Avatar>
        )}
        <div className={`grid gap-1 ${isHuman ? "text-right" : ""}`}>
          <div className="font-medium">
            {isHuman ? user.user?.firstName : "BaatSheet"}
          </div>
          <div
            className={`rounded-lg p-3 text-sm ${
              isHuman ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
          >
            {msg.message}
          </div>
        </div>
        {isHuman && (
          <Avatar className="h-8 w-8 shrink-0 rounded-full">
            <AvatarImage className="rounded-full" src={user.user?.imageUrl} />
            <AvatarFallback>
              {user.user?.firstName?.[0] || "Y"}
              {user.user?.lastName?.[0] || "O"}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col md:border-l-2 h-full md:w-[40%] border-t lg:border-l-2 lg:border-t-0 border-[#fe640b] bg-background p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Chat</h2>
        <Button variant="outline" size="icon">
          <div className="h-5 w-5">❤️</div>
          <span className="sr-only">Like</span>
        </Button>
      </div>
      <div className="flex-1 overflow-auto" ref={chatContainerRef}>
        <div className="grid gap-4">
          {messages.map((msg, index) => RenderMessage(msg, index))}
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mt-4 flex items-center gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask your question..."
            className="flex-1 rounded-lg border px-4 py-2 text-sm"
          />
          <Button
            disabled={
              !message ||
              isPending ||
              messages[messages.length - 1].message === "Thinking..."
            }
            type="submit"
          >
            <div className="h-5 w-5">
              {isPending ? (
                <LoaderIcon className="animate-spin h-5 w-5" />
              ) : (
                <Send />
              )}
            </div>
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </form>
      <div className="bg-white rounded-md p-5 mt-2 border-t w-full shadow-2xl text-sm">
        <Footer />
      </div>
    </div>
  );
};

export default ChatComp;