import React from "react";
import { useParams } from "react-router-dom";
// Components
import Grid from "./Grid";
import Thumb from "./Thumb";
import Spinner from "./Spinner";
import SearchBar from "./SearchBar";
// Hooks
import { useSearch } from "../hooks/useSearch";
// Helper
import Helper from "../Helper";

const SearchPage = () => {
  const { searchText } = useParams();

  const {
    state: comics,
    text,
    loading,
    error,
    setText,
  } = useSearch(searchText ? searchText : "");

  if (error) return <div>Something went wrong ....</div>;
  if (loading) return <Spinner />;

  return (
    <>
      <SearchBar setSearchTerm={setText} searchTerm={text} />
      <div style={{margin: "20px"}}></div>
      <Grid>
        {comics.map((comic) => (
          <Thumb
            key={comic.id}
            itemId={comic.id}
            type="c"
            image={`${process.env.REACT_APP_DOMAIN}${comic.cover_path}`}
            title={Helper.titleCase(comic.title)}
            clickable
          />
        ))}
      </Grid>
    </>
  );
};

export default SearchPage;
