import styled from "styled-components";

export const Wrapper = styled.div`
  position: fixed;
  top: 0%;
  left: 0%;

  background-color: rgba(255, 255, 255, 0.85);

  width: 100%;
  height: 110%; /* Need to be above 100% because of phone browser when scrolling */

  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ModalBody = styled.div`
  position: fixed;
  background: var(--darkGrey);
  width: 50%;
  top: 15%;
  left: 25%;

  border-radius: 12px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;

  display: flex;
  flex-direction: column;
  padding: 25px;

  .close {
    display: flex;
    justify-content: flex-end;
  }

  @media screen and (max-width: 768px) {
      top: 5%;
      left: 5%;
      width: 90%;
    }
`;

export const CloseBtn = styled.button`
  background-color: transparent;
  color: var(--white);

  border: none;
  font-size: 15px;

  cursor: pointer;
`;

export const Title = styled.div`
  color: var(--white);
  font-size: var(--fontBig);
  font-weight: bold;

  padding-left: 10px;
  padding-right: 10px;
`;

export const Body = styled.div`
  font-size: var(--fontSmall);
  color: var(--white);

  hr {
    margin-top: 10px;
    margin-bottom: 10px;
    border: none;
    color: var(--white);
    opacity: 0.2;
    height: 1px;
    background-color: var(--white);
  }
`;

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;

  button {
    width: 95px;
    height: 35px;
    margin: 5px;

    border: none;
    background-color: grey;
    cursor: pointer;

    color: var(--white);
    border-radius: 8px;
    font-size: var(--fontSmall);

    transition: opacity 0.3s;

    :hover {
      opacity: 0.6;
    }
  }

  .accept {
    background-color: green;
  }
`;
