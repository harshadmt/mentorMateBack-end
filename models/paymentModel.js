const mongoose = require('mongoose')

const paymentSchema  = new mongoose.Schema({
    studentId:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    roadmapId:{type:mongoose.Schema.Types.ObjectId,ref:'Roadmap'},
     razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    amount: Number,
    status:{type:String,enum:['created','paid','failed'],default:'created'}
},{timestamps:true});

module.exports = mongoose.model('Payment',paymentSchema)