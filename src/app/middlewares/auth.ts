import { NextFunction, Request, Response } from "express";
import { UserRole } from "../../generated/prisma/enums";

export const auth = (...role: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {

    req.cookies.get("accessToken")

    console.log(role);


    next()
  }
}