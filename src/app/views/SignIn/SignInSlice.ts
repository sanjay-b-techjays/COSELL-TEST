/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable linebreak-style */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable comma-dangle */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable operator-linebreak */
/* eslint-disable linebreak-style */
/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'universal-cookie';
import { AppBelong } from 'src/strings';
import { postRequest } from '../../service';
import { AppDispatch, RootState } from '../../store';
import { State, SigninPayload, UserData } from './types';

const initialState: State = {
  userData: {
    userId: '',
    token: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    image: '',
  },
  isSignedIn: false,
  errorMsg: '',
  validationErrField: '',
};

const cookies = new Cookies();

// Slice
export const signInSlice = createSlice({
  name: 'sign',
  initialState,
  reducers: {
    setSignedIn(state, { payload }: PayloadAction<{ userData: UserData }>) {
      state.userData = payload.userData;
      state.isSignedIn = true;
    },
    setErrMsg(
      state,
      {
        payload,
      }: PayloadAction<{ errorMsg: string; validationErrField: string }>
    ) {
      state.errorMsg = payload.errorMsg;
      state.validationErrField = payload.validationErrField;
    },
  },
});

// Actions
export const { setSignedIn, setErrMsg } = signInSlice.actions;

const dispatchFunc = (dispatch, resp, payload, loaderAction) => {
  localStorage.setItem('token', resp.data.token);
  localStorage.setItem('userId', resp.data.user_id);
  cookies.set('rememberMe', payload.rememberMe, { path: '/' });
  cookies.set('email', payload.email, { path: '/' });
  dispatch(
    setSignedIn({
      userData: { ...resp.data, password: payload.password },
    })
  );
  dispatch(
    setErrMsg({
      errorMsg: '',
      validationErrField: '',
    })
  );
  loaderAction();
};

export const loginAction =
  (
    payload: SigninPayload,
    history: any,
    url: boolean,
    loaderAction: () => void,
    showAlert: () => void
  ) =>
  (dispatch: AppDispatch) => {
    let signApi;
    if (url === false) {
      signApi = 'users/sales-hub/sign-in/';
    } else {
      signApi = 'users/sign-in/';
    }
    postRequest(signApi, {
      email: payload.email,
      password: payload.password,
      subdomain_name: localStorage.getItem('subDomainName'),
    }).then((resp: any) => {
      if (resp.result === true) {
        localStorage.setItem('userType', resp.data.user_type);
        localStorage.setItem('partnershipId', resp.data.partnership_id);
        if (url === false) {
          dispatchFunc(dispatch, resp, payload, loaderAction);
          history.push(`/home?partner_id=${resp.data.partnership_id}`);
        } else if (resp.data.user_type === AppBelong.manager && url === true) {
          dispatchFunc(dispatch, resp, payload, loaderAction);
          history.push('/accountSetup');
        } else {
          dispatch(
            setErrMsg({
              errorMsg: 'User not allowed',
              validationErrField: 'User not allowed',
            })
          );
          loaderAction();
          showAlert();
        }
        localStorage.setItem('token', resp.data.token);
        localStorage.setItem('userId', resp.data.user_id);
      } else {
        if (resp.data) {
          if (resp.data.msg) {
            dispatch(
              setErrMsg({
                errorMsg: resp.data.msg,
                validationErrField: resp.data.validation_error_field!,
              })
            );
            showAlert();
          } else {
            dispatch(
              setErrMsg({
                errorMsg: 'User not allowed',
                validationErrField: 'User not allowed',
              })
            );
            showAlert();
          }
        } else if (resp.msg) {
          dispatch(
            setErrMsg({
              errorMsg: resp.msg,
              validationErrField: '',
            })
          );
          showAlert();
        } else {
          dispatch(
            setErrMsg({
              errorMsg: 'User not allowed',
              validationErrField: 'User not allowed',
            })
          );
          showAlert();
        }
        loaderAction();
      }
    });
  };

// Selectors
export const selectUserData = (state: RootState) => state.signInSlice.userData;

export const selectSignInRespData = (state: RootState) => state.signInSlice;

export default signInSlice.reducer;
