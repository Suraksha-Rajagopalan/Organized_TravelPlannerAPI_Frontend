export interface PaginationParamsDto<T> {
  pageNumber: number; // default is 1
  pageSize: number;   // default is 3
  totalItems?: number;
  totalPages?: number;
  items: T[];
}
