"use client"

import { format } from "date-fns"
import { Trash2, CheckCircle, Circle, Clock, CalendarIcon, Pencil, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip } from "@/components/ui/tooltip"
import type { Todo } from "./todo-app"
import { useState } from "react"
import { Draggable } from "react-beautiful-dnd"

type TodoListProps = {
  todos: Todo[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  isDraggable?: boolean
}

export default function TodoList({ todos, onToggle, onDelete, isDraggable = false }: TodoListProps) {
  // Track hover state for each card
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  if (todos.length === 0) {
    return <div className="text-center p-8 border border-dashed rounded-lg text-gray-500 dark:text-neutral-400 dark:border-neutral-700 transition-colors duration-200">No tasks found</div>
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
        return "bg-gray-100 text-gray-800 dark:bg-neutral-800 dark:text-neutral-300"
    }
  }

  // Calculate days remaining until due date
  const getDaysRemaining = (dueDate: Date) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  // Get text and style for days remaining indicator
  const getDueDateStatus = (dueDate: Date, completed: boolean) => {
    if (completed) return { text: "Completed", className: "text-green-500" };
    
    const daysRemaining = getDaysRemaining(dueDate);
    
    if (daysRemaining < 0) {
      return { text: "Overdue", className: "text-red-500 font-medium" };
    } else if (daysRemaining === 0) {
      return { text: "Due today", className: "text-orange-500 font-medium" };
    } else if (daysRemaining === 1) {
      return { text: "Due tomorrow", className: "text-orange-400" };
    } else if (daysRemaining <= 3) {
      return { text: `Due in ${daysRemaining} days`, className: "text-yellow-500" };
    } else {
      return { text: `Due in ${daysRemaining} days`, className: "text-gray-500 dark:text-neutral-400" };
    }
  }

  return (
    <div className="space-y-4">
      {todos.map((todo, index) => {
        const dueStatus = getDueDateStatus(todo.date, todo.completed);
        
        const todoCard = (
          <Card 
            className={`overflow-hidden dark:bg-neutral-900 dark:border-neutral-800 transition-all duration-200 hover:shadow-md ${isDraggable ? 'hover:border-blue-400 dark:hover:border-blue-500' : ''}`}
            onMouseEnter={() => setHoveredCardId(todo.id)}
            onMouseLeave={() => setHoveredCardId(null)}
          >
            <div className="h-2" style={{ backgroundColor: todo.color }}></div>
            <CardHeader className="p-4 pb-2 flex flex-row justify-between items-start">
              <div className="flex-1 flex items-center gap-2">
                {isDraggable && (
                  <Tooltip content="Drag to move task">
                    <span className="cursor-grab">
                      <GripVertical className="h-5 w-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                    </span>
                  </Tooltip>
                )}
                <h3 className={`font-medium text-lg ${todo.completed ? "line-through text-gray-500 dark:text-neutral-400" : "dark:text-white"}`}>
                  {todo.title}
                </h3>
              </div>
              <Badge className={`ml-2 ${getPriorityColor(todo.priority)}`}>{todo.priority}</Badge>
            </CardHeader>
            {todo.description && (
              <CardContent className="p-4 pt-0 pb-2">
                <p className={`text-sm ${todo.completed ? "line-through text-gray-500 dark:text-neutral-400" : "dark:text-neutral-300"}`}>
                  {todo.description}
                </p>
              </CardContent>
            )}
            <CardFooter className="p-4 pt-2 flex justify-between items-center text-sm">
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1.5 text-gray-400" />
                <span className={dueStatus.className}>
                  {dueStatus.text} ({format(new Date(todo.date), "MMM d")})
                </span>
              </div>
              <div className="flex space-x-1">
                <Tooltip content={todo.completed ? "Mark as incomplete" : "Mark as complete"}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onToggle(todo.id)}
                    className={`size-8 dark:hover:bg-neutral-800 transition-all ${hoveredCardId === todo.id ? 'opacity-100 scale-100' : 'opacity-70 scale-95'}`}
                  >
                    {todo.completed ? 
                      <CheckCircle className="h-5 w-5 text-green-500" /> : 
                      <Circle className="h-5 w-5 dark:text-neutral-300" />
                    }
                  </Button>
                </Tooltip>
                <Tooltip content="Delete task">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onDelete(todo.id)} 
                    className={`size-8 dark:hover:bg-neutral-800 transition-all ${hoveredCardId === todo.id ? 'opacity-100 scale-100' : 'opacity-70 scale-95'}`}
                  >
                    <Trash2 className="h-5 w-5 text-red-500" />
                  </Button>
                </Tooltip>
              </div>
            </CardFooter>
          </Card>
        );
        
        if (isDraggable) {
          return (
            <Draggable key={todo.id} draggableId={todo.id} index={index} isDragDisabled={false}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={{
                    ...provided.draggableProps.style,
                    opacity: snapshot.isDragging ? 0.8 : 1
                  }}
                  className="cursor-grab active:cursor-grabbing"
                >
                  {todoCard}
                </div>
              )}
            </Draggable>
          );
        }
        
        return <div key={todo.id}>{todoCard}</div>;
      })}
    </div>
  )
}
