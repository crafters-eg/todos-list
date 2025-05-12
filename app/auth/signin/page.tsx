"use client";

import { Suspense } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FaGoogle } from "react-icons/fa";
import { FaDiscord } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";

function SignInContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12">
      <div className="w-full max-w-md space-y-8 px-4 sm:px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Sign in to your account</h1>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link href="/" className="text-blue-600 hover:underline">
              go back to home
            </Link>
          </p>

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-600 rounded-md">
              {error === "github"
                ? "GitHub authentication failed. Please try again."
                : "Authentication error."}
            </div>
          )}
        </div>
        <div className="mt-8 space-y-5">
          <Button
            onClick={() => signIn("google", { callbackUrl: "/todos" })}
            variant={"outline"}
            className="flex items-center justify-center w-full hover:cursor-pointer"
            size="lg"
          >
            <FaGoogle className="h-5 w-5 mr-2" />
            Sign in with Google
          </Button>
            <Button
              onClick={() => signIn("github", { callbackUrl: "/todos" })}
              variant={"outline"}
              className="flex items-center justify-center w-full hover:cursor-pointer"
              size="lg"
            >
              <FaGithub className="h-5 w-5 mr-2" />
              Sign in with GitHub
            </Button>
            <Button
              onClick={() => signIn("discord", { callbackUrl: "/todos" })}
              variant={"outline"}
              className="flex items-center justify-center w-full hover:cursor-pointer"
              size="lg"
            >
              <FaDiscord className="h-5 w-5 mr-2" />
              Sign in with Discord
            </Button>
        </div>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={<div className="text-center mt-12">Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
}
