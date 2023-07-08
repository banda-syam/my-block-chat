const { ObjectId } = require("mongodb");
const { db } = require("../services/database.services");
const { createResponse, createResponseWithError } = require("../utils/helpers");

module.exports.decodeUser = async (req, res, next) => {
  try {
    var user = await db.collection("users").findOne({ _id: new ObjectId(req.payload._id) });
    if (!user) {
      next(createResponse("user not found", 404));
    } else {
      req.user = user;
      next();
    }
  } catch (e) {
    next(createResponseWithError(e));
  }
};
