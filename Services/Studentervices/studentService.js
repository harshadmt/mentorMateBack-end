const User  = require('../../models/usermodel');
const Roadmap = require('../../models/roadmapModel');
const videoSession = require('../../models/videoModel');
const mongoose = require('mongoose');
const Message = require('../../models/MessageModel');
const Notification = require('../../models/notificationModel')

const getStudentStats = async(studentId)=>{
    const studentObjectId = new mongoose.Types.ObjectId(studentId);
    
    const student  = await  User.findById(studentObjectId)
    .select('unlockedRoadmaps').lean();


    const purchasedRoadmapsCount = student?.unlockedRoadmaps?.length||0;


    let purchasedMentorCount = 0;


    if(student?.unlockedRoadmaps?.length>0){
        const mentors  = await Roadmap.distinct('createdBy',{
            _id:{$in:student.unlockedRoadmaps}
        });
        purchasedMentorCount= mentors.length;
    }

    const sessionCount = await videoSession.countDocuments({
        student:studentObjectId
    });

    return{
        purchasedMentorCount,
        purchasedRoadmapsCount,
        sessionCount,
    }
} ;


const getLatestMessageForStudent = async (studentId) => {
  let objectId = studentId;
  if (typeof studentId === 'string') {
    objectId = new mongoose.Types.ObjectId(studentId);
  }

  return await Message.findOne({
    $or: [
      { sender: objectId },
      { receiver: objectId }
    ]
  })
    .sort({ createdAt: -1 })
    .populate('sender', 'fullName profilePicture')
    .populate('receiver', 'fullName profilePicture');
};

const getLatestNotificationForStudent = async (studentId)=>{
    let objectId = studentId;
    if(typeof studentId=='string'){
        objectId = new mongoose.Types.objectId(studentId);
    }
    return await Notification.findOne({recipient:objectId})
    .sort({createdAt:-1})
    .populate('sender','fullName profilePicture')
    .populate('recipient','fullName profilePicture');
}
const getUpcomingSessionsForStudent = async (studentId) => {
  const objectId = typeof studentId === 'string'
    ? new mongoose.Types.ObjectId(studentId)
    : studentId;

    console.log(objectId);
  return await videoSession.find({
    student: objectId,
    status: 'scheduled',
    scheduledAt: { $gte: new Date() } 
  })
    .sort({ scheduledAt: 1 }) 
    .populate('mentor', 'fullName email') 
    .select('topic scheduledAt durationMinutes status');
};
module.exports = {getStudentStats,getLatestMessageForStudent,getLatestNotificationForStudent,getUpcomingSessionsForStudent}