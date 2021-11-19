import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
// Components
import Grid from "./Grid";
import Thumb from "./Thumb";
import Button from "./Button";
import Spinner from "./Spinner";
import SearchBar from "./SearchBar";
// Hooks
import { useSearch } from "../hooks/useSearch";
// Helper
import Helper from "../Helper";

const TYPES = ["img", "vid"];

const SearchPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [type, setType] = useState(TYPES[0]);

  const { state, loading, error, text, setText } = useSearch(
    params.getAll("searchText")
  );

  useEffect(() => {
    if (state[TYPES[0]].length < state[TYPES[1]].length) {
      setType(TYPES[1]);
    } else {
      setType(TYPES[0]);
    }
  }, [state]);

  if (error) return <div>Something went wrong ....</div>;

  const handleNavigate = (to) => {
    const urlSearchText = Helper.appendSearchString(
      "searchText",
      text,
      location.search
    );
    navigate(urlSearchText);
    navigate(to);
  };

  return (
    <>
      <SearchBar searchText={text} setSearchText={setText} />
      <div style={{ margin: "20px" }}></div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button text={"Comics"} callback={() => setType("img")} />
        <Button text={"Videos"} callback={() => setType("vid")} />
      </div>
      {loading && <Spinner />}
      <Grid>
        {state[type].map((item) => (
          <Thumb
            key={item.ItemId}
            itemId={item.ItemId}
            type={type === TYPES[0] ? "c" : "v"}
            image={`${process.env.REACT_APP_DOMAIN}${item.CoverPath}`}
            title={Helper.titleCase(item.Title)}
            clickable
            cb={handleNavigate}
          />
        ))}
      </Grid>
    </>
  );
};

export default SearchPage;
