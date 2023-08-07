import { model, Schema } from 'mongoose';

// TODO: admin should be able to view a list of users who want to be mentors and update their role or reject their application to be a mentor
  export interface UserDocument {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    address: string;
    bio: string;
    occupation: string;
    expertise: string;
    role: string;

  }
const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true, // TODO: implement reset forgotten password feature
    },
    address: {
      type: String,
    },
    bio: {
      type: String, // TODO: make it possible for users to edit their bios in account page
    },
    occupation: {
      type: String,
      required: true,
    },
    expertise: {
      type: String,
      enum: ['beginner', 'intermediate', 'expert'],
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'mentor', 'user'],
      default: 'user',
    },
  },
  { timestamps: true }
);

export default model<UserDocument>('User', userSchema);
