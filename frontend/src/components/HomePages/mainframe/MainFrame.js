import React, { useState, useEffect } from "react";
import "./MainFrame.css";
import socket from "../../../socket";

const MainFrame = () => {
  const [friendshipId, setFriendshipId] = useState("");
  const [friendId, setFriendId] = useState("");

  setInterval(() => {
    setFriendshipId(localStorage.getItem("friendshipId"));
    setFriendId(localStorage.getItem("friendId"));
  }, 200);

  useEffect(() => {
    console.log("triggered");
    socket.emit("read-message", { token: localStorage.getItem("token"), friendId: friendId });
    socket.on("read-message", (data) => {
      console.log("read message", data);
    });
  }, [friendshipId, friendId]);
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

            <div className="showChats"></div>

            <div className="sendMessageFormContaimer">
              <form className="sendMessageForm">
                <input type="text" id="textMessageInput"></input>
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
