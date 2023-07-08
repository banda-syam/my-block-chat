import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/authenticate");
    }
  }, []);
  return (
    <>
      <h1> success </h1>
    </>
  );
};

export default HomePage;
