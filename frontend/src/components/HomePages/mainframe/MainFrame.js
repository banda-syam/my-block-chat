import React, { useState, useEffect } from "react";
import "./MainFrame.css";
import socket from "../../../socket";

const MainFrame = () => {
  const [myMessage, setMyMessage] = useState("");
  const [friendshipId, setFriendshipId] = useState("");
  const [friendId, setFriendId] = useState("");
  const [messages, setMessages] = useState([]);

  // setInterval(() => {
  //   if (localStorage.getItem("friendshipId") !== friendshipId) {
  //     setFriendshipId(localStorage.getItem("friendshipId"));
  //   }
  //   if (localStorage.getItem("friendId") !== friendId) {
  //     setFriendId(localStorage.getItem("friendId"));
  //   }
  // }, 200);

  socket.on("read-message", (data) => {
    console.log("triggered - data", data);
    messages.push({ from: data.from, to: data.to, message: data.message });
    setMessages(messages);
  });

  // get bulk messages
  socket.emit("read-message-bulk", { token: localStorage.getItem("token"), friendId: localStorage.getItem("friendId") });
  socket.on("read-message-bulk", (data) => {
    setMessages(data);
  });

  const handleSubmit = (e) => {
    socket.emit("send-message", { token: localStorage.getItem("token"), friendId: localStorage.getItem("friendId"), message: myMessage });
  };

  useEffect(() => {
    socket.on("error", (data) => {
      console.log("error data", data);
      alert(data.message);
    });

    // // get bulk messages
    // socket.emit("read-message-bulk", { token: localStorage.getItem("token"), friendId: localStorage.getItem("friendId") });
    // socket.on("read-message-bulk", (data) => {
    //   setMessages(data);
    // });

    // socket.on("read-message", (data) => {
    //   messages.push({ from: data.from, to: data.to, message: data.message });
    //   setMessages(messages);
    // });
  }, [friendshipId, friendId, myMessage]);
  return (
    <>
      <div className="mainChatContainer">
        {localStorage.getItem("friendshipId") ? (
          <div className="mainChatContainerContents">
            <div id="friendAddressContainer">
              <span>
                <strong> {localStorage.getItem("friendpublicAddress")} </strong>
              </span>
            </div>

            <div className="showChats">
              {messages.map((message) => {
                return (
                  <div className="singleChat">
                    <>
                      <span id="youMessage">
                        <strong>{message.from}</strong>
                      </span>
                      <span> {message.message} </span>
                    </>
                  </div>
                );
              })}
            </div>

            <div className="sendMessageFormContaimer">
              <form className="sendMessageForm" onSubmit={handleSubmit}>
                <input type="text" id="textMessageInput" onChange={(e) => setMyMessage(e.target.value)}></input>
                <input type="submit" value="send" id="messageSendButton"></input>
              </form>
            </div>
          </div>
        ) : (
          <h1> No friend</h1>
        )}
      </div>
    </>
  );
};

export default MainFrame;
