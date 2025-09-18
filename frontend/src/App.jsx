import React, { Suspense, useState } from "react";
import "./App.css";

import UserContext from "./context/user";
import { Navigate, Route, Routes } from "react-router";
import AllCards from "./pages/AllCards";
import NavBar from "./components/NavBar";
import AllTrades from "./pages/AllTrades";
import NewTrade from "./pages/NewTrade";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import MyTrades from "./pages/MyTrades";
import ProtectedRoute from "./components/ProtectedRoute";
import SingleTrade from "./pages/SingleTrade";
import AdminRoute from "./components/AdminRoute";
import AllUsers from "./pages/AllUsers";
import Footer from "./components/Footer";

function App() {
  const [accessToken, setAccessToken] = useState(""); // Access token state
  const [username, setUsername] = useState("");
  const [gameID, setGameID] = useState("");
  const [role, setRole] = useState(""); // User role state

  return (
    <>
      <Suspense fallback={<p>Loading...</p>}>
        <UserContext.Provider
          value={{
            accessToken,
            setAccessToken,
            username,
            setUsername,
            role,
            setRole,
            gameID,
            setGameID,
          }}
        >
          <NavBar />
          <Routes>
            <Route path="/" element={<Navigate to="/cards" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cards" element={<AllCards />} />
            <Route path="/trades" element={<AllTrades />} />
            <Route path="/trade/:tradeID" element={<SingleTrade />} />
            <Route
              path="/newtrade"
              element={
                <ProtectedRoute>
                  <NewTrade />
                </ProtectedRoute>
              }
            />
            <Route path="/register" element={<Registration />} />
            <Route
              path="/mytrades"
              element={
                <ProtectedRoute>
                  <MyTrades />
                </ProtectedRoute>
              }
            />
            {
              //only admin can see all users
              role === "admin" && (
                <Route
                  path="/allusers"
                  element={
                    <AdminRoute>
                      <AllUsers />
                    </AdminRoute>
                  }
                />
              )
            }
          </Routes>
          {/*TODO: add footer
           <Footer /> */}
        </UserContext.Provider>
      </Suspense>
    </>
  );
}

export default App;
