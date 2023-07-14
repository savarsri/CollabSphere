const express = require('express');
const router = express.Router();

const TeamsController = require('../controller/TeamsController')

// Teams functions router set-up 

router.post('/getTeams', TeamsController.getTeams)
router.post("/createTeams" , TeamsController.createTeams)
router.post('/joinTeam' , TeamsController.joinTeam)
router.post('/addMember' , TeamsController.addmember)
router.post('/removeMember' , TeamsController.removeMember)
router.post('/teamDetails' , TeamsController.getTeamDetails)
router.post('/teamPosts' , TeamsController.getTeamPosts)
router.get('/teamFiles' , TeamsController.getTeamFiles)
router.post('/teamAssignments' , TeamsController.getTeamAssignments)
router.post('/teamMembers' , TeamsController.getTeamMembers)

module.exports = router 
