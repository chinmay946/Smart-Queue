import Token from '../models/Token.js';

export const getQueueStats = async () => {
  const [total, waiting, called, skipped, completed] = await Promise.all([
    Token.countDocuments(),
    Token.countDocuments({ status: 'Waiting' }),
    Token.countDocuments({ status: 'Called' }),
    Token.countDocuments({ status: 'Skipped' }),
    Token.countDocuments({ status: 'Completed' })
  ]);

  return { total, waiting, called, skipped, completed };
};

export const getNextWaitingToken = async () => {
  return Token.findOne({ status: 'Waiting' }).sort({ createdAt: 1 });
};
