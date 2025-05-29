"use client"

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Calendar, Clock, User, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { importSharedTodo, getShareTokenInfo } from '@/lib/todoService';
import { toast } from '@/components/ui/use-toast';

interface SharedTodoImportProps {
  params: Promise<{ token: string }>;
}

interface ShareInfo {
  todoData: {
    title: string;
    description?: string;
    color?: string;
    date: Date;
    priority: 'low' | 'medium' | 'high';
  };
  sharedBy: string;
  sharedByName?: string;
  sharedByImage?: string;
  isExpired: boolean;
  hasAlreadyImported?: boolean;
}

export default function SharedTodoImport({ params }: SharedTodoImportProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [token, setToken] = useState<string>('');
  const [shareInfo, setShareInfo] = useState<ShareInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [imported, setImported] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Resolve params
  useEffect(() => {
    params.then(({ token }) => {
      setToken(token);
    });
  }, [params]);

  // Fetch share info when token is available
  useEffect(() => {
    if (!token) return;

    const fetchShareInfo = async () => {
      try {
        setLoading(true);
        const info = await getShareTokenInfo(token);
        setShareInfo(info);
      } catch (error: any) {
        console.error('Failed to fetch share info:', error);
        setError(error.message || 'Failed to load shared todo');
      } finally {
        setLoading(false);
      }
    };

    fetchShareInfo();
  }, [token]);

  const handleImport = async () => {
    try {
      setImporting(true);
      await importSharedTodo(token);
      setImported(true);
      toast({
        title: "Success!",
        description: "Todo has been added to your list",
      });
    } catch (error: any) {
      console.error('Failed to import todo:', error);

      // Handle specific error cases
      let errorMessage = error.message || "Failed to import todo";
      if (error.message?.includes("cannot import your own")) {
        errorMessage = "You cannot import your own shared todo. This todo is already in your list.";
      } else if (error.message?.includes("already imported")) {
        errorMessage = "You have already imported this todo to your list.";
      } else if (error.message?.includes("expired")) {
        errorMessage = "This share link has expired. Please ask for a new link.";
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setImporting(false);
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

  // Show loading state
  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-gray-600 dark:text-neutral-400">Loading shared todo...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Share Link Not Found
          </h1>
          <p className="text-gray-600 dark:text-neutral-400">
            {error}
          </p>
          <Button onClick={() => router.push('/todos')} variant="outline">
            Go to My Todos
          </Button>
        </div>
      </div>
    );
  }

  // Redirect to sign in if not authenticated
  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  if (!shareInfo) {
    return null;
  }

  // Check if this is the user's own todo
  const isOwnTodo = session?.user?.id === shareInfo.sharedBy;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Shared Todo
          </h1>
          <p className="text-gray-600 dark:text-neutral-400">
            {shareInfo.sharedByName || 'Someone'} shared a todo with you
          </p>
        </div>

        <Card className="mb-8 dark:bg-neutral-900 dark:border-neutral-800">
          <div className="h-2" style={{ backgroundColor: shareInfo.todoData.color || '#3b82f6' }}></div>
          <CardHeader className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {shareInfo.todoData.title}
              </h2>
              <Badge className={getPriorityColor(shareInfo.todoData.priority)}>
                {shareInfo.todoData.priority}
              </Badge>
            </div>

            {shareInfo.todoData.description && (
              <p className="text-gray-600 dark:text-neutral-300 mb-4">
                {shareInfo.todoData.description}
              </p>
            )}

            <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-neutral-400">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Due: {format(shareInfo.todoData.date, "MMM d, yyyy")}</span>
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span>Shared by: {shareInfo.sharedByName || 'Anonymous'}</span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {shareInfo.isExpired ? (
          <div className="text-center space-y-4">
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
              <AlertCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
              <p className="text-red-800 dark:text-red-300 font-medium">
                This share link has expired
              </p>
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                Share links are valid for 7 days. Please ask for a new link.
              </p>
            </div>
            <Button onClick={() => router.push('/todos')} variant="outline">
              Go to My Todos
            </Button>
          </div>
        ) : imported ? (
          <div className="text-center space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md">
              <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <p className="text-green-800 dark:text-green-300 font-medium">
                Todo successfully added to your list!
              </p>
            </div>
            <Button onClick={() => router.push('/todos')}>
              View My Todos
            </Button>
          </div>
        ) : (
          <div className="text-center space-y-4">
            {isOwnTodo ? (
              <>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
                  <p className="text-blue-800 dark:text-blue-300 text-sm">
                    This is your own shared todo. You cannot import it because it's already in your list.
                  </p>
                </div>
                <Button onClick={() => router.push('/todos')} variant="outline">
                  Go to My Todos
                </Button>
              </>
            ) : shareInfo.hasAlreadyImported ? (
              <>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md">
                  <CheckCircle className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                  <p className="text-yellow-800 dark:text-yellow-300 font-medium">
                    You have already imported this todo
                  </p>
                  <p className="text-yellow-600 dark:text-yellow-400 text-sm mt-1">
                    This todo is already in your personal list.
                  </p>
                </div>
                <Button onClick={() => router.push('/todos')} variant="outline">
                  Go to My Todos
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleImport}
                  disabled={importing}
                  className="w-full sm:w-auto"
                >
                  {importing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Adding to your list...
                    </>
                  ) : (
                    'Add to My Todos'
                  )}
                </Button>
                <p className="text-xs text-gray-500 dark:text-neutral-400">
                  This will create a copy of this todo in your personal list
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
