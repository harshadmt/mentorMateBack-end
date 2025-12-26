const crypto = require('crypto');
const Payment = require('../../models/paymentModel');
const User = require('../../models/usermodel');
const Roadmap = require('../../models/roadmapModel'); 
const Razorpay = require('razorpay');

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createPaymentOrder = async (studentId, roadmapId, amount) => {
  try {
    const order = await razorpayInstance.orders.create({
      amount: amount * 100, 
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    });

    const payment = new Payment({
      studentId,
      roadmapId,
      razorpayOrderId: order.id,
      amount,
      status: 'created'
    });

    await payment.save();
    return order;

  } catch (error) {
    console.error("RAZORPAY ORDER CREATION ERROR:", error);
    throw new Error("Order creation failed: " + error.message);
  }
};



exports.verifypaymentAndUnlock = async (studentId, roadmapId, {
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature
}) => {
  try {
   
    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      throw new Error("Payment verification failed: Invalid signature");
    }

    
    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId },
      {
        razorpayPaymentId,
        razorpaySignature,
        status: "paid"
      },
      { new: true }
    );

    if (!payment) {
      throw new Error("Payment record not found");
    }

    
    const updatedStudent = await User.findByIdAndUpdate(
      studentId,
      { 
        $addToSet: { unlockedRoadmaps: roadmapId } 
      },
      { new: true }
    ).populate('unlockedRoadmaps');

    if (!updatedStudent) {
      throw new Error("Student not found");
    }

    return updatedStudent.unlockedRoadmaps;

  } catch (error) {
    console.error("🚨 Verification Error:", error);
    throw error; 
  }
};