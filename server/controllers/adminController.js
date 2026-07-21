import Token from '../models/Token.js';
import { getQueueStats } from '../services/queueService.js';
import { emitQueueUpdate } from '../utils/socket.js';

export const getAdminTokens = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'asc' } = req.query;
    const query = {};

    if (status) query.status = status;
    if (search) {
      query.$or = [
        { status: { $regex: search, $options: 'i' } },
        { tokenNumber: Number.isNaN(Number(search)) ? undefined : Number(search) }
      ].filter(Boolean);
    }

    const total = await Token.countDocuments(query);
    const tokens = await Token.find(query)
      .populate('user', 'name email')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const stats = await getQueueStats();
    res.json({ tokens, stats, pagination: { page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) || 1, total } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const callNextToken = async (req, res) => {
  try {
    const nextToken = await Token.findOne({ status: 'Waiting' }).sort({ createdAt: 1 });
    if (!nextToken) {
      return res.status(404).json({ message: 'No waiting token found' });
    }

    nextToken.status = 'Called';
    nextToken.calledAt = new Date();
    await nextToken.save();

    emitQueueUpdate({ type: 'called', token: nextToken });
    res.json({ message: 'Next token called', token: nextToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const skipToken = async (req, res) => {
  try {
    const token = await Token.findById(req.params.id);
    if (!token) {
      return res.status(404).json({ message: 'Token not found' });
    }

    token.status = 'Skipped';
    token.skippedAt = new Date();
    await token.save();

    emitQueueUpdate({ type: 'skipped', token });
    res.json({ message: 'Token skipped', token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const completeToken = async (req, res) => {
  try {
    const token = await Token.findById(req.params.id);
    if (!token) {
      return res.status(404).json({ message: 'Token not found' });
    }

    token.status = 'Completed';
    token.completedAt = new Date();
    await token.save();

    emitQueueUpdate({ type: 'completed', token });
    res.json({ message: 'Token completed', token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetQueue = async (req, res) => {
  try {
    await Token.deleteMany({});
    emitQueueUpdate({ type: 'reset' });
    res.json({ message: 'Queue reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
