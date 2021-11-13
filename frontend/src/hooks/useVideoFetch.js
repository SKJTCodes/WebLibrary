import { useState, useEffect } from "react";
// API
import API from "../API";

const DEFEP = {
  item: { Title: "" },
  curEp: { EpisodeNo: 0, Path: "" },
  NextEpNum: 0,
  PrevEpNum: 0,
};

export const useFetchEpisode = (itemId, epNum) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [state, setState] = useState(DEFEP);

  const fetchEp = async (itemId, epNum) => {
    try {
      setLoading(true);
      setError(false);

      const ep = await API.fetchEpisodes(itemId, epNum, "v");
      setState(ep);
    } catch (err) {
      setError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEp(itemId, epNum);
  }, [itemId, epNum]);

  return { state, loading, error };
};
