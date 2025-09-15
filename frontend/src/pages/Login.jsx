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
        sessionStorage.setItem("currentUserID", JSON.stringify(decoded.gameID));
        sessionStorage.setItem("currentUserName", JSON.stringify(decoded.name));
      }
      navigate("/mytrades");
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

  //   const refreshAccessTokenMutation = useMutation({
  //     mutationFn: async () => {
  //       return await fetchData(`/auth/refresh`, "POST", {
  //         refresh: localStorage.getItem("refresh"),
  //       });
  //     },
  //     onSuccess: (data) => {
  //       try {
  //         authCtx.setAccessToken(data.access);
  //         const decoded = jwtDecode(data.access);
  //         if (decoded) {
  //           authCtx.setUsername(decoded.username);
  //           authCtx.setUserId(decoded.id);
  //         }
  //         navigate("/user");
  //       } catch (e) {
  //         console.error(e.message);
  //       }
  //     },
  //   });

  //   useEffect(() => {
  //     // Auto login for users with refresh token in localStorage
  //     const refresh = localStorage.getItem("refresh");
  //     if (refresh && refresh !== "undefined") refreshAccessTokenMutation.mutate();
  //   }, []);

  const loginQuery = useMutation({
    mutationFn: doLogin,
    onSuccess: () => {
      navigate("/mytrades");
    },
  });

  return (
    <div>
      <div>
        <div className="card-title text-center mt-4 mb-4">
          <h3>Login</h3>
        </div>

        <div className="card-body">
          <label className="col-sm-3" htmlFor="username">
            Username
          </label>
          <input
            className="col-sm-9"
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
            className="col-sm-9"
            type="password"
            id="password"
            value={passwordInput}
            onChange={(event) => setPasswordInput(event.target.value)}
          />
        </div>

        <div className="card-body row">
          <div className="col-sm-4" />
          <button className="col-sm-4 btn btn-primary" onClick={auth.refetch}>
            Login
          </button>
          <div className="col-sm-4" />
        </div>

        <button
          className="col-sm-4 btn btn-primary"
          onClick={(event) => {
            event.preventDefault();
            loginQuery.mutate();
          }}
        >
          Sign in
        </button>

        <div
          className="card-body row text-center"
          style={{ marginTop: "-20px" }}
        >
          <Link to="/register">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
