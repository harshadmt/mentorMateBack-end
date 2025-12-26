const Roadmap = require('../../models/roadmapModel')

exports.createRoadmap= async(data)=>{
  return await Roadmap.create(data)
};

exports.getMentorRoadmaps = async(mentorId)=>{
    return await Roadmap.find({createdBy:mentorId})
};

exports.getRoadmapById = async(id)=>{
    return await Roadmap.findById(id)
}
exports.updateRoadmap = async (id,data)=>{
    return await Roadmap.findByIdAndUpdate(id,data,{new:true})
}
exports.deleteRoadmap = async (id)=>{
    return await Roadmap.findByIdAndDelete(id)
}

exports.getAllRoadmaps = async () => {
  const roadmaps = await Roadmap.find()
    .populate('createdBy', 'fullName profilePicture')
    .select('title description price skills steps resources createdAt updatedAt isPublished');

  return roadmaps;
};

// For students – only published ones
exports.getPublishedRoadmaps = async () => {
  const roadmaps = await Roadmap.find({ isPublished: true })
    .populate('createdBy', 'fullName profilePicture')
    .select('title description price skills steps resources createdAt updatedAt');

  return roadmaps;
};


exports.findRoadmapById = async(roadmapId)=>{
  const roadmap = await Roadmap.findById(roadmapId)
  return roadmap
}