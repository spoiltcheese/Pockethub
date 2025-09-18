import React, { useState, useEffect, useContext } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../context/user";

const ChangeUserDetails = () => {
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();

  const [gameIDInput, setGameIDInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [message, setMessage] = useState("");

  const doChange = async () => {
    const url = `${import.meta.env.VITE_API_URL}/auth/changeDetails`;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage
            .getItem("access")
            .replace(/"/g, "")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameID: gameIDInput.trim(),
          password: passwordInput.trim(),
          newPassword: newPasswordInput.trim(),
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
      } else {
        navigate("/logout");
      }
      return data;
    } catch (error) {
      //console.error(error.message);
      return [];
    }
  };

  const getCurrentID = async () => {
    const url = `${import.meta.env.VITE_API_URL}/auth/getCurrentUserGameID`;
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage
            .getItem("access")
            .replace(/"/g, "")}`,
          "Content-Type": "application/json",
        },
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
      console.log(data);
      return data;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  };

  const auth = useQuery({
    queryKey: ["auth"],
    queryFn: doChange,
    enabled: false,
    retry: false,
  });

  const currentID = useQuery({
    queryKey: ["currentID"],
    queryFn: getCurrentID,
  });

  useEffect(() => {
    if (currentID.data) {
      console.log(currentID.data.gameid);
      setGameIDInput(currentID.data.gameid);
    }
  }, [currentID.data]);

  return (
    <div className="card col-sm-6 offset-sm-3" style={{ marginTop: "20px" }}>
      {message && <div className="alert alert-info">{message}</div>}
      <div className="card-body">
        <label className="col-sm-3" htmlFor="gameID">
          GameID
        </label>
        <input
          className="col-sm-6"
          id="gameID"
          value={gameIDInput ?? ""}
          onChange={(event) => setGameIDInput(event.target.value)}
        />
        {auth.isError && JSON.stringify(auth.error)}
      </div>

      <div className="card-body">
        <label className="col-sm-3" htmlFor="password">
          Old Password
        </label>
        <input
          className="col-sm-6"
          type="password"
          id="password"
          value={passwordInput ?? ""}
          onChange={(event) => setPasswordInput(event.target.value)}
        />
      </div>

      <div className="card-body">
        <label className="col-sm-3" htmlFor="newPassword">
          New Password
        </label>
        <input
          className="col-sm-6"
          type="password"
          id="newPassword"
          value={newPasswordInput ?? ""}
          onChange={(event) => setNewPasswordInput(event.target.value)}
        />
      </div>

      <div className="card-body">
        <div className="col-sm-4" />
        <button className="col-sm-6 btn btn-primary" onClick={auth.refetch}>
          Change
        </button>
        <div className="col-sm-6" />
      </div>
    </div>
  );
};

export default ChangeUserDetails;
