import React, { Suspense, useState, useEffect } from "react";
import "./App.css";

import UserContext from "./context/user";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navigate, Route, Routes } from "react-router";

function App() {
  const [accessToken, setAccessToken] = useState(""); // Access token state
  const [role, setRole] = useState(""); // User role state

  return (
    <>
      <UserContext.Provider
        value={{ accessToken, setAccessToken, role, setRole }}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/main" />} />
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/main" element={<div>Main Page</div>} />
        </Routes>
      </UserContext.Provider>
    </>
  );
}

export default App;
