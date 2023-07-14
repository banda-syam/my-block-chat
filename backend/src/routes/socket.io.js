require("dotenv").config();
const { ObjectId } = require("mongodb");
const { db } = require("../services/database.services");
const jwt = require("jsonwebtoken");

var onlineUsersMap = new Map();
async function socketEventManagment(io, socket) {
  try {
    socket.on("add-online", async (data) => {
      try {
        // parsing data
        var parsedData = data;

        if (!parsedData.token) {
          io.to(socket.id).emit("error", { status: 500, message: e.message });
        }

        // validate user
        var response = await validatedUser(parsedData.token);
        if (response.status != 200 || response.message) {
          return ws.send(JSON.stringify(response));
        }

        // get userId and set him online
        var userId = response.user._id;
        onlineUsersMap.set(userId.toString(), socket.id);
        console.log("add user online", onlineUsersMap);
      } catch (e) {
        io.to(socket.id).emit("error", { status: 500, message: e.message });
      }
    });

    socket.on("send-message", (data) => {
      return new Promise(async (resolve, reject) => {
        try {
          // parsing data
          var parsedData = data;

          // check if token is given in data
          if (!parsedData.token) {
            return io.to(socket.id).emit("error", { status: 400, message: `Error in send-message - Please mention token` });
          }

          // check if friendId is mentioned
          if (!parsedData.friendId) {
            return io.to(socket.id).emit("error", { status: 400, message: `Error in send-message - Please mention friendId` });
          }

          // check if message is present
          if (!parsedData.message) {
            return io.to(socket.id).emit("error", { status: 400, message: `Error in send-message - Please mention message` });
          }

          // validate user
          var response = await validatedUser(parsedData.token);
          if (response.status != 200 || response.message) {
            return io.to(socket.id).emit("error", { status: response.status, message: `Error in send-message - ${response.message}` });
          }

          // get user
          var userId = response.user._id;

          // check if friendId exists
          var isFriend = await db.collection("users").findOne({ _id: new ObjectId(parsedData.friendId) });
          if (!isFriend) {
            return io.to(socket.id).emit("error", { message: 400, message: `Error in send-message - No friend found with the given id ${parsedData.friendId}` });
          }

          // check if they are friends
          var isFriendship = await db.collection("friends").findOne({
            $or: [
              { requestedUser: new ObjectId(parsedData.friendId), acceptedUser: userId },
              { acceptedUser: new ObjectId(parsedData.friendId), requestedUser: userId },
            ],
          });

          if (!isFriendship) {
            return io.to(socket.id).emit("error", { message: 400, message: `Error in send-message - The given ${parsedData.friendId} is not your friend` });
          }

          // insert message in db
          await insertMessage(io, socket, userId, parsedData.friendId, parsedData.message);

          if (!onlineUsersMap.get(isFriend._id.toString())) {
            // io.to(socket.id).emit("error", { status: 402, message: "User is not online" });
            console.log(`${parsedData.friendId} user is not online`);
          } else {
            io.to(onlineUsersMap.get(isFriend._id.toString())).emit("read-message", { from: "friend", to: "you", message: parsedData.message });
          }
          resolve();
        } catch (e) {
          console.log(e);
          reject(e);
          return io.to(socket.id).emit("error", { status: 500, message: `Error in send-message - ${e}` });
        }
      });
    });

    socket.on("read-message-bulk", async (data) => {
      // parsing data
      var parsedData = data;

      // check if token is given in data
      if (!parsedData.token) {
        return io.to(socket.id).emit("error", { status: 400, message: `Error in read-message - Please mention token` });
      }

      // check if friendId is given in data
      if (!parsedData.friendId) {
        return io.to(socket.id).emit("error", { status: 400, message: `Error in read-message - Please mention friendId` });
      }

      // validate user
      var response = await validatedUser(parsedData.token);
      if (response.status != 200 || response.message) {
        return io.to(socket.id).emit("error", { status: response.status, message: `Error in send-message - ${response.message}` });
      }

      // get user
      var userId = response.user._id;

      var messages = await db
        .collection("messages")
        .aggregate([
          {
            $match: {
              $or: [
                { from: userId, to: new ObjectId(parsedData.friendId) },
                { from: new ObjectId(parsedData.friendId), to: userId },
              ],
            },
          },
          {
            $addFields: {
              from: { $cond: { if: { $eq: ["$from", userId] }, then: "you", else: "friend" } },
              to: { $cond: { if: { $eq: ["$to", userId] }, then: "you", else: "friend" } },
            },
          },
          // {
          //   $sort: { timestamp: -1 },
          // },
          // {
          //   $limit: 3,
          // },
          // {
          //   $sort: { timestamp: 1 },
          // },
        ])
        .toArray();

      io.to(socket.id).emit("read-message-bulk", messages);
    });

    socket.on("close", async (data) => {
      try {
        // parsing data
        var parsedData = JSON.parse(data);

        // check if token is given in data
        if (!parsedData.token) {
          return io.to(socket.id).emit("error", { status: 400, message: `Error in send-message - Please mention token` });
        }

        // validate user
        var response = await validatedUser(parsedData.token);
        if (response.status != 200 || response.message) {
          return io.to(socket.id).emit("error", { status: response.status, message: `Error in send-message - ${response.message}` });
        }

        // get user
        var userId = response.user._id;

        onlineUsersMap.delete(userId.toString());
      } catch (e) {
        console.log(e);
      }
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

const insertMessage = async (io, socket, userId, friendId, message) => {
  try {
    await db.collection("messages").insertOne({
      from: userId,
      to: new ObjectId(friendId),
      message: message,
      timestamp: Date.now() / 1000,
    });
  } catch (e) {
    io.to(socket.id).emit("error", { status: 500, message: `Error in insertMessage - ${e}` });
  }
};

module.exports = { socketEventManagment };
