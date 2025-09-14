import React, { useState, useEffect } from "react";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const NewTrade = () => {
  const [selectedValue, setSelectedValue] = useState("None");

  const handleSelectRarity = (eventKey) => {
    setSelectedValue(eventKey);
  };

  useEffect(() => {
    console.log(`Selected value changed to: ${selectedValue}`);
  }, [selectedValue]);

  const queryClient = useQueryClient();

  async function getFilteredCards() {
    const url = "http://localhost:5001/api/cards_filtered";
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rarity: selectedValue }),
      });

      const data = await res.json();

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
      console.error(error.message);
      return [];
    }
  }

  const queryCardMedia = useQuery({
    queryKey: ["cardsByRarity", selectedValue],
    queryFn: getFilteredCards,
  });

  return (
    <div className="container">
      <p className="mt-2">Current Selection: {selectedValue}</p>

      <DropdownButton
        id="rarity-dropdown"
        title={`Selected: ${selectedValue}`}
        onSelect={handleSelectRarity}
      >
        <Dropdown.Item eventKey="1D">1 Diamond</Dropdown.Item>
        <Dropdown.Item eventKey="2D">2 Diamond</Dropdown.Item>
        <Dropdown.Item eventKey="3D">3 Diamond</Dropdown.Item>
        <Dropdown.Item eventKey="4D">4 Diamond</Dropdown.Item>
        <Dropdown.Item eventKey="1S">1 Star</Dropdown.Item>
      </DropdownButton>

      <DropdownButton id="filtered-cards-dropdown">
        {queryCardMedia.isSuccess &&
          queryCardMedia.data &&
          queryCardMedia.data.map((card, id) => (
            <Dropdown.Item key={id} eventKey={card.cardname}>
              {card.cardname}
            </Dropdown.Item>
          ))}
      </DropdownButton>
    </div>
  );
};

export default NewTrade;
