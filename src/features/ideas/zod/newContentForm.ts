import { FORM_ERROR_MESSAGES } from "@/src/constants/formErrorMessages";
import * as zod from "zod";

export const newContentFormSchema = zod.object({
  newContent: zod.string(FORM_ERROR_MESSAGES.fieldRequired),
});

export interface NewContentFormData {
  newContent: string;
}
