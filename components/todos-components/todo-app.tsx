"use client"

import { useState, useEffect } from "react"
import { Plus, Search, SlidersHorizontal, X, GripVertical, CheckCircle, Circle, Trash2, CalendarIcon, Clock } from "lucide-react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import TodoForm from "./todo-form"
import { fetchTodos, createTodo, updateTodo, deleteTodo } from "@/lib/todoService"
import { toast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { Tooltip } from "@/components/ui/tooltip"
import ContextMenu from "./context-menu"
import ShareModal from "./share-modal"

export type Todo = {
  id: string
  title: string
  description: string
  color: string
  date: Date
  priority: "low" | "medium" | "high"
  completed: boolean
  createdAt: Date
  userId?: string
}

export default function TodoApp() {
  const { data: session, status } = useSession()
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"date" | "priority" | "createdAt">("date")
  const [filterPriority, setFilterPriority] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [draggedTodo, setDraggedTodo] = useState<Todo | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)

  // Context menu state
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    todoId: string;
  } | null>(null);

  // Share modal state
  const [shareModal, setShareModal] = useState<{
    isOpen: boolean;
    todoId: string;
    todoTitle: string;
  }>({
    isOpen: false,
    todoId: '',
    todoTitle: '',
  });

  useEffect(() => {
    const getTodos = async () => {
      if (status !== "authenticated") {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const todosData = await fetchTodos()
        setTodos(todosData)
      } catch (error) {
        console.error("Failed to fetch todos:", error)
        toast({
          title: "Error",
          description: "Failed to load tasks. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    getTodos()
  }, [status])

  const handleAddTodo = async (todo: Omit<Todo, "id" | "completed" | "createdAt" | "userId">) => {
    try {
      const newTodo = await createTodo(todo)
      setTodos([...todos, newTodo])
      setShowForm(false)
      toast({
        title: "Success",
        description: "Task created successfully",
      })
    } catch (error) {
      console.error("Failed to create todo:", error)
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleToggleTodoStatus = async (id: string) => {
    try {
      const todo = todos.find(todo => todo.id === id)
      if (!todo) return

      const updatedTodo = await updateTodo(id, { completed: !todo.completed })

      setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)))
    } catch (error) {
      console.error("Failed to update todo:", error)
      toast({
        title: "Error",
        description: "Failed to update task status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteTodo(id)
      setTodos(todos.filter((todo) => todo.id !== id))
      toast({
        title: "Success",
        description: "Task deleted successfully",
      })
    } catch (error) {
      console.error("Failed to delete todo:", error)
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      })
    }
  }

  const filterTodos = (todosList: Todo[]) => {
    return todosList.filter(todo => {
      const matchesSearch =
        searchQuery === "" ||
        todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        todo.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPriority =
        filterPriority.length === 0 ||
        filterPriority.includes(todo.priority);

      return matchesSearch && matchesPriority;
    });
  };

  const sortTodos = (todosList: Todo[]) => {
    return [...todosList].sort((a, b) => {
      if (sortBy === "priority") {
        const priorityWeight = { low: 0, medium: 1, high: 2 };
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      } else if (sortBy === "date") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  };

  const filteredTodos = sortTodos(filterTodos(todos));
  const inProgressTodos = filteredTodos.filter((todo) => !todo.completed);
  const completedTodos = filteredTodos.filter((todo) => todo.completed);

  const totalTodos = todos.length;
  const completionRate = totalTodos > 0
    ? Math.round((todos.filter(t => t.completed).length / totalTodos) * 100)
    : 0;
  const highPriorityCount = todos.filter(t => t.priority === "high" && !t.completed).length;
  const dueSoonCount = todos.filter(t => {
    const dueDate = new Date(t.date);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && !t.completed;
  }).length;

  const togglePriorityFilter = (priority: string) => {
    if (filterPriority.includes(priority)) {
      setFilterPriority(filterPriority.filter(p => p !== priority));
    } else {
      setFilterPriority([...filterPriority, priority]);
    }
  };

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

  const getDaysRemaining = (dueDate: Date) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

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
  };

  const handleDragStart = (todo: Todo) => {
    setDraggedTodo(todo);
  };

  const handleDragOver = (columnId: string, e: React.DragEvent) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDrop = async (columnId: string, e: React.DragEvent) => {
    e.preventDefault();
    setDragOverColumn(null);

    if (!draggedTodo) return;

    const isMovingToCompleted = columnId === 'done' && !draggedTodo.completed;
    const isMovingToInProgress = columnId === 'inProgress' && draggedTodo.completed;

    if (isMovingToCompleted || isMovingToInProgress) {
      try {
        const newCompleted = columnId === 'done';

        const updatedTodo = await updateTodo(draggedTodo.id, { completed: newCompleted });

        setTodos(todos.map(todo =>
          todo.id === draggedTodo.id ? updatedTodo : todo
        ));

        toast({
          title: "Success",
          description: `Task moved to ${newCompleted ? 'Done' : 'In Progress'}`,
        });
      } catch (error) {
        console.error("Failed to update todo:", error);
        toast({
          title: "Error",
          description: "Failed to move task. Please try again.",
          variant: "destructive",
        });
      }
    }

    setDraggedTodo(null);
  };

  const handleDragEnd = () => {
    setDraggedTodo(null);
    setDragOverColumn(null);
  };

  // Handle right-click context menu
  const handleContextMenu = (e: React.MouseEvent, todoId: string) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      todoId,
    });
  };

  // Handle share action
  const handleShare = (todoId: string) => {
    const todo = todos.find(t => t.id === todoId);
    if (todo) {
      setShareModal({
        isOpen: true,
        todoId,
        todoTitle: todo.title,
      });
    }
  };

  // Close context menu
  const closeContextMenu = () => {
    setContextMenu(null);
  };

  // Close share modal
  const closeShareModal = () => {
    setShareModal({
      isOpen: false,
      todoId: '',
      todoTitle: '',
    });
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin h-10 w-10 border-2 border-primary rounded-full border-t-transparent"></div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-4">
        <h2 className="text-xl font-semibold">Please sign in to manage your tasks</h2>
        <Button
          onClick={() => window.location.href = "/api/auth/signin"}
          className="mt-4"
        >
          Sign In
        </Button>
      </div>
    )
  }

  const renderTodoCard = (todo: Todo) => {
    const getStatusIndicator = () => {
      if (todo.completed) {
        return { color: "bg-green-500", icon: <CheckCircle className="h-4 w-4 text-white" /> };
      }

      const daysRemaining = getDaysRemaining(todo.date);
      if (daysRemaining < 0) {
        return { color: "bg-red-500", icon: <Clock className="h-4 w-4 text-white" /> };
      } else if (daysRemaining <= 3) {
        return { color: "bg-yellow-500", icon: <Clock className="h-4 w-4 text-white" /> };
      } else {
        return { color: "bg-blue-500", icon: <Circle className="h-4 w-4 text-white" /> };
      }
    };

    const statusIndicator = getStatusIndicator();
    const dueDateStatus = getDueDateStatus(todo.date, todo.completed);

    return (
      <div
        key={todo.id}
        draggable
        onDragStart={() => handleDragStart(todo)}
        onDragEnd={handleDragEnd}
        className="mb-4 cursor-grab active:cursor-grabbing transition-transform duration-100 hover:-translate-y-1"
      >
        <Card
          className={`overflow-hidden border-l-4 dark:bg-neutral-900/95 backdrop-blur-sm dark:border-neutral-800 transition-all duration-100 hover:shadow-lg group ${
            draggedTodo?.id === todo.id ? 'opacity-60 scale-105' : ''
          } ${
            !todo.completed && dragOverColumn === 'done' && draggedTodo?.id === todo.id ? 'border-l-green-400' : ''
          } ${
            todo.completed && dragOverColumn === 'inProgress' && draggedTodo?.id === todo.id ? 'border-l-blue-400' : ''
          }`}
          style={{ borderLeftColor: todo.color }}
          onContextMenu={(e) => handleContextMenu(e, todo.id)}
        >
          <div className="relative pt-2">
            <CardHeader className="p-4 pt-1 pb-2">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Tooltip content="Drag to move task">
                    <span className="cursor-grab rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">
                      <GripVertical className="h-5 w-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                    </span>
                  </Tooltip>
                  <h3 className={`font-medium text-lg ${todo.completed ? "line-through text-gray-500 dark:text-neutral-400" : "dark:text-white"}`}>
                    {todo.title}
                  </h3>
                </div>

                <div className={`${statusIndicator.color} p-1.5 rounded-full shadow-sm flex-shrink-0`}>
                  {statusIndicator.icon}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-1">
                <div className="flex items-center text-xs font-medium py-1 px-2 rounded-md bg-gray-100 dark:bg-neutral-800">
                  <CalendarIcon className="h-3.5 w-3.5 mr-1.5 text-gray-500 dark:text-gray-400" />
                  <span className={`${dueDateStatus.className}`}>
                    {dueDateStatus.text} • {format(new Date(todo.date), "MMM d")}
                  </span>
                </div>

                <Badge className={`flex-shrink-0 ${getPriorityColor(todo.priority)} shadow-sm transition-transform group-hover:scale-110`}>
                  {todo.priority}
                </Badge>
              </div>
            </CardHeader>

            {todo.description && (
              <CardContent className="px-4 py-2">
                <p className={`text-sm ${todo.completed ? "line-through text-gray-500 dark:text-neutral-400" : "dark:text-neutral-300"}`}>
                  {todo.description}
                </p>
              </CardContent>
            )}

            <CardFooter className="p-3 flex justify-end items-center gap-2 bg-gray-50 dark:bg-neutral-800/30">
              <Tooltip content={todo.completed ? "Mark as incomplete" : "Mark as complete"}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleTodoStatus(todo.id)}
                  className={`h-8 px-3 border-dashed transition-all hover:border-solid ${
                    todo.completed ?
                    "text-green-600 dark:text-green-400 border-green-200 dark:border-green-900 hover:bg-green-50 dark:hover:bg-green-900/20" :
                    "border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800"
                  }`}
                >
                  {todo.completed ?
                    <><CheckCircle className="h-4 w-4 mr-1.5" /> Completed</> :
                    <><Circle className="h-4 w-4 mr-1.5" /> Complete</>
                  }
                </Button>
              </Tooltip>
              <Tooltip content="Delete task">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="h-8 w-8 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </Tooltip>
            </CardFooter>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col-reverse md:flex-row gap-2 justify-between items-center">
        <h1 className="text-2xl font-bold">Tomados Dashboard</h1>
        {session?.user?.name && (
          <p className="text-sm text-gray-500">
            Logged in as <span className="font-medium">{session.user.name}</span>
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 flex flex-col items-center dark:bg-neutral-900 dark:border-neutral-800 transition-colors duration-200">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tasks</h3>
          <p className="text-2xl font-bold mt-1">{totalTodos}</p>
        </Card>
        <Card className="p-4 flex flex-col items-center dark:bg-neutral-900 dark:border-neutral-800 transition-colors duration-200">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Completion Rate</h3>
          <p className="text-2xl font-bold mt-1">{completionRate}%</p>
        </Card>
        <Card className="p-4 flex flex-col items-center dark:bg-neutral-900 dark:border-neutral-800 transition-colors duration-200">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">High Priority</h3>
          <p className="text-2xl font-bold mt-1 text-red-500">{highPriorityCount}</p>
        </Card>
        <Card className="p-4 flex flex-col items-center dark:bg-neutral-900 dark:border-neutral-800 transition-colors duration-200">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Due Soon</h3>
          <p className="text-2xl font-bold mt-1 text-yellow-500">{dueSoonCount}</p>
        </Card>
      </div>

      {showForm ? (
        <Card className="p-4 dark:bg-neutral-900 dark:border-neutral-800 transition-colors duration-200">
          <TodoForm onSubmit={handleAddTodo} onCancel={() => setShowForm(false)} />
        </Card>
      ) : (
        <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Add New Task
        </Button>
      )}

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1">
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 dark:bg-neutral-900"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex gap-3">
          <Select value={sortBy} onValueChange={(value: "date" | "priority" | "createdAt") => setSortBy(value)}>
            <SelectTrigger className="w-[150px] dark:bg-neutral-900">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Due Date</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="createdAt">Created Date</SelectItem>
            </SelectContent>
          </Select>

          <Popover open={showFilters} onOpenChange={setShowFilters}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2 dark:bg-neutral-900">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {filterPriority.length > 0 && (
                  <Badge className="h-5 w-5 p-0 flex items-center justify-center rounded-full">{filterPriority.length}</Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-4">
              <h4 className="font-medium mb-3">Filter by Priority</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="filter-high"
                    checked={filterPriority.includes("high")}
                    onCheckedChange={() => togglePriorityFilter("high")}
                  />
                  <Label htmlFor="filter-high" className="cursor-pointer">High</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="filter-medium"
                    checked={filterPriority.includes("medium")}
                    onCheckedChange={() => togglePriorityFilter("medium")}
                  />
                  <Label htmlFor="filter-medium" className="cursor-pointer">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="filter-low"
                    checked={filterPriority.includes("low")}
                    onCheckedChange={() => togglePriorityFilter("low")}
                  />
                  <Label htmlFor="filter-low" className="cursor-pointer">Low</Label>
                </div>
              </div>
              <div className="flex justify-between mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilterPriority([])}
                  disabled={filterPriority.length === 0}
                >
                  Clear all
                </Button>
                <Button size="sm" onClick={() => setShowFilters(false)}>Apply</Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin h-10 w-10 border-2 border-primary rounded-full border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            onDragOver={(e) => handleDragOver('inProgress', e)}
            onDrop={(e) => handleDrop('inProgress', e)}
            className="min-h-[200px] transition-colors duration-75 relative"
          >
            <h2 className="text-xl font-semibold mb-4 dark:text-white transition-colors duration-200 m-5">
              In Progress ({inProgressTodos.length})
            </h2>
            {dragOverColumn === 'inProgress' && (
              <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/10 rounded-lg pointer-events-none"
                style={{ zIndex: -1 }}></div>
            )}
            <div className="min-h-[200px] p-2">
              {inProgressTodos.map(renderTodoCard)}
            </div>
          </div>

          <div
            onDragOver={(e) => handleDragOver('done', e)}
            onDrop={(e) => handleDrop('done', e)}
            className="min-h-[200px] transition-colors duration-75 relative"
          >
            <h2 className="text-xl font-semibold mb-4 dark:text-white transition-colors duration-200 m-5">
              Done ({completedTodos.length})
            </h2>
            {dragOverColumn === 'done' && (
              <div className="absolute inset-0 bg-green-50 dark:bg-green-900/10 rounded-lg pointer-events-none"
                style={{ zIndex: -1 }}></div>
            )}
            <div className="min-h-[200px] p-2">
              {completedTodos.map(renderTodoCard)}
            </div>
          </div>
        </div>
      )}

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onShare={() => handleShare(contextMenu.todoId)}
          onClose={closeContextMenu}
        />
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModal.isOpen}
        onClose={closeShareModal}
        todoId={shareModal.todoId}
        todoTitle={shareModal.todoTitle}
      />
    </div>
  )
}
