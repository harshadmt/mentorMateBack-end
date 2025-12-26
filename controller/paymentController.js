const {createPaymentOrder,verifypaymentAndUnlock} = require('../Services/PaymentServices/paymentService');

exports.createOrder = async(req,res,next)=>{
  try{
    const { roadmapId, amount } = req.body;
    const studentId = req.user.id;

    const order = await createPaymentOrder(studentId, roadmapId, amount);

    res.status(200).json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID, 
      },
    });
  } catch (error) {
    console.error("RAZORPAY ORDER CREATE ERROR:", error);
    next(error);
  }
};


exports.verifyAndUnlock = async(req, res, next) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, roadmapId } = req.body;
    const studentId = req.user.id;

    const result = await verifypaymentAndUnlock(
      studentId,
      roadmapId,
      { razorpayOrderId, razorpayPaymentId, razorpaySignature }
    );

    res.status(200).json({
      success: true,
      message: "Roadmap unlocked successfully",
      unlockedRoadmaps: result
    });
    
  } catch (error) {
    console.error("Verification Controller Error:", error);
    next(error);
  }
};