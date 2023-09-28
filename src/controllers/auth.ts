import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { BCRYPT_SALT, MENTOR_ROLE } from '../constants';
import User, { UserDocument } from '../models/User';
import { get30MinuteIntervals } from '../utils/date';
import Availability from '../models/Availability';

const generateToken = (id: string) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

export type AvailabilityArray = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  mentor: string;
  timeSlots: string[];
}[];

export const createDefaultAvailabilites = (mentor: string) => {
  const startTime = '09:00';
  const endTime = '17:00';
  const defaultAvailabilities: AvailabilityArray = [];
  for (let i = 0; i < 7; i++) {
    const timeSlots = get30MinuteIntervals(startTime, endTime);
    const newAvailability = {
      dayOfWeek: i,
      startTime,
      endTime,
      mentor,
      timeSlots,
      isAvailable: (i === 0 || i === 6) ? false : true,
    };
    defaultAvailabilities.push(newAvailability);
  }
  return defaultAvailabilities;
};

export const signup = async (req, res) => {
  const {
    firstname,
    lastname,
    email,
    password,
    address,
    bio,
    occupation,
    expertise,
    role,
  } = req.body;
  if (!email || !password)
    return res.status(400).send({ message: 'email and pasword required' });

  const foundEmail = await User.findOne({ email });
  if (foundEmail)
    return res
      .status(400)
      .send({ message: 'account with this email already exists' });

  const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT);

  if (!hashedPassword)
    return res.status(500).send({ message: 'password hashing unsuccessful' });

  try {
    const newUser: UserDocument = await new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      address,
      bio,
      occupation,
      expertise,
      role,
    }).save();

    if (newUser) {
      const token = generateToken(String(newUser._id));
      const data = {
        id: newUser._id,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        email: newUser.email,
        address: newUser.address,
        bio: newUser.bio,
        occupation: newUser.occupation,
        expertise: newUser.expertise,
        role: newUser.role,
        token,
      };
      // if user is a mentor, create default mentor schedule
      if (newUser.role === MENTOR_ROLE) {
        const defaultAvailabilities = createDefaultAvailabilites(newUser._id);
        await Availability.insertMany(defaultAvailabilities);
      }
      return res.status(200).send({ message: 'sign-up successful', ...data });
    }
  } catch (error: any) {
    console.log('SIGN_UP_ERROR', error);
    return res.status(500).send({ error: error.message });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(400).send({ message: 'Incorrect email' });

  try {
    const match = await bcrypt.compare(password, user?.password as string);

    if (!match) return res.status(400).send({ message: 'Incorrect password' });
    const token = generateToken(String(user?._id));
    const data = {
      id: user?._id,
      firstname: user?.firstname,
      lastname: user?.lastname,
      email: user?.email,
      address: user?.address,
      bio: user?.bio,
      occupation: user?.occupation,
      expertise: user?.expertise,
      role: user?.role,
      token,
    };
    return res.status(200).send({ message: 'sign-in succesful', ...data });
  } catch (error: any) {
    console.log('SIGN_IN_ERROR', error);
    return res.status(500).send({ error: error.message });
  }
};
