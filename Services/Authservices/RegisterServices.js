const User = require('../../models/usermodel');
const bcrypt = require('bcryptjs');


const registerUser = async (userData) => {
  // Validate mentor has skills
  if (userData.role === 'mentor') {
    const hasSkills = userData.skills && Array.isArray(userData.skills) && userData.skills.length > 0;
    if (!hasSkills) {
      throw new Error('Mentors must have at least one skill');
    }
  }

  const userExists = await User.findOne({ email: userData.email });
  if (userExists) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  // Ensure skills is an array
  const skills = Array.isArray(userData.skills) ? userData.skills : [];

  const newUser = await User.create({
    fullName: userData.fullName,
    email: userData.email,
    password: hashedPassword,
    role: userData.role,
    bio: userData.bio || '',
    profilePicture: userData.profilePicture || '',
    skills: userData.role === 'mentor' ? skills : [],
  });

  return {
    id: newUser._id,
    fullName: newUser.fullName,
    email: newUser.email,
    role: newUser.role,
  };
};

module.exports = {
  registerUser,
};
