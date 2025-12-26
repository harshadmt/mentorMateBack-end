const User = require('../../models/usermodel');
const Roadmap = require('../../models/roadmapModel');
const Payment  = require('../../models/paymentModel')
const mongoose = require('mongoose')
const adminSettings = require('../../models/AdminSettingModel')


const getAllUsersService = async () => {
    const users = await User.find().select('-password');
    if (!users || users.length === 0) {
        const error = new Error('No users found');
        error.statusCode = 404;
        throw error;
    }
    return users;
};

const BlockUserServices = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const error = new Error('Invalid user ID');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findById(userId);

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  user.isBlocked = !user.isBlocked;
  await user.save();

  return {
    message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
    isBlocked: user.isBlocked,
  };
};
//getall roadmaps 

const getAllRoadmapsService = async()=>{
    const roadmaps = await Roadmap.find().populate('createdBy','fullName email').sort({createdAt:-1});
    return roadmaps
}
const getRoadmapsbyIdServices = async(roadmapId)=>{
    const roadmap= await Roadmap.findById(roadmapId).populate('createdBy','fullName email');
    if(!roadmap){
        const error = new Error ('Roadmap is not found');
        error.statusCode = 404;
        throw error;
    }
    return roadmap
};

const getUserByIdService = async (userId) => {
  const user = await User.findById(userId)
    .select("-password") 
    .populate("unlockedRoadmaps", "title description") 
    .populate("createdRoadmaps", "title description"); 

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return user;
};
const getUserDetailsWithPaymentServices = async (userId)=>{
  const user = await User.findById(userId)
  .select('-password')
  .populate("unlockedRoadmaps", "title description price")
  .populate("createdRoadmaps", "title description price");

  if(!user){
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error
  }

  const payment  = await Payment.find({studentId:userId})
  .populate('roadmapId',"title price")
  .sort({ createdAt: -1})

  return{user,payment}
 };
 const getAllTransactionsServices= async () => {
  try {
    const payments = await Payment.find()
      .populate("studentId", "fullName email role") 
      .populate("roadmapId", "title price")   
      .sort({ createdAt: -1 });                     
      

    return payments;
  } catch (error) {
    throw new Error("Error fetching all payments: " + error.message);
  }
};

const  getSettings =  async () => {
    let settings = await adminSettings.findOne();
    if (!settings) {
      settings = await adminSettings.create({});
    }
    return settings;
  }

  const   updateSettings = async (updates) => {
    let settings = await adminSettings.findOne();
    if (!settings) {
      settings = await adminSettings.create(updates);
    } else {
      Object.assign(settings, updates);
      await settings.save();
    }
    return settings;
  }
  const updateAdminProfile =  async (adminId, profileData) => {
    const allowedFields = [
      'fullName',
      'email',
      'bio',
      'profilePicture',
      'skills'
    ];

    const updates = {};
    allowedFields.forEach(field => {
      if (profileData[field] !== undefined) {
        updates[field] = profileData[field];
      }
    });

    const updatedAdmin = await User.findOneAndUpdate(
      { _id: adminId, role: 'admin' },
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    return updatedAdmin;
  }

const getAdminProfile = async (adminId) => {
  
  const admin = await User.findOne({ _id: adminId, role: 'admin' }).select('-password');
  if (!admin) {
    throw new Error('Admin not found or unauthorized');
  }
  return admin;
};
module.exports = {
    getAllUsersService,
    BlockUserServices,
    getAllRoadmapsService,
    getRoadmapsbyIdServices,
    getUserByIdService,
    getUserDetailsWithPaymentServices,
    getAllTransactionsServices,
    getSettings,
    updateSettings,
    updateAdminProfile,
    getAdminProfile,
  
};
