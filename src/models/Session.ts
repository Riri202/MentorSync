import { model, Schema } from 'mongoose';
// import { TimeSlotDocument } from './TimeSlot';

// each mentor can select from a list of time slots that users will then be able to select from to book a session
// there will be a time slot model. when a new session is created a new slot is created and that is added to the new session's slot field 
// on the frontend, to get a list of available times for users to select from on mentor's page, we search slots created within that day. Then we use the list of times

interface sessionDocument {
  mentor: string;
  mentee: string;
  note: string | undefined;
  // timeSlot: TimeSlotDocument;
  sessionDate: Date;
  time: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema(
  {
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
    note: {
      type: String
    },
    // timeSlot: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'TimeSlot',
    //   required: true,
    // },
    time: {
      type: String,
      required: true
    },
    sessionDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default model<sessionDocument>('Session', sessionSchema);
