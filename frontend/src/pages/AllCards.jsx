import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const AllCards = () => {
  const queryClient = useQueryClient();

  async function getCardMedia() {
    const url = "http://localhost:5001/api/card_media";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result);
      return result;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  }
  const queryCardMedia = useQuery({
    queryKey: ["cardMedia"],
    queryFn: getCardMedia,
  });

  // In React (Create React App or Vite), the public directory is at the root of your project.
  // Files in /public can be referenced with a relative path starting with "/".
  // For example, if you have an image at /public/media/example.jpg, use src="/media/example.jpg"

  return (
    <div>
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
