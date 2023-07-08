import React, { useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AuthenticatePage.css";

async function authenticate(message) {
  if (!window.ethereum) {
    return alert(`Please install metamask`);
  }

  await window.ethereum.send("eth_requestAccounts");
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  const signature = await signer.signMessage(message);

  return { address: address, message: message, signature: signature };
}

function generateRandomString() {
  var randomString = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
  for (let i = 0; i < 20; i++) {
    randomString = randomString + characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomString;
}

const AuthenticatePage = () => {
  const navigate = useNavigate();

  async function runAuthenticate() {
    var message = generateRandomString();
    var authenticateResult = await authenticate(message);
    if (!authenticateResult) {
      return alert("Authetication failed");
    }

    const postLogin = async (authenticateResult) => {
      try {
        let config = {
          method: "POST",
          url: `http://localhost:4000/api/user/authenticate`,
          headers: {
            mode: "no-cors",
            accept: "application/json",
          },
          data: {
            message: authenticateResult.message,
            signature: authenticateResult.signature,
            publicAddress: authenticateResult.address,
          },
        };

        const response = await axios(config);
        console.log(response);
        if (response.status === 201 || response.status === 200) {
          localStorage.setItem("token", response.headers.token);
          navigate("/");
        } else {
          alert(response.data);
        }
      } catch (error) {
        alert(error);
      }
    };

    postLogin(authenticateResult);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    runAuthenticate();
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);
  return (
    <div className="authButtonDiv">
      <div className="authenticateForm">
        <form onSubmit={handleSubmit}>
          <input id="authenticateButton" type="submit" value="Authenticate" />
        </form>
      </div>
    </div>
  );
};

export default AuthenticatePage;
