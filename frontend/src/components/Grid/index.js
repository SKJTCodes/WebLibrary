import React from "react";
// Styles
import { Wrapper, Content } from "./Grid.styles";

const Grid = ({ children }) => (
  <Wrapper>
    <Content>{children}</Content>
  </Wrapper>
);

export default Grid;
