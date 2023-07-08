import "./App.css";
import { Route, Routes } from "react-router-dom";
import AuthenticatePage from "./components/AuthenticatePages/AuthenticatePage";
import HomePage from "./components/HomePages/HomePage";

function App() {
  // let ip = "https://api.user.server.cryptocricket.io";

  return (
    <>
      <Routes>
        <>
          <Route path="/authenticate" element={<AuthenticatePage />} />
          <Route path="/" element={<HomePage />} />
        </>
      </Routes>
    </>
  );
}

export default App;
