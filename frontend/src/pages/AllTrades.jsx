import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const AllTrades = () => {
  const queryClient = useQueryClient();

  async function getAllTrades() {
    const url = `${import.meta.env.VITE_API_URL}/api/trades`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
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
        <div className="col-md-3"></div>
        <div className="col-md-3">Looking for:</div>
        <div className="col-md-3">Cards available to trade:</div>
        <div className="col-md-3">Trader ID:</div>
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
  );
};

export default AllTrades;
