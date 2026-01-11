/**
 * Pagination helper for MongoDB queries
 */

const getPagination = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 10));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const getSorting = (query, defaultSort = '-createdAt') => {
  const sortBy = query.sortBy || defaultSort;
  return sortBy;
};

const buildPaginationResult = (page, limit, total) => {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    hasNextPage: page < Math.ceil(total / limit),
    hasPrevPage: page > 1
  };
};

module.exports = {
  getPagination,
  getSorting,
  buildPaginationResult
};
