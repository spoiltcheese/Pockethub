import React, { useState, useEffect } from "react";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "react-bootstrap";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Image from "react-bootstrap/Image";

import { Link, useNavigate } from "react-router-dom";

const NewTrade = () => {
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
    console.log(cardname, cardnumber);
    setSelectedValueLF(cardname);
    setLFID(cardnumber);
  };

  const handleSelectValueTW = (eventKey) => {
    const { cardname, cardnumber } = decodeEventKey(eventKey);
    console.log(cardname, cardnumber);
    setSelectedValueTW(cardname);
    setTWID(cardnumber);
  };

  const navigate = useNavigate();

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

  async function getMedia(id) {
    const url = "http://localhost:5001/api/single_card_media";
    try {
      console.log(id);
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
      console.error(error.message);
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
    const url = "http://localhost:5001/api/addTrade";
    const payload = {
      lookingfor: selectedValueLF,
      tradingwith: selectedValueTW,
      LFID: LFID,
      TWID: TWID,
      traderID: localStorage.getItem("currentUserID").replace(/"/g, ""),
      traderName: localStorage.getItem("currentUserName").replace(/"/g, ""),
    };

    console.log("Submitting trade with payload:", payload);
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
        navigate("/mytrades");
      }
      return data;
    } catch (error) {
      console.error(error.message || error);
      return [];
    }
  }

  const queryCardName = useQuery({
    queryKey: ["cardsByRarity", selectedRarityLF],
    queryFn: () => getFilteredCards(selectedRarityLF),
  });

  const queryCardMediaLF = useQuery({
    queryKey: ["carMediaLF", selectedRarityLF],
    queryFn: () => getMedia(LFID),
  });

  const queryCardMediaTW = useQuery({
    queryKey: ["carMediaYW", selectedRarityLF],
    queryFn: () => getMedia(TWID),
  });

  return (
    <Container>
      <Row>
        <Col>
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
        </Col>
        <Col>
          <DropdownButton
            id="filtered-cards-dropdown"
            title={`Selected: ${selectedValueLF}`}
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
            title={`Selected: ${selectedValueTW}`}
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
                  {card.cardname}/{card.cardnumber}
                </Dropdown.Item>
              ))}
          </DropdownButton>
        </Col>

        <Col>
          <Button
            className="mt-3"
            variant="primary"
            type="submit"
            onClick={addNewTrade}
          >
            Submit Trade
          </Button>
        </Col>
      </Row>
      <Row>
        <Col> </Col>
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
        <Col> </Col>
      </Row>

      <style>{`
            .dropdown-menu {
                max-width: 100vw;
                max-height: 50vh;
                overflow-y: auto;
                word-break: break-word;
            }
        `}</style>
    </Container>
  );
};

export default NewTrade;
