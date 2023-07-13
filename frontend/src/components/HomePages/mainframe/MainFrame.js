import React, { useState, useEffect } from "react";
import "./MainFrame.css";
import socket from "../../../socket";

const MainFrame = () => {
  const [friendshipId, setFriendshipId] = useState("");

  setInterval(() => {
    setFriendshipId(localStorage.getItem("friendshipId"));
  }, 500);

  useEffect(() => {}, [friendshipId]);
  return (
    <>
      <div className="main-chat">
        {localStorage.getItem("friendshipId") ? (
          <>
            <h1>friend</h1>
            <p> {localStorage.getItem("friendshipId")}</p>
          </>
        ) : (
          <h1> No friend</h1>
        )}
      </div>
    </>
  );
};

export default MainFrame;
