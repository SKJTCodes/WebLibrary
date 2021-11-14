import React from "react";
// Image
import searchIcon from "../../images/search-icon.svg";
// Styles
import { Wrapper, Content } from "./SearchBar.styles";

const SearchBar = ({ searchText, setSearchText }) => {
  return (
    <Wrapper>
      <Content>
        <img src={searchIcon} alt="search-icon" />
        <input
          onChange={(event) => setSearchText(event.currentTarget.value)}
          value={searchText}
          type="text"
          placeholder="Search Movie"
        />
      </Content>
    </Wrapper>
  );
};

export default SearchBar;
