import React, { Suspense, useState } from "react";
import "./App.css";

import UserContext from "./context/user";
import { Navigate, Route, Routes } from "react-router";
import AllCards from "./pages/AllCards";

function App() {
  const [accessToken, setAccessToken] = useState(""); // Access token state
  const [role, setRole] = useState(""); // User role state

  return (
    <div className="container">
      <Suspense fallback={<p>Loading...</p>}>
        <UserContext.Provider
          value={{ accessToken, setAccessToken, role, setRole }}
        >
          <Routes>
            <Route path="/" element={<Navigate to="/cards" />} />
            <Route path="/login" element={<div>Login Page</div>} />
            <Route path="/cards" element={<AllCards />} />
          </Routes>
        </UserContext.Provider>
      </Suspense>
    </div>
  );
}

export default App;
