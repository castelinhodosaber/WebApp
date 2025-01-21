type Pagination = {
  limit?: number;
  size?: number;
  page: number;
  total?: number;
  next?: boolean;
  previous?: boolean;
};

export default Pagination;
