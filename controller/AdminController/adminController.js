const { getAllUsersService, BlockUserServices,getAllRoadmapsService,getUserDetailsWithPaymentServices, getRoadmapsbyIdServices,getUserByIdService,getAllTransactionsServices ,getSettings,updateSettings,updateAdminProfile,getAdminProfile} = require('../../Services/AdminServices/AdminServices');
const Roadmap = require('../../models/roadmapModel');
const Payment = require('../../models/paymentModel');
const User = require('../../models/usermodel');
const videoSession = require('../../models/videoModel')

const getAllUsers = async (req, res, next) => {
    try {
        const users = await getAllUsersService();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};
const  BlockUsers =async (req,res,next)=>{
   try {
    const userId = req.params.id;
    const result = await BlockUserServices(userId);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};


const getAllRoadmaps = async (req, res, next) => {
  try {
    const roadmaps = await getAllRoadmapsService();
    res.status(200).json({ success: true, roadmaps });
  } catch (error) {
    next(error);
  }
};
const getRoadmapById = async(req,res,next)=>{
    try{
        const {id} = req.params;
    const roadmap = await getRoadmapsbyIdServices(id);
    res.status(200).json({success:true,roadmap});
    }catch(error){
        next(error)
    }
};

const deleteRoadmapById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await Roadmap.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Roadmap not found" });
    }

    res.status(200).json({ success: true, message: "Roadmap deleted successfully" });
  } catch (error) {
    next(error);
  }
};
const publishRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.findByIdAndUpdate(
      req.params.id,
      { isPublished: true },
      { new: true }
    );

    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }

    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find()
      .populate('studentId', 'fullName email') 
      .populate('roadmapId', 'title price')          
      .sort({ createdAt: -1 });               

    res.status(200).json({
      success: true,
      count: payments.length,
      payments
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    next(error);
  }
};
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params; 
    const user = await getUserByIdService(id);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};
const getAdminStats = async (req,res)=>{
  try{
    const totalUsers = await User.countDocuments();
    const totalMentors = await User.countDocuments({role:"mentor"});
    const totalStudents = await User.countDocuments({role:'student'});
    const totalRoadmaps = await Roadmap.countDocuments();
    const totalSessions =  await videoSession.countDocuments();

    const payments = await Payment.aggregate([
      {$match:{status:'paid'}},
      {$group :{_id:null,total:{$sum:"$amount"}}}
    ]);
    const totalRevenue = payments.length >0 ?payments[0].total:0;
    res.json({
      totalUsers,
      totalMentors,
      totalStudents,
      totalRoadmaps,
      totalSessions,
      totalRevenue
    });
  }catch(error){
    console.error('Error fetching admin stats:',error);
    res.status(500).json({message:'server error'})
  }
};
const getUserDetailsWithPayments = async (req,res,next)=>{
  try{
    const {id} = req.params ;
    const data  = await getUserDetailsWithPaymentServices(id);


    res.status(200).json({
      success:true,
      data
    });
  }catch(error){
    next(error)
  }
};
const getAlltransactions = async (req, res, next) => {
  try {
    const payments = await getAllTransactionsServices();

    res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    next(error);
  }
};

const getAdminSettings  = async (req,res,next)=>{
  try{
    const settings = await getSettings();
    res.status(200).json({
      success:true,
      data:settings
    })
  }catch(error){
    next(error)
  }
}

const updatedAdminSettings = async (req,res,next)=> {
  try {
    const updates  = req.body;
    const updatedSetting = await updateSettings(updates);
    res.status(200).json({
      success:true,
      message:"setting updated successfully",
      data:updatedSetting
    })
  }catch(error){
    next(error)
  }
}

const updateAdminProfiles = async (req,res,next)=>{
   try {
    const adminId = req.user.id;
    const updatedAdmin = await updateAdminProfile(adminId, req.body);

    if (!updatedAdmin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found or unauthorized'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Admin profile updated successfully',
      data: updatedAdmin
    });
  } catch (error) {
    next(error);
  }
}

const getAdminProfiles = async (req, res, next) => {
  try {
    const adminId = req.user.id; 
    const profile = await getAdminProfile(adminId);
    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getAllUsers,
  BlockUsers,
  getAllRoadmaps,
  getRoadmapById,
  deleteRoadmapById,
  publishRoadmap,
  getAllPayments,
  getUserById,
  getAdminStats,
  getUserDetailsWithPayments,
  getAlltransactions,
  getAdminSettings,
  updatedAdminSettings,
  updateAdminProfiles,
  getAdminProfiles,
};
