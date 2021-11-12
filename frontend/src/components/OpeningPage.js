import React from "react";
import { useParams } from "react-router-dom";
// Components
import Spinner from "./Spinner";
import DropDownList from "./DropDownList";
import Grid from "./Grid";
import Thumb from "./Thumb";
import Pagination from "./Pagination";
// Helper
import Helper from "../Helper";
// Hooks
import { useFetchLib } from "../hooks/useLibraryFetch";

const OpeningPage = () => {
  // URL Param
  const { itemType } = useParams();
  // get library list items
  const { error, loading, state, setPageNum, setSort } = useFetchLib(itemType);

  if (error) return <div>Encountered an Error ...</div>;
  if (loading) return <Spinner />;

  return (
    <>
      <div
        className="container"
        style={{ display: "flex", marginTop: "15px", marginBottom: "15px" }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <span
            style={{ color: "var(--white)", fontSize: "var(--fontSuperBig)" }}
          >
            <b>{itemType === "c" ? "Comic" : "Video"}</b>
          </span>
        </div>
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "right",
          }}
        >
          <DropDownList
            list={[
              "Most Recent",
              itemType === "c" ? "Most Chapters" : "Most Episodes",
            ]}
            setSort={setSort}
          />
        </div>
      </div>

      <Grid>
        {state.results.map((item) => {
          return (
            <Thumb
              key={item.ItemId}
              itemId={item.ItemId}
              type={itemType}
              image={`${process.env.REACT_APP_DOMAIN}${item.CoverPath}`}
              title={Helper.titleCase(item.Title)}
              clickable
            />
          );
        })}
      </Grid>

      {state.results.length > 0 && (
        <Pagination
          curPage={state.page}
          totalPages={state.total_pages}
          setPage={setPageNum}
          total={window.innerWidth < 500 ? (window.innerWidth ? 3 : 5) : 9}
        />
      )}
    </>
  );
};

export default OpeningPage;
