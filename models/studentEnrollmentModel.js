const mongoose = require('mongoose');


const studentEnrollmentSchema  = new  mongoose.Schema ({
    studentId :{type :mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    mentorId :{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    roadmapId :{type:mongoose.Schema.Types.ObjectId,ref:'Roadmap',required:true},
    status:{type:String,enum:['active','completed','cancelled'],default:'active'}
},{timestamps:true});

module.exports = mongoose.model('StudentEnrollment',studentEnrollmentSchema)