import { SortDirection } from "../validations/core.validations";

// Общие типы для пагинации
export type PaginationQuery = {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: SortDirection;
};

export type PaginatedResponse<T> = {
  items: T[];
  totalCount: number;
  pagesCount: number;
  page: number;
  pageSize: number;
};

// Тип для MongoDB сортировки
export type MongoSortDirection = 1 | -1;

// Утилита для преобразования SortDirection в MongoDB формат
export const toMongoSortDirection = (
  direction: SortDirection
): MongoSortDirection => {
  return direction === SortDirection.Asc ? 1 : -1;
};
