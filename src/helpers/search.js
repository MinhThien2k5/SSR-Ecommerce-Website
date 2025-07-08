module.exports = (query) => {
  let objectSearch = {
    keyword: "",
    regrex: "",
  };

  if (query.keyword) {
    objectSearch.keyword = query.keyword;

    const regex = new RegExp(objectSearch.keyword, "i");
    objectSearch.regrex = regex;
  }

  return objectSearch;
};
