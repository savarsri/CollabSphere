const Team = require("../models/Team");
const Post = require("../models/Post");
const User = require("../models/User");
const Assignment = require("../models/Assignment");
const File = require("../models/File");
const { application } = require("express");
const filess = require("../middleware/upload");
const fs = require("fs-extra");
const path = require("path");

const getTeams = async (req, res) => {
  let uid = req.headers.uid;
  let userTeamsID = [];

  // Find list of objectID's of teams the user is in

  await User.findById(uid)
    .then((user) => {
      userTeamsID = user?.teams;
    })
    .catch((error) => {
      console.log(error);
    });

  // Fetchs and sends Team details (name,code,channels)

  Team.find(
    {
      _id: {
        $in: userTeamsID,
      },
    },
    "name code _id",
    function (err, docs) {
      if (err) {
        res.status(500).json({
          error: "Error getting teams!",
        });
        return;
      }
      res.status(200).json(docs);
    }
  );
};

function makeid(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

const createTeams = (req, res) => {
  let uid = req.headers.uid;
  code = makeid(6);

  let team = new Team({
    name: req.body.name,
    createdBy: uid,
    admin: uid,
    code: code,
  });
  team
    .save()
    .then((team) => {
      filess.mkdirectory(team.id);
      User.findByIdAndUpdate(uid, { $push: { teams: team } })
        .then((data) => {
          // Do something with data
          res.status(200).json({
            code: 200,
            message: "Team created successfully!",
          });
        })
        .catch((error) => {
          // Error handling
          res.status(500).json(error);
          team.deleteOne();
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        code: 500,
        error,
        message: "error occured",
      });
      delete team;
    });
};

const joinTeam = (req, res) => {
  let uid = req.headers.uid;
  let code = req.body.code;
  Team.findOneAndUpdate({ code }, { $push: { members: uid } })
    .then((team) => {
      User.findByIdAndUpdate(uid, { $push: { teams: team } })
        .then((data) => {
          res.status(200).json({
            code: 200,
            message: "Team Joined",
          });
        })
        .catch((error) => {
          res.status(500).json({
            error,
          });
        });
    })
    .catch((error) => {
      res.status(500).json({
        error,
      });
    });
};

const addmember = (req, res) => {
  let uid = req.headers.uid;
  let teamID = req.body.teamID;
  let member = req.body.member;

  Team.findOneAndUpdate(
    { _id: teamID, admin: uid },
    { $push: { members: member } }
  )
    .then((team) => {
      if (team == null) {
        res.status(200).json({
          error: "Team not found",
        });
        return;
      }
      User.updateMany(
        { _id: { $in: member } },
        { $push: { teams: team._id } },
        function (err, docs) {
          if (err) {
            res.status(500).json(err);
          } else {
            res.status(200).json({
              code: 200,
            });
          }
        }
      );
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error,
      });
    });
};

const removeMember = (req, res) => {
  let uid = req.headers.uid;
  let teamID = req.body.teamID;
  let member = req.body.member;

  Team.findOneAndUpdate(
    { _id: teamID, admin: uid },
    { $pull: { members: { $in: member } } }
  )
    .then((team) => {
      if (team == null) {
        res.status(500).json({
          error: "Team not found",
        });
        return;
      }
      User.updateMany(
        { _id: { $in: member } },
        { $pull: { teams: team._id } },
        function (err, docs) {
          if (err) {
            res.status(500).json(err);
          } else {
            res.status(200).json({
              code: 200,
            });
          }
        }
      );
    })
    .catch((error) => {
      res.status(500).json({
        error,
      });
    });
};

const getTeamDetails = (req, res) => {
  let uid = req.headers.uid;
  let teamID = req.body.teamID;
  let isAdmin = false;
  User.findById(uid).then((user) => {
    Team.findById(teamID)
      .then((team) => {
        if (team?.admin.includes(user.id, 0)) {
          isAdmin = true;
        }
        res.status(200).json({
          name: team.name,
          code: team.code,
          id: team.id,
          isAdmin,
        });
      })
      .catch((error) => {
        res.status(500).json({ error });
      });

    // Team.findById(teamID, "name code admin members id", function (err, docs) {
    //   if (err) {
    //     res.status(500).json({
    //       error: "Error getting teams!",
    //     });
    //     return;
    //   }
    //   if (!user.teams.includes(docs.id, 0)) {
    //     return;
    //   }
    //   if (
    //     !(docs.admin.includes(user.id, 0) || docs.members.includes(user.id, 0))
    //   ) {
    //     return;
    //   }
    //   res.status(200).json(docs);
    // });
  });
};

