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

/**
 * Paginate a Mongoose model query
 * @param {Model} model - Mongoose model
 * @param {Object} filter - Query filter
 * @param {Object} options - Pagination options
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.limit - Items per page (default: 10)
 * @param {Object} options.sort - Sort object
 * @param {Array} options.populate - Populate paths
 * @param {string} options.select - Fields to select
 * @returns {Object} Paginated result with data and pagination info
 */
const paginate = async (model, filter = {}, options = {}) => {
  const page = Math.max(1, options.page || 1);
  const limit = Math.min(100, Math.max(1, options.limit || 10));
  const skip = (page - 1) * limit;
  const sort = options.sort || { createdAt: -1 };

  // Build query
  let query = model.find(filter);

  // Apply sort
  query = query.sort(sort);

  // Apply pagination
  query = query.skip(skip).limit(limit);

  // Apply select
  if (options.select) {
    query = query.select(options.select);
  }

  // Apply populate
  if (options.populate) {
    if (Array.isArray(options.populate)) {
      options.populate.forEach((p) => {
        query = query.populate(p);
      });
    } else {
      query = query.populate(options.populate);
    }
  }

  // Execute query and count in parallel
  const [data, total] = await Promise.all([
    query.exec(),
    model.countDocuments(filter)
  ]);

  return {
    data,
    pagination: buildPaginationResult(page, limit, total)
  };
};

module.exports = {
  getPagination,
  getSorting,
  buildPaginationResult,
  paginate
};
