import { NextFunction, Request, Response } from "express";
import { ClientError, HTTP_STATUSES } from "../../core/types/types";
import {
  PaginatedResponse,
  PaginationQuery,
} from "../../core/types/common.types";
import { usersService } from "../services/users.services";
import {
  CreateUserDTO,
  CreateUserResponseDTO,
  GetUserDTO,
  GetUsersDTO,
} from "../dto/users.dto";
import { UserItem } from "../types/users.type";

export const userController = {
  getUsers: async (
    req: Request<{}, {}, {}, PaginationQuery>,
    res: Response<PaginatedResponse<GetUserDTO> | ClientError>,
    next: NextFunction
  ) => {
    try {
      const users = await usersService.getUsers(req.query);
      return res.status(HTTP_STATUSES.OK).send(users);
    } catch (error) {
      next(error);
    }
  },
  createUser: async (
    req: Request<{}, {}, CreateUserDTO>,
    res: Response<CreateUserResponseDTO | ClientError>,
    next: NextFunction
  ) => {
    try {
      const user = await usersService.createUser(req.body);
      return res.status(HTTP_STATUSES.CREATED).send(user);
    } catch (error) {
      next(error);
    }
  },
  deleteUser: async (
    req: Request<{ id: string }>,
    res: Response<void | ClientError>,
    next: NextFunction
  ) => {
    try {
      await usersService.deleteUser(req.params.id);
      return res.status(HTTP_STATUSES.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  },
};