const getTeamPosts = (req, res) => {
  let uid = req.headers.uid;
  let teamID = req.body.teamID;
  let isAdmin = false;

  User.findById(uid).then((user) => {
    Team.findById(teamID, "id admin posts", async function (err, docs) {
      if (err) {
        res.status(500).json({
          error: "Error getting teams!",
        });
        return;
      }
      if (docs?.admin.includes(user.id, 0)) {
        isAdmin = true;
      }
      let posts = docs?.posts;
      if (posts == []) {
        res.status(200).json({
          posts: [],
        });
      } else {
        let teamPosts = await Post.find(
          {
            _id: {
              $in: posts,
            },
          },
          "content createdBy _id"
        )
          .populate({ path: "createdBy", select: "name email _id" })
          .populate({ path: "files", select: "_id originalname mimetype" })
          .sort({ updatedAt: -1 });

        res.status(200).json({ teamPosts, isAdmin });
      }
    });
  });
};

const getTeamAssignments = (req, res) => {
  let uid = req.headers.uid;
  let teamID = req.body.teamID;
  let isAdmin = false;

  User.findById(uid).then((user) => {
    Team.findById(
      teamID,
      "id admin members assignment",
      async function (err, docs) {
        if (err) {
          res.status(500).json({
            error: "Error getting teams!",
          });
          return;
        }
        if (docs?.admin.includes(user.id, 0)) {
          isAdmin = true;
        }
        let assignments = docs?.assignment;
        if (assignments == []) {
          res.status(200).json({
            assignments: [],
          });
        } else {
          let teamAssignments = await Assignment.find(
            {
              _id: {
                $in: assignments,
              },
            },
            "title dueDate _id"
          ).sort({ dueDate: 1 });

          res.status(200).json({
            teamAssignments,
            isAdmin,
          });
        }
      }
    );
  });
};

const getTeamMembers = async (req, res) => {
  let uid = req.headers.uid;
  let teamID = req.body.teamID;
  let isAdmin = false;

  Team.findById(teamID, "admin").then((team) => {
    if (team.admin.includes(uid)) {
      isAdmin = true;
    }
  });

  User.findById(uid).then(async (user) => {
    let teamMembers = await Team.findById(teamID, "admin members -_id")
      .populate({ path: "admin", select: "name email _id" })
      .populate({ path: "members", select: "name email _id" });
    if (teamMembers.admin.includes(user._id, 0)) {
      res.status(200).json({ teamMembers, isAdmin });
    } else {
      res.status(200).json({ teamMembers, isAdmin });
    }
  });
};

const getTeamFiles = async (req, res) => {
  let uid = req.headers.uid;
  let teamID = req.headers.teamid;
  let files = await Team.find(
    { _id: teamID, $or: [{ admin: uid }, { members: {$in: uid}  }], },
    "_id files"
  )
    .populate({ path: "files", select: "_id originalname mimetype" })
    .sort({ createdAt: 1 });


  res.status(200).json(files);
};

const uploadFiles = (req, res) => {
  let teamID = req.body.teamID;
  let files = res.locals.files;
  Team.findByIdAndUpdate(teamID, { $push: { files: files } })
    .then((data) => {
      for (let index = 0; index < files.length; index++) {
        var dir = path.join(
          __dirname,
          `../files/${teamID}/files/${files[index].originalname}`
        );
        var des = path.join(__dirname, `../files/${teamID}/files/`);
        fs.move(files[index].path, dir, { overwrite: true });
        File.findByIdAndUpdate(files[index]._id, {
          $set: { path: dir, destination: des },
        }).then(() => {});
      }
      res.status(200).json({
        code: 200,
        message: "Post Created",
      });
    })
    .catch((error) => {
      console.log(error)
      res.status(500).json({
        error,
      });
    });
};

const deleteFile = (req, res) => {
  let teamID = req.headers.teamid;
  let fileID = req.headers.fileid;
  Team.findByIdAndUpdate(teamID,{files:{$pull : fileID}}).then((team)=>{
    File.findById(fileID, "path").then((file) => {
      fs.unlink(file.path, (err) => {
        if (err) throw err;
      });
      File.findByIdAndDelete(fileID).then(() => {
        res.status(200).json({
          code: 200,
          message: "File deleted!",
        });
      });
    });
  })
};

module.exports = {
  getTeams,
  joinTeam,
  createTeams,
  getTeamDetails,
  getTeamPosts,
  getTeamAssignments,
  getTeamFiles,
  getTeamMembers,
  addmember,
  removeMember,
  uploadFiles,
  deleteFile
};
