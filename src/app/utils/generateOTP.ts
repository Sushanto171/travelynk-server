import crypto from "crypto";

export const generateOTP = (length = 6): string => {
  const digits = "0123456789";
  const bytes = crypto.randomBytes(length);

  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[bytes[i] % 10];
  }

  return otp;
};
