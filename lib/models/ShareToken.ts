import mongoose from 'mongoose';

// Define the ShareToken schema
const ShareTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  todoData: {
    title: {
      type: String,
      required: true,
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
      required: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
  },
  sharedBy: {
    type: String,
    required: true,
  },
  sharedByName: {
    type: String,
    required: false,
  },
  sharedByImage: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  usedBy: [{
    userId: String,
    usedAt: {
      type: Date,
      default: Date.now,
    }
  }],
});

// Create indexes for efficient queries
ShareTokenSchema.index({ token: 1 }, { unique: true });
ShareTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // MongoDB TTL index

// Use existing model or create a new one to prevent model overwrite error on hot reload
export default mongoose.models.ShareToken || mongoose.model('ShareToken', ShareTokenSchema);
