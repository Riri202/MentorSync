import { Request, Response } from 'express';
import endOfDay from 'date-fns/endOfDay';
import startOfDay from 'date-fns/startOfDay';
import User from '../models/User';
import { MENTOR_ROLE } from '../constants/index';
import Session from '../models/Session';
import TimeSlot, { TimeSlotDocument } from '../models/TimeSlot';

export const getAllMentors = async (req: Request, res: Response) => {
  try {
    const data = await User.find(
      { role: MENTOR_ROLE },
      {},
      { sort: { createdAt: -1 } }
    ).select('-password');
    res.status(200).send({ data });
  } catch (error: any) {
    console.log('GET_ALL_MENTORS_ERROR', error);
    res.status(500).send({ message: error.message });
  }
};

export const getMentor = async (req, res) => {
  const { mentorId } = req.params;
  if (!mentorId)
    return res.status(400).send({ message: 'Mentor id is required' });
  try {
    const data = await User.findById(mentorId).select('-password');
    res.status(200).send({ data });
  } catch (error: any) {
    console.log('GET_MENTOR_ERROR', error);
    res.status(500).send({ message: error.message });
  }
};

export const createSessionTimeSlots = async (req, res) => {
  const { mentorId } = req.params;
  const { startTime, endTime } = req.body;
  try {
    const data = await new TimeSlot({
      startTime,
      endTime,
      mentor: mentorId,
    }).save();
    res.status(201).send({ data });
  } catch (error) {
    console.log(error);
  }
};

export const createMentorshipSession = async (req, res) => {
  const { mentor, questions, sessionDate, timeSlotId } = req.body;
  const mentee = req.user._id;
  if (!mentor) return res.status(400).send({ message: 'Mentor is required' });

  try {
    const data = await new Session({
      mentor,
      mentee,
      questions,
      sessionDate,
      timeSlot: timeSlotId,
    }).save();
    res.status(200).send({ message: 'Session created successfully', data });
  } catch (error: any) {
    console.log('CREATE_SESSION_ERROR', error);
    res.status(500).send({ message: error.message });
  }
};

export const getMentorTimeSlots = async (req, res) => {
  const { mentorId } = req.params;
  const { date } = req.query;

  const data: TimeSlotDocument[] = []

  const toDate = endOfDay(new Date(date));
  const fromDate = startOfDay(new Date(date));

  const slots = await TimeSlot.find({ mentor: mentorId });
  
  const bookedSessionsForSelectedDate = await Session.find({
    mentor: mentorId,
    sessionDate: { $gte: fromDate, $lte: toDate },
  }).populate('timeSlot');

  slots.forEach(slot => {
    if (bookedSessionsForSelectedDate.some(session => String(session?.timeSlot?._id) === String(slot._id)))
    slot.isDisabled = true
    data.push(slot)
  })
};
