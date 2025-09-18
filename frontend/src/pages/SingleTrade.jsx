import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";

const SingleTrade = () => {
  const queryClient = useQueryClient();
  const { tradeID } = useParams();

  async function getTrade() {
    const url = `http://localhost:5001/api/trades/${tradeID}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const result = await response.json();
      console.dir(result);
      return result;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  }

  async function acceptTrade() {
    const url = `http://localhost:5001/api/trades/acceptTrade`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage
            .getItem("access")
            .replace(/"/g, "")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          //gameID: localStorage.getItem("currentUserID").replace(/"/g, ""),
          tradeID: tradeID,
        }),
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const result = await response.json();
      console.dir(result);
      return result;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  }

  async function completeTrade() {
    const url = `http://localhost:5001/api/trades/completeTrade`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage
            .getItem("access")
            .replace(/"/g, "")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          //gameID: localStorage.getItem("currentUserID").replace(/"/g, ""),
          tradeID: tradeID,
        }),
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  }

  const queryTrade = useQuery({
    queryKey: ["trade", tradeID],
    queryFn: getTrade,
  });

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-3">Looking for:</div>
        <div className="col-md-3">Cards available to trade:</div>
        <div className="col-md-3">Trader ID:</div>
      </div>

      {queryTrade.isSuccess && (
        <div>
          {queryTrade.data &&
            queryTrade.data.map((trade) => (
              <div key={trade.uuid}>
                <div className="row">
                  <div className="col-md-3">{trade.lookingfor}</div>
                  <div className="col-md-3">{trade.tradingwith}</div>
                  <div className="col-md-3">{trade.traderID}</div>
                </div>
                <div className="row">
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
                  <div className="col-md-3"></div>
                </div>
              </div>
            ))}
        </div>
      )}
      <button className="col-sm-4 btn btn-primary" onClick={acceptTrade}>
        Accept Trade
      </button>

      <button className="col-sm-4 btn btn-danger" onClick={completeTrade}>
        Complete Trade
      </button>
    </div>
  );
};

export default SingleTrade;
