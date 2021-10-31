import styled from "styled-components";

export const Wrapper = styled.div`
  font-size: 1.6rem;
  position: relative;
`;

export const Header = styled.button`
  background-color: var(--white);
  display: flex;
  min-width: 200px;
  align-items: center;
  border-radius: 3px;
  border: 1px solid var(--darkGray);
  position: relative;
  cursor: pointer;

  .title {
    font-size: var(--fontSmall);
    margin-right: 5px;
  }

  .arrow {
    margin-left: auto;
  }
`;

export const Content = styled.div`
  z-index: 10;
  position: absolute;
  max-height: 215px;
  border: 1px solid var(--lightGray);
  border-top: none;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  box-shadow: 0 2px 5px -1px var(--darkGrey);
  background-color: var(--white);
  text-align: left;
  -webkit-overflow-scrolling: touch;

  .item {
    display: inline-block;
    overflow: hidden;
    width: 100%;
    padding: 8px 10px;
    font-size: var(--fontSmall);
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: default;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;

    :hover {
      background-color: var(--medGrey);
      color: var(--white);
    }

  }
  
  .active {
    background-color: var(--lightGrey);
    color: var(--white);
  }
`;
