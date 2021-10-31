import { useState, useEffect } from "react";
// API
import API from "../API";

export const useSearch = (searchText) => {
  const [text, setText] = useState(searchText);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [state, setState] = useState([]);

  const getSearchResults = async (text) => {
    try {
      setLoading(true);
      setError(false);

      const data = await API.fetchSearch(text, "c");
      setState(data);
    } catch (err) {
      console.error(err);
      setError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    getSearchResults(text);
  }, [text]);

  return { state, text, loading, error, setText };
};
