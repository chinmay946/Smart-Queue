import Token from '../models/Token.js';
import { emitQueueUpdate } from '../utils/socket.js';

export const bookToken = async (req, res) => {
  try {
    const count = await Token.countDocuments();
    const token = await Token.create({
      user: req.user.id,
      tokenNumber: count + 1,
      status: 'Waiting'
    });

    emitQueueUpdate({ type: 'booked', token });
    res.status(201).json({ message: 'Token booked successfully', token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyTokens = async (req, res) => {
  try {
    const tokens = await Token.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ tokens });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLiveQueue = async (req, res) => {
  try {
    const tokens = await Token.find({ status: { $in: ['Waiting', 'Called'] } }).sort({ createdAt: 1 }).populate('user', 'name email');
    res.json({ tokens });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelToken = async (req, res) => {
  try {
    const token = await Token.findOne({ _id: req.params.id, user: req.user.id });
    if (!token) {
      return res.status(404).json({ message: 'Token not found' });
    }
    if (token.status !== 'Waiting') {
      return res.status(400).json({ message: 'Only waiting tokens can be cancelled' });
    }

    await Token.findByIdAndDelete(req.params.id);
    emitQueueUpdate({ type: 'cancelled', tokenId: req.params.id });
    res.json({ message: 'Token cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
