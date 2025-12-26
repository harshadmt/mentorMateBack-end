const messageService = require('../services/MessageServices/messageServices');
const mongoose = require('mongoose');
const  NotificationService = require('../Services/NotifactionServices/notificationservice')
const Message = require('../models/MessageModel');


const sendMessage = async (req, res, next) => {
  try {
    const sender = req.user.id;
    const { receiver, content } = req.body;

    if (!receiver || !content) {
      return res.status(400).json({
        success: false,
        message: "Receiver ID and content are required"
      });
    }

    const message = await messageService.sendMessage(sender, receiver, content);

   
    const io = req.app.get('io');
    const notification = await NotificationService.createNotification({
      recipient: receiver,
      sender,
      type: 'message',
      content: `New message: ${content.substring(0, 50)}`
    });

    io.to(receiver.toString()).emit('new-notification', {
      type: 'message',
      content: notification.content,
      createdAt: notification.createdAt
    });

    return res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error("Send Message Error:", error);
    next(error);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { receiverId } = req.query;

    if (!receiverId) {
      return res.status(400).json({ 
        success: false, 
        message: "Receiver ID is required (e.g., /api/messages?receiverId=123)" 
      });
    }
    
    if (userId === receiverId) {
      return res.status(400).json({
        success: false,
        message: "Error: Cannot fetch messages between the same user"
      });
    }

    console.log(`🔍 Fetching messages between USER ${userId} and RECEIVER ${receiverId}`);
    
    const messages = await messageService.getMessages(userId, receiverId);
    
   
    
    return res.status(200).json({ 
      success: true, 
      data: messages 
    });
  } catch (error) {
    console.error("❌ Get Messages Error:", error);
    next(error);
  }
};
const getLatestMessage = async (req, res) => {
  try {
    const studentId = req.user.id; 
    

    const latestMessage = await Message.findOne({ receiver: studentId })
      .sort({ createdAt: -1 })
      .populate('sender', 'name email') 
      .lean();

    if (!latestMessage) {
      return res.json(null); 
    }

    res.json({
      from: latestMessage.sender.name || 'Unknown',
      text: latestMessage.content,
      time: latestMessage.createdAt
    });
  } catch (error) {
    console.error('Error fetching latest message:', error);
    res.status(500).json({ message: 'Server error fetching latest message.' });
  }
};
module.exports = {
  sendMessage,
  getMessages,
  getLatestMessage,
  
};