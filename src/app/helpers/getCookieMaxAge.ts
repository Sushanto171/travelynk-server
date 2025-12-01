import config from "../../config";

type IMaxAgeConvertor = (expires: string) => number;

/**
 * Converts a token expiration string to milliseconds.
 * @param expires - The expiration string (e.g., "1h", "30d").
 * @returns The expiration time in milliseconds.
 *
 * example:
 *  "1h" => 3600000
 *  "30d" => 2592000000
 */

const maxAgeConvertor: IMaxAgeConvertor = (expires: string) => {
  // convert tokenExpiresIn to milliseconds
  let tokenMaxAge = 0;
  const tokenUnit = expires.slice(-1);
  const tokenValue = parseInt(expires.slice(0, -1));
  if (tokenUnit === "y") {
    tokenMaxAge = tokenValue * 365 * 24 * 60 * 60 * 1000;
  } else if (tokenUnit === "M") {
    tokenMaxAge = tokenValue * 30 * 24 * 60 * 60 * 1000;
  } else if (tokenUnit === "w") {
    tokenMaxAge = tokenValue * 7 * 24 * 60 * 60 * 1000;
  } else if (tokenUnit === "d") {
    tokenMaxAge = tokenValue * 24 * 60 * 60 * 1000;
  } else if (tokenUnit === "h") {
    tokenMaxAge = tokenValue * 60 * 60 * 1000;
  } else if (tokenUnit === "m") {
    tokenMaxAge = tokenValue * 60 * 1000;
  } else if (tokenUnit === "s") {
    tokenMaxAge = tokenValue * 1000;
  } else {
    tokenMaxAge = 1000 * 60 * 60; // default 1 hour
  }
  return tokenMaxAge;
};

type IGetCookieMaxAge = () => {
  accessTokenMaxAge: number;
  refreshTokenMaxAge: number;
};
/**
 * Gets the max age for access and refresh tokens.
 * @returns An object containing the max age for access and refresh tokens in milliseconds.
 *
 * example:
 *  {
 *    accessTokenMaxAge: 3600000, // 1 hour
 *    refreshTokenMaxAge: 7776000000 // 90 days
 *  }
 */

export const getCookieMaxAge: IGetCookieMaxAge = () => {
  const accessTokenExpiresIn = config.jwt.JWT_ACCESS_EXPIRES_IN || "1h";
  const refreshTokenExpiresIn = config.jwt.JWT_REFRESH_EXPIRES_IN || "90d";
  return {
    accessTokenMaxAge: maxAgeConvertor(accessTokenExpiresIn),
    refreshTokenMaxAge: maxAgeConvertor(refreshTokenExpiresIn),
  };
};
