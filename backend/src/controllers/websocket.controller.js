const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const { db } = require("../services/database.services");

async function sendMessages(ws, parsedMessage) {
  try {
    var token = parsedMessage.token;
    var message = parsedMessage.message;
    var friendshipId = parsedMessage._id;

    if (!token || !message || !friendshipId) {
      return ws.send(JSON.stringify({ status: 400, message: "Please send proper data" }));
    }

    var response = await validatedUser(token);
    if (response.status != 200 || response.message) {
      return ws.send(JSON.stringify(response));
    }

    var user = response?.user;

    const friendship = await db.collection("friends").findOne({ _id: new ObjectId(friendshipId) });
    if (!friendship) {
      return ws.send(JSON.stringify({ status: 404, message: `No friendship found with the given id ${friendshipId}` }));
    }

    // bug which caused snapchat spotlight to loose 50000 dollar
    var to;
    if (friendship.requestedUser.toString() == user._id.toString()) {
      to = friendship.acceptedUser;
    } else if (friendship.acceptedUser.toString() == user._id.toString()) {
      to = friendship.requestedUser;
    }
    if (!to) {
      return ws.send(JSON.stringify({ status: 400, message: `You don't have permission to send message to this chat` }));
    }

    const insertMessage = await db.collection("chats").insertOne({
      friendshipId: friendship._id,
      from: user._id,
      to: to,
      message: message,
    });

    if (!insertMessage) {
      return ws.send(JSON.stringify({ status: 500, message: "Couldn't insert into database" }));
    }

    var message = await db.collection("chats").findOne(insertMessage.insertedId);
    return ws.send(JSON.stringify({ status: 200, data: message }));
  } catch (e) {
    return ws.send(JSON.stringify({ status: 500, message: e.message }), () => {
      ws.close();
    });
  }
}

var getMessagesMap = new Map();

async function getMessages(ws, parsedMessage) {
  if (getMessagesMap.get(parsedMessage.friendshipId)) {
  }
  try {
    var token = parsedMessage.token;
    var friendshipId = parsedMessage.friendshipId;

    if (!token || !friendshipId) {
      return ws.send(JSON.stringify({ status: 400, message: "Please send proper data" }));
    }

    var response = await validatedUser(token);
    if (response.status != 200 || response.message) {
      return ws.send(JSON.stringify(response));
    }

    var user = response?.user;

    const friendship = await db.collection("friends").findOne({ _id: new ObjectId(friendshipId) });
    if (!friendship) {
      return ws.send(JSON.stringify({ status: 404, message: `No friendship found with the given id ${friendshipId}` }));
    }

    var userInFriendShip = false;
    if (friendship.requestedUser.toString() == user._id.toString() || friendship.acceptedUser.toString() == user._id.toString()) {
      userInFriendShip = true;
    }
    if (!userInFriendShip) {
      return ws.send(JSON.stringify({ status: 400, message: `You don't have permission to send message to this chat` }));
    }

    var chat = await db
      .collection("chats")
      .aggregate([
        {
          $match: { friendshipId: new ObjectId(friendshipId) },
        },
        // {
        //   $project: {
        //     You: { $cond: { if: { $eq: ["$requestUser", user._id] }, then: "You", else: "YourFriend" } },
        //     YourFriend: { $cond: { if: { $eq: ["$acceptedUser", user._id] }, then: "You", else: "YourFriend" } },
        //   },
        // },
      ])
      .toArray();

    return ws.send(JSON.stringify({ status: 200, data: chat }));
  } catch (e) {
    return ws.send(JSON.stringify({ status: 500, message: e.message }), () => {
      ws.close();
    });
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

module.exports = { sendMessages, getMessages };
