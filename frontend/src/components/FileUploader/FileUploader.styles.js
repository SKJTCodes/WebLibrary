import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  height: 200px;
  max-width: 666px;
  max-height: 200px;
  border-style: dashed;
  border-radius: 10px;
  border-color: var(--lightGrey);
  border-width: 2px;
  background-color: var(--medGrey);
  overflow-y: hidden;

  *::-webkit-scrollbar {
    width: 14px;
  }
  *::-webkit-scrollbar-track {
    background: var(--medGrey);
  }
  *::-webkit-scrollbar-thumb {
    background-color: var(--darkGrey);
    border-radius: 20px;
    border: 2px solid var(--medGrey);
  }
`;

export const Label = styled.div`
  letter-spacing: 4px;
  padding: 50px 60px 30px 60px;
  text-align: center;

  .label-text {
    padding-bottom: 30px;
    color: var(--white);
    cursor: text;
    font-size: var(--fontSmall);
    line-height: 20px;
    text-transform: uppercase;
  }
`;

export const ImgContent = styled.div`
  color: var(--white);
  padding: 15px;
  overflow-y: scroll;
  max-height: inherit;
`;
