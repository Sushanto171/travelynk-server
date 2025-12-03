import z from "zod";

export const verifySchema = z.object({
  email: z.email("Invalid email address").nonempty("Email must be required"),
  otp: z.coerce
    .number()
    .int("OTP must be an integer")
    .min(100000, "OTP must be 6 digits")
    .max(999999, "OTP must be 6 digits"),

})

export type VerifyInput = z.infer<typeof verifySchema>