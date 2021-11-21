import React from "react";
// Styles
import { Wrapper, Content, Wrapper2, Content2 } from "./Grid.styles";

const Grid = ({ children, noPadding }) => {
  if (!noPadding)
    return (
      <Wrapper>
        <Content>{children}</Content>
      </Wrapper>
    );
  else
    return (
      <Wrapper2>
        <Content2>{children}</Content2>
      </Wrapper2>
    );
};

export default Grid;
