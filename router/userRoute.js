const express = require('express');
const router = express.Router();
const { updateMentorprofile, getLoggedUser, updateStudentProfile, getAllMentorWithSkill, getMentorDetailsById } = require('../controller/userController');
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/profile', protect, getLoggedUser);
router.put('/updateprofile', protect, upload.single('profilePicture'), updateMentorprofile);
router.put('/studentprofile', protect, upload.single('profilePicture'), updateStudentProfile);
router.get('/student/mentor', protect, getAllMentorWithSkill);



module.exports = router;
