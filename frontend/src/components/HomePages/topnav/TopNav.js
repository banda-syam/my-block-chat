import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./TopNav.css";

const TopNav = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const takeToRequests = () => {
    navigate("/requests");
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
      alert(error.response.data.message);
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
            <span onClick={takeToRequests}>Friend Requests</span>
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
