import { AvailabilityArray, createDefaultAvailabilites } from './auth';
import User from '../models/User';
import Availability from '../models/Availability';

export const createDefaultAvailabilitesForExistingMentors = async (req, res) => {
  try {

    const allMentors = await User.find({ role: 'mentor' });
    const newAvailabilities = allMentors.reduce((initial: AvailabilityArray[], mentor) => {
      const defaultAvailabilities = createDefaultAvailabilites(mentor._id);
      return initial.concat(defaultAvailabilities);
    }, []);
    const data = await Availability.insertMany(newAvailabilities)
    res.status(200).send({ data });
  } catch (error) {
    res.status(500).send(error);
  }
};
