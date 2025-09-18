import React, { useState, useEffect, useContext } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../context/user";

const Login = () => {
  const userCtx = useContext(UserContext);

  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const navigate = useNavigate();
  const [currentUser, getCurrentUser] = useState("");

  const doLogin = async () => {
    const url = `${import.meta.env.VITE_API_URL}/auth/login`;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: usernameInput.trim(),
          password: passwordInput.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data?.errors) {
          const errorMsgArray = data.msg.map((error) => error.msg);
          const errorMsgs = errorMsgArray.join(", ");
          throw data.errors[0].msg;
        } else if (data.status === "error") {
          throw data.msg;
        } else {
          throw "an unknown error has occurred, please try again later";
        }
      }

      const decoded = jwtDecode(data.access_token);
      userCtx.setAccessToken(data.access_token);
      if (decoded) {
        console.log(decoded);
        localStorage.setItem("currentUserID", JSON.stringify(decoded.gameID));
        localStorage.setItem("currentUserName", JSON.stringify(decoded.name));
        localStorage.setItem("refresh", JSON.stringify(data.refresh_token));
        localStorage.setItem("access", JSON.stringify(data.access_token));
        localStorage.setItem("role", JSON.stringify(decoded.role));
        userCtx.setUsername(decoded.name);
        userCtx.setRole(decoded.role);
        userCtx.setGameID(decoded.gameID);
      }
      navigate("/mytrades");
      return data;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  };

  const auth = useQuery({
    queryKey: ["auth"],
    queryFn: doLogin,
    enabled: false,
    retry: false,
  });

  return (
    <div className="card col-sm-6 offset-sm-3" style={{ marginTop: "20px" }}>
      <div className="card-title text-center mt-4 mb-4">
        <h3>Login</h3>
      </div>

      <div className="card-body">
        <label className="col-sm-3" htmlFor="username">
          Username
        </label>
        <input
          className="col-sm-6"
          id="username"
          value={usernameInput}
          onChange={(event) => setUsernameInput(event.target.value)}
        />
        {auth.isError && JSON.stringify(auth.error)}
      </div>

      <div className="card-body">
        <label className="col-sm-3" htmlFor="password">
          Password
        </label>
        <input
          className="col-sm-6"
          type="password"
          id="password"
          value={passwordInput}
          onChange={(event) => setPasswordInput(event.target.value)}
        />
      </div>

      <div className="card-body">
        <div className="col-sm-4" />
        <button className="col-sm-6 btn btn-primary" onClick={auth.refetch}>
          Login
        </button>
        <div className="col-sm-6" />
      </div>

      <div
        className="card-body row justify-content-center"
        style={{ marginTop: "20px" }}
      >
        <div className="col-sm-4 text-center">
          <Link to="/register">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
