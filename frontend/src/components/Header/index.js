import React from "react";
import { Link } from "react-router-dom";
import { Wrapper, Content } from "./Header.styles";

const Header = () => (
  <Wrapper>
    <Content>
      <Link to="/">
        <h3>Library</h3>
      </Link>
      <Link to="/c">
        <span>Comic</span>
      </Link>
      <Link to="/v">
        <span>Video</span>
      </Link>
      <Link to="/u">
        <span>Upload</span>
      </Link>
      <Link to="/cs">
        <span>Search</span>
      </Link>
    </Content>
  </Wrapper>
);

export default Header;
