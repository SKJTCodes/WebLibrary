import axios from "axios";

const apiSettings = {
  fetchLibrary: async (page, type, sort) => {
    const res = await axios({
      method: "GET",
      url: `${process.env.REACT_APP_DOMAIN}${type}/l?page=${page}&sort=${sort}`,
    });
    return res.data;
  },
  fetchPages: async (itemId, chptNum, type) => {
    const res = await axios({
      method: "GET",
      url: `${process.env.REACT_APP_DOMAIN}${type}/page?itemId=${itemId}&chptNum=${chptNum}`,
    });
    return res.data;
  },
  fetchEpisodes: async (itemId, epNum, type) => {
    const res = await axios({
      method: "GET",
      url: `${process.env.REACT_APP_DOMAIN}${type}/ep?itemId=${itemId}&epNum=${epNum}`,
    });
    return res.data;
  },
  fetchEntry: async (itemId, type) => {
    const res = await axios({
      method: "GET",
      url: `${process.env.REACT_APP_DOMAIN}${type}/entry?itemId=${itemId}`,
    });
    return res.data;
  },
  fetchSearch: async (searchText) => {
    const res = await axios({
      method: "GET",
      url: `${process.env.REACT_APP_DOMAIN}com/search?text=${searchText}`,
    });
    return res.data;
  },
  fetchTags: async () => {
    const res = await axios({
      method: "GET",
      url: `${process.env.REACT_APP_DOMAIN}com/tags`,
    });
    return res.data;
  },
  deleteLibraryItem: async (itemId, itemType) => {
    const res = await axios({
      method: "DELETE",
      url: `${process.env.REACT_APP_DOMAIN}com/entry?itemId=${itemId}&itemType=${itemType}`,
    });

    return res.status;
  },
  updateEntry: async (updData) => {
    await axios({
      method: "POST",
      url: `${process.env.REACT_APP_DOMAIN}com/upd`,
      data: updData,
    });
  },
  upload: async (type, formData, setProgress) => {
    const res = await axios({
      method: "POST",
      url: `${process.env.REACT_APP_DOMAIN}u?type=${type}`,
      data: formData,
      onUploadProgress: (progressEvent) => {
        const progress = progressEvent.loaded / progressEvent.total;
        console.log(`Upload Progress: ${progress}`);
        setProgress(progress);
      },
    });
    return res.status;
  },
};

export default apiSettings;
