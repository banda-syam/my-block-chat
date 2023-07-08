import React from "react";
import "./AcceptFriendRequest.css";
import axios from "axios";

const AcceptFriendRequest = ({ friend }) => {
  const acceptFriendRequest = () => {
    async function acceptFriendRequestFunction() {
      try {
        let config = {
          method: "PATCH",
          url: `http://localhost:4000/api/user/friendrequest/accept`,
          headers: {
            mode: "no-cors",
            accept: "application/json",
            token: localStorage.getItem("token"),
          },
          data: {
            friendRequestId: friend._id,
          },
        };

        const response = await axios(config);
        if (response.status === 200) {
          alert("Requested accepted");
          window.location.reload();
        }
      } catch (error) {
        alert(error.response.data.message);
      }
    }

    acceptFriendRequestFunction();
  };
  return (
    <>
      <div className="friendRequestBox">
        <span>{friend.AcceptingUser.publicAddress}</span>
        <button id="acceptButton" onClick={acceptFriendRequest}>
          Accept
        </button>
      </div>
    </>
  );
};

export default AcceptFriendRequest;
