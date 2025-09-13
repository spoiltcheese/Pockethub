import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const AllTrades = () => {
  const queryClient = useQueryClient();

  async function getAllTrades() {
    const url = "http://localhost:5001/api/trades";
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

  const queryAllTrades = useQuery({
    queryKey: ["allTrades"],
    queryFn: getAllTrades,
  });

  return (
    <div className="container">
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

export default AllTrades;
