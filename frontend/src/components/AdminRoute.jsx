import React, { useContext } from "react";
import UserContext from "../context/user";
import { Navigate } from "react-router";

const AdminRoute = (props) => {
  const userCtx = useContext(UserContext);

  const currentUserID = localStorage.getItem("currentUserID");
  const currentUserRole = localStorage.getItem("role");

  if (!currentUserID && currentUserRole !== "admin") {
    return <Navigate to="/" replace />;
  }

  return props.children;
};

export default AdminRoute;
