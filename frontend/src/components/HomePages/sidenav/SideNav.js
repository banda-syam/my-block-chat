import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SideNav.css";

const SideNav = () => {
  const [me, setMe] = useState({});

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
      console.log(response);
      if (response.status === 200) {
      } else {
        alert(response.data);
      }
    } catch (error) {
      alert(error);
    }
  }
  useEffect(() => {
    getMyDetails();
  }, []);
  return (
    <>
      <div className="">
        <h1>This is side nav </h1>
      </div>
    </>
  );
};

export default SideNav;
