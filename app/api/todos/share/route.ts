import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Todo from '@/lib/models/Todo';
import ShareToken from '@/lib/models/ShareToken';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { randomBytes } from 'crypto';

// Generate a share link for a todo
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const { todoId } = await req.json();

    if (!todoId) {
      return NextResponse.json(
        { error: 'Todo ID is required' },
        { status: 400 }
      );
    }

    // Verify the todo exists and belongs to the user
    const todo = await Todo.findOne({
      _id: todoId,
      userId: session.user.id
    }).lean() as any;

    if (!todo) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }

    // Generate a unique token
    const token = randomBytes(32).toString('hex');

    // Set expiration to 7 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Create share token
    const shareToken = await ShareToken.create({
      token,
      todoData: {
        title: todo.title,
        description: todo.description,
        color: todo.color,
        date: todo.date,
        priority: todo.priority,
      },
      sharedBy: session.user.id,
      sharedByName: session.user.name || session.user.email,
      sharedByImage: session.user.image,
      expiresAt,
    });

    // Generate the share URL
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const shareUrl = `${baseUrl}/shared/${token}`;

    return NextResponse.json({
      shareUrl,
      token,
      expiresAt: shareToken.expiresAt,
    }, { status: 200 });

  } catch (error) {
    console.error('Error generating share link:', error);
    return NextResponse.json(
      { error: 'Failed to generate share link' },
      { status: 500 }
    );
  }
}
