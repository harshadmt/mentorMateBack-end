
const userService = require('../Services/UserServices/userService');
const { uploadImageToCloudinary } = require('../Services/UploadServices/uploadService');

const updateMentorprofile = async (req, res) => {
  try {
    const mentorId = req.user.mentorId;

    if (!mentorId) {
      return res.status(403).json({ message: 'Access denied: Not a mentor' });
    }

    const { fullName, bio, skills } = req.body;

    if (!fullName || !bio) {
      return res.status(400).json({ message: 'Full name and bio are required' });
    }

    // Build update object - only include profilePicture if a new file is uploaded
    const updateData = {
      fullName,
      bio,
      skills
    };

    // Handle file upload if present
    if (req.file && req.file.buffer) {
      try {
        updateData.profilePicture = await uploadImageToCloudinary(req.file.buffer, req.file.originalname);
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        // Don't fail the update if image upload fails
      }
    }
    // If no file uploaded, profilePicture is NOT in updateData, so existing picture stays

    const updatedUser = await userService.updateMentorprofile(mentorId, updateData);

    if (!updatedUser) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    res.status(200).json({
      message: 'Mentor profile updated successfully',
      user: updatedUser,
    });
  } catch (err) {
    console.error('Update error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getLoggedUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userService.getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error('Get user error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateStudentProfile = async(req,res,next)=>{
    try{
      const userId = req.user.id;
      const {fullName,bio}=req.body;

      if(!fullName||!bio){
        const error = new Error ("Full name and bio are required");
        error.statusCode = 400;
        throw error; 
      }

      // Build update object - only include profilePicture if a new file is uploaded
      const updateData = {
        fullName,
        bio
      };

      // Handle file upload if present
      if (req.file && req.file.buffer) {
        try {
          updateData.profilePicture = await uploadImageToCloudinary(req.file.buffer, req.file.originalname);
        } catch (uploadError) {
          console.error('Cloudinary upload error:', uploadError);
          // Don't fail the update if image upload fails
        }
      }
      // If no file uploaded, profilePicture is NOT in updateData, so existing picture stays

      const UpdatedStudent = await userService.updateStudentProfile(userId, updateData);
      if(!UpdatedStudent){
        const error = new Error("Student not found")
        throw error
      }
      res.status(200).json({
        success:true,
        message:"student profile updated Successfully",
        user:UpdatedStudent,
      });
    }catch(err){
      next(err)
    }
}
const getAllMentorWithSkill = async (req, res, next) => {
  try {
    const mentors = await userService.getAllMentorSkills();
    res.status(200).json({
      success: true,
      message: 'Mentors fetched successfully',
      data: mentors
    });
  } catch (error) {
    next(error);
  }
};




module.exports = { updateMentorprofile, getLoggedUser,updateStudentProfile,getAllMentorWithSkill};
