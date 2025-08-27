import { FORM_ERROR_MESSAGES } from "@/src/constants/formErrorMessages";
import * as zod from "zod";

export default zod
  .object({
    username: zod.string(FORM_ERROR_MESSAGES.fieldRequired),
    email: zod.email({
      error: (issue) =>
        !issue.input
          ? FORM_ERROR_MESSAGES.fieldRequired
          : FORM_ERROR_MESSAGES.invalidEmail,
    }),
    password: zod
      .string(FORM_ERROR_MESSAGES.fieldRequired)
      .min(6, FORM_ERROR_MESSAGES.passwordTooShort),
    confirmPassword: zod.string(FORM_ERROR_MESSAGES.fieldRequired),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: FORM_ERROR_MESSAGES.passwordsUnmatch,
    path: ["confirmPassword"],
  });
