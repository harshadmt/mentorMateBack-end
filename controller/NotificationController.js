const NotificationService = require('../Services/NotifactionServices/notificationservice');


const getNotifications = async(req,res,next)=>{
    try{
        const notifications = await NotificationService.getUserNotifications(req.user.id);
        res.json({sucess:true,data:notifications})
    }catch(error){
        next(error)
    }
}

module.exports = {
    getNotifications
}