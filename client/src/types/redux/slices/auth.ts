export type UserType = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  address?: string;
  role: string;
};

export interface InitialStateType {
  user: UserType | null;
  accessToken: string | null;
  isLoggedIn: boolean;
}
