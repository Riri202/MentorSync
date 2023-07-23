import { Request, Response } from 'express';
import User from '../models/User';
import Review from '../models/User';

export const getAllAdmins = () => console.log('Get admins');

export const updateUserRole = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;
  if (!role || !id)
    return res.status(400).send({ message: 'user id and role is required' });

  try {
    const user = await User.findOneAndUpdate(
      { _id: id },
      { $set: { role } },
      { new: true }
    ).exec();
    if (user) {
      const data = {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        address: user.address,
        bio: user.bio,
        occupation: user.occupation,
        expertise: user.expertise,
        role: user.role,
      };
      return res
        .status(200)
        .send({ message: 'user role updated successfully', data });
    }
    return res.status(404).send({message: 'User not found'})
  } catch (error: any) {
    console.log('UPDATE_USER_ROLE_ERROR', error);
    return res.status(500).send({ message: error.message });
  }
};

export const deleteSessionReview = async (req, res) => {
  const { reviewId } = req.params;
  try {
    await Review.deleteOne({ _id: reviewId });
    return res.status(200).send({ message: 'Review successfully deleted' });
  } catch (error: any) {
    res.status(500).send({ message: error.message });
  }
};
