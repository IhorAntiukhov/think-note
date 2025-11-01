import { FORM_ERROR_MESSAGES } from "@/src/constants/formErrorMessages";
import * as zod from "zod";

export const usernameFormSchema = zod.object({
  username: zod.string(FORM_ERROR_MESSAGES.fieldRequired),
});

export const emailFormSchema = zod.object({
  email: zod.email({
    error: (issue) =>
      !issue.input
        ? FORM_ERROR_MESSAGES.fieldRequired
        : FORM_ERROR_MESSAGES.invalidEmail,
  }),
});

export const passwordFormSchema = zod
  .object({
    password: zod
      .string(FORM_ERROR_MESSAGES.fieldRequired)
      .min(6, FORM_ERROR_MESSAGES.passwordTooShort),
    confirmPassword: zod.string(FORM_ERROR_MESSAGES.fieldRequired),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: FORM_ERROR_MESSAGES.passwordsUnmatch,
    path: ["confirmPassword"],
  });
