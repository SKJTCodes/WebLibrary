import React, { useState } from "react";
import { useParams } from "react-router-dom";
// Hooks
import { useComicFetch, useUpdateComic } from "../hooks/useComicFetch";
// Components
import Spinner from "./Spinner";
import InfoBar from "./InfoBar";
import Grid from "./Grid";
import Thumb from "./Thumb";
import FloatingButton from "./FloatingButton";
import { DeleteComicModal, EditComicModal } from "./ComicModal";

const ComicPage = () => {
  const { comicId } = useParams();
  const { state, loading, error, setState } = useComicFetch(comicId);
  const { setData, loading: loading2, error: error2} = useUpdateComic()

  const defState = { edit: false, delete: false };
  const [openModal, setOpenModal] = useState(defState);

  const toggleModal = (type) => {
    setOpenModal((state) => ({ ...defState, [type]: !state[type] }));
  };

  if (loading | loading2) return <Spinner />;
  if (error | error2) return <div>Something went wrong ....</div>;

  if (Object.keys(state).length > 0) {
    return (
      <>
        {openModal.delete && (
          <DeleteComicModal
            title={state["identity"].Title}
            toggleModal={toggleModal}
            id={state["identity"].ItemId}
          />
        )}
        {openModal.edit && (
          <EditComicModal item={state["identity"]} toggleModal={toggleModal} update={setData} setItem={setState} />
        )}

        <div
          style={{
            position: "fixed",
            right: "1%",
            bottom: "1%",
          }}
        >
          <FloatingButton type="edit" callback={() => toggleModal("edit")} />
          <FloatingButton
            type="delete"
            callback={() => toggleModal("delete")}
          />
        </div>
        <InfoBar item={state["identity"]} />
        <div style={{ margin: "20px" }}></div>
        <Grid header={"Chapters"}>
          {state["chapters"].map((chpt) => (
            <Thumb
              key={chpt.ChapterNo}
              image={`${process.env.REACT_APP_DOMAIN}${chpt.PagePaths[0]}`}
              itemId={`${chpt.ItemId}/${chpt.ChapterNo}`}
              title={`Chapter ${chpt.ChapterNo}`}
              type="cc"
              clickable
              disable
            />
          ))}
        </Grid>
      </>
    );
  }

  return null;
};

export default ComicPage;
