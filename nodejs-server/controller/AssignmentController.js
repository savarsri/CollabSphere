const User = require("../models/User");
const Team = require("../models/Team");
const Assignment = require("../models/Assignment");
const File = require("../models/File");
const fs = require("fs-extra");
// var fs = require('fs');
const path = require("path");

const getAllAssignments = async (req, res) => {
  let uid = req.headers.uid;
  let assignments = await Assignment.find(
    {
      $or: [{ createdBy: uid }, { submittedBy: {$in: uid}  }, { notSubmittedBy: {$in: uid}  }],
    },
    "title dueDate _id"
  ).sort({ dueDate: 1 });
  res.status(200).json(assignments);
};

const getAssignment = (req, res) => {
  let uid = req.headers.uid;
  let assignmentID = req.body.assignmentID;
  User.findById(uid).then((user) => {
    Assignment.findById(assignmentID)
      .populate({ path: "submittedBy", select: "name email avatar _id" })
      .populate({ path: "notSubmittedBy", select: "name email avatar _id" })
      .populate({ path: "files", select: "_id originalname mimetype" })
      .sort({ updatedAt: -1 })
      .then((assignment) => {
        if (assignment.createdBy == uid) {
          res.status(200).json({
            assignment,
            isAdmin: true,
          });
        } else if (assignment.submittedBy.filter(e => e._id == uid).length > 0) {
          var des = path.join(
            __dirname,
            `../files/${assignment.team}/assignments/${assignment._id}/uploads/${req.headers.uid}`
          );
          File.find({destination : des},"_id originalname mimetype").then((files)=>{
            res.status(200).json({
              assignment: {
                _id: assignment._id,
                title: assignment.title,
                description: assignment.description,
                dueDate: assignment.dueDate,
                grade: assignment.grade,
                files: assignment.files,
                submitted: true,
              },
              files,
              isAdmin: false,
            });
          })
        } else {
          res.status(200).json({
            assignment: {
              _id: assignment._id,
              title: assignment.title,
              description: assignment.description,
              dueDate: assignment.dueDate,
              grade: assignment.grade,
              files: assignment.files,
              submitted: false,
            },
            isAdmin: false,
          });
        }
      })
      .catch((error) => {
        res.status(404).json({
          error: "Assignment not found",
        });
      });
  });
};

const createAssignment = (req, res, next) => {
  let uid = req.headers.uid;
  let createdBy = req.headers.uid;
  let teamID = req.body.teamID;
  let assignmentTitle = req.body.title;
  let assignmentDescription = req.body.description;
  let assignmentDueDate = req.body.dueDate;
  let assignmentGrade = req.body.grade;
  let assignmentFiles = res.locals.files;

  User.findById(uid).then((user) => {
    Team.findById(teamID, "id admin members", function (err, docs) {
      if (err) {
        res.status(500).json({
          error: "Error getting teams!",
        });
        return;
      }
      if (!user.teams.includes(docs.id, 0)) {
        return;
      }
      if (!docs.admin.includes(user.id, 0)) {
        return;
      }
      let teamID = docs.id;
      let assignment = new Assignment({
        team: teamID,
        createdBy: createdBy,
        title: assignmentTitle,
        description: assignmentDescription,
        dueDate: assignmentDueDate,
        notSubmittedBy: docs.members,
        grade: assignmentGrade,
        files: assignmentFiles,
      });

      assignment
        .save()
        .then((assignment) => {
          Team.findByIdAndUpdate(teamID, { $push: { assignment: assignment } })
            .then(() => {
              var srcDel = path.join(
                __dirname,
                `../temp/uploads/${req.headers.uploadid}`
              );

              for (let index = 0; index < assignmentFiles.length; index++) {
                var dir = path.join(
                  __dirname,
                  `../files/${teamID}/assignments/${assignment._id}/materials/${assignmentFiles[index].originalname}`
                );
                var des = path.join(
                  __dirname,
                  `../files/${teamID}/assignments/${assignment._id}/materials/`
                );
                fs.move(assignmentFiles[index].path, dir, { overwrite: true });
                File.findByIdAndUpdate(assignmentFiles[index]._id, {
                  $set: { path: dir, destination: des },
                }).then(() => {});
              }
              // fs.rmSync(srcDel, { recursive: true, force: true });
              res.status(200).json({
                code: 200,
                message: "Assignment created",
              });
            })
            .catch((error) => {
              assignment.deleteOne();
              res.status(500).json(error);
            });
        })
        .catch((error) => {
          res.status(500).json(error);
        });
    });
  });
};

