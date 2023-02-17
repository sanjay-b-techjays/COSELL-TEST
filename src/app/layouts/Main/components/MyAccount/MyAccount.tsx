/* eslint-disable indent */
/* eslint-disable operator-linebreak */
/* eslint-disable linebreak-style */
/* eslint-disable comma-dangle */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable linebreak-style */
import React, { useState, useRef } from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import InputAdornment from '@material-ui/core/InputAdornment';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import PrimaryButton from 'src/app/components/Button/PrimaryButton';
import PreviewImage from 'src/app/components/PreviewImage/PreviewImage';
import useThumbnailImage from 'src/app/components/PreviewImage/CustomHook/useThumbnailImage';
import CloseIcon from '@mui/icons-material/Close';
import { Badge } from '@mui/material';
import { postRequest, getRequest } from '../../../../service';
import { setAccountDetailRefresh } from '../../../../views/CreatePartnership/CreatePartnerShipSlice';
import UploadLogo from '../../../../components/Icons/PreviewPartnership/UploadLogoIcon.svg';
import profile from '../../../../assets/profile.png';
import DialogBoxComponent from '../../../../components/DialogBox/DialogBox';

import {
  ButtonLabels,
  MyAccountLabels,
  previewImageLables,
} from '../../../../../strings';
import {
  GenTextField,
  RenderErrorMessage,
  RenderTextField,
} from '../../../../views/SalesHubSite/Form';
import { useStyles } from '../../../../views/SalesHubSite/Styles';
import SecondaryButton from '../../../../components/Button/SecondaryButton';
import styles from './MyAccount.module.css';
import {
  selectUserData,
  setSignedIn,
} from '../../../../views/SignIn/SignInSlice';

