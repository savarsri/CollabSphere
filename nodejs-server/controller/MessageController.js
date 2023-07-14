const Message = require("../models/message");
const Chat = require("../models/chat");
const User = require("../models/User");

const sendMessage = async (req, res) => {
  const { message, chatId } = req.body;

  if (!message || !chatId) {
    res.status(500).json({
      error: "Chat does not exist!"
    })
  }

  let newMessage = {
    sender: req.headers.uid,
    message: message,
    chat: chatId,
  };

  let m = await Message.create(newMessage);

  m = await m.populate("sender", "email avatar");
  m = await m.populate("chat");
  m = await User.populate(m, {
    path: "chat.users",
    select: "avatar email _id",
  });

  await Chat.findByIdAndUpdate(chatId, { latestMessage: m }, { new: true });
  res.status(200).json(m);
};

const allMessages = async (req, res) => {
  let chatId  = req.body.chatId;

  if(chatId == ''){
    return;
  }

  const getMessage = await Message.find({ chat: chatId })
    .populate("sender", "avatar email _id")
    .populate("chat");

  res.status(200).json(getMessage);

  // res.status(200).json({
  //   message:"hello"
  // })
};

module.exports = { allMessages, sendMessage };
