const mongoose = require('mongoose')


const videoSessionSchema = new mongoose.Schema({
    mentor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    topic:{
        type:String,
        required:true
    },
    scheduledAt:{
        type:Date,
        required:true
    },
    status:{
        type:String,
        enum:['scheduled','completed','cancelled'],
        default:'scheduled'
    },
    durationMinutes:Number,
    callStartTime:Date,
    callEndTime:Date
},{timestamps:true});


module.exports = mongoose.model('VideoSession',videoSessionSchema)