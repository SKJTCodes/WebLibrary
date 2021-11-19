import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 70px;
  background: var(--medGrey);
  color: var(--white);
`;

export const Content = styled.div`
  width: 100%;
  max-width: var(--maxWidth);
  padding: 0 20px;
  white-space: nowrap;

  div {
    display: inline-block;
    font-size: var(--fontMed);
    color: var(--white);

    .sep {
      padding: 0px 10px 0px 10px;
    }
  }

  @media screen and (max-width: 500px) and (min-width: 368px) {
    div {
      font-size: var(--fontSmall);
    }
  }

  @media screen and (max-width: 368px) {
    div {
      font-size: var(--fontSmall);
    }
    .value, .sep {
      max-width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;
