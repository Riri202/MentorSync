import { Schema, model } from 'mongoose';

const mentorSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isDemotedToUser: {
      type: Boolean,
      default: false,
    },
    isDemotedToUserAt: {
      type: Date,
    },
    isDemotedToUserBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export default model('Mentor', mentorSchema);
