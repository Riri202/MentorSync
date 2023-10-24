import { Request, Response } from 'express';
import endOfDay from 'date-fns/endOfDay';
import startOfDay from 'date-fns/startOfDay';
import User from '../models/User';
import { MENTOR_ROLE, USER_ROLE } from '../constants/index';
import Session, { SessionDocument } from '../models/Session';
// import TimeSlot, { TimeSlotDocument } from '../models/TimeSlot';
import getDay from 'date-fns/getDay';
import { get30MinuteIntervals } from '../utils/date';
import Availability from '../models/Availability';
import Review, { ReviewDocument } from '../models/Review';
import addMinutes from 'date-fns/addMinutes';
import format from 'date-fns/format';

const checkIfUserOrMentorExists = async (
  res: Response,
  id: string,
  role: string
) => {
  const existing = await User.findOne({
    _id: id,
    role,
  }).select('-password');

  if (!existing)
    return res.status(404).send({
      message: `${role.charAt(0).toUpperCase()}${role.slice(1)} not found`,
    });
};

export const getAllMentors = async (req: Request, res: Response) => {
  try {
    const data = await User.find(
      { role: MENTOR_ROLE },
      {},
      { sort: { createdAt: -1 } }
    ).select('-password');
    res.status(200).send(data);
  } catch (error: any) {
    console.log('GET_ALL_MENTORS_ERROR', error);
    res.status(500).send({ message: error.message });
  }
};

export const getUser = async (req, res) => {
  const { userId } = req.params;
  if (!userId) return res.status(400).send({ message: 'User id is required' });
  try {
    const data = await User.findById(userId).select('-password');
    res.status(200).send({ data });
  } catch (error: any) {
    console.log('GET_USER_ERROR', error);
    res.status(500).send({ message: error.message });
  }
};

