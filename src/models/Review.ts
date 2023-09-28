import { model, Schema } from 'mongoose';
import { SessionDocument } from './Session';
import { UserDocument } from './User';

export interface ReviewDocument {
  session: SessionDocument;
  mentor: UserDocument;
  mentee: UserDocument;
  rating: number;
  review: string;
}

const reviewSchema = new Schema({
  session: {
    type: Schema.Types.ObjectId,
    ref: 'Session',
    required: true,
  },
  mentor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  mentee: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  review: {
    type: String,
  },
}, {timestamps: true});

export default model<ReviewDocument>('Review', reviewSchema);
