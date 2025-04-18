export type HTMLFormSubmitType = React.FormEvent<HTMLFormElement>;

export interface HTMLInputEventType {
  target: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
}

export interface HTMLInputFileType {
  target: { files: FileList };
}

export type FormImageType = {
  name: string;
  size: number;
  type: string;
  base64: string | ArrayBuffer;
};

export type SignupFormInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
};

export type LoginFormInput = {
  email: string;
  password: string;
  role: string;
};

export type SignupFunction = (
  formInput: SignupFormInput,
  customLink?: string
) => void;

export type LoginFunction = (
  formInput: LoginFormInput,
  customLink?: string
) => void;

export type LogoutFunction = () => void;

export type VerifyTokenFunction = () => Promise<{
  verified: boolean;
  msg: string;
}>;
