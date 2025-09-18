import React, { useState, useEffect, useContext } from "react";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "react-bootstrap";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Image from "react-bootstrap/Image";

import { Link, useNavigate } from "react-router-dom";
import UserContext from "../context/user";

const NewTrade = () => {
  const userContext = useContext(UserContext);
  const [currentUser, getCurrentUser] = useState(() => {
    const savedData = localStorage.getItem("currentUser");
    return savedData ? savedData : "no User found";
  });

  const [selectedRarityLF, setSelectedRarityLF] = useState("None");
  const [selectedValueLF, setSelectedValueLF] = useState("None");
  const [selectedValueTW, setSelectedValueTW] = useState("None");

  const [LFID, setLFID] = useState("");
  const [TWID, setTWID] = useState("");

  const handleSelectRarityLF = (eventKey) => {
    setSelectedRarityLF(eventKey);
  };

  // Helper to encode multiple values as a single eventKey (e.g., JSON string)
  const encodeEventKey = (card, extra) =>
    JSON.stringify({
      cardname: card.cardname,
      cardnumber: card.cardnumber,
      ...extra,
    });

  // Helper to decode eventKey back to object
  const decodeEventKey = (eventKey) => {
    try {
      return JSON.parse(eventKey);
    } catch {
      return { cardname: eventKey };
    }
  };

  // Update handlers to accept multiple values
  const handleSelectValueLF = (eventKey) => {
    const { cardname, cardnumber } = decodeEventKey(eventKey);

    setSelectedValueLF(cardname);
    setLFID(cardnumber);
  };

  const handleSelectValueTW = (eventKey) => {
    const { cardname, cardnumber } = decodeEventKey(eventKey);

    setSelectedValueTW(cardname);
    setTWID(cardnumber);
  };

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  async function getFilteredCards(rarity) {
    const url = `${import.meta.env.VITE_API_URL}/api/cards_filtered`;
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
      return [];
    }
  }

  async function getMedia(id) {
    const url = `${import.meta.env.VITE_API_URL}/api/single_card_media`;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cardID: id }),
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
      return [];
    }
  }

  useEffect(() => {
    if (LFID) {
      getMedia(LFID);
    }
  }, [LFID]);

  useEffect(() => {
    if (TWID) {
      getMedia(TWID);
    }
  }, [TWID]);

  async function addNewTrade() {
    const url = `${import.meta.env.VITE_API_URL}/api/addTrade`;
    const payload = {
      lookingfor: selectedValueLF,
      tradingwith: selectedValueTW,
      LFID: LFID,
      TWID: TWID,
      traderID: localStorage.getItem("currentUserID").replace(/"/g, ""),
      traderName: localStorage.getItem("currentUserName").replace(/"/g, ""),
    };
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      let data;
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error("Server did not return valid JSON.");
      }

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
      } else {
        userContext.setStatus("Trade successfully created!");
        navigate("/mytrades");
      }
      return data;
    } catch (error) {
      return [];
    }
  }

  const queryCardName = useQuery({
    queryKey: ["cardsByRarity", selectedRarityLF],
    queryFn: () => getFilteredCards(selectedRarityLF),
    enabled: selectedRarityLF !== "None",
  });

  const queryCardMediaLF = useQuery({
    queryKey: ["cardMediaLF", selectedRarityLF, LFID],
    queryFn: () => getMedia(LFID),
    enabled: !!LFID,
  });

  const queryCardMediaTW = useQuery({
    queryKey: ["cardMediaTW", selectedRarityLF, TWID],
    queryFn: () => getMedia(TWID),
    enabled: !!TWID,
  });

  // Map rarity codes to full names
  const rarityNames = {
    "1D": "1 Diamond",
    "2D": "2 Diamond",
    "3D": "3 Diamond",
    "4D": "4 Diamond",
    "1S": "1 Star",
    None: "None",
  };

  return (
    <Container>
      <Row>
        <Col>
          <h2>Create a New Trade</h2>
        </Col>
      </Row>
      <Row className="align-items-center">
        <Col>
          <DropdownButton
            id="rarity-dropdown"
            title={`Rarity: ${
              rarityNames[selectedRarityLF] || selectedRarityLF
            }`}
            onSelect={handleSelectRarityLF}
            menuAlign="left"
            style={{ maxWidth: "100%" }}
          >
            <Dropdown.Item eventKey="1D">{rarityNames["1D"]}</Dropdown.Item>
            <Dropdown.Item eventKey="2D">{rarityNames["2D"]}</Dropdown.Item>
            <Dropdown.Item eventKey="3D">{rarityNames["3D"]}</Dropdown.Item>
            <Dropdown.Item eventKey="4D">{rarityNames["4D"]}</Dropdown.Item>
            <Dropdown.Item eventKey="1S">{rarityNames["1S"]}</Dropdown.Item>
          </DropdownButton>
        </Col>
        <Col>
          <DropdownButton
            id="filtered-cards-dropdown"
            title={`Looking For: ${selectedValueLF}`}
            menuAlign="left"
            style={{ maxWidth: "100%" }}
            menuVariant="light"
            onSelect={handleSelectValueLF}
          >
            {queryCardName.isSuccess &&
              queryCardName.data &&
              queryCardName.data.map((card, idx) => (
                <Dropdown.Item
                  key={idx}
                  eventKey={encodeEventKey({
                    cardname: card.cardname,
                    cardnumber: card.cardnumber,
                  })}
                >
                  {card.cardname}
                </Dropdown.Item>
              ))}
          </DropdownButton>
        </Col>

        <Col>
          <DropdownButton
            id="filtered-cards-dropdown"
            title={`Trading With: ${selectedValueTW}`}
            menuAlign="left"
            style={{ maxWidth: "100%" }}
            menuVariant="light"
            onSelect={handleSelectValueTW}
          >
            {queryCardName.isSuccess &&
              queryCardName.data &&
              queryCardName.data.map((card, idx) => (
                <Dropdown.Item
                  key={idx}
                  eventKey={encodeEventKey({
                    cardname: card.cardname,
                    cardnumber: card.cardnumber,
                  })}
                >
                  {card.cardname}
                </Dropdown.Item>
              ))}
          </DropdownButton>
        </Col>

        <Col className="d-flex align-items-center justify-content-center">
          <Button variant="primary" type="submit" onClick={addNewTrade}>
            Submit Trade
          </Button>
        </Col>
      </Row>
      <Row>
        <Col></Col>
        <Col>
          {queryCardMediaLF.isLoading && <p>Loading...</p>}
          {queryCardMediaLF.isError && <p>Error loading card media</p>}
          {queryCardMediaLF.isSuccess &&
            queryCardMediaLF.data &&
            queryCardMediaLF.data.map((card, idx) => (
              <Image key={idx} src={`/media/A1/${card.uri}`} fluid></Image>
            ))}
        </Col>
        <Col>
          {queryCardMediaTW.isLoading && <p>Loading...</p>}
          {queryCardMediaTW.isError && <p>Error loading card media</p>}
          {queryCardMediaTW.isSuccess &&
            queryCardMediaTW.data &&
            queryCardMediaTW.data.map((card, idx) => (
              <Image key={idx} src={`/media/A1/${card.uri}`} fluid></Image>
            ))}
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
};

export default NewTrade;
