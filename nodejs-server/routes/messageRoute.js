const express = require('express')
const router = express.Router()

const MessageController = require('../controller/MessageController');

router.post("/chatId", MessageController.allMessages);
router.post('/', MessageController.sendMessage);

module.exports = router