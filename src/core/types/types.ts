export enum HTTP_STATUSES {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,

  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,

  INTERNAL_SERVER_ERROR = 500,
}

export type ClientError = {
  errorsMessages: { message: string; field: string }[];
};

export enum ROUTES {
  BLOGS = "/blogs",
  TESTING_ALL_DATA = "/testing/all-data",
  POSTS = "/posts",
}
