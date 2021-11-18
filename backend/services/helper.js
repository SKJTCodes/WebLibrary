
const helper = {
  getDistinctObjArr: (arr, distinctKey) => {
    return Array.from(new Set(arr.map((s) => s[distinctKey]))).map(
      (id) => {
        const obj = arr.find((s) => s[distinctKey] === id);
        return obj;
      }
    )
  },
}

module.exports = helper;