const VideoSessionService = require('../Services/VideoSessionServices/VideoSession');
const NotificationService = require('../Services/NotifactionServices/notificationservice')
const scheduleSession = async (req, res, next) => {
  try {
    const { mentor, student, topic, scheduledAt } = req.body;

    const session = await VideoSessionService.scheduleSession({ mentor, student, topic, scheduledAt });

    
    const io = req.app.get('io');
    const notification = await NotificationService.createNotification({
      recipient: student,
      sender: mentor,
      type: 'session',
      content: `New session on "${topic}" scheduled.`
    });

    io.to(student.toString()).emit('new-notification', {
      type: 'session',
      content: notification.content,
      createdAt: notification.createdAt
    });

    res.status(201).json({ success: true, data: session });
  } catch (error) {
    next(error);
  }
};

const getSessions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let sessions;
    if (role === 'mentor') {
      sessions = await VideoSessionService.getMentorSessions(userId);
    } else if (role === 'student') {
      sessions = await VideoSessionService.getStudentSessions(userId);
    } else {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    res.json({ success: true, data: sessions });
  } catch (error) {
    next(error);
  }
};

const updateSession = async (req, res, next) => {
  try {
    const sessionId = req.params.id;
    const updates = req.body;
    const updatedSession = await VideoSessionService.updateSessionStatus(sessionId, updates);
    res.json({ success: true, data: updatedSession });
  } catch (error) {
    next(error);
  }
};
const deleteSession = async (req, res, next) => {
  try {
    const sessionId = req.params.id;
    await VideoSessionService.deleteSession(sessionId);
    res.json({ success: true, message: "Session deleted successfully" });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  scheduleSession,
  getSessions,
  updateSession,
  deleteSession
 
};
