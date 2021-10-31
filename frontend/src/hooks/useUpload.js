import { useState, useEffect } from "react";
// API
import API from "../API";

export const useUploadComic = () => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isInitial, setIsInitial] = useState(true);
  const [fd, setFd] = useState(new FormData());

  const upload = async (fd) => {
    try {
      setLoading(true);
      setError(false);
      const resStatus = await API.upload("c", fd, setProgress);
      // eslint-disable-next-line no-throw-literal
      if (resStatus !== 200) throw `Status code error: ${resStatus}`;
      else console.log("successfully upload");
    } catch (err) {
      setError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isInitial) return;

    upload(fd);
  }, [fd, isInitial]);
  return { loading, error, progress, setFd, setIsInitial };
};
