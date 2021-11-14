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
export const useFetchLib = (itemType, sortVal = "DateCreated", page = 1) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
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
    fetchLib(page, itemType, sortVal);
  }, [page, sortVal, itemType]);

  return { error, loading, state };
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
