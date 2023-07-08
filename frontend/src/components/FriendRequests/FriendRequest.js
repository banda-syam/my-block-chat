import React, { useEffect, useState } from "react";
import AcceptFriendRequest from "./AcceptFriendRequest";
import axios from "axios";

const FriendRequests = () => {
  const [friends, setFriends] = useState([]);

  async function getFriendRequests() {
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
      if (response.status === 201 || response.status === 200) {
        setFriends(response.data);
      } else {
        alert(response.data);
      }
    } catch (error) {
      alert(error);
    }
  }

  useEffect(() => {
    getFriendRequests();
  }, []);

  return (
    <>
      {friends?.length > 0 ? (
        friends?.map((friend) => {
          console.log(friend);
          return <AcceptFriendRequest friend={friend} />;
        })
      ) : (
        <h1>no friendrequests</h1>
      )}
    </>
  );
};

export default FriendRequests;
