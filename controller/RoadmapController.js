
const RoadmapService = require('../Services/RoadmapServices/roadmapService')
const Roadmap =require('../models/roadmapModel')
exports.createRoad = async(req,res)=>{
   try {
    const { title, description, price, resources, steps } = req.body;
    const newRoadmap = await RoadmapService.createRoadmap({
      title,
      description,
      price,
      resources,
      steps,
      createdBy: req.user.id,
    });
    res.status(201).json(newRoadmap);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyRoadmaps = async (req, res) => {
  try {
    const roadmaps = await RoadmapService.getMentorRoadmaps(req.user.id);
    res.json(roadmaps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getRoadmap = async(req,res)=>{
    try{
        const roadmap = await RoadmapService.getRoadmapById(req.params.id);
        res.json(roadmap)
    }catch(err){
        res.status(500).json({message:err.message})
    }
}

exports.updateRoadmap = async(req,res)=>{
    try{
        const roadmap = await RoadmapService.updateRoadmap(req.params.id,req.body);
        res.json(roadmap)
    }catch(err){
        res.status(500).json({message:err.message})
    }
}

exports.deleteRoadmap = async (req,res)=>{
   try{
     await RoadmapService.deleteRoadmap(req.params.id);
    res.json({message:"Roadmap is deleted"})
   }catch(err){
     res.status(500).json({message:err.message})
   }
}

exports.getAllRoadmaps = async (req, res, next) => {
  try {
    const userRole = req.user?.role;

    let roadmaps;

    if (userRole === 'admin' || userRole === 'mentor') {
      roadmaps = await RoadmapService.getAllRoadmaps(); 
    } else {
      roadmaps = await RoadmapService.getPublishedRoadmaps();
    }

    res.status(200).json({
      success: true,
      message: "Roadmaps fetched successfully",
      data: roadmaps,
    });
  } catch (error) {
    next(error);
  }
};



exports.getRoadmapById = async (req, res, next) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id)
      .select('title description price resources steps createdBy')
      .populate('createdBy', 'fullName email profilePicture');

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: 'Roadmap not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Roadmap fetched successfully',
      data: roadmap
    });
  } catch (error) {
    next(error);
  }
};
