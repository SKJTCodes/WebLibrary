import React, { useState, useEffect, useRef } from "react";
// Image
import searchIcon from "../../images/search-icon.svg";
// Styles
import { Wrapper, Content } from "./SearchBar.styles";

const SearchBar = ({ searchTerm = "", setSearchTerm }) => {
  const [state, setState] = useState(searchTerm);
  const initial = useRef(true);

  useEffect(() => {
    if (initial.current) {
      initial.current = false;
      return;
    }
    const timer = setTimeout(() => {
      setSearchTerm(state);
    }, 1000);

    return () => clearTimeout(timer); // will trigger after Everything is rendered
  }, [setSearchTerm, state]);

  return (
    <Wrapper>
      <Content>
        <img src={searchIcon} alt="search-icon" />
        <input
          onChange={(event) => setState(event.currentTarget.value)}
          value={state}
          type="text"
          placeholder="Search Movie"
        />
      </Content>
    </Wrapper>
  );
};

export default SearchBar;
