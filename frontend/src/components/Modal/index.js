import React from "react";
// Styles
import {
  ModalBody,
  Wrapper,
  Body,
  Title,
  Footer,
  CloseBtn,
} from "./Modal.styles";

const Modal = ({
  title = "",
  setOpenModal,
  callback,
  cancelButton,
  acceptButton,
  children,
}) => {
  const handleBackground = (e) => {
    // if (e.target.id === "background") setOpenModal();
  };

  return (
    <Wrapper id="background" onClick={(e) => handleBackground(e)}>
      <ModalBody>
        <div className="close">
          <CloseBtn onClick={() => setOpenModal(state => !state)}> X </CloseBtn>
        </div>
        <Title>{title}</Title>
        <Body>
          <hr />
          <div style={{ paddingLeft: "10px", paddingRight: "10px" }}>
            {children}
          </div>
          <hr />
        </Body>
        <Footer>
          {cancelButton !== "" && (
            <button onClick={() => setOpenModal(state => !state)}>{cancelButton}</button>
          )}
          {acceptButton !== "" && (
            <button className="accept" onClick={callback}>
              {acceptButton}
            </button>
          )}
        </Footer>
      </ModalBody>
    </Wrapper>
  );
};

export default Modal;
