"use client";
// Import the necessary components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { ClerkProvider, useSession } from "@clerk/nextjs";
import { ChromeIcon, FileText, GithubIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function SignInPage() {
  const user = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");

  if (user.isSignedIn) {
    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-[100vh] flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-10 lg:px-8">
      <div className="mx-auto max-w-md space-y-6 border p-5 rounded-md shadow-md">
        <SignIn.Root>
          <SignIn.Step name="start">
            <div className="space-y-2 text-center">
              {/* <Image
                src="https://static.vecteezy.com/system/resources/previews/017/197/488/original/pdf-icon-on-transparent-background-free-png.png"
                alt="BaatSheet Logo"
                width={64}
                height={64}
                className="rounded-full mx-auto"
              /> */}
              <Link
                href={"/"}
                className="flex text-2xl justify-center bg-zinc-100 p-2 rounded-md items-center space-x-1"
              >
                बात<span className="text-[#fe640b] font-bold">Sheet</span>
                {/* <FileText className="h-6 w-6" /> */}
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome Back 👋🏻
                {/* <span className="text-transparent bg-clip-text bg-gradient-to-br from-orange-500 to-orange-400">
                  BaatSheet!
                </span> */}
              </h1>
              <p className="text-gray-600 text-sm">
                Sign in to your account to continue...
              </p>
            </div>
            <Separator className="my-3" />
            <div className="space-y-4 w-full flex flex-col items-center justify-center">
              <Clerk.Connection name="google" className="w-full">
                <Button className="w-full mt-3 flex items-center justify-center space-x-2">
                  <ChromeIcon className="h-5 w-5" />
                  <span>Sign in with Google</span>
                </Button>
              </Clerk.Connection>
              <Clerk.Connection name="github" className="w-full">
                <Button className="w-full flex items-center justify-center space-x-2">
                  <GithubIcon className="h-5 w-5" />
                  <span>Sign in with GitHub</span>
                </Button>
              </Clerk.Connection>
              <Separator className="my-4" />
              <div className="space-y-2 w-full">
                <Clerk.Field name="identifier">
                  <Label htmlFor="email">Email:</Label>
                  <Input
                    id="email"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="shubhcodes@mail.com"
                    required
                  />
                  <Clerk.FieldError />
                </Clerk.Field>
              </div>
              <SignIn.Action submit>
                <Button
                  onClick={() => {
                    if (email === "") {
                      toast.error("Email cannot be empty!");
                    } else {
                      toast.success(
                        "Magic Link has been successfully sent to your email, Please check your inbox!"
                      );
                    }
                  }}
                  className="w-96 mt-3 flex items-center justify-center space-x-2"
                >
                  Continue
                </Button>
              </SignIn.Action>
            </div>
          </SignIn.Step>

          <SignIn.Step name="verifications">
            <SignIn.Strategy name="email_code">
              <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  Check your email
                </h1>
                <p className="text-gray-600">
                  We sent a code to <SignIn.SafeIdentifier />.
                </p>
              </div>
              <div className="space-y-2">
                <Clerk.Field name="code">
                  <Label htmlFor="code">Email code</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="Enter your code"
                    required
                  />
                  <Clerk.FieldError />
                </Clerk.Field>
              </div>
              <SignIn.Action submit>
                <Button className="w-full">Continue</Button>
              </SignIn.Action>
            </SignIn.Strategy>

            <SignIn.Strategy name="password">
              <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  Enter your password
                </h1>
              </div>
              <div className="space-y-2">
                <Clerk.Field name="password">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    required
                  />
                  <Clerk.FieldError />
                </Clerk.Field>
              </div>
              <div className="flex justify-between mt-4">
                <SignIn.Action submit>
                  <Button className="w-full">Continue</Button>
                </SignIn.Action>
                <SignIn.Action navigate="forgot-password">
                  <Button
                    variant="link"
                    className="text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </Button>
                </SignIn.Action>
              </div>
            </SignIn.Strategy>

            <SignIn.Strategy name="reset_password_email_code">
              <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  Check your email
                </h1>
                <p className="text-gray-600">
                  We sent a code to <SignIn.SafeIdentifier />.
                </p>
              </div>
              <div className="space-y-2">
                <Clerk.Field name="code">
                  <Label htmlFor="code">Email code</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="Enter your code"
                    required
                  />
                  <Clerk.FieldError />
                </Clerk.Field>
              </div>
              <SignIn.Action submit>
                <Button className="w-full">Continue</Button>
              </SignIn.Action>
            </SignIn.Strategy>
          </SignIn.Step>

          <SignIn.Step name="forgot-password">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Forgot your password?
              </h1>
            </div>
            <SignIn.SupportedStrategy name="reset_password_email_code">
              <Button className="w-full">Reset password</Button>
            </SignIn.SupportedStrategy>
            <SignIn.Action navigate="previous">
              <Button variant="link" className="text-blue-600 hover:underline">
                Go back
              </Button>
            </SignIn.Action>
          </SignIn.Step>

          <SignIn.Step name="reset-password">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Reset your password
              </h1>
            </div>
            <div className="space-y-2">
              <Clerk.Field name="password">
                <Label htmlFor="password">New password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter new password"
                  required
                />
                <Clerk.FieldError />
              </Clerk.Field>

              <Clerk.Field name="confirmPassword">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  required
                />
                <Clerk.FieldError />
              </Clerk.Field>
            </div>
            <SignIn.Action submit>
              <Button className="w-full">Reset password</Button>
            </SignIn.Action>
          </SignIn.Step>
        </SignIn.Root>
      </div>
    </div>
  );
}
