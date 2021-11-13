import React, { useState, useEffect } from "react";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
// Styles
import { Label, Button, SubBtn, Pill, GenreBar } from "./ModalUpdate.styles";
// Components
import Modal from "../Modal";

const ModalUpdate = ({ toggleModal, item, type }) => {
  const [state, setState] = useState({ Title: "", Genre: [], Maker: "" });
  const [genre, setGenre] = useState([]);
  // TODO: Update sends results to server and server needs to process it
  const addTag = (item) => {
    setGenre((state) => [...state, item]);
    document.getElementById("genre").value = "";
  };

  const removeTag = (index) => {
    setGenre((state) => state.filter((_, i) => i !== index));
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
        setOpenModal={toggleModal}
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
            <input type="text" required id="genre" />
            <div className="label-text">Genre</div>
          </Label>
          <SubBtn
            onClick={() => addTag(document.getElementById("genre").value)}
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
          <Button onClick={() => {}}>Submit</Button>
        </div>
      </Modal>
    </>
  );
};

export default ModalUpdate;
