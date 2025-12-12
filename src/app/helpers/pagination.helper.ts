export interface IOptions {
  page?: string | number,
  limit?: string | number,
  sortBy?: string,
  sortOrder?: "asc" | "desc"
}

export interface IOptionsResult {
  page: number,
  limit: number,
  sortBy: string,
  sortOrder: "asc" | "desc",
  skip: number
}

const calculatePagination = (options: IOptions): IOptionsResult => {
  const page = Number(options?.page) || 1;
  const limit = Number(options?.limit) || 10;
  const sortOrder = options?.sortOrder || "desc";
  const sortBy = options?.sortBy || "created_at";
  const skip = (page - 1) * limit;
  return {
    page,
    limit,
    sortBy,
    sortOrder,
    skip,
  };
};

export const paginationHelper = {
  calculatePagination
}