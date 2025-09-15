import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const MyTrades = () => {
  const [currentUser, getCurrentUser] = useState(() => {
    const savedData = sessionStorage.getItem("currentUserID");
    return savedData ? savedData : "no User found";
  });

  async function getAllTrades() {
    const url = "http://localhost:5001/api/myTrades";
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          traderID: localStorage.getItem("currentUserID"),
        }),
      });

      let data;
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error("Server did not return valid JSON.");
      }

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
      console.error(error.message || error);
      return [];
    }
  }

  const queryAllTrades = useQuery({
    queryKey: ["allTrades"],
    queryFn: getAllTrades,
  });

  return (
    <div className="container">
      {currentUser && <h2>Your User ID: {currentUser}</h2>}
      <div className="row">
        <div className="col-md-3">Looking for:</div>
        <div className="col-md-3">Cards available to trade:</div>
        <div className="col-md-3">Trader ID:</div>
        <div className="col-md-3">Trader Name:</div>
      </div>

      {queryAllTrades.isSuccess && (
        <div>
          {queryAllTrades.data &&
            queryAllTrades.data.map((trade) => (
              <div className="row" key={trade.id}>
                <div className="col-md-3">{trade.lookingfor_cardname}</div>
                <div className="col-md-3">{trade.tradingwith_cardname}</div>
                <div className="col-md-3">{trade.traderID}</div>
                <div className="col-md-3">{trade.traderName}</div>
              </div>
            ))}
        </div>
      )}
      <div className="row">
        <div className="col-md-6"></div>
        <div className="col-md-6"></div>
      </div>
    </div>
  );
};

export default MyTrades;
