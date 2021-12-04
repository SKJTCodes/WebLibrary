import React from "react";
// Styles
import { Wrapper, Content, Image } from "./List.styles";

const List = ({ header, pages }) => {
  if (pages.length === 0) return null;

  const landscape = { maxWidth: "100%" };
  const portrait = { maxWidth: "720px" };
  
  const numLandscape = pages.filter(page => page.type === 'landscape')
  const imgType = numLandscape.length > 0 ? 'landscape' : 'portrait'

  return (
    <Wrapper>
      <h1>{header}</h1>
      <Content style={imgType === 'landscape' ? landscape : portrait}>
        {pages.map((page, index) => (
          <Image
            key={index}
            src={`${process.env.REACT_APP_DOMAIN}${page.path}`}
            alt="page-img"
          />
        ))}
      </Content>
    </Wrapper>
  );
};

export default List;
