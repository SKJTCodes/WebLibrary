import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
// Components
import Grid from "./Grid";
import Thumb from "./Thumb";
import Badge from "./Badges";
import Button from "./Button";
import Spinner from "./Spinner";
import SearchBar from "./SearchBar";
import Pagination from "./Pagination";
// Hooks
import { useSearch, useTags } from "../hooks/useSearch";
// Helper
import helper from "../Helper";

const TYPES = ["img", "vid"];

const SearchPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [type, setType] = useState(TYPES[0]);
  const [isTag, setIsTag] = useState(true);

  const { state, loading, error, text, pageNum, setText, setPageNum } =
    useSearch(params.getAll("searchText")[0]);
  const { state: tags, loading: loading2, error: error2 } = useTags();

  useEffect(() => {
    if (state[TYPES[0]].length < state[TYPES[1]].length) {
      setType(TYPES[1]);
    } else {
      setType(TYPES[0]);
    }

    if (params.getAll("page")[0]) setPageNum(params.getAll("page")[0]);

    if (isTag) {
      setText(params.getAll("searchText")[0]);
    }
  }, [state, params, isTag, setText, setPageNum]);

  if (error | error2) return <div>Something went wrong ....</div>;

  const handleNavigate = (to) => {
    const urlSearchText = helper.appendSearchString(
      "searchText",
      text,
      location.search
    );
    navigate(urlSearchText);
    navigate(to);
  };

  return (
    <>
      <SearchBar
        searchText={text}
        setSearchText={(e) => {
          setIsTag(false);
          setText(e);
        }}
      />

      {/* Display Tags */}
      <div className="container" style={{ paddingTop: "20px" }}>
        {tags.map((tag) => (
          <Badge
            key={tag.Text}
            text={tag.Text}
            num={tag.Num}
            cb={() => {
              const url = helper.appendSearchString(
                "searchText",
                tag.Text,
                location.search
              );
              const url2 = helper.appendSearchString("page", 1, url);
              setIsTag(true)
              navigate(url2);
            }}
          />
        ))}
      </div>

      {/* Video/Comic Buttons */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button text={"Comics"} callback={() => setType("img")} />
        <Button text={"Videos"} callback={() => setType("vid")} />
      </div>

      {loading | loading2 ? <Spinner /> : null}

      {/* Items */}
      <Grid>
        {state[type].map((item) => (
          <Thumb
            key={item.ItemId}
            itemId={item.ItemId}
            type={type === TYPES[0] ? "c" : "v"}
            image={`${process.env.REACT_APP_DOMAIN}${item.CoverPath}`}
            title={helper.titleCase(item.Title)}
            clickable
            cb={handleNavigate}
          />
        ))}
      </Grid>

      {(state[type].length > 0) & (state["total_pages"] > 1) ? (
        <Pagination
          curPage={pageNum}
          totalPages={state["total_pages"]}
          total={window.innerWidth < 500 ? (window.innerWidth ? 3 : 5) : 9}
        />
      ) : null}
    </>
  );
};

export default SearchPage;
