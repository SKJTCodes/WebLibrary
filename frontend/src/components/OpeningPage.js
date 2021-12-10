import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
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
  // Query Params after '?' in url
  const [params] = useSearchParams();
  // URL Param
  const { itemType } = useParams();
  // get library list items
  const { error, loading, state } = useFetchLib(
    itemType,
    params.getAll("sort")[0],
    params.getAll("page")[0]
  );

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
            items={[
              { title: "Most Recent", value: "DateCreated" },
              {
                title: itemType === "c" ? "Most Chapters" : "Most Episodes",
                value: "TotalEntries",
              },
              {title: "Alphabetical", value: "Title"}
            ]}
            itemType={itemType}
            selected={params.getAll("sort")[0]}
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
              pageHist={state.page}
              sortHist={params.getAll("sort")[0]}
              clickable
            />
          );
        })}
      </Grid>

      {state.results.length > 0 && (
        <Pagination
          curPage={state.page}
          totalPages={state.total_pages}
          itemType={itemType}
          total={window.innerWidth < 500 ? (window.innerWidth ? 3 : 5) : 9}
        />
      )}
    </>
  );
};

export default OpeningPage;
