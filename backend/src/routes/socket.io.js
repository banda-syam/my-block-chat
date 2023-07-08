const io = require("socket.io")(4081);
const socketApi = { io: io };
const { db } = require("../services/database.services");

var onlineUsersMap = new Map();
var changeInMessagesMap = new Map();

io.on("connection", (socket) => {
  console.log("connected", socket.id);

  io.on("makeUsersOnline", (userId) => {
    onlineUsersMap.set(userId, socket.id);
  });

  io.on("sendMessage", async (data) => {
    var fromUser = data.from;
    var toUser = data.to;
    var friendshipId = data.friendshipId;

    if (!onlineUsersMap.get(toUser)) {
      var insertMessage = await db.collection("messages").insertOne({});
    }
    io.emit("get", "data");
  });
});

module.exports = socketApi;
