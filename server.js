var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
var path = require("path");

app.use(express.static(path.join(__dirname)));

users = [];
connections = [];
emptyEntry = { animal: null, object: null, color: null };

server.listen(process.env.PORT || 3000);
console.log("Server running on port 3000...");

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname + "/static/index.html"))
);

io.sockets.on("connection", function(socket) {
  connections.push(socket);
  console.log("Connected: %s sockets connected", connections.length);

  // Disconnect
  socket.on("disconnect", function(data) {
    users.splice(users.indexOf(socket.username), 1);
    updateUsernames();
    connections.splice(connections.indexOf(socket), 1);
    console.log("Disconnected: %s sockets connected", connections.length);
  });

  // New user
  socket.on("new user", function(username) {
    socket.username = username;
    user = { username: socket.username, play: { emptyEntry } };
    socket.index = users.length();
    users.push(user);
    updateUsernames();
  });

  function updateUsernames() {
    io.sockets.emit("get users", () => {
      currentUsers = [];
      users.map(user => {
        currentUsers.push(user.username);
      });
      return currentUsers;
    });
  }

  // Send Tutti
  socket.on("send tutti", function(category, content) {
    io.sockets.emit("new tutti", {
      username: socket.username,
      type: category,
      content: content
    });
    users[socket.index].play[category] = content;
  });
});
