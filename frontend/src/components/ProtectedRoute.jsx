import React, { useContext } from "react";
import UserContext from "../context/user";
import { Navigate } from "react-router";

const ProtectedRoute = (props) => {
  const userCtx = useContext(UserContext);
  //const isAuthenticated = userCtx.accessToken.length > 0;
  const currentUserID = localStorage.getItem("currentUserID");

  if (!currentUserID) {
    return <Navigate to="/login" replace />;
  }
  return props.children;
};

export default ProtectedRoute;