interface Values {
  firstName: string;
  lastName: string;
  email: string;
  profileImg: string | File;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
const MyAccount = (props: any) => {
  const {
    cancelHandler,
    showAlert,
    setIsFormEdited,
    isFormEdited,
    setisDirty,
    showCloseWarning,
    setShowCloseWarning,
  } = props;
  const classes = useStyles();
  const userData = useSelector(selectUserData);
  const token = localStorage.getItem('token');
  const [pWChangeShow, setPWChangeShow] = React.useState(false);
  const [fieldError, setFieldError] = React.useState('');
  const [visibilityCurrentPswd, setVisibilityCurrentPswd] =
    React.useState(false);
  const [visibilityNewPswd, setVisibilityNewPswd] = React.useState(false);
  const [visibilityConfirmPswd, setVisibilityConfirmPswd] =
    React.useState(false);
  const [initialValues, setInitialValues] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    profileImg: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const dispatch = useDispatch();
  const currentPwRef = React.useRef(null);
  const newPwRef = React.useRef(null);
  const confirmPwRef = React.useRef(null);
  const profileFileInput = useRef<HTMLInputElement>(null);

  const getAccountInfo = () => {
    getRequest(`users/my-account/`, {
      Authorization: `Token ${token}`,
    }).then((resp: any) => {
      if (resp.result === true) {
        setInitialValues({
          firstName: resp.data.first_name,
          lastName: resp.data.last_name,
          email: resp.data.email,
          profileImg: resp.data.image,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    });
  };

  React.useEffect(() => {
    getAccountInfo();
  }, []);

  const setAccountDetail = (formValues: Values) => {
    const formData = new FormData();
    formData.append('first_name', formValues.firstName);
    formData.append('last_name', formValues.lastName);
    formData.append('email', formValues.email);
    formData.append('image', formValues.profileImg);

    if (pWChangeShow) {
      formData.append('current_password', formValues.currentPassword);
      formData.append('new_password', formValues.newPassword);
      formData.append('confirm_password', formValues.confirmPassword);
    }
    postRequest(`users/my-account/`, formData, {
      Authorization: `Token ${token}`,
    }).then((resp: any) => {
      if (resp.result === true) {
        dispatch(
          setAccountDetailRefresh({
            refreshAccDetailTimeStamp: Date.now(),
          })
        );
        setSignedIn({
          userData: {
            ...userData,
            email: resp.data.email,
            firstName: resp.data.first_name,
            lastName: resp.data.last_name,
            image: resp.data.image,
          },
        });
        setPWChangeShow(false);
        cancelHandler();
        showAlert(MyAccountLabels.successProfileMsg);
      }
      const timer = setTimeout(() => setFieldError(''), 10000);
      setFieldError(resp.data.msg);
      return () => clearTimeout(timer);
    });
  };
  const myPwSchema = Yup.object().shape({
    firstName: Yup.string()
      .trim()
      .min(3, 'Minimum 3 characters is required')
      .required('First name is required'),
    lastName: Yup.string()
      .trim()
      // .min(3, 'Minimum 3 characters is required')
      .required('Last name is required'),
    email: Yup.string()
      .trim()
      .email('Enter a valid email')
      .required('Email is required'),
    currentPassword: Yup.string()
      .trim()
      .required('Current password is required'),
    newPassword: Yup.string()
      .trim()
      .required('New password is required')
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{5,17}$/,
        'Valid password should include 5 to 17 characters, upper, lower case, numeric and special characters'
      )
      .notOneOf(
        [Yup.ref('currentPassword'), null],
        'New password must be different from current password'
      ),
    confirmPassword: Yup.string()
      .trim()
      .required('Confirm password is required')
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
  });
  const MyAccountSchema = Yup.object().shape({
    firstName: Yup.string().trim().required('First name is required'),
    lastName: Yup.string().trim().required('Last name is required'),
    email: Yup.string()
      .trim()
      .email('Enter a valid email')
      .required('Email is required'),
  });
  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };
  const handleClickShowCurrentPassword = (pwValue) => {
    setVisibilityCurrentPswd(!visibilityCurrentPswd);
    currentPwRef.current.children[0].children[0].focus();
    setTimeout(() => {
      const inputField: HTMLInputElement =
        currentPwRef.current.children[0].children[0];
      inputField.setSelectionRange(pwValue.length, pwValue.length);
    }, 1);
  };
  const handleClickShowNewPswd = (pwValue) => {
    setVisibilityNewPswd(!visibilityNewPswd);
    newPwRef.current.children[0].children[0].focus();
    setTimeout(() => {
      const inputField: HTMLInputElement =
        newPwRef.current.children[0].children[0];
      inputField.setSelectionRange(pwValue.length, pwValue.length);
    }, 1);
  };
  const handleClickShowConfirmPswd = (pwValue) => {
    setVisibilityConfirmPswd(!visibilityConfirmPswd);
    confirmPwRef.current.children[0].children[0].focus();
    setTimeout(() => {
      const inputField: HTMLInputElement =
        confirmPwRef.current.children[0].children[0];
      inputField.setSelectionRange(pwValue.length, pwValue.length);
    }, 1);
  };

  const onImageCancel = (setFieldValue: any) => {
    profileFileInput.current.value = '';
    setFieldValue('profileImg', '');
  };
  const onProfileImageSelect = (event: any, setFieldValue: any) => {
    const file1 = event.target.files[0];
    if (
      file1 &&
      file1.name &&
      // formikForm &&
      // formikForm.current &&
      file1.type.includes('image/')
    ) {
      // setProfileImg(URL.createObjectURL(e.target.files[0]));
      setFieldValue('profileImg', event.target.files[0]);
    } else {
      showAlert(MyAccountLabels.fileErrorMessage, 'error');
    }
  };

  return (
    <div className={styles.myAccWrap}>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={pWChangeShow ? myPwSchema : MyAccountSchema}
        onSubmit={(values) => {
          setAccountDetail(values);
        }}
      >
        {(formik) => {
          const {
            values,
            handleChange,
            handleSubmit,
            errors,
            touched,
            dirty,
            handleBlur,
            setFieldValue,
          } = formik;
          setisDirty(dirty);
          console.log(values, 'values');
          return (
            <Form
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onSubmit={handleSubmit}
            >
              <div className={styles.accInfoFom}>
                <div className={styles.accInfoField}>
                  <div className={`${styles.semiField} ${styles.labelField}`}>
                    {MyAccountLabels.firstName}
                  </div>
                  <div className={styles.semiField}>
                    <Field
                      type="text"
                      name="firstName"
                      value={values.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={MyAccountLabels.firstName}
                      hasError={errors.firstName && touched.firstName}
                      errorMessage={errors.firstName}
                      classes={classes}
                      component={RenderTextField}
                    />
                    <RenderErrorMessage name="firstName" />
                  </div>
                </div>
                <div className={styles.accInfoField}>
                  <div className={`${styles.semiField} ${styles.labelField}`}>
                    {MyAccountLabels.lastName}
                  </div>
                  <div className={styles.semiField}>
                    <Field
                      type="text"
                      name="lastName"
                      value={values.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={MyAccountLabels.lastName}
                      hasError={errors.lastName && touched.lastName}
                      errorMessage={errors.lastName}
                      classes={classes}
                      component={RenderTextField}
                    />
                    <RenderErrorMessage name="lastName" />
                  </div>
                </div>

                <div
                  className={`${styles.accInfoField} ${styles.profileInfoField}`}
                >
                  <div className={`${styles.semiField}`}>
                    {MyAccountLabels.profileImage}
                  </div>
                  <div className={styles.semiField}>
                    <div className={styles.profileField}>
                      {values.profileImg ? (
                        <Badge
                          overlap="circular"
                          anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                          }}
                          badgeContent={
                            <IconButton
                              style={{
                                width: '15px',
                                height: '15px',
                                borderRadius: '50%',
                                border: '8px solid white',
                                // backgroundColor: 'white',
                                padding: '2px',
                              }}
                            >
                              <CloseIcon
                                onClick={() => {
                                  onImageCancel(setFieldValue);
                                }}
                                style={{
                                  width: '11px',
                                  height: '11px',
                                  color: 'black',
                                  backgroundColor: 'white',
                                  borderRadius: '50%',
                                  border: '1px solid black',
                                }}
                              />
                            </IconButton>
                          }
                        >
                          <img
                            className={styles.profileImg}
                            src={
                              typeof values.profileImg !== 'string'
                                ? URL.createObjectURL(values.profileImg)
                                : `${
                                    values.profileImg
                                  }?time=${new Date().getTime()}`
                            }
                            alt="Profile"
                          />
                        </Badge>
                      ) : (
                        <Badge
                          overlap="circular"
                          anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                          }}
                        >
                          <img
                            className={styles.profileImg}
                            src={profile}
                            alt="Profile"
                          />
                        </Badge>
                      )}
                      <div
                        className={styles.changeImageLink}
                        onClickCapture={() => {
                          if (profileFileInput && profileFileInput.current) {
                            profileFileInput.current.click();
                          }
                        }}
                      >
                        {!values.profileImg
                          ? MyAccountLabels.uploadImage
                          : MyAccountLabels.changeImage}
                      </div>
                      <div>
                        <img
                          id="salesHubSiteProfileImg"
                          className={styles.changeImgIcon}
                          src={UploadLogo}
                          alt="upload"
                          onClickCapture={() => {
                            if (profileFileInput && profileFileInput.current) {
                              profileFileInput.current.click();
                            }
                          }}
                        />
                        <input
                          accept="image"
                          ref={profileFileInput}
                          type="file"
                          style={{ display: 'none' }}
                          onChange={(e: any) => {
                            setIsFormEdited(true);
                            onProfileImageSelect(e, setFieldValue);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.accInfoField}>
                  <div className={`${styles.semiField} ${styles.labelField}`}>
                    {MyAccountLabels.emailAddress}
                  </div>
                  <div className={`${styles.semiField} amMailField`}>
                    <Field
                      type="text"
                      name="email"
                      value={values.email}
                      readOnly
                      disabled
                      className={`Mui-disabled ${styles.mailDisabled}`}
                      placeholder={MyAccountLabels.emailAddress}
                      hasError={errors.email && touched.email}
                      errorMessage={errors.email}
                      InputProps={{
                        readOnly: true,
                      }}
                      classes={classes}
                      component={GenTextField}
                    />
                    <RenderErrorMessage name="email" />
                    {pWChangeShow === false && (
                      <div
                        onClickCapture={() => setPWChangeShow(true)}
                        className={styles.changePwLink}
                      >
                        {MyAccountLabels.changePassword}
                      </div>
                    )}
                  </div>
                </div>
                {pWChangeShow === true && (
                  <>
                    <div className={styles.accInfoField}>
                      <div
                        className={`${styles.semiField} ${styles.labelField}`}
                      >
                        {MyAccountLabels.currentPassword}
                      </div>
                      <div className={styles.semiField}>
                        <Field
                          type={visibilityCurrentPswd ? 'text' : 'password'}
                          name="currentPassword"
                          innerRef={currentPwRef}
                          value={values.currentPassword}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder={MyAccountLabels.currentPassword}
                          hasError={
                            errors.currentPassword && touched.currentPassword
                          }
                          classes={classes}
                          errorMessage={errors.currentPassword}
                          component={RenderTextField}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() =>
                                    handleClickShowCurrentPassword(
                                      values.currentPassword
                                    )
                                  }
                                  onMouseDown={handleMouseDownPassword}
                                >
                                  {visibilityCurrentPswd ? (
                                    <Visibility />
                                  ) : (
                                    <VisibilityOff />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />

                        {fieldError !== '' ? (
                          <div
                            style={{
                              color: 'red',
                              fontSize: '12px',
                              fontWeight: '500',
                              padding: '5px 0',
                            }}
                          >
                            {fieldError}
                          </div>
                        ) : (
                          <RenderErrorMessage name="currentPassword" />
                        )}
                      </div>
                    </div>
                    <div className={styles.accInfoField}>
                      <div
                        className={`${styles.semiField} ${styles.labelField}`}
                      >
                        {MyAccountLabels.newPassword}
                      </div>
                      <div className={styles.semiField}>
                        <Field
                          type={visibilityNewPswd ? 'text' : 'password'}
                          name="newPassword"
                          innerRef={newPwRef}
                          value={values.newPassword}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder={MyAccountLabels.newPassword}
                          hasError={errors.newPassword && touched.newPassword}
                          errorMessage={errors.newPassword}
                          classes={classes}
                          component={RenderTextField}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() =>
                                    handleClickShowNewPswd(values.newPassword)
                                  }
                                  onMouseDown={handleMouseDownPassword}
                                >
                                  {visibilityNewPswd ? (
                                    <Visibility />
                                  ) : (
                                    <VisibilityOff />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                        <RenderErrorMessage name="newPassword" />
                      </div>
                    </div>
                    <div className={styles.accInfoField}>
                      <div
                        className={`${styles.semiField} ${styles.labelField}`}
                      >
                        {MyAccountLabels.confirmPassword}
                      </div>
                      <div className={styles.semiField}>
                        <Field
                          type={visibilityConfirmPswd ? 'text' : 'password'}
                          name="confirmPassword"
                          innerRef={confirmPwRef}
                          value={values.confirmPassword}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder={MyAccountLabels.confirmPassword}
                          hasError={
                            errors.confirmPassword && touched.confirmPassword
                          }
                          errorMessage={errors.confirmPassword}
                          classes={classes}
                          component={RenderTextField}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() =>
                                    handleClickShowConfirmPswd(
                                      values.confirmPassword
                                    )
                                  }
                                  onMouseDown={handleMouseDownPassword}
                                >
                                  {visibilityConfirmPswd ? (
                                    <Visibility />
                                  ) : (
                                    <VisibilityOff />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                        <RenderErrorMessage name="confirmPassword" />
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className={`${styles.accInfoBtnWrap} ${styles.bottomLayer}`}>
                <SecondaryButton
                  onClick={() => {
                    if (dirty || isFormEdited) setShowCloseWarning(true);
                    else cancelHandler();
                  }}
                  style={{ minWidth: '160px', marginRight: '30px' }}
                >
                  {ButtonLabels.cancel}
                </SecondaryButton>
                <PrimaryButton type="submit" style={{ minWidth: '160px' }}>
                  {ButtonLabels.update}
                </PrimaryButton>
              </div>
            </Form>
          );
        }}
      </Formik>
      {showCloseWarning && (
        <DialogBoxComponent
          title=""
          secondaryContent="Are you sure you want to discard changes made on this page?"
          primaryContent="Unsaved changes"
          primaryButton="Discard"
          secondaryButton="Cancel"
          handleDialogBoxClose={() => setShowCloseWarning(false)}
          handleAgree={cancelHandler}
          show
        />
      )}
    </div>
  );
};
export default MyAccount;
