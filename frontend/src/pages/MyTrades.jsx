import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const MyTrades = () => {
  const [currentUser, getCurrentUser] = useState(() => {
    const savedData = localStorage.getItem("currentUserID");
    return savedData ? savedData : "no User found";
  });

  async function getAllTrades() {
    const url = "http://localhost:5001/api/myTrades";
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
          gameID: localStorage.getItem("currentUserID").replace(/"/g, ""),
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
      console.dir(data);
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
    <>
      <div className="container">
        {currentUser && <h2>Your User ID: {currentUser}</h2>}
        <div className="row">
          <div className="col-md-3">&nbsp;</div>
          <div className="col-md-3">Looking for:</div>
          <div className="col-md-3">Cards available to trade:</div>
        </div>

        {queryAllTrades.isSuccess && (
          <div>
            {queryAllTrades.data &&
              queryAllTrades.data.map((trade) => (
                <>
                  <div className="row" key={trade.uuid}>
                    <div className="col-md-3">
                      <a href={`/trade/${trade.uuid}`}>Go to trade</a>
                    </div>
                    <div className="col-md-3">{trade.lookingfor}</div>
                    <div className="col-md-3">{trade.tradingwith}</div>
                  </div>

                  <div className="row" key={trade.uuid}>
                    <div className="col-md-3"></div>
                    <div className="col-md-3">
                      <img
                        key={trade.lookingfor}
                        src={`/media/A1/${trade.LFURI}`}
                        alt={`Card ${trade.lookingfor}`}
                        className="img-fluid"
                      />
                    </div>
                    <div className="col-md-3">
                      <img
                        key={trade.tradingwith}
                        src={`/media/A1/${trade.TWURI}`}
                        alt={`Card ${trade.tradingwith}`}
                        className="img-fluid"
                      />
                    </div>
                  </div>
                </>
              ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MyTrades;
