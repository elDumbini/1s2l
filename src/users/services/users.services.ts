import {
  AppError,
  DatabaseError,
  NotFoundError,
} from "../../core/utils/errorsInstances";
import { HTTP_STATUSES } from "../../core/types/types";
import { UserItem } from "../types/users.type";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT_DIRECTION,
  SortDirection,
} from "../../core/validations/core.validations";
import {
  PaginatedResponse,
  PaginationQuery,
} from "../../core/types/common.types";
import { toMongoSortDirection } from "../../core/types/common.types";
import { usersQueryRepository } from "../repositories/users.queryRepo";
import {
  CreateUserDTO,
  CreateUserResponseDTO,
  GetUserDTO,
} from "../dto/users.dto";
import { usersRepository } from "../repositories/users.repo";

export const usersService = {
  getUsers: async (
    query: PaginationQuery & {
      searchEmailTerm?: string;
      searchLoginTerm?: string;
    }
  ): Promise<PaginatedResponse<GetUserDTO>> => {
    try {
      const pageNumber = query.pageNumber || DEFAULT_PAGE;
      const pageSize = query.pageSize || DEFAULT_PAGE_SIZE;
      const sortBy = query.sortBy || "createdAt";
      const sortDirection =
        (query.sortDirection as SortDirection) || DEFAULT_SORT_DIRECTION;

      return await usersQueryRepository.getUsers({
        pageNumber,
        pageSize,
        sortBy,
        sortDirection: toMongoSortDirection(sortDirection),
        searchEmailTerm: query?.searchEmailTerm || "",
        searchLoginTerm: query?.searchLoginTerm || "",
      });
    } catch (error) {
      throw new DatabaseError(
        error instanceof Error ? error.message : "Failed to get users",
        error instanceof Error ? error : undefined
      );
    }
  },
  createUser: async (dto: CreateUserDTO): Promise<CreateUserResponseDTO> => {
    try {
      const foundUser = await usersRepository.getUserByLoginOrEmail(
        dto.login,
        dto.email
      );

      if (foundUser) {
        if (foundUser.login === dto.login) {
          throw new AppError(
            "User with this login already exists",
            HTTP_STATUSES.BAD_REQUEST,
            "login"
          );
        }
        if (foundUser.email === dto.email) {
          throw new AppError(
            "User with this email already exists",
            HTTP_STATUSES.BAD_REQUEST,
            "email"
          );
        }
        throw new AppError(
          "User with this login and email already exists",
          HTTP_STATUSES.BAD_REQUEST,
          "login"
        );
      }

      return await usersRepository.createUser(dto);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new DatabaseError(
        error instanceof Error ? error.message : "Failed to create user",
        error instanceof Error ? error : undefined
      );
    }
  },
  deleteUser: async (id: string): Promise<void> => {
    try {
      const deleted = await usersRepository.deleteUser(id);
      if (!deleted) {
        throw new NotFoundError("User not found");
      }
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError(
        error instanceof Error ? error.message : "Failed to delete user",
        error instanceof Error ? error : undefined
      );
    }
  },
};