export const createMentorSchedule = async (req, res) => {
  const { mentorId } = req.params;
  const { startTime, endTime, dayOfWeek } = req.body;
  //TODO: make sure start and end time are in correct 'hh:mm' format
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
  const { startTime, endTime, isAvailable, availabilityId } = req.body;
  const { mentorId } = req.params;
  const userId = req.user._id.toString();
  if (userId !== mentorId)
    return res.status(403).send({ message: 'You are not allowed to do this' });

  const timeSlots = get30MinuteIntervals(startTime, endTime);

  try {
    const data = await Availability.findOneAndUpdate(
      { _id: availabilityId },
      { $set: { startTime, endTime, timeSlots, isAvailable } },
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
    const data = await Availability.find({ mentor: mentorId })
      .populate('mentor', '-password')
      .sort({ dayOfWeek: 'asc' });
    res.status(200).send({ data });
  } catch (error: any) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};

export const createMentorshipSession = async (req, res) => {
  const { mentor, note, sessionDate, time } = req.body;

  if (!mentor || !time || !sessionDate)
    return res
      .status(400)
      .send({ message: 'Mentor, session date and time slot are required' });

  await checkIfUserOrMentorExists(res, mentor, 'mentor');

  const mentee = req.user._id;
  const dayOfWeek = getDay(new Date(sessionDate));
  const toDate = endOfDay(new Date(sessionDate));
  const fromDate = startOfDay(new Date(sessionDate));

  const availableTimeslots: string[] = [];
  const schedule = await Availability.find({ mentor, dayOfWeek });

  if (!schedule.length)
    return res.status(400).send({
      message: 'Sorry, this mentor is not available for the selected date',
    });

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
  if (
    bookedSessionsForSelectedDate.length &&
    !availableTimeslots.includes(time)
  )
    return res.status(400).send({
      message: 'Sorry, this mentor is not available for the selected time',
    });
  try {
    const data = await new Session({
      mentor,
      mentee,
      note,
      sessionDate,
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

  const data: string[] = [];

  const toDate = endOfDay(new Date(date));
  const fromDate = startOfDay(new Date(date));
  try {
    const schedule = await Availability.find({ mentor: mentorId, dayOfWeek });

    if (!schedule.length)
      return res
        .status(200)
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

export const updateSessionStatus = async (req, res) => {
  const { sessionId } = req.params;
  const { status } = req.body;

  if (!status)
    return res.status(400).send({
      message: 'Please provide session status',
    });

  try {
    const data = await Session.findByIdAndUpdate(sessionId, {
      $set: { status },
    }).exec();
    return res
      .status(200)
      .send({ message: `Session succesfully ${status}`, data });
  } catch (error: any) {
    res.status(500).send({ message: error.message });
  }
};

const getFiltersForSessions = (role: string, userId: string, filters?: any) => {
  if (role === USER_ROLE) {
    return { ...filters, mentee: userId };
  }
  return { ...filters, mentor: userId };
};

export const getSessions = async (req, res) => {
  const { role, userId } = req.query;
  type SessionsGroupedByDate = {
     [key: string]: SessionDocument[] ;
  }
  const data: {
    accepted: SessionsGroupedByDate ;
    rejected: SessionsGroupedByDate;
    pending: SessionsGroupedByDate;
    expired: SessionsGroupedByDate;
  } = { accepted: {}, rejected: {}, pending: {}, expired: {} };
  const sessionExpirationTime = addMinutes(new Date(), 30);

  try {
    const ungroupedAccepted = await Session.find(
      getFiltersForSessions(role, userId, {
        sessionDate: { $gt: sessionExpirationTime },
        status: 'accepted',
      })
    )
      .populate('mentor', '-password')
      .populate('mentee', '-password')
      .sort({sessionDate: -1});
    const ungroupedExpired = await Session.find(
      getFiltersForSessions(role, userId, {
        sessionDate: { $lte: sessionExpirationTime },
        status: 'accepted',
      })
    )
      .populate('mentor', '-password')
      .populate('mentee', '-password')
      .sort({sessionDate: -1});
    const ungroupedRejected = await Session.find(
      getFiltersForSessions(role, userId, {
        status: 'rejected',
      })
    )
      .populate('mentor', '-password')
      .populate('mentee', '-password')
      .sort({sessionDate: -1});
    const ungroupedPending = await Session.find(
      getFiltersForSessions(role, userId, {
        status: 'pending',
      })
    )
      .populate('mentor', '-password')
      .populate('mentee', '-password')
      .sort({sessionDate: -1});
      data.accepted = groupSessionsByDate(ungroupedAccepted);
      data.expired = groupSessionsByDate(ungroupedExpired);
      data.pending = groupSessionsByDate(ungroupedPending);
      data.rejected = groupSessionsByDate(ungroupedRejected);
    return res.status(200).send({ data });
  } catch (error: any) {
    res.status(500).send({ message: error.message });
    console.log(error)
  }
};

const groupSessionsByDate = (sessions: SessionDocument[]) => {
  const groupedSessions = {};

sessions.forEach((session) => {
  const date = format(new Date(session.sessionDate), 'yyyy-MM'); // Extract the date without time
  if (!groupedSessions[date]) {
    groupedSessions[date] = [];
  }
  groupedSessions[date].push(session);
});
return groupedSessions;
}


export const getSession = async (req, res) => {
  const { role, _id: userId } = req.user;
  const { sessionId } = req.params;
  let data: SessionDocument | null;
  try {
    if (role === USER_ROLE) {
      data = await Session.findOne({ mentee: userId, _id: sessionId })
        .populate('mentor', '-password')
        .populate('mentee', '-password');
    } else
      data = await Session.findOne({ mentor: userId, _id: sessionId })
        .populate('mentor', '-password')
        .populate('mentee', '-password');
    return res.status(200).send({ data });
  } catch (error: any) {
    res.status(500).send({ message: error.message });
  }
};

export const getExpiredSessionsForReview = async (req, res) => {
  const { _id: userId } = req.user;
  const sessionExpirationTime = addMinutes(new Date(), 30);
  try {
    const data: SessionDocument[] = await Session.aggregate([
      {
        $match: {
          mentee: userId,
          sessionDate: { $lte: sessionExpirationTime },
          status: 'accepted',
        },
      },
      {
        $lookup: {
          from: 'reviews', // this has to be how the collection name is in the db, it's "reviews" in mongodb atlas but in the model in this repo it is "Review". Same for other models.
          localField: '_id',
          foreignField: 'session',
          as: 'reviews',
        },
      },
      {
        $match: {
          reviews: { $size: 0 },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'mentor',
          foreignField: '_id',
          as: 'mentorInfo',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'mentee',
          foreignField: '_id',
          as: 'menteeInfo',
        },
      },
      {
        $project: {
          note: 1,
          time: 1,
          sessionDate: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          mentee: {
            $arrayElemAt: [
              {
                $map: {
                  input: '$menteeInfo',
                  in: {
                    _id: '$$this._id',
                    firstname: '$$this.firstname',
                    lastname: '$$this.lastname',
                    email: '$$this.email',
                    address: '$$this.address',
                    bio: '$$this.bio',
                    occupation: '$$this.occupation',
                    expertise: '$$this.expertise',
                    role: '$$this.role',
                    createdAt: '$$this.createdAt',
                    updatedAt: '$$this.updatedAt',
                  },
                },
              },
              0,
            ],
          },
          mentor: {
            $arrayElemAt: [
              {
                $map: {
                  input: '$mentorInfo',
                  in: {
                    _id: '$$this._id',
                    firstname: '$$this.firstname',
                    lastname: '$$this.lastname',
                    email: '$$this.email',
                    address: '$$this.address',
                    bio: '$$this.bio',
                    occupation: '$$this.occupation',
                    expertise: '$$this.expertise',
                    role: '$$this.role',
                    createdAt: '$$this.createdAt',
                    updatedAt: '$$this.updatedAt',
                  },
                },
              },
              0,
            ],
          },
        },
      },
    ]);
    res.status(200).send({ data });
  } catch (error: any) {
    res.status(500).send({ message: error.message });
  }
};

export const reviewSession = async (req, res) => {
  const { mentor, rating, review, session } = req.body;
  const mentee = req.user._id;
  try {
    const data: ReviewDocument = await new Review({
      session,
      mentor,
      mentee,
      rating,
      review,
    }).save();
    return res
      .status(200)
      .send({ message: 'Session reviewed successfully', data });
  } catch (error: any) {
    res.status(500).send({ message: error.message });
  }
};

export const getReviewedSessions = async (req, res) => {
  const { role, userId } = req.query;
  let data: ReviewDocument[];
  try {
    if (role === USER_ROLE) {
      data = await Review.find({ mentee: userId })
        .populate('mentor', '-password')
        .populate('mentee', '-password')
        .populate('session');
    } else
      data = await Review.find({ mentor: userId })
        .populate('mentor', '-password')
        .populate('mentee', '-password')
        .populate('session');
    return res.status(200).send({ data });
  } catch (error: any) {
    res.status(500).send({ message: error.message });
  }
};
