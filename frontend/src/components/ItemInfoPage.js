import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// Hooks
import { useFetchEntry } from "../hooks/useLibraryFetch";
import { useUpdateItem } from "../hooks/useUpload";
import { useDeleteItem } from "../hooks/useDelete";
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

const ModalDelete = ({ type, item, toggleModal, pageHist, sortHist }) => {
  const { error, loading, isDeleted, setItem } = useDeleteItem();

  const nav = useNavigate();

  useEffect(() => {
    if (!isDeleted) return;
    nav(`/`);
  }, [isDeleted, type, pageHist, sortHist, nav]);

  if (error) return <div>Something went wrong ....</div>;

  return (
    <Modal
      title={`Delete ${item.Title}`}
      setOpenModal={() => toggleModal("delete")}
      cancelButton="No"
      acceptButton="Yes"
      callback={() => setItem({ id: item.ItemId, type: type })}
    >
      {loading && <Spinner />}
      <p>Do you want to delete {item.Title}?</p>
    </Modal>
  );
};

const ItemInfoPage = () => {
  // URL Param
  const { itemType, itemId, pageHist, sortHist } = useParams();
  // Get Chapter/ Item Info from Server
  const { state, loading, error, setState } = useFetchEntry(itemId, itemType);
  // For Update entry info
  const { setData, error2, loading2 } = useUpdateItem();

  const [updateIsOpen, setUpdateIsOpen] = useState(false);
  const [deleteIsOpen, setDeleteIsOpen] = useState(false);

  const tableType = itemType === "c" ? "chapter" : "episode";

  const toggleModal = (action) => {
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
            pageHist={pageHist}
            sortHist={sortHist}
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
          <FloatingButton type="edit" callback={() => toggleModal("update")} />
          <FloatingButton
            type="delete"
            callback={() => toggleModal("delete")}
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
              title={
                item[`${Helper.titleCase(tableType)}Title`] === ""
                  ? `${Helper.titleCase(tableType)} ${
                      item[`${Helper.titleCase(tableType)}No`]
                    }`
                  : item[`${Helper.titleCase(tableType)}Title`]
              }
              pageHist={pageHist}
              sortHist={sortHist}
              type={itemType}
              clickable
            />
          ))}
        </Grid>
      </>
    );

  return null;
};

export default ItemInfoPage;
