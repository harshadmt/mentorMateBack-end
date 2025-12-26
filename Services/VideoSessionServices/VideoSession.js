const VideoSession = require('../../models/videoModel');

const scheduleSession = async (data) => {
  return await VideoSession.create(data);
};

const getMentorSessions = async (mentorId) => {
  return await VideoSession.find({ mentor: mentorId }).populate('student');
};

const getStudentSessions = async (studentId) => {
  return await VideoSession.find({ student: studentId }).populate('mentor');
};

const updateSessionStatus = async (sessionId, updates) => {
  return await VideoSession.findByIdAndUpdate(sessionId, updates, { new: true });
};
const deleteSession = async (sessionId) => {
  return await VideoSession.findByIdAndDelete(sessionId);
};


const markSessionStart = async (sessionId) => {
  return await VideoSession.findByIdAndUpdate(sessionId, {
    callStartTime: new Date(),
    status: 'ongoing'
  }, { new: true });
};

const markSessionEnd = async (sessionId) => {
  const session = await VideoSession.findById(sessionId);
  const callEndTime = new Date();
  const duration = Math.round((callEndTime - session.callStartTime) / 60000);
  session.callEndTime = callEndTime;
  session.status = 'completed';
  session.durationMinutes = duration;
  return await session.save();
};

module.exports = {
  scheduleSession,
  getMentorSessions,
  getStudentSessions,
  updateSessionStatus,
  deleteSession,
  markSessionStart,
  markSessionEnd,
 
};
