import { useState, useEffect } from "react";
// API
import API from "../API";

export const useDeleteItem = () => {
  const [item, setItem] = useState({id: null, type: null});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const deleteItem = async (item) => {
    try {
      setLoading(true);
      setError(false);

      await API.deleteLibraryItem(item['id'], item['type']);
      setIsDeleted(true)
    } catch (err) {
      setError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!item['id'] | !item['type']) return;
    deleteItem(item);
  }, [item]);

  return { error, loading, isDeleted, setItem };
};
