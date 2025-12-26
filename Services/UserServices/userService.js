
const User = require('../../models/usermodel');

const updateMentorprofile = async (mentorId, updateData) => {
  try {
    // Build the set object dynamically - only include fields that are provided
    const setObj = {
      fullName: updateData.fullName,
      bio: updateData.bio,
      skills: updateData.skills,
    };
    
    // Only include profilePicture if it was provided (new file uploaded)
    if (updateData.profilePicture !== undefined) {
      setObj.profilePicture = updateData.profilePicture;
    }

    const updatedUser = await User.findByIdAndUpdate(
      mentorId,
      {
        $set: setObj,
      },
      { new: true }
    ).select('-password');

    return updatedUser;
  } catch (err) {
    throw new Error('Failed to update mentor profile');
  }
};

const getUserById = async (id) => {
  return await User.findById(id).select('-password');
};
const updateStudentProfile = async(studentId, updateData)=>{
  // Build the set object dynamically - only include fields that are provided
  const setObj = {
    fullName: updateData.fullName,
    bio: updateData.bio,
  };
  
  // Only include profilePicture if it was provided (new file uploaded)
  if (updateData.profilePicture !== undefined) {
    setObj.profilePicture = updateData.profilePicture;
  }

  const UpdatedStudent = await User.findByIdAndUpdate(
    studentId,
    {
      $set: setObj,
    },
    {new: true}
  ).select("-password");
  return UpdatedStudent;
}
const getAllMentorSkills = async () => {
  const mentors = await User.find({ role: 'mentor' }).select('fullName bio profilePicture skills');
  return mentors;
};
const getMentorById = async (mentorId) => {
  const mentor = await User.findOne({ _id: mentorId, role: "mentor" })
    .select('fullName bio profilePicture skills');
  return mentor;
};

module.exports = { updateMentorprofile, getUserById,updateStudentProfile,getAllMentorSkills,getMentorById };
