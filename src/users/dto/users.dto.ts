import { PaginatedResponse } from "../../core/types/common.types";
import { UserItem } from "../types/users.type";

// Response DTOs
export type GetUsersDTO = PaginatedResponse<UserItem>;
export type GetUserDTO = Omit<UserItem, "hashedPassword" | "salt">;

// Request DTOs
export type CreateUserDTO = {
  email: string;
  login: string;
  password: string;
};

export type CreateUserResponseDTO = Omit<UserItem, "hashedPassword" | "salt">;
