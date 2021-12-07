import { useState, useEffect } from "react";
// API
import API from "../API";

export const useSearch = (searchText) => {
  const [pageNum, setPageNum] = useState(1);
  const [text, setText] = useState(searchText);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [state, setState] = useState({ img: [], vid: [] });

  const getSearchResults = async (text, page) => {
    try {
      setLoading(true);
      setError(false);
      if (text !== "") {
        const data = await API.fetchSearch(text, page);
        setState(data);
      }
    } catch (err) {
      console.error(err);
      setError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    getSearchResults(text, pageNum);
  }, [text, pageNum]);

  return { state, text, loading, error, pageNum, setText, setPageNum };
};

export const useTags = () => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState([]);

  const getTags = async () => {
    try {
      setLoading(true);
      setError(false);

      const data = await API.fetchTags();
      setState(data);
    } catch (err) {
      console.error(err);
      setError(true);
    }
    setLoading(false);
  };

  // Loads once on refresh
  useEffect(() => {
    getTags();
  }, []);

  return { loading, error, state };
};
