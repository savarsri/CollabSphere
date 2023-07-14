const express = require('express');
const router = express.Router();

const AssignmentController = require('../controller/AssignmentController');
const { upload } = require('../middleware/upload');

// Assignment functions router set-up 

router.post('/getAssignment', AssignmentController.getAssignment)
router.get('/assignments', AssignmentController.getAllAssignments)
router.post('/updateAssignment', AssignmentController.updateAssignment)
router.post('/deleteAssignment', AssignmentController.deleteAssignment)
router.get('/unSubmitAssignment', AssignmentController.unSubmitAssignment)

module.exports = router 
