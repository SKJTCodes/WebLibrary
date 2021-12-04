import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
// Components
import List from "./List";
import Button from "./Button";
import Spinner from "./Spinner";
import Breadcrumb from "./Breadcrumb";
// Hooks
import { useFetchPages } from "../hooks/useComicFetch";
import { useFetchEpisode } from "../hooks/useVideoFetch";
// Helper
import Helper from "../Helper";

const Episode = ({ itemId, epNum, nav }) => {
  const { state, loading, error } = useFetchEpisode(itemId, epNum);

  if (error) return <div>Encountered an Error ...</div>;
  if (loading) return <Spinner />;

  const breadcrumb =
    Object.keys(state["item"]).length === 0
      ? []
      : [
          { title: "Home", url: "/v" },
          {
            title: Helper.titleCase(state.item.Title),
            url: `/c/${itemId}`,
          },
          {
            title: `Episode ${state.curEp.EpisodeNo}`,
            url: undefined,
          },
        ];
  return (
    <>
      <Breadcrumb listOfCrumbs={breadcrumb} />

      {state.PrevEpNum !== -1 && (
        <Button
          text={"Previous"}
          callback={() => nav(`/v/${itemId}/${state.PrevEpNum}`)}
        />
      )}

      <div style={{ display: "flex", justifyContent: "center" }}>
        <ReactPlayer
          controls={true}
          url={`${process.env.REACT_APP_DOMAIN}${state.curEp.Path}`}
        />
      </div>
      {state.NextEpNum !== -1 && (
        <Button
          text={"Next"}
          callback={() => nav(`/v/${itemId}/${state.NextEpNum}`)}
        />
      )}
    </>
  );
};

const Pages = ({ itemId, chptNum, nav }) => {
  const { state, error, loading } = useFetchPages(itemId, chptNum);

  if (error) return <div>Encountered an Error ...</div>;
  if (loading) return <Spinner />;
  console.log(state)
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
    <Episode itemId={itemId} epNum={num} nav={navigate} />
  );
};

export default Viewer;
