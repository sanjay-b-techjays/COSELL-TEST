/* eslint-disable linebreak-style */
/* eslint-disable camelcase */
/* eslint-disable linebreak-style */
// state the object where the needed vaiables stored

export type State = {
  email: string;
  errorMsg: string;
  validationErrField: string;
};

export type signUpPayload = {
  firstName: string;
  lastName: string;
  workEmail: string;
  password: string;
  companyName: string;
  role: string;
  salesRegion: string;
  termsAgreed: boolean;
};

export type signUpResponse = {
  data: {
    email: string;
  };
  msg: string;
  result: boolean;
  validation_error_field?: string;
};
