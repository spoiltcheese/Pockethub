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
      return result;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  }

  async function acceptTrade() {
    const url = `http://localhost:5001/api/trades/acceptTrade/${tradeID}`;
    try {
      const response = await fetch(url);
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

  async function completeTrade() {
    const url = `http://localhost:5001/api/trades/completeTrade/${tradeID}`;
    try {
      const response = await fetch(url);
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
              <div className="row" key={trade.id}>
                <div className="col-md-3">{trade.lookingfor}</div>
                <div className="col-md-3">{trade.tradingwith}</div>
                <div className="col-md-3">{trade.traderid}</div>
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
