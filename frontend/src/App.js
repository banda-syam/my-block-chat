import "./App.css";
import { Route, Routes } from "react-router-dom";
import AuthenticatePage from "./components/AuthenticatePages/AuthenticatePage";
import HomePage from "./components/HomePages/HomePage";
import FriendRequests from "./components/FriendRequests/FriendRequest";

function App() {
  return (
    <>
      <Routes>
        <>
          <Route path="/authenticate" element={<AuthenticatePage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/requests" element={<FriendRequests />} />
        </>
      </Routes>
    </>
  );
}

export default App;
