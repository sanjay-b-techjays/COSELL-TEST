/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from 'src/app/store';
import { State, loginPayload } from './types';

type loggedInUser = {
  email: string;
  name: string;
};

const initialState: State = {
  user: {
    email: '',
    name: '',
  },
  isLoggedIn: false,
};

// Slice
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsers(state, { payload }: PayloadAction<{ user: loggedInUser }>) {
      state.user = payload.user;
      state.isLoggedIn = true;
    },
  },
});

// Actions
export const { setUsers } = userSlice.actions;

export const loginAction =
  (payload: loginPayload) => (dispatch: AppDispatch) => {
    // fetch(`/user/login`, {
    //   method: 'POST',
    //   body: JSON.stringify(payload),
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: 'Bearer '
    //   }
    // })
    //   .then((res) => res.json())
    //   .then((response) => {
    //       dispatch(setUsers(response.data));
    //   })
    //   .catch((error) => console.error('Error:', error));

    console.log({ payload });
    const user = { name: 'suganya', email: payload.email };
    dispatch(setUsers({ user }));
  };

// Selectors
export const selectUser = (state: RootState) => state.userslice.user;

export const selectIsUserLoggedIn = (state: RootState) =>
  state.userslice.isLoggedIn;

export default userSlice.reducer;
