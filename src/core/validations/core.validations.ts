import { param, query } from "express-validator";

export enum SortDirection {
  Asc = "asc",
  Desc = "desc",
}

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_DIRECTION = SortDirection.Desc;

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
  return [
    query("pageNumber")
      .default(DEFAULT_PAGE)
      .isInt({ min: 1 })
      .withMessage("Page number must be a positive integer")
      .toInt(),

    query("pageSize")
      .default(DEFAULT_PAGE_SIZE)
      .isInt({ min: 1, max: 100 })
      .withMessage("Page size must be between 1 and 100")
      .toInt(),

    query("sortBy")
      .default(Object.values(sortFieldsEnum)[0])
      .isIn(Object.values(sortFieldsEnum))
      .withMessage(
        `Allowed sort fields: ${Object.values(sortFieldsEnum).join(", ")}`
      ),

    query("sortDirection")
      .default(DEFAULT_SORT_DIRECTION)
      .isIn(Object.values(SortDirection))
      .withMessage(
        `Sort direction must be one of: ${Object.values(SortDirection).join(", ")}`
      ),
  ];
}
