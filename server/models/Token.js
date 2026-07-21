import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tokenNumber: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Waiting', 'Called', 'Skipped', 'Completed'],
      default: 'Waiting'
    },
    createdAt: { type: Date, default: Date.now },
    calledAt: { type: Date },
    skippedAt: { type: Date },
    completedAt: { type: Date }
  },
  { timestamps: true }
);

const Token = mongoose.model('Token', tokenSchema);
export default Token;
