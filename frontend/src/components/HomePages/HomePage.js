import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SideNav from "./SideNav";
import MainFrame from "./MainFrame";
import "./homepage.css";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/authenticate");
    }
  }, []);
  return (
    <div className="homepage">
      <SideNav></SideNav>
      <MainFrame></MainFrame>
    </div>
  );
};

export default HomePage;
