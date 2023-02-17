/* eslint-disable linebreak-style */
export type State = {
  user: {
    firstName: string;
    lastName: string;
    workEmail: string;
    password: string;
  };
  termsAgreed: boolean;
};

export interface signUpPayload {
  firstName: string;
  lastName: string;
  workEmail: string;
  password: string;
}
