import React from "react";
import { useParams, useNavigate } from "react-router-dom";
// Components
import List from "./List";
import Button from "./Button";
import Spinner from "./Spinner";
import Breadcrumb from "./Breadcrumb";
// Hooks
import { useFetchPages } from "../hooks/useComicFetch";
// Helper
import Helper from "../Helper";

const Episode = () => <div>Episode</div>;

const Pages = ({ itemId, chptNum, nav }) => {
  const { state, error, loading } = useFetchPages(itemId, chptNum);

  if (error) return <div>Encountered an Error ...</div>;
  if (loading) return <Spinner />;

  const breadcrumb =
    Object.keys(state.item).length === 0
      ? []
      : [
          { title: "Home", url: "/c" },
          {
            title: Helper.titleCase(state.item.Title),
            url: `/c/${itemId}`,
          },
          {
            title: `Chapter ${state.item.ChapterNum}`,
            url: undefined,
          },
        ];

  return (
    <>
      <Breadcrumb listOfCrumbs={breadcrumb} />

      {state.PrevChaptNum !== -1 && (
        <Button
          text={"Previous"}
          callback={() => nav(`/c/${itemId}/${state.PrevChaptNum}`)}
        />
      )}

      <List pages={state.curChapt} />

      {state.NextChaptNum !== -1 && (
        <Button
          text={"Next"}
          callback={() => nav(`/c/${itemId}/${state.NextChaptNum}`)}
        />
      )}

      <div style={{ padding: "10px", textAlign: "center", marginTop: "15px" }}>
        <span
          style={{
            textAlign: "center",
            color: "var(--white)",
            cursor: "pointer",
          }}
          onClick={() => window.scrollTo(0, 0)}
        >
          Back to the Top
        </span>
      </div>
    </>
  );
};

const Viewer = () => {
  // React-Router-Dom
  const { itemType, itemId, num } = useParams();
  const navigate = useNavigate();

  return itemType === "c" ? (
    <Pages itemId={itemId} chptNum={num} nav={navigate} />
  ) : (
    <Episode />
  );
};

export default Viewer;
