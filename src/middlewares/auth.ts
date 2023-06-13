import jwt from 'jsonwebtoken';
import User from '../models/User';

export const verifyAuth = async (req, res, next) => {
  const token = req.header("Authorization");
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      req.user = user;
      return next();
    } catch (error: any) {
      console.log('VERIFY_AUTH_ERROR', error);
      return res.status(500).send({ message: error.message });
    }
  }
  return res.status(401).send({ message: 'You need to login first' });
};
