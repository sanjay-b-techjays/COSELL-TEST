/* eslint-disable linebreak-style */
export type State = {
  userData: UserData;
  isSignedIn: boolean;
  errorMsg: string;
  validationErrField: string;
};
export interface UserData {
  userId: string;
  token: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  image: string | File;
}

export interface SigninPayload {
  email: string;
  password: string;
  rememberMe: boolean;
}
