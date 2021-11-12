import React from "react";
// Styles
import { Wrapper, Content, Image } from "./List.styles";

const List = ({ header, pages }) => {
  if (pages.length === 0) return null;

  return (
    <Wrapper>
      <h1>{header}</h1>
      <Content>
        {pages.map((page_path, index) => (
          <Image
            key={index}
            src={`${process.env.REACT_APP_DOMAIN}${page_path}`}
            alt="page-img"
          />
        ))}
      </Content>
    </Wrapper>
  );
};

export default List;
