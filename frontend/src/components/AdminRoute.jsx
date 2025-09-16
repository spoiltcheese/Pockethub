import React, { useContext } from "react";
import UserContext from "../context/user";
import { Navigate } from "react-router";

const AdminRoute = (props) => {
  const userCtx = useContext(UserContext);
  const isAuthenticated = userCtx.accessToken.length > 0;
  const isAdmin = userCtx.role === "admin";

  console.log("User role:", userCtx.role);
  console.log("Is Admin:", isAdmin);

  if (!isAuthenticated && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return props.children;
};

export default AdminRoute;
