module.exports = {
  getOffset: (page, limit) => {
    return page * limit - limit;
  },
  getNextPage: (page, limit, total) => {
    if (total / limit > page) {
      return page + 1;
    }
    return null;
  },
  getPreviousPage: (page) => {
    if (page <= 1) {
      return null;
    }
    return page - 1;
  },
};
