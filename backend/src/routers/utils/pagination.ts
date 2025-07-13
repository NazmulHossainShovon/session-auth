// utils/pagination.ts
import { Request } from "express";
import { Model } from "mongoose";

interface PaginationOptions {
  page: number;
  skip: number;
  limit: number;
}

export const getPaginationParams = (req: Request): PaginationOptions => {
  const page = parseInt(req.query.currentPage as string) || 1;
  const limit = 3; // Default limit of 3
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

export const applyPagination = async <T>(
  model: Model<T>,
  query: object,
  pagination: PaginationOptions
): Promise<{ data: T[]; totalPages: number }> => {
  const { skip, limit } = pagination;
  const data = await model
    .find(query)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });
  const totalItems = await model.countDocuments(query);
  const totalPages = Math.ceil(totalItems / limit);
  return { data, totalPages };
};
