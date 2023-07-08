module.exports.createResponse = (message, status) => {
  return { message: message, status: status };
};

module.exports.createResponseWithError = (error, status = 500) => {
  return { message: error.message, status: status };
};