const updateAssignment = (req, res) => {
  let uid = req.headers.uid;
  let assignmentId = req.body.assignmentId;
  let assignmentTitle = req.body.title;
  let assignmentDescription = req.body.description;
  let assignmentDueDate = req.body.dueDate;
  let assignmentGrade = req.body.grade;
  User.findById(uid).then((user) => {
    Team.findOne({ code }, "id admin", function (err, docs) {
      if (err) {
        res.status(500).json({
          error: "Error getting teams!",
        });
        return;
      }
      if (!user.teams.includes(docs.id, 0)) {
        return;
      }
      if (!docs.admin.includes(user.id, 0)) {
        return;
      }

      Assignment.findByIdAndUpdate(assignmentId, {
        title: assignmentTitle,
        description: assignmentDescription,
        dueDate: assignmentDueDate,
        grade: assignmentGrade,
      })
        .then((docs) => {})
        .catch((error) => {
          res.status(500).json({
            error: "Error: cannot update assignment",
          });
        });
    });
  });
};

const deleteAssignment = (req, res) => {
  let uid = req.headers.uid;
  let assignmentId = req.body.assignmentId;
  Assignment.findById(
    { _id: assignmentId, createdBy: uid },
    "_id team files"
  ).then((docs) => {
    var srcDel = path.join(
      __dirname,
      `../files/${docs.team}/assignments/${docs._id}`
    );
    Team.findByIdAndUpdate(docs.team, {
      $pull: { assignment: assignmentId },
    }).then(() => {
      File.deleteMany({ _id: { $in: docs.files } }).then(() => {
        fs.rmSync(srcDel, { recursive: true, force: true });
        Assignment.findByIdAndDelete(assignmentId).then(() => {
          res.status(200).json({
            code: 200,
            message: "Assignment deleted",
          });
        });
      });
    });
  });
};

const submitAssignment = (req, res) => {
  let files = res.locals.files;
  Assignment.findByIdAndUpdate(req.body.assignmentID, {
    $push: { submittedBy: req.headers.uid },
    $pull: { notSubmittedBy: req.headers.uid },
  }).then((assignment) => {
    var srcDel = path.join(
      __dirname,
      `../temp/uploads/${req.headers.uploadid}`
    );

    for (let index = 0; index < files.length; index++) {
      var dir = path.join(
        __dirname,
        `../files/${assignment.team}/assignments/${assignment._id}/uploads/${req.headers.uid}/${files[index].originalname}`
      );

      var des = path.join(
        __dirname,
        `../files/${assignment.team}/assignments/${assignment._id}/uploads/${req.headers.uid}`
      );
      fs.move(files[index].path, dir, { overwrite: true });
      File.findByIdAndUpdate(files[index]._id, {
        $set: { path: dir, destination: des },
      }).then(() => {});
    }
    res.status(200).json({
      code: 200,
      message: "Assignment submitted",
    });
    // fs.rmSync(srcDel, { recursive: true, force: true });
  });
};

const unSubmitAssignment = (req, res) => {
  Assignment.findByIdAndUpdate(req.headers.assid, {
    $pull: { submittedBy: req.headers.uid },
    $push: { notSubmittedBy: req.headers.uid },
  }).then((assignment) => {
    var des = path.join(
      __dirname,
      `../files/${assignment.team}/assignments/${assignment._id}/uploads/${req.headers.uid}`
    );
    File.deleteMany({ destination: des }).then(() => {
      fs.rmSync(des, { recursive: true, force: true });
      res.status(200).json({
        code: 200,
        message: "Assignment unsubmitted",
      });
    });
  });
};

const gradeAssignment = (req, res) => {};

// const testUpload = (req, res, next) => {
//   console.log(req.body);
//   console.log("hello");
//   next();
//   // console.log(req.headers);
// };

module.exports = {
  createAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  unSubmitAssignment,
  gradeAssignment,
  getAssignment,
  getAllAssignments,
};
