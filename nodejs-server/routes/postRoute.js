const express = require('express');
const router = express.Router();

const PostController = require('../controller/PostController')

// Assignment functions router set-up 

// router.post('/createPost', PostController.createPost)
router.post('/updatePost', PostController.updatePost)
router.post('/deletePost', PostController.deletePost)

module.exports = router 
