import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
// Styles
import { Label, Button, SubBtn, Pill, GenreBar } from "./ComicModal.styles";
// Components
import Modal from "../Modal";
import Spinner from "../Spinner";
// Hooks
import { useDeleteComic } from "../../hooks/useDelete";

export const EditComicModal = ({ toggleModal, item, update, setItem }) => {
  const [comic, setComic] = useState({ title: "", genre: [], author: "" });
  const [genre, setGenre] = useState([]);

  useEffect(() => {
    if (Object.keys(item).length !== 0) {
      setComic(item);
      setGenre(item.genre);
    }
  }, [item]);

  const removeTag = (index) => {
    setGenre((state) => state.filter((_, i) => i !== index));
  };

  const addTag = (item) => {
    setGenre((state) => [...state, item]);
    document.getElementById("genre").value = "";
  };

  const handleUpdate = () => {
    const updState = { ...comic, genre: genre };
    update(updState);
    setItem(state => ({...state, identity: updState}))
    toggleModal(state => !state)
  };

  return (
    <Modal
      title="Edit Item"
      cancelButton=""
      acceptButton=""
      setOpenModal={() => toggleModal("edit")}
    >
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Label>
          <input
            type="text"
            required
            value={comic.title}
            onChange={(e) =>
              setComic((state) => ({ ...state, title: e.target.value }))
            }
          />
          <div className="label-text">Title</div>
        </Label>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Label>
          <input
            type="text"
            required
            value={comic.author}
            onChange={(e) =>
              setComic((state) => ({ ...state, author: e.target.value }))
            }
          />
          <div className="label-text">Author</div>
        </Label>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Label>
          <input type="text" required id="genre" />
          <div className="label-text">Genre</div>
        </Label>
        <SubBtn onClick={() => addTag(document.getElementById("genre").value)}>
          <KeyboardArrowRightRoundedIcon fontSize="large" />
        </SubBtn>
      </div>
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
  );
};

export const DeleteComicModal = ({ title, id, toggleModal }) => {
  const { error, loading, done, setItemId } = useDeleteComic();

  const navigate = useNavigate();

  useEffect(() => {
    if (!done) return;
    navigate("/");
  }, [done, navigate]);

  return (
    <Modal
      title={`Delete ${title}`}
      setOpenModal={() => toggleModal("delete")}
      cancelButton="No"
      acceptButton="Yes"
      callback={() => setItemId(id)}
    >
      {error && <div>An Error Occured ...</div>}
      {loading && <Spinner />}
      <p>Do you want to delete this Item? All chapters will be removed.</p>
    </Modal>
  );
};
