import { useState, useEffect } from "react";
// API
import API from "../API";

const LIBSTATE = {
  page: 0,
  results: [],
  total_pages: 0,
  total_results: 0,
};

// Fetch All library Items
export const useFetchLib = (itemType) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [sort, setSort] = useState(null);
  const [state, setState] = useState(LIBSTATE);

  const fetchLib = async (page, itemType, sort) => {
    try {
      setLoading(true);
      setError(false);

      const items = await API.fetchLibrary(page, itemType, sort);
      setState(items);
    } catch (err) {
      setError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLib(pageNum, itemType, sort);
  }, [pageNum, sort, itemType]);

  return { error, loading, state, setPageNum, setSort };
};

// Fetch Single Entry
export const useFetchEntry = (itemId, itemType) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({});

  const fetchComic = async (itemId, itemType) => {
    try {
      setError(false);
      setLoading(true);

      const items = await API.fetchEntry(itemId, itemType);
      setState(items);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(true);
    }
  };

  useEffect(() => {
    fetchComic(itemId, itemType);
  }, [itemId, itemType]);

  return { state, loading, error, setState };
};
