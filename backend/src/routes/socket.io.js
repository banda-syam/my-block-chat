require("dotenv").config();
const { db } = require("../services/database.services");
const jwt = require("jsonwebtoken");

var onlineUsersMap = new Map();
async function socketEventManagment(io, socket) {
  try {
    socket.on("add-online", async (data) => {
      try {
        // parsing data
        var parsedData = JSON.parse(data);
        if (!parsedData.userId) {
          io.to(socket.id).emit("error", { status: 400, message: `Please mention userId in the data` });
        }

        // get user token
        var userToken = parsedData.token;

        // validate user
        var response = await validatedUser(userToken);
        if (response.status != 200 || response.message) {
          return ws.send(JSON.stringify(response));
        }

        // get userId and set him online
        var userId = response.user._id;
        onlineUsersMap.set(userId, socket.id);
      } catch (e) {
        io.to(socket.id).emit("error", { status: 500, message: e.message });
      }
    });

    socket.on("send-message", async (data) => {
      // parsing data
      var parsedData = JSON.parse(data);
      if (!parsedData.userId) {
        io.to(socket.id).emit("error", { status: 400, message: `Please mention userId in the data` });
      }

      // get user token
      var userToken = parsedData.token;

      // validate user
      var response = await validatedUser(userToken);
      if (response.status != 200 || response.message) {
        return ws.send(JSON.stringify(response));
      }

      // get userId and set him online
      var userId = response.user._id;

      if (!onlineUsersMap.get(userId)) {
        io.to(socket.id).emit("error", { status: 402, message: "User is not online" });
      }
    });

    socket.on("read-message", (data) => {
      console.log("in custom event", data);
    });
  } catch (e) {
    console.error(e);
  }
}

const validatedUser = async (token) => {
  try {
    var decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    console.log(e);
    if (e.message.includes("jwt")) {
      return { status: 401, message: "Token expired. Login again" };
    } else {
      return { status: 500, message: e.message };
    }
  }

  try {
    var user = await db.collection("users").findOne({ _id: new ObjectId(decoded._id) });
    if (!user) {
      return { status: 404, message: `user not found` };
    } else {
      return { status: 200, user };
    }
  } catch (e) {
    return { status: 500, message: e.message };
  }
};

module.exports = { socketEventManagment };
