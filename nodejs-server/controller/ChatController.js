const Chat = require("../models/chat");
const User = require("../models/User");

// const codes =require("http-status-codes");
// const StatusCodes = codes.StatusCodes;


const getChat = async (req, res) => {
  let userId  = req.body.userId;

  console.log(userId);

  if (!userId) {
    return res.send("No User Exists!");
  }

  let chat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.headers.uid } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate({path: "users", select: "name email _id"})
    .populate("latestMessage");

  chat = await User.populate(chat, {
    path: "latestMessage.sender",
    select: "avatar email name _id",
  });

  if (chat.length > 0) {
    res.send(chat[0]);
  } else {
    const createChat = await Chat.create({
      chatName: "sender",
      isGroupChat: false,
      users: [req.headers.uid, userId],
    });

    const fullChat = await Chat.findOne({ _id: createChat._id }).populate(
      { path: "users", select: "name email _id" }
    );

    res.status(200).json(fullChat);
  }
};

const getChats = async (req, res) => {
  const chat = await Chat.find({ users: { $elemMatch: { $eq: req.headers.uid } } })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 });

  const user = await User.populate(chat, {
    path: "latestMessage.sender",
    select: "avatar email name _id",
  });

  res.status(200).json(user);
};

// const createGroup = async (req, res) => {
//   if (!req.body.users || !req.body.name) {
//     return res.status(400).send({ message: "Please Fill all the feilds" });
//   }

//   var users = JSON.parse(req.body.users);

//   if (users.length < 2) {
//     return res
//       .status(400)
//       .send("More than 2 users are required to form a group chat");
//   }

//   users.push(req.user.id);

//   const groupChat = await Chat.create({
//     chatName: req.body.name,
//     users: users,
//     isGroupChat: true,
//     groupAdmin: req.user.id,
//   });

//   const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
//     .populate("users", "-password")
//     .populate("groupAdmin", "-password");

//   res.status(200).json(fullGroupChat);
// };

// const renameGroup = async (req, res) => {
//   const { chatId, chatName } = req.body;

//   const updateChat = await Chat.findByIdAndUpdate(
//     chatId,
//     {
//       chatName: chatName,
//     },
//     {
//       new: true,
//     }
//   )
//     .populate("users", "-password")
//     .populate("groupAdmin", "-password");

//   if (!updateChat) {
//     throw new BadRequestError("Chat Not Found");
//   } else {
//     res.json(updateChat);
//   }
// };

// const addUserToGroup = async (req, res) => {
//   const { chatId, userId } = req.body;

//   const addUser = await Chat.findByIdAndUpdate(
//     chatId,
//     {
//       $push: { users: userId },
//     },
//     {
//       new: true,
//     }
//   )
//     .populate("users", "-password")
//     .populate("groupAdmin", "-password");

//   if (!addUser) {
//     throw new BadRequestError("Chat Not Found");
//   } else {
//     res.status(200).json(addUser);
//   }
// };

// const removeFromGroup = async (req, res) => {
//   const { chatId, userId } = req.body;

//   const removeUser = await Chat.findByIdAndUpdate(
//     chatId,
//     {
//       $pull: { users: userId },
//     },
//     {
//       new: true,
//     }
//   )
//     .populate("users", "-password")
//     .populate("groupAdmin", "-password");

//   if (!removeUser) {
//     throw new BadRequestError("Chat Not Found");
//   } else {
//     res.status(200).json(removeUser);
//   }
// };

module.exports = {
  getChat,
  getChats,
  // createGroup,
  // removeFromGroup,
  // renameGroup,
  // addUserToGroup,
};
