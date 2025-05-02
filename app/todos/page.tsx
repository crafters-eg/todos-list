"use client";

import React from 'react'
import { cn } from "@/lib/utils";
import TodoApp from '@/components/todos-components/todo-app';
import { useSession } from 'next-auth/react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { FaGithub } from 'react-icons/fa';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

const TodosPage = () => {
  const { data: session, status } = useSession();

  return (
    <div className="relative w-full bg-white dark:bg-neutral-950 text-black dark:text-white transition-colors duration-200">
      {/* Background gradient effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-pink-400 opacity-10 blur-3xl filter dark:bg-purple-600 dark:opacity-10"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-400 opacity-10 blur-3xl filter dark:bg-blue-600 dark:opacity-10"></div>
      </div>
      
      <div className="container mx-auto py-8 px-4 relative z-10">
        {status === "authenticated" ? (
          <TodoApp />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[70vh] py-12">
            <Card className="max-w-md w-full p-8 mx-auto bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm border rounded-lg shadow-lg dark:border-neutral-800">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-4">
                  <Image 
                    src="/favicon.ico" 
                    alt="Tomados" 
                    width={64} 
                    height={64} 
                    className="h-16 w-16 mx-auto" 
                  />
                </div>
                <CardTitle className="text-2xl font-bold">Welcome to Tomados</CardTitle>
                <CardDescription>
                  The simple and effective todo list manager
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
                  Sign in with your GitHub account to create and manage your todo list, track your productivity, and stay organized.
                </p>
                <Button 
                  onClick={() => signIn("github", { callbackUrl: "/todos" })}
                  className="flex items-center gap-2 w-full justify-center"
                  size="lg"
                >
                  <FaGithub className="h-5 w-5" />
                  Login with GitHub
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default TodosPage