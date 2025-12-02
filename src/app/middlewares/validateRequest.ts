import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export const validateRequest =
  (schema: ZodSchema) => async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body?.data ? JSON.parse(req.body.data) : req.body;
    try {
      req.body = await schema.parse(data);
      next();
    } catch (error) {
      next(error);
    }
  };
