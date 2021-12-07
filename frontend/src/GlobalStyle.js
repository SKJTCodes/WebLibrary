import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  :root {
    --maxWidth: 1280px;
    --white: #fff;
    --lightGrey: #838383;
    --medGrey: #353535;
    --darkGrey: #1c1c1c;
    --lightBlue: #C1C9E1;
    --medBlue: #6577B3;
    --darkBlue: #333c5a;
    --fontSuperBig: 2.5rem;
    --fontBig: 1.5rem;
    --fontMed: 1.2rem;
    --fontSmall: 1rem;
    --fontTiny: 0.8rem;
  }

  * {
    box-sizing: border-box;
    font-family: 'Abel', sans-serif;
  }

  body {
    margin: 0;
    padding: 0;
    background-color: var(--medGrey);

    h1 {
      font-size: 2rem;
      font-weight: 600;
      color: var(--white);
    }

    h3 {
      font-size: 1.1rem;
      font-weight: 600;
    }

    p {
      font-size: 1rem;
      color: var(--white);
    }

    a {
      color: var(--white);
      text-decoration: none;
    }

    .container {
      max-width: var(--maxWidth);
      margin: 0 auto;
      padding: 0 20px;
    }
  }
`;
