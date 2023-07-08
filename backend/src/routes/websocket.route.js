const { sendMessages, getMessages } = require("../controllers/websocket.controller");

async function eventManagement(wss, ws, message) {
  let res;
  try {
    try {
      var parsedMessage = JSON.parse(message);
    } catch (e) {
      console.log("Error in parse message", e);
      return ws.send(JSON.stringify({ status: 500, message: e.message }), () => {
        ws.close();
      });
    }

    switch (parsedMessage.method) {
      case "SENDMESSAGE": {
        sendMessages(ws, parsedMessage);
        break;
      }
      case "GETMESSAGES": {
        getMessages(ws, parsedMessage);
        break;
      }
      default: {
        ws.send(JSON.stringify({ status: 404, message: "No such method found" }), () => {
          ws.close();
        });
        break;
      }
    }
  } catch (e) {
    console.log("Error in eventManagment", e);
    ws.send(JSON.stringify({ status: 500, message: e.message }), () => {
      ws.close();
    });
  }
}

module.exports = { eventManagement };
