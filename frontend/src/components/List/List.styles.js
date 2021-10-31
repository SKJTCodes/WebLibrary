import styled from "styled-components";

export const Wrapper = styled.div`
  max-width: var(--maxWidth);
  margin: 0 auto;
  padding: 0 20px;

  @media screen and (max-width: 700px) {
    padding: 0 0;
  }

  h1 {
    color: var(--white);

    @media screen and (max-width: 768px) {
      font-size: var(--fontBig);
    }
  }
`;

export const Content = styled.div`
  display: block;
  margin: auto;
  padding: 10px;
  background-color: var(--darkGrey);
  border-radius: 10px;
  max-width: 720px;

  @media screen and (max-width: 700px) {
    padding: 0;
  }
`;

export const Image = styled.img`
  width: 100%;
  margin-bottom: 5px;
  object-fit: cover;
`;
