const User = require('../../models/usermodel');
const Roadmap = require('../../models/roadmapModel');
const Payment = require('../../models/paymentModel');
const videoSession =require ('../../models/videoModel');
const StudentEnrollment = require('../../models/studentEnrollmentModel');
const mongoose = require('mongoose')


const mentorService = {
  getMentorsForPurchasedRoadmaps: async (studentId) => {
    try {
      const student = await User.findById(studentId)
        .populate({
          path: 'unlockedRoadmaps',
          populate: {
            path: 'createdBy',
            select: 'fullName email profilePicture bio',
            match: { role: 'mentor' },
          },
        });

      if (!student) {
        throw new Error('Student not found');
      }

      const mentors = [];
      const mentorIds = new Set();

      for (const roadmap of student.unlockedRoadmaps) {
        if (roadmap.createdBy && !mentorIds.has(roadmap.createdBy._id.toString())) {
          const roadmapsCount = student.unlockedRoadmaps.filter(
            (r) => r.createdBy && r.createdBy._id.toString() === roadmap.createdBy._id.toString()
          ).length;

          mentors.push({
            _id: roadmap.createdBy._id,
            fullName: roadmap.createdBy.fullName,
            email: roadmap.createdBy.email,
            profilePicture: roadmap.createdBy.profilePicture,
            bio: roadmap.createdBy.bio || 'Experienced mentor guiding students to success',
            roadmapsCount,
          });

          mentorIds.add(roadmap.createdBy._id.toString());
        }
      }

      return mentors;
    } catch (error) {
      throw new Error(`Error fetching mentors: ${error.message}`);
    }
  },

  getStudentsWhoPurchasedMentorRoadmaps: async (mentorId) => {
    try {
      // Get all roadmaps created by this mentor
      const mentorRoadmaps = await Roadmap.find({ createdBy: mentorId }).select('_id title');
      const roadmapIds = mentorRoadmaps.map(roadmap => roadmap._id);

      if (roadmapIds.length === 0) return [];
      const payments = await Payment.find({
        roadmapId: { $in: roadmapIds },
        status: 'paid',
      }).populate({
        path: 'studentId',
        select: 'fullName email profilePicture'
      }).populate({
        path: 'roadmapId',
        select: 'title'
      });

      const studentMap = new Map();

      payments.forEach((payment) => {
        const student = payment.studentId;
        const roadmap = payment.roadmapId;
        
        if (!studentMap.has(student._id.toString())) {
          studentMap.set(student._id.toString(), {
            id: student._id,
            fullName: student.fullName,
            email: student.email,
            profilePicture: student.profilePicture,
            purchasedRoadmaps: [{
              roadmapId: roadmap._id,
              title: roadmap.title
            }]
          });
        } else {
          const existingStudent = studentMap.get(student._id.toString());
          existingStudent.purchasedRoadmaps.push({
            roadmapId: roadmap._id,
            title: roadmap.title
          });
        }
      });

      return Array.from(studentMap.values());
    } catch (error) {
      throw new Error(`Error fetching students: ${error.message}`);
    }
  },

  getStudentPurchasedById: async (mentorId, studentId) => {
    try {
      const mentorRoadmaps = await Roadmap.find({ createdBy: mentorId }).select('_id title');
      const roadmapIds = mentorRoadmaps.map(r => r._id);

      if (roadmapIds.length === 0) return null;

      const payments = await Payment.find({
        roadmapId: { $in: roadmapIds },
        studentId,
        status: 'paid',
      }).populate('roadmapId', 'title');

      if (!payments || payments.length === 0) return null;

      const student = await User.findById(studentId)
        .select('fullName email profilePicture bio');
      if (!student) return null;

      const purchasedRoadmaps = payments.map(payment => ({
        roadmapId: payment.roadmapId._id,
        title: payment.roadmapId.title,
        purchaseDate: payment.createdAt
      }));

      return {
        _id: student._id,
        fullName: student.fullName,
        email: student.email,
        profilePicture: student.profilePicture,
        bio: student.bio || 'Aspiring learner',
        purchasedRoadmaps,
        totalPurchases: purchasedRoadmaps.length
      };
    } catch (error) {
      throw new Error(`Error fetching student: ${error.message}`);
    }
  },

getDashboardStats: async (mentorId) => {
  const totalRoadmaps = await Roadmap.countDocuments({ createdBy: mentorId });

  const activeStudents = await videoSession.distinct('student', {
    mentor: mentorId,
    status: 'completed',
  });


  const totalSessions = await videoSession.countDocuments({
    mentor: mentorId,
  });

 
  const roadmapIds = await Roadmap.distinct('_id', { createdBy: mentorId });

  const unlockedRoadmapStudents = await User.countDocuments({
    role: 'student',
    unlockedRoadmaps: { $in: roadmapIds },
  });

  return {
    totalRoadmaps,
    activeStudents: activeStudents.length,
    unlockedRoadmapStudents,
    totalSessions,
  };
},

getRecentRoadmaps: async (mentorId, limit = 5) => {
  const mentorObjectId = new mongoose.Types.ObjectId(mentorId);
  return await Roadmap.find({
    createdBy: mentorObjectId
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select("title createdAt");
}
};

module.exports = mentorService;