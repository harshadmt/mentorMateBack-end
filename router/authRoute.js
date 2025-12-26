const express = require('express')
const router  = express.Router()
const {login,register, logOut}= require('../controller/authController')
const upload = require('../middleware/uploadMiddleware');

router.post('/register', upload.single('profilePicture'), register)
router.post('/login',login)
router.post('/logout',logOut)

module.exports = router