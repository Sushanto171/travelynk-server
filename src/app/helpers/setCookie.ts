import { CookieOptions, Response } from "express";
import { getCookieMaxAge } from "./getCookieMaxAge";

const options: CookieOptions = {
  sameSite: "none",
  secure: true,
  httpOnly: true,
};

export const setCookie = (
  res: Response,
  { accessToken, refreshToken }: { accessToken?: string; refreshToken?: string }
) => {
  if (accessToken) {
    res.cookie("accessToken", accessToken, {
      ...options,
      maxAge: getCookieMaxAge().accessTokenMaxAge,
    });
  }
  if (refreshToken) {
    res.cookie("refreshToken", refreshToken, {
      ...options,
      maxAge: getCookieMaxAge().refreshTokenMaxAge,
    });
  }
};
