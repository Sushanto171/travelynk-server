import z from "zod";

export const verifySchema = z.object({
  email: z.email("Invalid email address").nonempty("Email must be required"),
  otp: z.coerce
    .number()
    .int("OTP must be an integer")
    .min(100000, "OTP must be 6 digits")
    .max(999999, "OTP must be 6 digits"),

})

export const resetPassSchema = z.object({
  password: z.string().min(6, "Password must be at least 8 characters long"),
  otp: z.coerce
    .number()
    .int("OTP must be an integer")
    .min(100000, "OTP must be 6 digits")
    .max(999999, "OTP must be 6 digits"),

})

export const changePassSchema = z.object({
  newPassword: z.string().min(6, "Password must be at least 8 characters long"),
  oldPassword: z.string().min(6, "Password must be at least 8 characters long"),
})


export const loginValidationZodSchema = z.object({
  emails: z.email(),
  password: z
    .string("Password is required.")
    .trim()
    .min(6, "Password must be at least 6 character or long"),
});

export type VerifyInput = z.infer<typeof verifySchema>
export type ResetPassInput = z.infer<typeof resetPassSchema>
export type ChangePassInput = z.infer<typeof changePassSchema>