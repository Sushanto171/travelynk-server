import { NextFunction, Request, Response } from "express";
import { ZodSchema, } from "zod";

export const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parse(req.body);
      next();
    } catch (error) {
      next(error)
    }
  };
};