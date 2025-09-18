import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useMutation } from "@tanstack/react-query";

const Registration = () => {
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [gameIDInput, setGameIDInput] = useState("");
  const navigate = useNavigate();

  const doRegister = async () => {
    const url = `${import.meta.env.VITE_API_URL}/auth/register`;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: usernameInput.trim(),
          password: passwordInput.trim(),
          email: emailInput.trim(),
          gameID: gameIDInput.trim(),
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

      return data;
    } catch (error) {
      return [];
    }
  };

  const registerQuery = useMutation({
    mutationFn: doRegister,
    onSuccess: () => {
      navigate("/login");
    },
  });

  return (
    <>
      <div className="card text-center mt-4 mb-4">
        <div className="card-title text-center mt-4 mb-4">
          <h3>Registration</h3>
        </div>
        <div className="card-body">
          <label className="col-sm-3" htmlFor="username">
            Username
          </label>
          <input
            className="col-sm-4"
            id="username"
            value={usernameInput}
            onChange={(event) => setUsernameInput(event.target.value)}
          />

          <div>
            {registerQuery.isError && JSON.stringify(registerQuery.error)}
          </div>
        </div>
        <div className="card-body">
          <label className="col-sm-3" htmlFor="email">
            Email
          </label>
          <input
            className="col-sm-4"
            type="email"
            id="email"
            value={emailInput}
            onChange={(event) => setEmailInput(event.target.value)}
          />
        </div>

        <div className="card-body">
          <label className="col-sm-3" htmlFor="password">
            Password
          </label>
          <input
            className="col-sm-4"
            type="password"
            id="password"
            value={passwordInput}
            onChange={(event) => setPasswordInput(event.target.value)}
          />
        </div>

        <div className="card-body">
          <label className="col-sm-3" htmlFor="gameID">
            GameID
          </label>
          <input
            className="col-sm-4"
            type="text"
            id="gameID"
            value={gameIDInput}
            onChange={(event) => setGameIDInput(event.target.value)}
          />
        </div>

        <div className="card-body row">
          <div className="col-sm-4" />
          <button
            className="col-sm-4 btn btn-primary"
            onClick={(event) => {
              event.preventDefault();
              registerQuery.mutate();
            }}
          >
            Sign up
          </button>
          <div className="col-sm-4" />
        </div>
      </div>
    </>
  );
};

export default Registration;
