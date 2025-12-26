const Notification = require('../../models/notificationModel');


const createNotification = async({recipient, sender, type, content})=>{
    return await Notification.create({recipient,sender,type,content})
}

const getUserNotifications = async(userId)=>{
    return await Notification.find({recipient:userId}).sort({createdAt: -1 })
}


module.exports = {
    createNotification,getUserNotifications
}