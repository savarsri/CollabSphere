const express = require('express')
const router = express.Router()

const AuthController = require('../controller/AuthController')
const authenticate = require('../middleware/authenticate')

// Authentication functions routes set-up

router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.post('/uploadProfilePicture', AuthController.uploadProfilePicture)
router.get("/searchUsers",authenticate, AuthController.searchUser);


module.exports = router