import { FORM_ERROR_MESSAGES } from "@/src/constants/formErrorMessages";
import * as zod from "zod";

const defaultPromptFormSchema = zod.object({
  defaultPrompt: zod.string(FORM_ERROR_MESSAGES.fieldRequired),
});

export default defaultPromptFormSchema;
