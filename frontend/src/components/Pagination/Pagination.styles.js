import styled from "styled-components";

export const Wrapper = styled.div`
  max-width: var(--maxWidth);
  margin: 0 auto;
  margin-top: 20px;
  padding: 0 20px;
`;

export const Content = styled.div`
  overflow: hidden;
  display: flex;
  justify-content: center;
  background-color: var(--darkGrey);
  border-radius: 10px;
  padding: 10px;

  div {
    padding: 8px 16px;
    color: var(--white);
    cursor: pointer;
    margin-left: 2px;
    margin-right: 2px;

    :hover:not(.active) {
      background-color: black;
      border-radius: 5px;
    }
  }

  .active {
    background-color: var(--lightGrey);
    border-radius: 5px;
    color: var(--darkGrey);
  }
`;
