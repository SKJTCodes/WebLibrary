import React from "react";
// Hook
import { useLibraryFetch } from "../hooks/useComicFetch";
// Components
import Spinner from "./Spinner";
import Grid from "./Grid";
import Thumb from "./Thumb";
import Pagination from "./Pagination";
import DropDownList from "./DropDownList";
// Helper
import Helper from "../Helper";

const LandingPage = () => {
  const { state, loading, error, setPage, setSort } = useLibraryFetch();

  if (error) return <div>Encountered an Error ...</div>;

  return (
    <>
      {loading && <Spinner />}
      <div
        className="container"
        style={{ display: "flex", marginTop: "15px", marginBottom: "15px" }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <span
            style={{ color: "var(--white)", fontSize: "var(--fontSuperBig)" }}
          >
            <b>Comic</b>
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
            list={["Most Recent", "Most Chapters"]}
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
              type="c"
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
          setPage={setPage}
          total={window.innerWidth < 500 ? (window.innerWidth ? 3 : 5) : 9}
        />
      )}
    </>
  );
};

export default LandingPage;
