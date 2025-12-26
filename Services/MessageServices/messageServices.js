const Message = require('../../models/MessageModel');
const mongoose = require('mongoose');

const sendMessage = async (sender, receiver, content) => {
  if (!sender || !receiver || !content) {
    throw new Error("Sender, receiver, and content are required");
  }

  const message = new Message({ 
    sender: new mongoose.Types.ObjectId(sender),
    receiver: new mongoose.Types.ObjectId(receiver),
    content 
  });
  
  await message.save();
  return await Message.populate(message, { 
    path: 'sender receiver', 
    select: 'name email' 
  });
};

const getMessages = async (userId, receiverId) => {
  try {
    // Debug: Log raw IDs before conversion
    console.log("Raw IDs - User:", userId, "| Receiver:", receiverId);

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: receiverId },
        { sender: receiverId, receiver: userId }
      ]
    })
    .sort({ createdAt: 1 })
    .populate('sender receiver', 'name email');

    // Debug: Log the exact MongoDB query
    console.log("MongoDB Query:", {
      $or: [
        { sender: userId, receiver: receiverId },
        { sender: receiverId, receiver: userId }
      ]
    });

    return messages;
  } catch (error) {
    console.error('💥 Database Error:', error);
    throw error;
  }
};

module.exports = {
  sendMessage,
  getMessages
};