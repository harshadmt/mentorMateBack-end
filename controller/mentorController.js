const mentorService = require('../Services/MentorServices/MentorService');

const getStudentsByMentor = async (req, res, next) => {
  try {
    const mentorId = req.user.id;
    const students = await mentorService.getStudentsWhoPurchasedMentorRoadmaps(mentorId);

    res.status(200).json({
      success: true,
      message: 'Students fetched successfully',
      data: students,
    });
  } catch (error) {
    next(error);
  }
};


const getStudentById = async (req, res, next) => {
  try {
    const mentorId = req.user.id;
    const studentId = req.params.studentId;

    const studentData = await mentorService.getStudentPurchasedById(mentorId, studentId);

    if (!studentData) {
      return res.status(404).json({
        success: false,
        message: 'Student not found or no purchases',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student fetched successfully',
      data: studentData,
    });
  } catch (error) {
    next(error);
  }
};

const getMentorDashboardStats = async (req,res,next)=>{
 try {
    const mentorId = req.user.id; 

    const stats = await mentorService.getDashboardStats(mentorId);

    res.status(200).json({
      success: true,
      message: 'Mentor dashboard stats fetched successfully',
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};


const getRecentRoadmap = async (req, res, next) => {
  try {
    if (!req.user?.mentorId) {
      return res.status(403).json({ success: false, message: "Not authorized as mentor" });
    }

    const limit = parseInt(req.query.limit) || 5;
    const roadmaps = await mentorService.getRecentRoadmaps(req.user.mentorId, limit);

    return res.status(200).json({ success: true, data: roadmaps });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudentsByMentor,
  getStudentById,
  getMentorDashboardStats,
  getRecentRoadmap
};
