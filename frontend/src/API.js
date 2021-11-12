import axios from "axios";

const apiSettings = {
  fetchLibrary: async (page, type, sort) => {
    let column = "DateCreated";
    if ((sort === "Most Chapters") | (sort === "Most Episodes"))
      column = "TotalEntries";

    const res = await axios({
      method: "GET",
      url: `${process.env.REACT_APP_DOMAIN}${type}/l?page=${page}&sort=${column}`,
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
  fetchEntry: async (itemId, type) => {
    const res = await axios({
      method: "GET",
      url: `${process.env.REACT_APP_DOMAIN}${type}/entry?itemId=${itemId}`,
    });
    return res.data;
  },
  fetchSearch: async (searchText, type) => {
    const res = await axios({
      method: "GET",
      url: `${process.env.REACT_APP_DOMAIN}${type}/search?text=${searchText}`,
    });
    return res.data;
  },
  deleteEntry: async (itemId, type, tableType = "all") => {
    let res = { status: 404 };

    if (tableType === "all") {
      res = await axios({
        method: "DELETE",
        url: `${process.env.REACT_APP_DOMAIN}${type}/entry?itemId=${itemId}`,
      });
    }

    return res.status;
  },
  updateEntry: async (type, updData) => {
    const res = await axios({
      method: "POST",
      url: `${process.env.REACT_APP_DOMAIN}${type}/upd`,
      data: updData,
    });
    console.log(res.data);
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
