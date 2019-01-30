var express = require("express");
var app = express();
var server = require("http").createServer(app);
var socketIo = require("socket.io");
var path = require("path");

const io = socketIo(server);
app.use(express.static(path.join(__dirname)));

users = [];
gameRooms = [];
connections = [];
emptyEntry = { animal: null, country: null, object: null };

server.listen(process.env.PORT || 3000);
console.log("Server running on port 3000...");

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname + "/static/index.html"))
);

io.on("connection", function (socket) {
  connections.push(socket);
  console.log("Connected: %s sockets connected", connections.length);

  // Disconnect
  socket.on("disconnect", function () {
    users.splice(users.indexOf(socket.username), 1);
    updateUsernames();
    connections.splice(connections.indexOf(socket), 1);
    console.log("Disconnected: %s sockets connected", connections.length);
  });

  // New user
  socket.on("new user", function (username) {
    console.log(`New user  ${username}`);
    socket.username = username;
    user = { username: socket.username, play: null };
    socket.index = users.length;
    users.push(user);
    updateUsernames();
    // send gameroom list to just this socket
    io.sockets.in(socket.id).emit("get gamerooms", gameRooms);
  });

  function updateUsernames() {
    currentUsers = [];
    users.map(user => {
      currentUsers.push(user.username);
    });
    io.sockets.emit("get users", currentUsers);
  }

  // Create Game
  socket.on("create game", function (name) {
    if (gameRooms.find((room) => room === name) === undefined) gameRooms.push(name);
    socket.join(name);
    socket.gameRoom = name;
    users[socket.index].play = { ...emptyEntry };
    console.log("Room created", name);
    io.sockets.emit("get gamerooms", gameRooms);
  });

  // Enter room
  socket.on("enter room", function (name) {
    if (gameRooms.find((room) => room === name)) {
      socket.join(name);
      socket.gameRoom = name;
      users[socket.index].play = { ...emptyEntry };
      console.log("A user entered room %s", name);

      io.sockets.in(socket.id).emit("get room users", connections.map(socket => {
        if (socket.gameRoom == name) return socket.username
      }))
      io.sockets.in(name).emit("user joined", socket.username)
    }
  });

  // Set ready
  socket.on("set ready", function () {
    socket.ready = true;
    if (allReady(socket.gameRoom)) beginGame(socket.gameRoom);
  });

  function allReady(room) {
    return connections.every(socket => {
      return socket.gameRoom == room && socket.ready;
    });
  }

  function beginGame(room) {
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randomLetter = possible[Math.floor(Math.random() * possible.length)];
    console.log("Game letter: %s", randomLetter);
    io.sockets.in(socket.gameRoom).emit("game letter", randomLetter)
    setTimeout(() => io.sockets.in(socket.gameRoom).emit("game over", users), 30000);
  }

  // Send Tutti
  // Content can be a string literal or a number. The string will represent the value
  // and the number the lenght of that string in case we don't want to show the user
  socket.on("send tutti", function (category, content) {
    console.log("Send tutti", category, content);
    io.sockets.in(socket.gameRoom).emit("new tutti", {
      username: socket.username,
      type: category,
      //   content: content,
      content: content === null ? 0 : content.length
    });

    if (users[socket.index] !== undefined) users[socket.index].play[category] = content;
  });
});
