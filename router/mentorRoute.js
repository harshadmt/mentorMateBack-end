const express = require('express');
const router = express.Router();
const { getStudentsByMentor, getStudentById,getMentorDashboardStats,getRecentRoadmap } = require('../controller/mentorController');
const protect = require('../middleware/authMiddleware');


router.get('/students', protect, getStudentsByMentor);

router.get('/dashboard/stats',protect,getMentorDashboardStats)
router.get('/student/:studentId', protect, getStudentById);
router.get('/dashboard/recentRoadmaps',protect,getRecentRoadmap)

module.exports = router;
