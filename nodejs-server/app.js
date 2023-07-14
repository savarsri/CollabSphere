const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const path = require("path");
const multer = require("multer");
const excelToJson = require("convert-excel-to-json");
const bodyParser = require("body-parser");
const authenticate = require("./middleware/authenticate");
const AuthRoute = require("./routes/authRoute");
const TeamsRoute = require("./routes/teamRoute");
const AssignmentRoute = require("./routes/assignmentRoute");
const PostRoute = require("./routes/postRoute");
const EmployeeRoute = require("./routes/employee");
const ChatRoute = require("./routes/chatRoute");
const MessageRoute = require("./routes/messageRoute");
const User = require("./models/User");
const File = require("./models/File");
const bcrypt = require("bcryptjs");
const socket = require("socket.io");
const http = require("http");
const AssignmentController = require("./controller/AssignmentController");
const PostController = require("./controller/PostController");
const TeamsController = require("./controller/TeamsController");
var fs = require("fs");

// const cors = require('cors');
// const helmet = require('helmet');
// const xss = require('xss');
// const mongoSanitize = require('mongo-sanitize');
// import {importExcelData2MongoDB} from "./middleware/excelupload"

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const directory = path.join(
      __dirname,
      `/temp/uploads/${req.headers.uploadid}`
    );

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    cb(null, directory);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
var upload = multer({ storage: storage });

// Connection with mongoDB database

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/testdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

// mongoDB database connection error handing

db.on("error", (err) => {
  console.log(err);
});

db.once("open", () => {
  console.log("database connection done");
});

const app = express();
const server = http.createServer(app);

const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());
app.use(express.static("public"));
// app.use(upload.array());
// app.use(cors);
// app.use(helmet);
// app.use(xss);
// app.use(mongoSanitize);
app.use("/uploads", express.static("uploads"));
const PORT = process.env.PORT || 3000;

// Server listening port

app.listen(PORT, () => {
  console.log("server is running on port 3000");
});

// Admin panel

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./admin-panel/login.html"));
  // res.sendFile(path.join(__dirname, "./admin-panel/admin.css"));
});

app.use("/api/teams", authenticate, TeamsRoute);
app.use("/api/auth", AuthRoute);
app.use("/api/assignment", authenticate, AssignmentRoute);
app.use("/api/post", authenticate, PostRoute);
app.use("/api/chat", authenticate, ChatRoute);
app.use("/api/message", authenticate, MessageRoute);

app.get("/api/download", authenticate, function (req, res) {
  File.findById(req.headers.fileid).then((file) => {
    res.download(
      file.path,
      file.originalname,
      (err) => {
        if (err) {
          res.send({
            error: err,
            msg: "Problem downloading the file",
          });
        }
      }
    );
  });
});

app.post(
  "/api/assignment/createAssignment",
  authenticate,
  upload.array("files"),
  (req, res, next) => {
    File.insertMany(req.files, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.locals.files = data;
        next();
      }
    });
  },
  AssignmentController.createAssignment
);

app.post(
  "/api/post/createPost",
  authenticate,
  upload.array("files"),
  (req, res, next) => {
    File.insertMany(req.files, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.locals.files = data;
        next();
      }
    });
  },
  PostController.createPost
);

app.post(
  "/api/assignment/submitAssignment",
  authenticate,
  upload.array("files"),
  (req, res, next) => {
    File.insertMany(req.files, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.locals.files = data;
        next();
      }
    });
  },
  AssignmentController.submitAssignment
);

app.post(
  "/api/teams/teamUploadFiles",
  authenticate,
  upload.array("files"),
  (req, res, next) => {
    File.insertMany(req.files, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.locals.files = data;
        next();
      }
    });
  },
  TeamsController.uploadFiles
);
// Socket

const io = new socket.Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
  },
});

io.listen(9000, () => {
  console.log("io listening on 9000");
});

io.on("connection", (socket) => {
  //connected to correct id
  socket.on("setup", (userData) => {
    socket.join(userData._id);

    socket.emit("connected");
  });

  socket.on("join-chat", (room) => {
    socket.join(room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop-typing", (room) => socket.in(room).emit("stop-typing"));

  socket.on("new-message", (newMessageReceived) => {
    let chat = newMessageReceived.chat;

    if (!chat.users) return console.log(`chat.users not defined`);

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message-received", newMessageReceived);
    });
  });

  socket.off("setup", () => {
    socket.leave(userData._id);
  });
});

// async function importExcelData2MongoDB(filePath) {
//   // -> Read Excel File to Json Data
//   const excelData = excelToJson({
//     sourceFile: filePath,
//     sheets: [
//       {
//         // Excel Sheet Name
//         name: "User",
//         // Header Row -> be skipped and will not be present at our result object.
//         header: {
//           rows: 1,
//         },
//         // Mapping columns to keys
//         columnToKey: {
//           A: "name",
//           B: "email",
//           C: "password",
//         },
//       },
//     ],
//   });

//   const temp = Object.values(excelData);
//   var data = temp[0];
//   delete temp;

//   // data = await createHashedPass(data);
//   console.log(data);
//   // Insert Json-Object to MongoDB

//   await addUsers(data);

//   // fs.unlinkSync(filePath);
// }

// async function createHashedPass(data) {
//   for (let index = 0; index < data.length; index++) {
//     const pass = bcrypt.hash(
//       data[index].password,
//       10,
//       function (err, hashedPass) {
//         if (err) {
//           res.json({
//             error: err,
//           });
//         } else {
//           return hashedPass;
//         }
//       }
//     );
//     data[index].password = pass;
//   }
//   return data;
// }

// async function addUsers(data) {
//   User.insertMany(data, (err, data) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("hello");
//       // res.redirect("/");
//     }
//   });
// }

// module.exports = {upload}
