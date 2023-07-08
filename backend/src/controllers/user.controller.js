const { db } = require("../services/database.services");
const { createResponseWithError, createResponse } = require("../utils/helpers");
const { createToken } = require("../middleware/authentication.middleware");
const web3 = require("web3");

async function authenticate(req, res, next) {
  try {
    // verifying user publicAdress
    const recoverAddress = await web3.eth.accounts.recover(req.body.message, req.body.signature);
    if (recoverAddress.toLowerCase() != req.body.publicAddress.toLowerCase()) {
      return next(createResponse("Not a valid signer", 400));
    }

    // checking if user already exists in database
    var user = await db.collection("users").findOne({ publicAddress: recoverAddress });
    if (user) {
      var payload = { _id: user._id };
      return res.header("token", createToken(payload)).status(200).send(user);
    }

    // inserting user in database
    var insertUser = await db.collection("users").insertOne({
      publicAddress: recoverAddress,
      wallet: [{ symbol: "BUSD", available: 0.0, frozen: 0.0 }],
    });

    if (!insertUser) {
      return next(createResponseWithError("Couldn't insert user"));
    }

    payload = { _id: insertUser.insertedId };
    user = await db.collection("users").findOne({ _id: insertUser.insertedId });
    res.header("token", createToken(payload)).status(201).send(user);
  } catch (e) {
    console.log(e);
    next(createResponseWithError(e));
  }
}

async function getMyDetails(req, res, next) {
  try {
    res.status(200).send(req.user);
  } catch (e) {
    console.log(e);
    next(createResponseWithError(e));
  }
}

async function makeFriends(req, res, next) {
  try {
    const user = req.user;
    const publicAddress = req.body.publicAddress;
    const friend = await db.collection("users").findOne({ publicAddress: publicAddress });
    if (!friend) {
      return next(createResponse(`No user found with the given id ${publicAddress}`, 404));
    }

    if (user._id.toString() == publicAddress.toString()) {
      return next(createResponse(`You cannot be friend with you`, 400));
    }

    var friends = await db.collection("friends").findOne({ requestedUser: user._id, acceptedUser: friend._id });
    if (friends?.accepted) {
      return next(createResponse("You guys are already friends", 400));
    }
    if (friends?.accepted == false) {
      return next(createResponse("You requested to be friend, status pending", 400));
    }

    var insertFriends = await db.collection("friends").insertOne({
      requestedUser: user._id,
      acceptedUser: friend._id,
      accepted: false,
    });

    if (!insertFriends) {
      throw new Error("Couldn't insert into database");
    }

    friends = await db.collection("friends").findOne({ _id: insertFriends.insertedId });
    res.status(201).send(friends);
  } catch (e) {
    next(createResponseWithError(e));
  }
}

async function getFriendRequests(req, res, next) {
  try {
    var myFriendRequests = await db.collection("friends").find({ acceptedUser: req.user._id, accepted: false }).toArray();
    res.status(200).send(myFriendRequests);
  } catch (e) {
    next(createResponseWithError(e));
  }
}

async function acceptFriendRequest(req, res, next) {
  try {
    const friendRequestId = req.body.friendRequestId;
    const makeFriends = await db.collection("friends").findOneAndUpdate({ _id: friendRequestId }, { $set: { accepted: true } }, { returnDocument: "after" });
    if (!makeFriends) {
      return next(createResponse(`No friend Request found with the given id ${friendRequestId}`, 404));
    }

    res.status(200).send(makeFriends);
  } catch (e) {
    next(createResponseWithError(e));
  }
}

async function getFriends(req, res, next) {
  try {
    const friends = await db
      .collection("friends")
      .find({ $or: [{ requestedUser: user._id }, { acceptedUser: user._id }] })
      .toArray();

    res.status(200).send(friends);
  } catch (e) {
    next(createResponseWithError(e));
  }
}

async function unFriend(req, res, next) {
  try {
    const unFriendId = req.body.unFriendId;
    const unFriend = await db.collection("friends").findOneAndUpdate({ _id: unFriendId }, { $set: { accepted: false } }, { returnDocument: "after" });
    if (!unFriend) {
      return next(createResponse(`No friend Request found with the given id ${unFriendId}`, 404));
    }

    res.status(200).send(unFriend);
  } catch (e) {
    next(createResponseWithError(e));
  }
}

module.exports = { authenticate, getMyDetails, makeFriends, getFriendRequests, acceptFriendRequest, getFriends, unFriend };
