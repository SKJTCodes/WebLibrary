import React from "react";
import { useParams } from "react-router-dom";
// Components
import Spinner from "./Spinner";
import List from "./List";
import Button from "./Button";
import Breadcrumb from "./Breadcrumb";
// Hooks
import { useChapterFetch } from "../hooks/useComicFetch";
// Helper
import Helper from "../Helper";

const ComicReader = () => {
  const { comicId, chptId } = useParams();
  const {
    loading,
    error,
    state: chapter,
    setChptId,
  } = useChapterFetch(comicId, chptId);

  if (loading) return <Spinner />;
  if (error) return <div>Something went wrong ....</div>;

  const breadcrumb =
    Object.keys(chapter.item).length === 0
      ? []
      : [
          { title: "Home", url: "/" },
          {
            title: Helper.titleCase(chapter.item["identity"].title),
            url: `/c/${comicId}`,
          },
          {
            title: `Chapter ${chapter.curChapt["chapter_no"]}`,
            url: undefined,
          },
        ];

  return (
    <>
      <Breadcrumb listOfCrumbs={breadcrumb} />
      {chapter.prevChaptNum !== -1 && (
        <Button
          text={"Previous"}
          callback={() => setChptId(chapter.prevChaptNum)}
        />
      )}
      <List pages={chapter.curChapt["page_paths"]} />
      {chapter.nextChaptNum !== -1 && (
        <Button
          text={"Next"}
          callback={() => setChptId(chapter.nextChaptNum)}
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

export default ComicReader;
