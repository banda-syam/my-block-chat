const { ObjectId } = require("mongodb");
const joi = require("joi");

createObject = (value, helpers) => {
  return new ObjectId(value);
};

const authenticateSchema = joi.object({
  publicAddress: joi.string().required(),
  message: joi.string().required(),
  signature: joi.string().required(),
});

const userDetailsSchema = joi.object({
  publicAddress: joi.string().required(),
});

const addFriendSchema = joi.object({
  publicAddress: joi.string().required(),
});

const acceptFriendRequestSchema = joi.object({
  friendRequestId: joi.string().hex().length(24).custom(createObject).required(),
});

const unFriendSchema = joi.object({
  unFriendId: joi.string().hex().length(24).custom(createObject).required(),
});

module.exports = { authenticateSchema, userDetailsSchema, addFriendSchema, acceptFriendRequestSchema, unFriendSchema };
