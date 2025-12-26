const express = require('express');
const {handleChat}  = require('../controller/chatbotController');
const router = express.Router();



router.post('/',handleChat);

module.exports  = router;