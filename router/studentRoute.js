const express = require('express');
const {
  getUnlockedRoadmaps,
  getSingleUnlockedRoadmap,
  getMentorsForPurchasedRoadmaps,
  getMentorDetailsById,
  getDashboardStats,
  getLatestMessages,
  getLatestNotification,
  getStudentUpcomingSessions
} = require('../controller/studentController');
const protect = require('../middleware/authMiddleware');
const roadmap = require('../controller/RoadmapController');

const router = express.Router();

router.get('/my-roadmap', protect, getUnlockedRoadmaps);
router.get('/unlocked-roadmap/:id', protect, getSingleUnlockedRoadmap);
router.get('/mentors', protect, getMentorsForPurchasedRoadmaps);
router.get('/mentor/:id', protect, getMentorDetailsById);
router.get('/getall', protect, roadmap.getAllRoadmaps);
router.get('/dashboard/stats',protect,getDashboardStats);
router.get('/dashboard/latestmessage',protect,getLatestMessages);
router.get('/dashboard/latestnotification',protect,getLatestNotification);
router.get('/dashboard/upcoming',protect,getStudentUpcomingSessions)



module.exports = router;