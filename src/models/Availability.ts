import { model, Schema } from 'mongoose';

export interface AvailabilityDocument {
  _id: string;
  mentor: string;
  timeSlots: string[];
  startTime: string;
  endTime: string;
  dayofWeek: number;
}

const availabilitySchema = new Schema(
  {
    dayOfWeek: {
      type: Number,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    mentor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    timeSlots: {
      type: Array,
      required: true
    }
  },
  { timestamps: true }
);

availabilitySchema.add({isAvailable: {type: Boolean, default: true}})

export default model('Availability', availabilitySchema);
