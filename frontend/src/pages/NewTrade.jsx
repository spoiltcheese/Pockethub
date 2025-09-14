import React, { useState, useEffect } from "react";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const NewTrade = () => {
  const [selectedRarityLF, setSelectedRarityLF] = useState("None");
  const [selectedValueLF, setSelectedValueLF] = useState("None");

  const [selectedRarityTW, setSelectedRarityTW] = useState("None");
  const [selectedValueTW, setSelectedValueTW] = useState("None");

  const handleSelectRarityLF = (eventKey) => {
    setSelectedRarityLF(eventKey);
  };

  const handleSelectValueLF = (eventKey) => {
    setSelectedValueLF(eventKey);
  };

  const handleSelectRarityTW = (eventKey) => {
    setSelectedRarityTW(eventKey);
  };

  const handleSelectValueTW = (eventKey) => {
    setSelectedValueTW(eventKey);
  };

  useEffect(() => {
    //console.log(`Selected rarity changed to: ${selectedRarity}`);
  }, [selectedRarityLF]);

  const queryClient = useQueryClient();

  async function getFilteredCards(rarity) {
    const url = "http://localhost:5001/api/cards_filtered";
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rarity: rarity }),
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
    queryKey: ["cardsByRarity", selectedRarityLF],
    queryFn: () => getFilteredCards(selectedRarityLF),
  });

  const queryCardMedia2 = useQuery({
    queryKey: ["cardsByRarity2", selectedRarityTW],
    queryFn: () => getFilteredCards(selectedRarityTW),
  });

  return (
    <div className="container">
      <p className="mt-2">Looking for: {selectedValueLF}</p>

      <DropdownButton
        id="rarity-dropdown"
        title={`Selected: ${selectedRarityLF}`}
        onSelect={handleSelectRarityLF}
        menuAlign="left"
        style={{ maxWidth: "100%" }}
      >
        <Dropdown.Item eventKey="1D">1 Diamond</Dropdown.Item>
        <Dropdown.Item eventKey="2D">2 Diamond</Dropdown.Item>
        <Dropdown.Item eventKey="3D">3 Diamond</Dropdown.Item>
        <Dropdown.Item eventKey="4D">4 Diamond</Dropdown.Item>
        <Dropdown.Item eventKey="1S">1 Star</Dropdown.Item>
      </DropdownButton>

      <DropdownButton
        id="filtered-cards-dropdown"
        title={`Selected: ${selectedValueLF}`}
        menuAlign="left"
        style={{ maxWidth: "100%" }}
        menuVariant="light"
        onSelect={handleSelectValueLF}
      >
        {queryCardMedia.isSuccess &&
          queryCardMedia.data &&
          queryCardMedia.data.map((card, id) => (
            <Dropdown.Item key={id} eventKey={card.cardname}>
              {card.cardname}
            </Dropdown.Item>
          ))}
      </DropdownButton>

      <p className="mt-2">Trading with: {selectedValueTW}</p>

      <DropdownButton
        id="rarity-dropdown"
        title={`Selected: ${selectedRarityLF}`}
        onSelect={handleSelectRarityLF}
        menuAlign="left"
        style={{ maxWidth: "100%" }}
      >
        <Dropdown.Item eventKey="1D">1 Diamond</Dropdown.Item>
        <Dropdown.Item eventKey="2D">2 Diamond</Dropdown.Item>
        <Dropdown.Item eventKey="3D">3 Diamond</Dropdown.Item>
        <Dropdown.Item eventKey="4D">4 Diamond</Dropdown.Item>
        <Dropdown.Item eventKey="1S">1 Star</Dropdown.Item>
      </DropdownButton>

      <DropdownButton
        id="filtered-cards-dropdown"
        title={`Selected: ${selectedValueTW}`}
        menuAlign="left"
        style={{ maxWidth: "100%" }}
        menuVariant="light"
        onSelect={handleSelectValueTW}
      >
        {queryCardMedia.isSuccess &&
          queryCardMedia.data &&
          queryCardMedia.data.map((card, id) => (
            <Dropdown.Item key={id} eventKey={card.cardname}>
              {card.cardname}
            </Dropdown.Item>
          ))}
      </DropdownButton>

      <style>{`
            .dropdown-menu {
                max-width: 100vw;
                max-height: 50vh;
                overflow-y: auto;
                word-break: break-word;
            }
        `}</style>
    </div>
  );
};

export default NewTrade;
