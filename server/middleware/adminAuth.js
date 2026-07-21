import auth from './auth.js';

const adminAuth = (req, res, next) => {
  auth(req, res, () => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  });
};

export default adminAuth;
