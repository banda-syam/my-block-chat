import React, { useEffect, useState } from "react";
import "./MainFrame.css";

const MainFrame = () => {
  return (
    <>
      <div className="main-chat">
        {localStorage.getItem("frienshipId") ? (
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
