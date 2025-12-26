const express = require('express');
const router = express.Router();
const {scheduleSession,getSessions,updateSession,deleteSession} = require('../controller/VideoSessionController');
const protect = require('../middleware/authMiddleware');


router.post('/schedule',protect,scheduleSession);
router.get('/',protect,getSessions);
router.put('/:id',protect,updateSession);
router.delete('/:id', protect, deleteSession);



module.exports = router;