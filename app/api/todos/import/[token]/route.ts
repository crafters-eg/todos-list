import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Todo from '@/lib/models/Todo';
import ShareToken from '@/lib/models/ShareToken';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Get share token info (without importing)
export async function GET(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;
    await connectToDatabase();

    const shareToken = await ShareToken.findOne({ token }).lean();

    if (!shareToken) {
      return NextResponse.json(
        { error: 'Share link not found or expired' },
        { status: 404 }
      );
    }

    // Check if token is expired
    const isExpired = new Date() > new Date(shareToken.expiresAt);

    // Check if user is authenticated and has already imported this todo
    let hasAlreadyImported = false;
    try {
      const session = await getServerSession(authOptions);
      if (session?.user?.id) {
        hasAlreadyImported = shareToken.usedBy?.some(
          (usage: any) => usage.userId === session.user.id
        ) || false;
      }
    } catch (sessionError) {
      // If session check fails, just continue without the hasAlreadyImported flag
      console.log('Session check failed in GET request:', sessionError);
    }

    return NextResponse.json({
      todoData: shareToken.todoData,
      sharedBy: shareToken.sharedBy,
      sharedByName: shareToken.sharedByName,
      sharedByImage: shareToken.sharedByImage,
      isExpired,
      hasAlreadyImported,
    }, { status: 200 });

  } catch (error) {
    console.error('Error getting share token info:', error);
    return NextResponse.json(
      { error: 'Failed to get share token info' },
      { status: 500 }
    );
  }
}

// Import a shared todo
export async function POST(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { token } = await params;
    await connectToDatabase();

    const shareToken = await ShareToken.findOne({ token }).lean();

    if (!shareToken) {
      return NextResponse.json(
        { error: 'Share link not found or expired' },
        { status: 404 }
      );
    }

    // Check if token is expired
    if (new Date() > new Date(shareToken.expiresAt)) {
      return NextResponse.json(
        { error: 'Share link has expired' },
        { status: 410 }
      );
    }

    // Check if user is trying to import their own todo
    if (shareToken.sharedBy === session.user.id) {
      return NextResponse.json(
        { error: 'You cannot import your own shared todo' },
        { status: 400 }
      );
    }

    // Check if user has already imported this todo
    const hasAlreadyImported = shareToken.usedBy?.some(
      (usage: any) => usage.userId === session.user.id
    );

    if (hasAlreadyImported) {
      return NextResponse.json(
        { error: 'You have already imported this todo' },
        { status: 409 }
      );
    }

    // Create new todo for the importing user
    const newTodo = await Todo.create({
      title: shareToken.todoData.title,
      description: shareToken.todoData.description,
      color: shareToken.todoData.color,
      date: shareToken.todoData.date,
      priority: shareToken.todoData.priority,
      completed: false,
      userId: session.user.id,
    });

    // Update the share token to track usage
    await ShareToken.findOneAndUpdate(
      { token },
      {
        $push: {
          usedBy: {
            userId: session.user.id,
            usedAt: new Date(),
          }
        }
      }
    );

    return NextResponse.json(newTodo, { status: 201 });

  } catch (error) {
    console.error('Error importing shared todo:', error);
    return NextResponse.json(
      { error: 'Failed to import shared todo' },
      { status: 500 }
    );
  }
}
