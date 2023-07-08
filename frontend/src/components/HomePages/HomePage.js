import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopNav from "./topnav/TopNav";
import SideNav from "./sidenav/SideNav";
import MainFrame from "./mainframe/MainFrame";
import "./homepage.css";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/authenticate");
    }
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
