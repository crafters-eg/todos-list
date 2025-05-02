"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import TodoForm from "./todo-form"
import TodoList from "./todo-list"

export type Todo = {
  id: string
  title: string
  description: string
  color: string
  date: Date
  priority: "low" | "medium" | "high"
  completed: boolean
  createdAt: Date
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    // Load todos from localStorage on client side
    if (typeof window !== "undefined") {
      const savedTodos = localStorage.getItem("todos")
      return savedTodos
        ? JSON.parse(savedTodos, (key, value) => {
            if (key === "date" || key === "createdAt") {
              return new Date(value)
            }
            return value
          })
        : []
    }
    return []
  })

  const [showForm, setShowForm] = useState(false)

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  const addTodo = (todo: Omit<Todo, "id" | "completed" | "createdAt">) => {
    const newTodo: Todo = {
      ...todo,
      id: Date.now().toString(),
      completed: false,
      createdAt: new Date(),
    }
    setTodos([...todos, newTodo])
    setShowForm(false)
  }

  const toggleTodoStatus = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const inProgressTodos = todos.filter((todo) => !todo.completed)
  const completedTodos = todos.filter((todo) => todo.completed)

  return (
    <div className="space-y-8">
      {showForm ? (
        <Card className="p-4">
          <TodoForm onSubmit={addTodo} onCancel={() => setShowForm(false)} />
        </Card>
      ) : (
        <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Add New Task
        </Button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">In Progress ({inProgressTodos.length})</h2>
          <TodoList todos={inProgressTodos} onToggle={toggleTodoStatus} onDelete={deleteTodo} />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Done ({completedTodos.length})</h2>
          <TodoList todos={completedTodos} onToggle={toggleTodoStatus} onDelete={deleteTodo} />
        </div>
      </div>
    </div>
  )
}
