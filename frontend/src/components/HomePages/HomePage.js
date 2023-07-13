import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopNav from "./topnav/TopNav";
import SideNav from "./sidenav/SideNav";
import MainFrame from "./mainframe/MainFrame";
import "./homepage.css";
import socket from "../../socket";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/authenticate");
    }

    socket.emit("connection");

    socket.on("connection", (data) => {
      console.log("connection io", data.message);
    });

    socket.emit("add-online", { token: localStorage.getItem("token") });
  }, []);
  return (
    <>
      <TopNav></TopNav>
      <div className="homepage">
        <SideNav></SideNav>
        <MainFrame></MainFrame>
      </div>
    </>
  );
};

export default HomePage;
