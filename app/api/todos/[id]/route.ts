import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Todo from "@/lib/models/Todo";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// Get a single todo
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Properly await params as recommended by Next.js
    const { id } = await params;
    await connectToDatabase();

    // Use the user ID from the session to ensure users can only access their own todos
    const userId = session.user.id;

    const todo = await Todo.findOne({ _id: id, userId }).lean();

    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json(todo, { status: 200 });
  } catch (error) {
    console.error("Error fetching todo:", error);
    return NextResponse.json(
      { error: "Failed to fetch todo" },
      { status: 500 }
    );
  }
}

// Update a todo
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Properly await params as recommended by Next.js
    const { id } = await params;
    await connectToDatabase();

    const data = await req.json();
    // Use the user ID from the session to ensure users can only update their own todos
    const userId = session.user.id;

    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: id, userId },
      { ...data },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedTodo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json(updatedTodo, { status: 200 });
  } catch (error) {
    console.error("Error updating todo:", error);
    return NextResponse.json(
      { error: "Failed to update todo" },
      { status: 500 }
    );
  }
}

// Delete a todo
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Properly await params as recommended by Next.js
    const { id } = await params;
    await connectToDatabase();

    // Use the user ID from the session to ensure users can only delete their own todos
    const userId = session.user.id;

    const deletedTodo = await Todo.findOneAndDelete({ _id: id, userId }).lean();

    if (!deletedTodo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Todo deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting todo:", error);
    return NextResponse.json(
      { error: "Failed to delete todo" },
      { status: 500 }
    );
  }
}
