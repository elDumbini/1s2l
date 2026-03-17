import { ObjectId, WithId } from "mongodb";
import { blogCollection, usersCollection } from "../../db/mongodb";
import {
  PaginatedResponse,
  MongoSortDirection,
} from "../../core/types/common.types";
import { UserItem } from "../types/users.type";
import { GetUserDTO } from "../dto/users.dto";

// Типы для работы с БД (внутренние типы репозитория)
type User = WithId<{
  email: string;
  login: string;
  createdAt: string;
  hashedPassword: string;
  salt: string;
}>;

type GetUsersParams = {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: MongoSortDirection;
  searchEmailTerm?: string;
  searchLoginTerm?: string;
};

const mapDocumentToUser = (doc: any): GetUserDTO => ({
  id: doc._id.toString(),
  email: doc.email,
  login: doc.login,
  createdAt: doc.createdAt,
});

export const usersQueryRepository = {
  getUsers: async (
    params: GetUsersParams
  ): Promise<PaginatedResponse<GetUserDTO>> => {
    if (!usersCollection) {
      throw new Error("User collection not initialized");
    }
    console.log(params);
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchEmailTerm,
      searchLoginTerm,
    } = params;

    const skip = (pageNumber - 1) * pageSize;
    const filter: any = {};

    if (searchEmailTerm) {
      filter.email = { $regex: searchEmailTerm, $options: "i" };
    }
    if (searchLoginTerm) {
      filter.login = { $regex: searchLoginTerm, $options: "i" };
    }

    const [items, totalCount] = await Promise.all([
      usersCollection
        .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .toArray(),
      usersCollection.countDocuments(filter),
    ]);

    return {
      items: items.map(mapDocumentToUser),
      totalCount,
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
    };
  },
};
