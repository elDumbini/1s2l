import { param, query } from "express-validator";

export enum SortDirection {
  Asc = "asc",
  Desc = "desc",
}

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_SORT_DIRECTION = SortDirection.Desc;

export const idValidation = (mix = 1, max = 1000) =>
  param("id")
    .exists()
    .withMessage("ID is required")
    .isString()
    .withMessage("ID must be a string")
    .isLength({ min: mix, max: max })
    .withMessage("ID must be between 1 and 1000 characters")
    .isNumeric()
    .withMessage("ID must be a numeric string");

export function paginationAndSortingValidation<T extends string>(
  sortFieldsEnum: Record<string, T>
) {
  const defaultSortBy = Object.values(sortFieldsEnum)[0];
  
  return [
    query("pageNumber")
      .optional({ checkFalsy: true })
      .customSanitizer((value) => {
        if (!value || value === "") return DEFAULT_PAGE;
        const num = parseInt(String(value), 10);
        return isNaN(num) ? DEFAULT_PAGE : num;
      }),

    query("pageSize")
      .optional({ checkFalsy: true })
      .customSanitizer((value) => {
        if (!value || value === "") return DEFAULT_PAGE_SIZE;
        const num = parseInt(String(value), 10);
        return isNaN(num) ? DEFAULT_PAGE_SIZE : num;
      }),

    query("sortBy")
      .optional({ checkFalsy: true })
      .customSanitizer((value) => {
        if (!value || value === "") return defaultSortBy;
        return value;
      }),

    query("sortDirection")
      .optional({ checkFalsy: true })
      .customSanitizer((value) => {
        if (!value || value === "") return DEFAULT_SORT_DIRECTION;
        return value;
      }),
  ];
}
