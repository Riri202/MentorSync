import { model, Schema } from 'mongoose';

export interface TimeSlotDocument {
    _id: string;
    mentor: string;
    time: string;
    // startTime: string;
    // endTime: string;
    dayofWeek: number;
    isDisabled: boolean | null;
    availability: string
}

const timeslotSchema = new Schema({
  mentor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  dayOfWeek: {
    type: Number,
    required: true
  },
  availability: {
    type: Schema.Types.ObjectId,
    ref: 'Availability',
    required: true,
  }
}, {timestamps: true});

export default model<TimeSlotDocument>('TimeSlot', timeslotSchema);
