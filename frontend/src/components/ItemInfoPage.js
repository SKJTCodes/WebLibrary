import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// Hooks
import { useFetchEntry } from "../hooks/useLibraryFetch";
import { useUpdateItem } from "../hooks/useUpload";
// Components
import FloatingButton from "./FloatingButton";
import ModalUpdate from "./ModalUpdate";
import Spinner from "./Spinner";
import InfoBar from "./InfoBar";
import Modal from "./Modal";
import Thumb from "./Thumb";
import Grid from "./Grid";
// Helper
import Helper from "../Helper";

const ModalDelete = ({ type, item, toggleModal }) => {
  const nav = useNavigate();
  const done = false;

  useEffect(() => {
    if (!done) return;
    nav("/");
  }, [done, nav]);

  return (
    <Modal
      title={`Delete ${item.Title}`}
      setOpenModal={() => toggleModal("delete")}
      cancelButton="No"
      acceptButton="Yes"
    >
      <p>Do you want to delete {item.Title}?</p>
    </Modal>
  );
};

const ItemInfoPage = () => {
  // URL Param
  const { itemType, itemId } = useParams();
  // Get Chapter/ Item Info from Server
  const { state, loading, error, setState } = useFetchEntry(itemId, itemType);
  // For Update entry info
  const { setData, error2, loading2 } = useUpdateItem();

  const [updateIsOpen, setUpdateIsOpen] = useState(false);
  const [deleteIsOpen, setDeleteIsOpen] = useState(false);

  const tableType = itemType === "c" ? "chapter" : "episode";

  const toggleModal = (action) => {
    console.log(action)
    if (action === "delete") {
      setDeleteIsOpen((state) => !state);
      setUpdateIsOpen(false);
    } else if (action === "update") {
      setUpdateIsOpen((state) => !state);
      setDeleteIsOpen(false);
    }
  };

  if (error | error2) return <div>Encountered an Error ...</div>;
  if (loading | loading2) return <Spinner />;

  if (Object.keys(state).length > 0)
    return (
      <>
        {updateIsOpen && (
          <ModalUpdate
            toggleModal={toggleModal}
            item={state["identity"]}
            type={itemType}
            setInfoBar={setState}
            setData={setData}
          />
        )}
        {deleteIsOpen && (
          <ModalDelete
            type={itemType}
            item={state["identity"]}
            toggleModal={toggleModal}
          />
        )}

        <div
          style={{
            position: "fixed",
            right: "1%",
            bottom: "1%",
          }}
        >
          <FloatingButton type="edit" callback={() => toggleModal('update')} />
          <FloatingButton
            type="delete"
            callback={() => toggleModal('delete')}
          />
        </div>

        <InfoBar item={state["identity"]} type={tableType} />

        <div style={{ margin: "20px" }}></div>

        <Grid header={`${Helper.titleCase(tableType)}s`}>
          {state[`${tableType}s`].map((item) => (
            <Thumb
              key={item[`${Helper.titleCase(tableType)}No`]}
              image={
                itemType === "c"
                  ? `${process.env.REACT_APP_DOMAIN}${item.PagePaths[0]}`
                  : `${process.env.REACT_APP_DOMAIN}${state["identity"].CoverPath}`
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
