import mongoose from 'mongoose';
import User from '../models/User';
import * as bcrypt from 'bcrypt';
import { BCRYPT_SALT } from '../constants/index';

export const connectToDB = async () => {
  try {
    const conn = await mongoose.connect(String(process.env.MONGO_URI));
    console.log(`mongoDB connected: ${conn.connection.host}`);
    await createFirstAdmin();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const createFirstAdmin = async () => {
  const existingAdmins = await User.find({ role: 'admin' });
  if (existingAdmins.length) return;
    try {
      const hashedPassword = await bcrypt.hash(
        String(process.env.ADMIN_PASSWORD),
        BCRYPT_SALT
      );

      if (!hashedPassword) {
        console.log('password hashing unsuccessful');
        return;
      }
      const admin = new User({
        firstname: process.env.ADMIN_FIRSTNAME,
        lastname: process.env.ADMIN_LASTNAME,
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        address: process.env.ADMIN_ADDRESS,
        bio: process.env.ADMIN_BIO,
        occupation: process.env.ADMIN_OCCUPATION,
        expertise: process.env.ADMIN_EXPERTISE,
        role: process.env.ADMIN_ROLE,
      });
      await admin.save();
      console.log('First admin created succesfully');
    } catch (error) {
      console.log('create first admin error', error);
    }

};

