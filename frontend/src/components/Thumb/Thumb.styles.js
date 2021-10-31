import styled from "styled-components";

export const Wrapper = styled.div`
  background-color: var(--darkGrey);
  border-radius: 10px;
  max-width: 720px;
  height: 375px;
  transition: all 0.3s;

  .top {
    padding: 10px;
    height: 90%;
    overflow: hidden;

  }

  .bottom {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    height: 10%;

    text-align: center;
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 10px;
  }

  @media screen and (max-width: 718px) and (min-width: 600px) {
    height: 480px;
  }

  @media screen and (max-width: 490px) and (min-width: 400px) {
    height: 650px;
  }

  :hover:not(.disable) {
    .top {
      height: 80%;
    }

    .bottom {
      height: 20%;
      overflow: hidden;
      text-overflow: clip;
      white-space: normal;
    }
  }

  :hover {
    background-color: var(--lightGrey);

    img {
      opacity: 0.7;
    }
  }
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
