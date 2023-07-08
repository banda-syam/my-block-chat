import React, { useEffect } from "react";
import axios from "axios";
import "./TopNav.css";

const TopNav = () => {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const getFriendRequests = async () => {
    try {
      let config = {
        method: "GET",
        url: `http://localhost:4000/api/user/friendrequest`,
        headers: {
          mode: "no-cors",
          accept: "application/json",
          token: localStorage.getItem("token"),
        },
      };

      const response = await axios(config);
      console.log(response);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    getFriendRequests();
  }, []);
  return (
    <>
      <div>
        <ul id="lists">
          <li className="single-list">
            <span>Friend Requests</span>
          </li>
          <li className="single-list">
            <span onClick={logout}> Logout </span>
          </li>
        </ul>
      </div>
    </>
  );
};

export default TopNav;
