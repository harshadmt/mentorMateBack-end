const adminSettingsServices = require('../Services/AdminServices/AdminServices');

const maintenanceMiddleware = async (req, res, next) => {
  try {
    const settings = await adminSettingsServices.getSettings();
    if (settings.maintenanceMode) {
      return res.status(503).json({
        success: false,
        message: 'The system is currently under maintenance. Please try again later.'
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = maintenanceMiddleware