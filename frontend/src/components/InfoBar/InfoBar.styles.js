import styled from "styled-components";

export const Wrapper = styled.div`
  background: ${({ backdrop }) =>
    backdrop ? `url('${process.env.REACT_APP_DOMAIN}${backdrop}')` : "#000"};
  background-size: cover;
  background-position: center;

  .transparent {
    background-color: rgba(75, 75, 75, 0.7);
    padding: 40px 20px;
  }
`;

export const Content = styled.div`
  display: flex;
  max-width: var(--maxWidth);
  margin: 0 auto;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 20px;

  @media screen and (max-width: 768px) {
    display: block;
    max-height: none;
  }
`;

export const Text = styled.div`
  width: 100%;
  padding: 20px 40px;
  color: var(--white);
  overflow: hidden;

  .author {
    cursor: pointer;
  }

  h1 {
    @media screen and (max-width: 768px) {
      font-size: var(--fontBig);
    }
  }
`;

export const Image = styled.div`
  max-width: 720px;
  max-height: 800px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 20px;
  }
`;

export const Pill = styled.div`
  display: inline-block;
  border-radius: 20px;
  background-color: var(--medGrey);
  color: var(--white);
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 1px;
  padding-bottom: 1px;
  margin-right: 6px;
  margin-bottom: 6px;

  :hover {
    background-color: #000;
    cursor: pointer;
  }
`;
