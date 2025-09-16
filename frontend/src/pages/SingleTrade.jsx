import React, { useParams } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const SingleTrade = () => {
  const queryClient = useQueryClient();
  const { tradeID } = useParams();

  async function getTrade() {
    const url = `http://localhost:5001/api/trade/${tradeID}`;
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
        <div className="col-md-3">Trader Name:</div>
      </div>

      {queryTrade.isSuccess && (
        <div>
          {queryTrade.data &&
            queryTrade.data.map((trade) => (
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

export default SingleTrade;
