const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const { selectChatRoom, patchNewMessage } = require("./utils/socketUtils");
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


  let currentUser = {};

  socket.on("join room", (userObj) => {
    socket.join(userObj.to);
  
    let date = Date.now();

    io.to(socket.id).emit("user joined", {
      body: "User has joined the chat",
      owner: "Chat Bot",
      date_time: `${date}`
    });

    const user = {
      username: userObj.username,
      socket_id: socket.id,
      user_id: userObj.userId,
      to: userObj.to
    };

    currentUser = user;

    selectChatRoom(user.to).then((messages) => {
      if (users[userObj.to]) {
        users[userObj.to].push(user);
      } else {
        users[userObj.to] = [];
        users[userObj.to].push(user);
      }
      let sendDatabaseMessages = true;
      let payload = {};

      if(sendDatabaseMessages){
        payload = {
          messages: JSON.stringify(messages),
          users: users[userObj.to]
        };
        sendDatabaseMessages = false;
      }else{
        payload = {
          users: users[userObj.to]
        };
      }
      
      io.to(socket.id).emit("new user", payload);
    });
  });

  socket.on("send message", ({ body, to, owner, chatName, isChannel, date_time, user_id }) => {

      const payload = {
        body: body,
        chatName,
        owner: owner,
        date_time: date_time,
        to: to,
        user_id: user_id
      };
      patchNewMessage(body, user_id, date_time, chatName);
      socket.to(to).emit("new message", payload);
   
  });

  socket.on("disconnect", () => {

    let date = Date.now();
      
    socket
      .to(currentUser.to)
      .emit("user left", {
        body: `${currentUser.username} has left the chat`,
        owner: "Chat Bot",
        date_time: `${date}`,
        personWhoLeft: currentUser.username
      });
  });
});

module.exports = server;
