const { registerUser } = require('../Services/Authservices/RegisterServices');
const { loginUser } = require('../Services/Authservices/LoginServices');
const { uploadImageToCloudinary } = require('../Services/UploadServices/uploadService');

exports.register = async (req, res) => {
  try {
    // Parse skills if it's a JSON string (from FormData)
    if (typeof req.body.skills === 'string' && req.body.skills) {
      try {
        req.body.skills = JSON.parse(req.body.skills);
      } catch (parseError) {
        req.body.skills = [];
      }
    }

    // Handle file upload if present
    if (req.file && req.file.buffer) {
      try {
        console.log('📄 File received:', { name: req.file.originalname, size: req.file.buffer.length });
        const profilePictureUrl = await uploadImageToCloudinary(req.file.buffer, req.file.originalname);
        console.log('✅ Profile picture URL set:', profilePictureUrl);
        req.body.profilePicture = profilePictureUrl;
      } catch (uploadError) {
        console.error('❌ Upload failed:', uploadError.message);
        // Don't fail signup if image upload fails - user can update later
        req.body.profilePicture = '';
      }
    } else {
      // No file provided - set empty string
      console.log('⚠️ No file in request');
      req.body.profilePicture = '';
    }

    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: error.message });
  }
};
exports.login = async (req, res) => {
  try {
    const { token, user } = await loginUser(req.body);

    res.cookie('token', token, {
      httpOnly: true,
      secure: false, 
      
      sameSite: 'Strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ message: 'Login successful', token, user });
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ message: err.message });
  }
};


exports.logOut  =async(req,res)=>{
    try{
      res.clearCookie('token',{
        httpOnly:true,
        secure:false,
        sameSite:'strict'
      });
      res.status(200).json({message:"LogOut Successfully"})
    }catch(err){
      console.log(err);
      return res.status(500).json({success:false,message:"internal server is error"})
      
    }
}