import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const AllUsers = () => {
  async function getAllUsers() {
    const url = `${import.meta.env.VITE_API_URL}/auth/users`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage
            .getItem("access")
            .replace(/"/g, "")}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      return [];
    }
  }

  const queryAllUsers = useQuery({
    queryKey: ["allUsers"],
    queryFn: getAllUsers,
  });

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-3">User Name:</div>
        <div className="col-md-3">Game ID:</div>
      </div>

      {queryAllUsers.isSuccess && (
        <div>
          {queryAllUsers.data &&
            queryAllUsers.data.map((user, idx) => (
              <div className="row" key={idx}>
                <div className="col-md-3">{user.name}</div>
                <div className="col-md-3">{user.gameid}</div>
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

export default AllUsers;
