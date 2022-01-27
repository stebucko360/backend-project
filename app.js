const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const { selectChatRoom } = require("./utils/socketUtils");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
const cors = require("cors");

const apiRouter = require("./routers/api.router");
const {
  handlePSQLErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./errors");
const { disconnect } = require("process");

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

const users = {};

io.on("connection", (socket) => {
  /*  console.log(socket.id); */ // x8WIv7-mJelg7on_ALbx
  let currentUser = {};

  socket.on("join room", (userObj) => {
    socket.join(userObj.to);
    console.log("room joined= ", userObj.to);
    socket.broadcast.to(currentUser.room).emit("A user has joined the chat");

    const user = {
      username: userObj.username,
      socket_id: socket.id,
      user_id: userObj.userId,
      to: userObj.to,
      user1: userObj.user1,
      user2: userObj.user2,
    };

    // Database
    currentUser = user;
    selectChatRoom(user.to).then((messages) => {
      if (users[userObj.to]) {
        users[userObj.to].push(user);
      } else {
        users[userObj.to] = [];
        users[userObj.to].push(user);
      }
      const payload = {
        messages,
        users: users[userObj.to],
      };
      io.to(userObj.to).emit("new user", payload);
    });
  });

  socket.on("send message", ({ content, to, sender, chatName, isChannel }) => {
    console.log("1: got message", to);
    if (isChannel) {
      const payload = {
        content,
        chatName,
        sender,
        date: Date.now(),
        to: to,
      };
      patchNewMessage(content, sender, payload.date, chatName);
      console.log("2: ", payload);
      io.to(to).emit("new message", payload);
      /*      socket.to(to).emit("new message", payload); */
    } else {
      // Chat with single user
      /*  const payload = {
        content,
        chatName: sender,
        sender,
      };
      socket.to(to).emit("new message", payload); */
    }
  });

  socket.on("disconnect", () => {
    socket
      .to(currentUser.to)
      .emit("user left", `${currentUser.username} has left the chat`);
  });
});

module.exports = server;
