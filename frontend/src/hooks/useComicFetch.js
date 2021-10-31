import { useState, useEffect, useRef } from "react";
// API
import API from "../API";

const initialLibState = {
  page: 0,
  results: [],
  total_pages: 0,
  total_results: 0,
};

export const useLibraryFetch = () => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState(initialLibState);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("Most Recent");

  const getLibrary = async (page, sort) => {
    try {
      setError(false);
      setLoading(true);
      const comics = await API.fetchLibrary(page, "c", sort);

      setState(comics);
    } catch (error) {
      setError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    setState(initialLibState);
    getLibrary(page, sort);
  }, [page, sort]);

  return { state, error, loading, setPage, setSort };
};

export const useComicFetch = (itemId) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({});

  useEffect(() => {
    const fetchComic = async () => {
      try {
        setError(false);
        setLoading(true);

        const comic = await API.fetchEntry(itemId, "c");
        setState(comic);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(true);
      }
    };
    fetchComic();
  }, [itemId]);

  return { state, loading, error, setState };
};

export const useUpdateComic = () => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  const updateEntry = async (dat) => {
    try {
      setError(false);
      setLoading(true);

      await API.updateEntry("c", dat);
    } catch (err) {
      console.error(err);
      setError(true);
    }

    setLoading(false);
  };


  useEffect(() => {
    if (Object.keys(data).length === 0) return;
    updateEntry(data);
  }, [data]);

  return { setData, error, loading };
};

export const useChapterFetch = (itemId, chaptId) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chptId, setChptId] = useState(chaptId);
  const identity = useRef(itemId);
  const [state, setState] = useState({
    item: {},
    curChapt: { PagePaths: [] },
    nextChaptNum: 0,
    prevChaptNum: 0,
  });

  const getChapter = async (itemId, chapter_num) => {
    try {
      setError(false);
      setLoading(true);

      const entry = await API.fetchEntry(itemId, "c");

      const chapter = entry.chapters.filter(
        (chpt) => chpt.ChapterNo === parseInt(chapter_num)
      )[0];

      const chaptIndex = entry.chapters
        .map((c) => c.ChapterNo)
        .indexOf(chapter.ChapterNo);

      const nchapt =
        chaptIndex < entry.chapters.length - 1
          ? entry.chapters[chaptIndex + 1].ChapterNo
          : -1;

      const pchapt =
        chaptIndex > 0 ? entry.chapters[chaptIndex - 1].ChapterNo : -1;

      setState({
        item: entry,
        curChapt: chapter,
        nextChaptNum: nchapt,
        prevChaptNum: pchapt,
      });
    } catch (err) {
      console.error(err);
      setError(true);
    }
    setLoading(false);
  };

  // run only when useChapterFetch is invoked
  useEffect(() => {
    console.log("Initial");
    getChapter(identity.current, chptId);
  }, [chptId]);

  

  return { state, error, loading, setChptId };
};
