require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.createToken = (payload, expiresIn = 60 * 60 * 24 * 7) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn,
  });
};

console.log(this.createToken({ _id: "64a31b8d86f0cc4965094eeb" }));

module.exports.decodeToken = (req, res, next) => {
  const token = req.headers.token;
  if (!token) {
    return next(createResponse("No token found", 401));
  }
  try {
    var decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.payload = decoded;
    next();
  } catch (e) {
    if (e.message.includes("jwt")) {
      next(createResponse("Token expired. Login again", 401));
    } else next(createResponseWithError(e));
  }
};
