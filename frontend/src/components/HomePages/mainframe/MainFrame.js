import React, { useEffect, useState } from "react";
import "./MainFrame.css";

const MainFrame = () => {
  const [friendshipId, setFriendshipId] = useState(null);

  setInterval(() => {
    var initialVal = localStorage.getItem("friendshipId");
    if (initialVal !== friendshipId) {
      setFriendshipId(localStorage.getItem("friendshipId"));
    }
  }, 500);

  return (
    <>
      <div className="main-chat">
        {friendshipId ? (
          <>
            <h1>friend </h1>
            <p>{friendshipId}</p>
          </>
        ) : (
          <h1>No friend</h1>
        )}
      </div>
    </>
  );
};

export default MainFrame;
