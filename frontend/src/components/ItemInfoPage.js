import React, { useState } from "react";
import { useParams } from "react-router-dom";
// Hooks
import { useFetchEntry } from "../hooks/useLibraryFetch";
import { useUpdateComic } from "../hooks/useComicFetch";
// Components
import { DeleteComicModal, EditComicModal } from "./ComicModal";
import FloatingButton from "./FloatingButton";
import Spinner from "./Spinner";
import InfoBar from "./InfoBar";
import Grid from "./Grid";
import Thumb from "./Thumb";
// Helper
import Helper from "../Helper";

const ItemInfoPage = () => {
  // URL Param
  const { itemType, itemId } = useParams();
  // Get Chapter/ Item Info from Server
  const { state, loading, error, setState } = useFetchEntry(itemId, itemType);
  // To update Database
  const { setData, loading: loading2, error: error2 } = useUpdateComic();
  // States
  const defState = { edit: false, delete: false };
  const [openModal, setOpenModal] = useState(defState);

  const tableType = itemType === "c" ? "chapter" : "episode";

  if (error | error2) return <div>Encountered an Error ...</div>;
  if (loading | loading2) return <Spinner />;

  const toggleModal = (type) => {
    setOpenModal((state) => ({ ...defState, [type]: !state[type] }));
  };

  if (Object.keys(state).length > 0)
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
          <EditComicModal
            item={state["identity"]}
            toggleModal={toggleModal}
            update={setData}
            setItem={setState}
          />
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

        <Grid header={`${Helper.titleCase(tableType)}s`}>
          {state[`${tableType}s`].map((item) => (
            <Thumb
              key={item[`${Helper.titleCase(tableType)}No`]}
              image={
                itemType === "c"
                  ? `${process.env.REACT_APP_DOMAIN}${item.PagePaths[0]}`
                  : null
              }
              itemId={`${item.ItemId}/${
                item[`${Helper.titleCase(tableType)}No`]
              }`}
              title={`${Helper.titleCase(tableType)} ${
                item[`${Helper.titleCase(tableType)}No`]
              }`}
              type={itemType}
              clickable
              disable
            />
          ))}
        </Grid>
      </>
    );

  return null;
};

export default ItemInfoPage;
