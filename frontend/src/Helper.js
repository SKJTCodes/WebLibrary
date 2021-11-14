const helper = {
  titleCase: (str) => {
    var splitStr = str.toLowerCase().split(" ");
    for (var i = 0; i < splitStr.length; i++) {
      // You do not need to check if i is larger than splitStr length, as your for does that for you
      // Assign it back to the array
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(" ");
  },
  // To append URL Search String with new variable, will replace/append if required
  appendSearchString: (searchKey, searchVal, searchString) => {
    if (searchString === "") return `?${searchKey}=${searchVal}`
    else {
      const split = searchString.substring(1).split("&")
      let append = true
      const newSearchText = split.map((text) => {
        if (text.includes(searchKey)) {
          append = false
          const val = text.split("=")
          return `${val[0]}=${searchVal}`
        }
        return text
      })
      if (append) newSearchText.push(`${searchKey}=${searchVal}`)
      return "?" + newSearchText.join("&")
    }
  }
};

export default helper;
