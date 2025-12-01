import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import config from "../../config";

const generateToken = (
  payload: JwtPayload,
  secretKey: string,
  expiresIn: string | number,
  algorithm?: jwt.Algorithm
) => {
  return jwt.sign(payload, secretKey, {
    algorithm,
    expiresIn,
  } as SignOptions);
};

const getTokens = (payload: JwtPayload) => {
  if (
    !config.jwt.JWT_ACCESS_SECRET ||
    !config.jwt.JWT_ACCESS_EXPIRES_IN ||
    !config.jwt.JWT_REFRESH_SECRET ||
    !config.jwt.JWT_REFRESH_EXPIRES_IN
  ) {
    throw new Error("JWT variables is not defined in config.");
  }
  const accessToken = generateToken(
    payload,
    config.jwt.JWT_ACCESS_SECRET,
    config.jwt.JWT_ACCESS_EXPIRES_IN,
    "HS256"
  );
  const refreshToken = generateToken(
    payload,
    config.jwt.JWT_REFRESH_SECRET,
    config.jwt.JWT_REFRESH_EXPIRES_IN,
    "HS256"
  );
  return { accessToken, refreshToken };
};

const verifyToken = (
  token: string,
  secret: string,
  algorithms?: jwt.Algorithm[]
) => {
  return jwt.verify(token, secret, { algorithms }) as JwtPayload;
};

export const jwtHelper = {
  verifyToken,
  generateToken,
  getTokens,
};
