import { useState, useEffect } from "react";
// API
import API from "../API";

export const useDeleteComic = () => {
  const [itemId, setItemId] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const deleteComic = async (itemId) => {
    try {
      setLoading(true);
      setError(false);

      const statusCode = await API.deleteEntry(itemId, "c", "all");
      if (statusCode !== 200) {
        console.error(`Failed to delete Entry: ${itemId}`);
        setError(true);
      }

      setLoading(false);
      setDone(true);
    } catch (err) {
      console.error(err);
      setError(true);
    }
  };

  useEffect(() => {
    if (!itemId) return;
    deleteComic(itemId);
  }, [itemId]);

  return { error, loading, done, setItemId };
};
