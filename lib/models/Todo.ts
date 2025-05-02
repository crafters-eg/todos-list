import mongoose from 'mongoose';

// Define the Todo schema
const TodoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for this task'],
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  description: {
    type: String,
    required: false,
  },
  color: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
    required: [true, 'Please specify a due date'],
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    index: true,
  },
});

// Create compound index for userId and completed status for efficient queries
TodoSchema.index({ userId: 1, completed: 1 });

// Use existing model or create a new one to prevent model overwrite error on hot reload
export default mongoose.models.Todo || mongoose.model('Todo', TodoSchema); 