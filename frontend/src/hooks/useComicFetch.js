import { useState, useEffect } from "react";
// API
import API from "../API";

const DEFPAGE = {
  item: { Title: "", ChapterNum: 0 },
  curChapt: [],
  NextChaptNum: 0,
  PrevChaptNum: 0,
};

export const useFetchPages = (itemId, chptNum) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState(DEFPAGE);

  const fetchPages = async (itemId, chptNum) => {
    try {
      setLoading(true);
      setError(false);

      const pages = await API.fetchPages(itemId, chptNum, "c");
      setState(pages);
    } catch (err) {
      setError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPages(itemId, chptNum);
  }, [itemId, chptNum]);

  return { state, error, loading };
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
