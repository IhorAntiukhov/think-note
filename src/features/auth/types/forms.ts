export interface UsernameFormData {
  username: string;
}

export interface EmailFormData {
  email: string;
}

export interface PasswordFormData {
  password: string;
  confirmPassword: string;
}

export interface IdeaWordsNumFormData {
  ideaWordsNum: number;
}

export interface SignInFormData {
  email: string;
  password: string;
}

export interface SignUpFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export type FormDataKey =
  | keyof UsernameFormData
  | keyof EmailFormData
  | keyof PasswordFormData
  | keyof IdeaWordsNumFormData;
