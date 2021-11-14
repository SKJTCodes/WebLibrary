import React, { useState } from "react";
import { useParams } from "react-router-dom";
// Hooks
import { useFetchEntry } from "../hooks/useLibraryFetch";
// Components
import FloatingButton from "./FloatingButton";
import ModalUpdate from "./ModalUpdate";
import Spinner from "./Spinner";
import InfoBar from "./InfoBar";
import Thumb from "./Thumb";
import Grid from "./Grid";
// Helper
import Helper from "../Helper";

const ItemInfoPage = () => {
  // URL Param
  const { itemType, itemId } = useParams();
  // Get Chapter/ Item Info from Server
  const { state, loading, error } = useFetchEntry(itemId, itemType);
  const [updateIsOpen, setUpdateIsOpen] = useState(false);

  const tableType = itemType === "c" ? "chapter" : "episode";

  if (error) return <div>Encountered an Error ...</div>;
  if (loading) return <Spinner />;

  if (Object.keys(state).length > 0)
    return (
      <>
        {updateIsOpen && <ModalUpdate toggleModal={setUpdateIsOpen} item={state['identity']} type={itemType}/>}

        <div
          style={{
            position: "fixed",
            right: "1%",
            bottom: "1%",
          }}
        >
          <FloatingButton type="edit" callback={() => setUpdateIsOpen(true)} />
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
                  : `${process.env.REACT_APP_DOMAIN}${state['identity'].CoverPath}`
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
