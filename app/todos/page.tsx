import React from 'react'
import { cn } from "@/lib/utils";
import TodoApp from '@/components/todos-components/todo-app';

const page = () => {
  return (
    <div className="relative flex min-h-[42.3rem] w-full items-center justify-center bg-background text-foreground dark">
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Todo Manager</h1>
        <TodoApp />
      </main>
    </div>
  )
}

export default page