import { Request, Response } from 'express';
import endOfDay from 'date-fns/endOfDay';
import startOfDay from 'date-fns/startOfDay';
import User from '../models/User';
import { MENTOR_ROLE } from '../constants/index';
import Session from '../models/Session';
// import TimeSlot, { TimeSlotDocument } from '../models/TimeSlot';
import getDay from 'date-fns/getDay';
import { get30MinuteIntervals } from '../utils/date';
import Availability from '../models/Availability';

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

export const createMentorSchedule = async (req, res) => {
  const { mentorId } = req.params;
  const { startTime, endTime, dayOfWeek } = req.body;
  //TODO: make sure start and end time are in correct 'hh:mm a' format
  const timeSlots = get30MinuteIntervals(startTime, endTime);
  try {
    const data = await new Availability({
      dayOfWeek,
      startTime,
      endTime,
      mentor: mentorId,
      timeSlots,
    }).save();
    // if (schedule) {
    //   intervals.map(async (item) => {
    //     const data = await new TimeSlot({
    //       time: item,
    //       mentor: mentorId,
    //       dayOfWeek,
    //       availability: schedule._id,
    //     }).save();
    //     promises.push(data);
    //   });
    // }
    res.status(201).send({ data });
  } catch (error) {
    console.log(error);
  }
};

export const updateMentorSchedule = async (req, res) => {
  const { startTime, endTime, availabilityId } = req.body;
  //TODO: make sure start and end time are in correct 'hh:mm a' format and check that person making request and mentorId are same
  const timeSlots = get30MinuteIntervals(startTime, endTime);

  try {
    const data = await Availability.findOneAndUpdate(
      { _id: availabilityId },
      { $set: { startTime, endTime, timeSlots } },
      { new: true }
    ).exec();
    res.status(200).send({ data });
  } catch (error: any) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};

export const getMentorSchedule = async (req, res) => {
  const { mentorId } = req.params;

  try {
    const data = await Availability.find({ mentor: mentorId }).populate(
      'mentor'
    );
    res.status(200).send({ data });
  } catch (error: any) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};

export const createMentorshipSession = async (req, res) => {
  const { mentor, note, sessionDate, time } = req.body;
  const mentee = req.user._id;
  const dayOfWeek = getDay(new Date(sessionDate));
  const toDate = endOfDay(new Date(sessionDate));
  const fromDate = startOfDay(new Date(sessionDate));

  const availableTimeslots: string[] = [];

  if (!mentor || !time || !sessionDate)
    return res
      .status(400)
      .send({ message: 'Mentor, session date and time slot are required' });

  const schedule = await Availability.find({ mentor, dayOfWeek });

  if (!schedule.length)
    return res
      .status(400)
      .send({ message: 'Mentor is not available this day of the week' });

  const bookedSessionsForSelectedDate = await Session.find({
    mentor,
    sessionDate: { $gte: fromDate, $lte: toDate },
  });

  if (bookedSessionsForSelectedDate.length) {
    schedule[0].timeSlots.forEach((slot) => {
      if (
        !bookedSessionsForSelectedDate.some(
          (session) => String(session?.time) === String(slot)
        )
      )
        availableTimeslots.push(slot);
    });
  }

  if (!availableTimeslots.includes(time))
    return res
      .status(400)
      .send({ message: 'Mentor is no longer available for the selected time' });

  try {
    const data = await new Session({
      mentor,
      mentee,
      note,
      sessionDate: new Date(sessionDate),
      time,
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

  const dayOfWeek = getDay(new Date(date));
  // console.log({dayOfWeek}, new Date(date))

  const data: string[] = [];

  const toDate = endOfDay(new Date(date));
  const fromDate = startOfDay(new Date(date));
  try {
    const schedule = await Availability.find({ mentor: mentorId, dayOfWeek });

    if (!schedule.length)
      return res
        .status(400)
        .send({ message: 'Mentor is not available this day of the week' });

    const bookedSessionsForSelectedDate = await Session.find({
      mentor: mentorId,
      sessionDate: { $gte: fromDate, $lte: toDate },
    });

    if (bookedSessionsForSelectedDate.length) {
      schedule[0].timeSlots.forEach((slot) => {
        if (
          !bookedSessionsForSelectedDate.some(
            (session) => String(session?.time) === String(slot)
          )
        )
          data.push(slot);
      });
      return res.status(200).send({ data });
    }
    return res.status(200).send({ data: schedule[0].timeSlots });
  } catch (error: any) {
    res.status(500).send({ message: error.message });
  }
};
