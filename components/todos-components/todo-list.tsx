"use client"

import { format } from "date-fns"
import { Trash2, CheckCircle, Circle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Todo } from "./todo-app"

type TodoListProps = {
  todos: Todo[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export default function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">No tasks found</div>
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <Card key={todo.id} className="overflow-hidden">
          <div className="h-2" style={{ backgroundColor: todo.color }}></div>
          <CardHeader className="p-4 pb-2 flex flex-row justify-between items-start">
            <div className="flex-1">
              <h3 className={`font-medium text-lg ${todo.completed ? "line-through text-muted-foreground" : ""}`}>
                {todo.title}
              </h3>
            </div>
            <Badge className={`ml-2 ${getPriorityColor(todo.priority)}`}>{todo.priority}</Badge>
          </CardHeader>
          {todo.description && (
            <CardContent className="p-4 pt-0 pb-2">
              <p className={`text-sm ${todo.completed ? "line-through text-muted-foreground" : ""}`}>
                {todo.description}
              </p>
            </CardContent>
          )}
          <CardFooter className="p-4 pt-2 flex justify-between items-center text-sm text-muted-foreground">
            <div>Due: {format(new Date(todo.date), "MMM d, yyyy")}</div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onToggle(todo.id)}
                title={todo.completed ? "Mark as incomplete" : "Mark as complete"}
              >
                {todo.completed ? <CheckCircle className="h-5 w-5 text-green-500" /> : <Circle className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(todo.id)} title="Delete task">
                <Trash2 className="h-5 w-5 text-red-500" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
