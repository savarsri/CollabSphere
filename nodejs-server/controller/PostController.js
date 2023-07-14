const User = require("../models/User");
const Team = require("../models/Team");
const Post = require("../models/Post");
const File = require("../models/File");
const fs = require("fs-extra");
const path = require("path");

const createPost = (req, res) => {
  let uid = req.headers.uid;
  let teamID = req.body.teamID;
  let content = req.body.content;
  let files = res.locals.files;

  let post = new Post({
    content: content,
    createdBy: uid,
    team: teamID,
    files: files,
  });

  post
    .save()
    .then((post) => {
      Team.findByIdAndUpdate(teamID, { $push: { posts: post } })
        .then((data) => {
          for (let index = 0; index < files.length; index++) {
            var dir = path.join(
              __dirname,
              `../files/${teamID}/posts/${post._id}/${files[index].originalname}`
            );
            var des = path.join(
              __dirname,
              `../files/${teamID}/posts/${post._id}/`
            );
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
          res.status(500).json({
            error,
          });
        });
    })
    .catch((error) => {
      res.json({
        error,
      });
    });
};

const updatePost = (req, res) => {
  Post.findByIdAndUpdate(req.body.postID, {
    content: req.body.content,
    attachments: req.body.attachments,
  })
    .then((post) => {
      res.status(200).json({
        message: "Post updated",
      });
    })
    .catch((error) => {
      res.status(500).json({
        error,
      });
    });
};

const deletePost = async (req, res) => {
  let uid = req.headers.uid;
  let postID = req.body.postID;
  await Post.findById(postID, "team")
    .then((post) => {
      Team.findById(post.team, "admin")
        .then((team) => {
          if (team.admin.includes(uid, 0)) {
            var srcDel = path.join(
              __dirname,
              `../files/${team._id}/posts/${post._id}`
            );
            File.deleteMany({ _id: { $in: post.files } }).then(()=>{});
            fs.rmSync(srcDel, { recursive: true, force: true });
            Post.findOne({
              _id: postID,
            })
              .remove()
              .exec()
              .then(() => {
                res.status(200).json({
                  code: 200,
                  message: "Deleted Post",
                });
                return;
              })
              .catch((error) => {
                res.status(500).json({
                  error,
                });
                return;
              });
          } else {
            var srcDel = path.join(
              __dirname,
              `../files/${team._id}/posts/${post._id}`
            );
            File.deleteMany({ _id: { $in: post.files } });
            fs.rmSync(srcDel, { recursive: true, force: true });
            Post.findOne({
              _id: postID,
              createdBy: uid,
            })
              .remove()
              .exec()
              .then(() => {
                res.status(200).json({
                  code: 200,
                  message: "Deleted Post",
                });
                return;
              })
              .catch((error) => {
                res.status(500).json({
                  error,
                });
                return;
              });
          }
        })
        .catch((error) => {
          res.status(500).json(error);
          return;
        });
    })
    .catch((error) => {
      res.status(500).json(error);
      return;
    });
};

module.exports = { createPost, updatePost, deletePost };
