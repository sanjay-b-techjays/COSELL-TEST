export type State = {
  user: {
    email: string;
    name: string;
  };
  isLoggedIn: boolean;
};

export interface loginPayload {
  email: string;
  password: string;
}
