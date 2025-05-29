"use client"

import { Suspense } from "react"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { FaGoogle, FaDiscord, FaGithub } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

function SignInContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  return (
    <div className="flex min-h-screen">
      {/* Left side - Auth providers */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-12">
        <div className="max-w-md mx-auto w-full space-y-8">
          <div className="flex items-center space-x-2 mb-8">
            <Image src="/favicon.ico" alt="Tomados Logo" width={40} height={40} className="lg:hidden" />
            <h1 className="text-2xl font-bold lg:hidden">Tomados</h1>
          </div>

          <div>
            <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-muted-foreground mt-2">Sign in to your account to continue</p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error === "github"
                  ? "GitHub authentication failed. Please try again."
                  : "Authentication error. Please try again."}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <Button
              onClick={() => signIn("google", { callbackUrl: "/todos" })}
              variant="outline"
              className="w-full justify-start h-12 px-4 transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <FaGoogle className="h-5 w-5 mr-4 text-red-500" />
              <span>Continue with Google</span>
            </Button>

            <Button
              onClick={() => signIn("github", { callbackUrl: "/todos" })}
              variant="outline"
              className="w-full justify-start h-12 px-4 transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <FaGithub className="h-5 w-5 mr-4" />
              <span>Continue with GitHub</span>
            </Button>

            <Button
              onClick={() => signIn("discord", { callbackUrl: "/todos" })}
              variant="outline"
              className="w-full justify-start h-12 px-4 transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <FaDiscord className="h-5 w-5 mr-4 text-indigo-500" />
              <span>Continue with Discord</span>
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground mt-6">
            <Link href="/" className="hover:text-primary underline underline-offset-4">
              Return to home page
            </Link>
          </div>
        </div>
      </div>

      {/* Right side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-start justify-center p-12 relative">
        <div className="max-w-md text-center">
          <div className="flex flex-col items-center mb-8">
            <Image src="/favicon.ico" alt="Tomados Logo" width={80} height={80} className="mb-4" />
            <h1 className="text-4xl font-bold">Tomados</h1>
            <p className="text-xl text-muted-foreground mt-2">Your simple, powerful todo list</p>
          </div>

          <Card className="p-6 backdrop-blur-sm border-0 shadow-lg">
            <p className="text-lg">
              Organize your tasks, boost your productivity, and never miss a deadline again with Tomados.
            </p>
          </Card>

          <div className="mt-8 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Tomados. All rights reserved.</p>
          </div>
        </div>

        {/* Background pattern */}
        <div className="absolute inset-0 z-[-1] opacity-30 dark:opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle at 25px 25px, rgba(0, 0, 0, 0.1) 2px, transparent 0)",
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default function SignIn() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="animate-pulse text-center">
            <p className="text-lg">Loading...</p>
          </div>
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  )
}
