import * as zod from "zod";

export interface SignInFormData {
  email: string;
  password: string;
}

export default zod.object({
  email: zod.email({
    error: (issue) =>
      !issue.input ? "Field is required" : "Enter a valid email",
  }),
  password: zod
    .string("Field is required")
    .min(6, "Password must be at least 6 characters long"),
});
