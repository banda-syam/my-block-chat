var express = require("express");
var router = express.Router();

const controller = require("../controllers/user.controller");
const { validator } = require("../middleware/joi.middleware");
const { decodeToken } = require("../middleware/authentication.middleware");
const { decodeUser } = require("../middleware/user.middleware");
const schema = require("../schemas/user.schema");

router.post("/authenticate", validator(schema.authenticateSchema), controller.authenticate);
router.get("/me", decodeToken, decodeUser, controller.getMyDetails);
router.get("/details", decodeToken, decodeUser, validator(schema.userDetailsSchema), controller.getUserDetails);
router.post("/friendrequest", decodeToken, decodeUser, validator(schema.addFriendSchema), controller.makeFriends);
router.get("/friendrequest", decodeToken, decodeUser, controller.getFriendRequests);
router.patch("/friendrequest/accept", decodeToken, decodeUser, validator(schema.acceptFriendRequestSchema), controller.acceptFriendRequest);
router.get("/friends", decodeToken, decodeUser, controller.getFriends);
router.patch("/unfriend", decodeToken, decodeUser, validator(schema.unFriendSchema), controller.unFriend);

module.exports = router;
