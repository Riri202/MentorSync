import { model, Schema } from 'mongoose';

export interface TimeSlotDocument {
    _id: string;
    mentor: string;
    startTime: string;
    endTime: string;
    isDisabled: boolean | null;
}

const timeslotSchema = new Schema({
  mentor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  }
}, {timestamps: true});

export default model<TimeSlotDocument>('TimeSlot', timeslotSchema);
