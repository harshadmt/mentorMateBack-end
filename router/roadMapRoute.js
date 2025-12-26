const express = require('express')
const protect = require('../middleware/authMiddleware')
const router  = express.Router()
const roadmapController = require('../controller/RoadmapController')

router.post('/',protect,roadmapController.createRoad);
router.get('/myroadmaps',protect,roadmapController.getMyRoadmaps);
router.get('/:id',protect,roadmapController.getRoadmap);
router.put('/:id',protect,roadmapController.updateRoadmap);
router.delete('/:id',protect,roadmapController.deleteRoadmap)
router.get('/:id',protect,roadmapController.getRoadmapById)



module.exports = router;