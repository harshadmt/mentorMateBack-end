const mongoose = require('mongoose');
const User = require('../models/usermodel');
const Roadmap = require('../models/roadmapModel');
const mentorService = require('../Services/MentorServices/MentorService');
const {getStudentStats,getLatestMessageForStudent,getLatestNotificationForStudent,getUpcomingSessionsForStudent}=require('../Services/Studentervices/studentService')
exports.getUnlockedRoadmaps = async (req, res, next) => {
  try {
    const student = await User.findById(req.user.id)
      .populate({
        path: 'unlockedRoadmaps',
        populate: {
          path: 'createdBy',
          select: 'fullName',
        },
      });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    res.status(200).json({
      success: true,
      unlocked: student.unlockedRoadmaps,
    });
  } catch (error) {
    console.error('Error fetching unlocked roadmaps:', error);
    next(error);
  }
};

exports.getSingleUnlockedRoadmap = async (req, res, next) => {
  try {
    const roadmapId = req.params.id;
    const student = await User.findById(req.user.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const isUnlocked = student.unlockedRoadmaps.some(
      (roadmap) => roadmap._id.toString() === roadmapId
    );

    if (!isUnlocked) {
      return res.status(403).json({
        success: false,
        message: "You haven't unlocked this roadmap",
      });
    }

    const roadmap = await Roadmap.findById(roadmapId).populate('createdBy', 'fullName');

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: 'Roadmap not found',
      });
    }

    res.status(200).json({
      success: true,
      data: roadmap,
    });
  } catch (error) {
    console.error('Error fetching single roadmap:', error);
    next(error);
  }
};

exports.getMentorsForPurchasedRoadmaps = async (req, res, next) => {
  try {
    const mentors = await mentorService.getMentorsForPurchasedRoadmaps(req.user.id);
    res.status(200).json({
      success: true,
      data: mentors,
    });
  } catch (error) {
    console.error('Error fetching mentors for purchased roadmaps:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMentorDetailsById = async (req, res, next) => {
  try {
    const mentorId = req.params.id;

    
    if (!mongoose.Types.ObjectId.isValid(mentorId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid mentor ID format',
      });
    }

   
    const student = await User.findById(req.user.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

   
    const hasUnlockedRoadmap = await Roadmap.findOne({
      _id: { $in: student.unlockedRoadmaps },
      createdBy: mentorId,
    });

    if (!hasUnlockedRoadmap) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this mentor’s profile',
      });
    }

   
    const mentor = await User.findById(mentorId)
      .select('fullName email profilePicture bio skills')
      .populate({
        path: 'createdRoadmaps',
        select: 'title description price resources steps updatedAt',
        options: { sort: { createdAt: -1 }, strictPopulate: false },
      });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found',
      });
    }

    
    const roadmapsCount = await Roadmap.countDocuments({
      _id: { $in: student.unlockedRoadmaps },
      createdBy: mentorId,
    });

    res.status(200).json({
      success: true,
      data: {
        _id: mentor._id,
        fullName: mentor.fullName,
        email: mentor.email,
        profilePicture: mentor.profilePicture,
        bio: mentor.bio || 'Experienced mentor guiding students to success',
        skills: mentor.skills || [],
        roadmapsCount,
        createdRoadmaps: mentor.createdRoadmaps || [],
      },
    });
  } catch (error) {
    console.error('Error in getMentorDetailsById:', {
      message: error.message,
      stack: error.stack,
      mentorId: req.params.id,
      userId: req.user.id,
    });
    res.status(500).json({
      success: false,
      message: `Error fetching mentor profile: ${error.message}`,
    });
  }
};
exports.getDashboardStats = async(req,res,next)=>{
  try{
    if(!req.user?.id){
      return res.status(403).json({
        success:false,
        message :'Not authorized'
      });
    }

    const stats = await getStudentStats(req.user.id);
    return res.status(200).json({success:true,data:stats})
  }catch(error){
    next(error)
  }
};
exports.getLatestMessages = async(req,res,next)=>{
 try{
    const studentId = req.user.id;  
    const latestMessage = await getLatestMessageForStudent(studentId)
    res.status(200).json({
      success:true,
      data:latestMessage
    })
    }catch(error){
    next(error)
   }
}

exports.getLatestNotification = async (req,res,next)=>{
  try{
     const studentId = req.user.id;
     const LatestNotification = await getLatestNotificationForStudent(studentId);
     res.status(200).json({
      success:true,
      data:LatestNotification
     });
  }catch(error){
    next(error)
  }
};

exports.getStudentUpcomingSessions = async (req,res,next)=>{
  try{
    const studentId = req.user.id;
    const sessions = await getUpcomingSessionsForStudent(studentId);
    res.status(200).json({
      success :true,
      data:sessions
    })
  }catch(error){
    next(error)
  }
}