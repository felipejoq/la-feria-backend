export const getResultsWithPagination = ({source, data, total, page, limit}) => {

  const haveNext = (page * limit < total);
  const havePrev = (page - 1 > 0) && (page + limit <= total);

  return {
    page,
    limit,
    total,
    next: haveNext ? `/api/v1/${source}?page=${(page + 1)}&limit=${limit}` : null,
    prev: havePrev ? `/api/v1/${source}article?page=${(page - 1)}&limit=${limit}` : null,
    [source]: data
  };
}