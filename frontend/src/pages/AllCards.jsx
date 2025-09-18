import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const AllCards = () => {
  const queryClient = useQueryClient();

  async function getCardMedia() {
    const url = `${import.meta.env.VITE_API_URL}/api/card_media`;
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
  const queryCardMedia = useQuery({
    queryKey: ["cardMedia"],
    queryFn: getCardMedia,
  });

  return (
    <div className="container">
      {queryCardMedia.isSuccess && (
        <div>
          {queryCardMedia.data &&
            queryCardMedia.data.map((card) => (
              <img
                key={card.id}
                src={`/media/A1/${card.uri}`}
                alt={`Card ${card.id}`}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default AllCards;
