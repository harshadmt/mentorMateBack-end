const express = require('express');
const router = express.Router();
const { getAllUsers,BlockUsers,getAllRoadmaps,getRoadmapById,deleteRoadmapById,publishRoadmap,
    getAllPayments,getUserById,getAdminStats,getUserDetailsWithPayments,getAlltransactions,getAdminSettings,updatedAdminSettings,updateAdminProfiles,getAdminProfiles
 } = require('../controller/AdminController/adminController');
const protect = require('../middleware/authMiddleware'); 
const adminOnly = require('./../middleware/Adminmiddleware')


router.get('/users',protect,getAllUsers);
router.patch('/blockuser/:id',protect,BlockUsers);
router.get('/roadmaps',protect,getAllRoadmaps);
router.get('/roadmaps/:id',protect,getRoadmapById);
router.delete('/roadmaps/:id',protect,deleteRoadmapById);
router.patch('/roadmaps/publish/:id',protect,publishRoadmap);
router.patch('/roadmaps/unpublish/:id',protect,publishRoadmap);
router.get('/users/:id',protect,getUserById)
router.get('/payments', protect,adminOnly, getAllPayments);
router.get('/stats',protect,getAdminStats);
router.get("/user/:id/details",protect,getUserDetailsWithPayments )
router.get ('/alltransactions',protect,getAlltransactions);
router.get('/settings',protect,getAdminSettings);
router.put('/settings',protect,updatedAdminSettings);
router.put('/profile',protect,updateAdminProfiles);
router.get('/profile',protect,getAdminProfiles)

module.exports = router;

