import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import {
  ZapIcon,
  GlobeIcon,
  BrainCogIcon,
  EyeIcon,
  CloudIcon,
  SearchIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

const features = [
  {
    name: "Store your PDF Documents",
    description:
      "Keep all your important PDF files securely stored and easily accessible anytime, anywhere.",
    icon: <GlobeIcon size={18} className="text-[#fe640b]" />,
  },
  {
    name: "Blazing Fast Responses",
    description:
      "Experience lightning-fast answers to your queries, ensuring you get the information you need instantly.",
    icon: <ZapIcon size={18} className="text-[#fe640b]" />,
  },
  {
    name: "Chat Memorisation",
    description:
      "Our intelligent chatbot remembers previous interactions, providing a seamless and personalized experience.",
    icon: <BrainCogIcon size={18} className="text-[#fe640b]" />,
  },
  {
    name: "Interactive PDF Viewer",
    description:
      "Engage with your PDFs like never before using our intuitive and interactive viewer.",
    icon: <EyeIcon size={18} className="text-[#fe640b]" />,
  },
  {
    name: "Cloud Backup",
    description:
      "Rest assured knowing your documents are safely backed up on the cloud, protected from loss or damage.",
    icon: <CloudIcon size={18} className="text-[#fe640b]" />,
  },
  {
    name: "Advanced Search",
    description:
      "Quickly find specific documents or information within your PDFs using our powerful search feature.",
    icon: <SearchIcon size={18} className="text-[#fe640b]" />,
  },
];

export default function Home() {
  const { userId } = auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col items-center text-left md:text-center justify-between p-3 bg-gradient-to-r from-[#fe640b] to-[#fe640b]/20 ">
      <div className="bg-white rounded-md md:pt-28 pt-10 p-5 w-full shadow-2xl h-full text-sm">
        <div className="w-full flex items-center justify-center mb-6">
          <Link
            className="mx-auto"
            href={"https://peerlist.io/avayyyyyyy/project/sheet"}
          >
            <Image
              src={"https://peerlist.io/images/week_medal_1.svg"}
              width={100}
              height={100}
              className="w-20 h-20 md:w-32 md:h-32"
              alt="peerlist"
            />
          </Link>
        </div>
        <div className="text-[#fe640b] mb-1">
          Your Interactive Document Comparison
        </div>
        <div className="font-bold md:pt-4 pt-1 md:text-5xl lg:text-7xl shrink-0 text-transparent bg-clip-text bg-gradient-to-br from-zinc-950 to-zinc-600 my-5 text-3xl">
          बात-चीत with your PDF&apos;s <br />
          in an super interactive way <span className="text-black">🚀</span>
        </div>
        <div className="my-5 font-medium text-lg">
          Introducing{" "}
          <Link href={"/"} className="text-[#fe640b] font-semibold underline ">
            बात-Sheet
          </Link>
        </div>
        <div className="text-zinc-600 md:w-[60%] lg:w-[40%] mx-auto">
          An interactive way to बात (talk) with your PDF&apos;s. Get started
          with our app today and talk to your PDFs like never before with our
          intelligent chatbot.
        </div>
        <div className="w-full flex">
          <Button asChild className="my-5 mx-auto">
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>
        <div className="relative flex max-w-6xl items-center mx-auto justify-center overflow-hidden">
          <Image
            src="https://utfs.io/f/2f8785eb-28ab-461d-bf1f-1dc8b99f95e6-6e7val.png"
            alt="hero-section"
            className="h-full w-[90%] border-[#fe640b] rounded-lg object-cover md:w-[1300px]"
            style={{
              maskImage: `linear-gradient(to top, transparent, black 100%)`,
            }}
            width={700}
            height={700}
          />
        </div>
        <div className="w-full mx-auto">
          <div className="grid w-fit grid-cols-1 items-center md:grid-cols-3 gap-3 mx-auto p-8 justify-evenly">
            {features.map((feature, index) => {
              return (
                <div className="flex items-start gap-2 w-fit mt-5" key={index}>
                  <div className="pt-1">{feature.icon}</div>
                  <div className="lg:w-72 text-zinc-600 text-sm text-left">
                    {feature.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <Footer />
      </div>
    </main>
  );
}
