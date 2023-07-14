const express = require('express')
const router = express.Router()

const ChatController = require('../controller/ChatController');

router.get('/chat', ChatController.getChats);
router.post('/chats', ChatController.getChat);
// router.post('/createGroup', ChatController.createGroup);
// router.patch('/renameGroup', ChatController.renameGroup);
// router.patch('/removeFromGroup', ChatController.removeFromGroup);
// router.patch('/addUserToGroup', ChatController.addUserToGroup);

module.exports = router