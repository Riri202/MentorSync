import { model, Schema } from 'mongoose';

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
  score: {
    type: Number,
    required: true,
  },
  remark: {
    type: String,
  },
}, {timestamps: true});

export default model('Review', reviewSchema);
