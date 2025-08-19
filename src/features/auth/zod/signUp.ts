import * as zod from "zod";

export interface SignUpFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default zod
  .object({
    username: zod.string("Field is required"),
    email: zod.email({
      error: (issue) =>
        !issue.input ? "Field is required" : "Enter a valid email",
    }),
    password: zod
      .string("Field is required")
      .min(6, "Password must be at least 6 characters long"),
    confirmPassword: zod.string("Field is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  });
