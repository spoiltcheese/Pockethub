import React, { useEffect } from "react";
import { useContext } from "react";
import UserContext from "../context/user";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("refresh", "");
    userCtx.setAccessToken("");
    localStorage.setItem("currentUserID", "");
    localStorage.setItem("currentUserName", "");
    localStorage.setItem("refresh", "");
    localStorage.setItem("access", "");
    localStorage.setItem("role", "");
    userCtx.setUsername("");
    userCtx.setRole("");
    userCtx.setGameID("");
    navigate("/");
    // to empty all states and contexts for next user
    window.location.reload(true);
  }, []);

  return <></>;
};

export default Logout;
