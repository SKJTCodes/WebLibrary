import React, { useState, useEffect } from "react";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
// Styles
import { Label, Button, SubBtn, Pill, GenreBar } from "./ModalUpdate.styles";
// Components
import Modal from "../Modal";

const ModalUpdate = ({ toggleModal, item, type, setInfoBar, setData }) => {
  // Set State
  const [state, setState] = useState({ Title: "", Genre: [], Maker: "" });
  const [genre, setGenre] = useState([]);

  const addTag = (item) => {
    setGenre((state) => [...state, item]);
    document.getElementById("genre").value = "";
  };

  const removeTag = (index) => {
    setGenre((state) => state.filter((_, i) => i !== index));
  };

  const handleUpdate = () => {
    const updState = { ...state, Genre: genre };
    setData(updState);
    setInfoBar((state) => ({ ...state, identity: updState }));
    toggleModal("update");
  };

  useEffect(() => {
    if (Object.keys(item).length !== 0) {
      setState(item);
      setGenre(item.Genre);
    }
  }, [item]);

  return (
    <>
      <Modal
        setOpenModal={() => toggleModal("update")}
        cancelButton=""
        acceptButton=""
        title="Edit Item"
      >
        {/* Title Textbox */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Label>
            <input
              type="text"
              required
              autoComplete="off"
              value={state.Title}
              onChange={(e) =>
                setState((state) => ({ ...state, Title: e.target.value }))
              }
            />
            <div className="label-text">Title</div>
          </Label>
        </div>
        {/* Maker Textbox */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Label>
            <input
              type="text"
              required
              value={state.Maker}
              autoComplete="off"
              onChange={(e) =>
                setState((state) => ({ ...state, Maker: e.target.value }))
              }
            />
            <div className="label-text">
              {type === "c" ? "Author" : "Brand"}
            </div>
          </Label>
        </div>
        {/* Genre Textbox */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Label>
            <input type="text" required id="genre" autoComplete="off" />
            <div className="label-text">Genre</div>
          </Label>
          <SubBtn
            onClick={() => {
              const value = document.getElementById("genre").value
              if (value.length > 2) addTag(value)
              else console.log("Please insert more than 2 characters.")
            }}
          >
            <KeyboardArrowRightRoundedIcon fontSize="large" />
          </SubBtn>
        </div>
        {/* Genre Bar */}
        <GenreBar>
          {genre.map((e, index) => {
            return (
              <Pill key={index} onClick={() => removeTag(index)}>
                {e}
              </Pill>
            );
          })}
        </GenreBar>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "25px",
          }}
        >
          <Button onClick={() => handleUpdate()}>Submit</Button>
        </div>
      </Modal>
    </>
  );
};

export default ModalUpdate;
