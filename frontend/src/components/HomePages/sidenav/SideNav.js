import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SideNav.css";

const SideNav = () => {
  const [me, setMe] = useState({});
  const [userAddress, setUserAddress] = useState("");
  const [friends, setFriends] = useState([]);

  async function getMyDetails() {
    try {
      let config = {
        method: "GET",
        url: `http://localhost:4000/api/user/me`,
        headers: {
          mode: "no-cors",
          accept: "application/json",
          token: localStorage.getItem("token"),
        },
      };

      const response = await axios(config);
      if (response.status === 200) {
        setMe(response.data);
      } else {
        alert(response.data);
      }
    } catch (error) {
      alert(error);
    }
  }

  async function makeFriend() {
    try {
      let config = {
        method: "POST",
        url: `http://localhost:4000/api/user/friendrequest`,
        headers: {
          mode: "no-cors",
          accept: "application/json",
          token: localStorage.getItem("token"),
        },
        data: {
          publicAddress: userAddress,
        },
      };

      const response = await axios(config);
      if (response.status === 201) {
        alert("Friend Notiication sent");
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  }

  async function getFriends() {
    try {
      let config = {
        method: "GET",
        url: `http://localhost:4000/api/user/friends`,
        headers: {
          mode: "no-cors",
          accept: "application/json",
          token: localStorage.getItem("token"),
        },
      };

      const response = await axios(config);
      if (response.status === 200) {
        setFriends(response.data);
      } else {
        alert(response.data);
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    makeFriend();
  };

  useEffect(() => {
    getMyDetails();
    getFriends();
  }, []);

  return (
    <>
      <div className="main-div">
        <div className="sideNavContainer">
          <div className="header">
            <span>Your address : </span>
            <span> {me.publicAddress} </span>
          </div>
          <span id="spantag">Search for a address and make friend</span>
          <div className="searchFormDiv">
            <form onSubmit={handleSubmit}>
              <input type="text" id="textfield" onChange={(e) => setUserAddress(e.target.value)}></input>
              <input type="submit" id="submitbutton" value="make friend"></input>
            </form>
          </div>

          <span id="friendstext"> FRIENDS </span>
          <div className="friendsList">
            {friends?.length > 0
              ? friends?.map((friend) => {
                  console.log(friend);
                  return (
                    <>
                      <span
                        className="friendBox"
                        onClick={() => {
                          localStorage.setItem("friendshipId", friend._id);
                          localStorage.setItem("friendpublicAddress", friend.Friend.publicAddress);
                          localStorage.setItem("friendId", friend.Friend._id);
                        }}
                      >
                        {friend.Friend.publicAddress}
                      </span>
                    </>
                  );
                })
              : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default SideNav;
