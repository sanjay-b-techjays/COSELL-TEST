/* eslint-disable indent */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable operator-linebreak */
/* eslint-disable linebreak-style */
/* eslint-disable comma-dangle */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable linebreak-style */
import React, { useState, useEffect, useRef } from 'react';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';

import { Formik, Form, Field, FormikProps } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import InputAdornment from '@material-ui/core/InputAdornment';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import useThumbnailImage from 'src/app/components/PreviewImage/CustomHook/useThumbnailImage';
import PrimaryButton from 'src/app/components/Button/PrimaryButton';
import DialogBox from 'src/app/components/DialogBox';
import { MenuItem, Select } from '@material-ui/core';
import { postRequest, getRequest, deleteRequest } from 'src/app/service';
import { previewImageLables, SalesHubSiteProfileLabels } from 'src/strings';
import {
  GenTextField,
  RenderErrorMessage,
  RenderTextField,
} from '../../../../../SalesHubSite/Form';
import SecondaryButton from 'src/app/components/Button/SecondaryButton';
import profile from '../../../../../../assets/profile.png';
import UploadLogo from '../../../../../../components/Icons/PreviewPartnership/UploadLogoIcon.svg';
import { setAccountDetailRefresh } from '../../../../../CreatePartnership/CreatePartnerShipSlice';
import styles from './ProfileForm.module.css';
import '../../SalesHubSiteProfile.css';
import { useStyles } from '../../../../../SalesHubSite/Styles';

import { selectUserData, setSignedIn } from '../../../../../SignIn/SignInSlice';
import DeleteProfileForm from '../DeleteProfileForm';
import DialogBoxComponent from '../../../../../../components/DialogBox/DialogBox';
import { Badge } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ProfileValues {
  firstName: string;
  lastName: string;
  profileImg: Blob | string;
  companyName: string;
  role: string;
  salesRegion: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ProfileForm = (props: any) => {
  const {
    cancelHandler,
    showAlert,
    setisDirty,
    setIsFormEdited,
    isFormEdited,
    showCloseWarning,
    setShowCloseWarning,
  } = props;
  const classes = useStyles();
  const userData = useSelector(selectUserData);
  const [pWChangeShow, setPWChangeShow] = useState(false);
  const [fieldError, setFieldError] = useState('');
  const profileFileInput = useRef<HTMLInputElement>(null);
  const formikForm = useRef<FormikProps<ProfileValues>>(null);
  const [visibilityCurrentPswd, setVisibilityCurrentPswd] = useState(false);
  const [visibilityNewPswd, setVisibilityNewPswd] = useState(false);
  const [visibilityConfirmPswd, setVisibilityConfirmPswd] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [reqPassword, setReqPassword] = useState('');
  const [companyInfo, setCompanyInfo] = useState([]);
  const [roleInfo, setRoleInfo] = useState([]);
  const [userType, setUserType] = useState(null);
  const [pwFieldError, setPwFieldError] = useState(null);
  const [initialValues, setInitialValues] = useState({
    firstName: '',
    lastName: '',
    profileImg: '',
    companyName: '',
    role: '',
    salesRegion: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const dispatch = useDispatch();
  const getMyAccountDetail = () => {
    const token = localStorage.getItem('token');
    getRequest(`users/my-account/`, {
      Authorization: `Token ${token}`,
    }).then((resp: any) => {
      if (resp.result === true) {
        setInitialValues({
          firstName: resp.data.first_name,
          lastName: resp.data.last_name,
          email: resp.data.email,
          profileImg: resp.data.image,
          companyName: resp.data.company_information_id || '',
          role: resp.data.role_id || '',
          salesRegion: resp.data.sales_region || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setUserType(resp.data.user_type);
      }
    });
  };
  const getCompanyList = () => {
    const domainName = localStorage.getItem('subDomainName');
    getRequest(
      `partnership/get-company-information-list/?domain_name=${domainName}`,
      {}
    )
      .then((resp: any) => {
        if (resp.result === true) {
          const resData = resp.data;
          setCompanyInfo(resData);
        }
      })
      .catch((error) => console.log(error));
  };
  const getRoleList = () => {
    getRequest(`partnership/get-roles/`, {})
      .then((resp: any) => {
        if (resp.result === true) {
          const resData = resp.data;
          setRoleInfo(resData);
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getMyAccountDetail();
    getCompanyList();
    getRoleList();
  }, []);
  const setAccountDetail = (formValues: ProfileValues) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('first_name', formValues.firstName);
    formData.append('last_name', formValues.lastName);
    formData.append('email', formValues.email);
    formData.append('company_information_id', formValues.companyName);
    formData.append('role_id', formValues.role);
    formData.append('sales_region', formValues.salesRegion);
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
          },
        });
        setPWChangeShow(false);
        cancelHandler();
        showAlert(SalesHubSiteProfileLabels.successProfileMsg, 'success');
      }
      const timer = setTimeout(() => setFieldError(''), 10000);
      setFieldError(resp.data.msg);
      return () => clearTimeout(timer);
    });
  };

  const onImageCancel = (setFieldValue: any) => {
    profileFileInput.current.value = '';
    setFieldValue('profileImg', '');
  };

  const onProfileImageSelect = (event: any, setFieldValue: any) => {
    const file1 = event.target.files[0];
    if (file1 && file1.name && file1.type.includes('image/')) {
      setFieldValue('profileImg', event.target.files[0]);
    } else {
      showAlert(SalesHubSiteProfileLabels.fileErrorMessage, 'error');
    }
  };

  const myPwSchema = Yup.object().shape({
    firstName: Yup.string()
      .trim()
      .min(3, 'Minimum 3 characters is required')
      .required('First name is required'),
    lastName: Yup.string().trim().required('Last name is required'),
    companyName: Yup.string().trim().required('Company name is required'),
    role: Yup.string().trim().required('Role is required'),
    salesRegion: Yup.string().trim().required('Sales region is required'),
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
    companyName: Yup.string().trim().required('Company name is required'),
    role: Yup.string().trim().required('Role is required'),
    salesRegion: Yup.string().trim().required('Sales region is required'),
    // profileImg: Yup.string().trim().required('Profile image required'),
  });
  const history = useHistory();
  const currentPwRef = React.useRef(null);
  const newPwRef = React.useRef(null);
  const confirmPwRef = React.useRef(null);
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
  const handleDeleteProfileButton = () => {
    setShowDialog(true);
    setReqPassword('');
  };
  const deleteProfile = () => {
    setReqPassword('req');
  };

  const deleteProfileAction = (formValues) => {
    const token = localStorage.getItem('token');
    deleteRequest(
      `users/my-account/`,
      {
        Authorization: `Token ${token}`,
      },
      {
        password: formValues.password,
      }
    ).then((response: any) => {
      if (response.result === true) {
        cancelHandler();
        showAlert(SalesHubSiteProfileLabels.profileDeleteSuccessMsg, 'success');
        localStorage.clear();
        history.push('/');
      } else {
        console.log(response?.data?.msg, response?.msg, 'msg');
        setPwFieldError(response?.msg);
      }
    });
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
                <div className={styles.profileInfoField}>
                  <div className={`${styles.semiField} ${styles.labelField}`}>
                    {SalesHubSiteProfileLabels.firstName}
                  </div>
                  <div className={styles.semiField}>
                    <Field
                      type="text"
                      name="firstName"
                      value={values.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={SalesHubSiteProfileLabels.firstName}
                      hasError={errors.firstName && touched.firstName}
                      errorMessage={errors.firstName}
                      classes={classes}
                      component={RenderTextField}
                    />
                    <RenderErrorMessage name="firstName" />
                  </div>
                </div>
                <div className={styles.profileInfoField}>
                  <div className={`${styles.semiField} ${styles.labelField}`}>
                    {SalesHubSiteProfileLabels.lastName}
                  </div>
                  <div className={styles.semiField}>
                    <Field
                      type="text"
                      name="lastName"
                      value={values.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={SalesHubSiteProfileLabels.lastName}
                      hasError={errors.lastName && touched.lastName}
                      errorMessage={errors.lastName}
                      classes={classes}
                      component={RenderTextField}
                    />
                    <RenderErrorMessage name="lastName" />
                  </div>
                </div>
                <div className={styles.profileInfoField}>
                  <div className={`${styles.semiField} ${styles.labelField}`}>
                    {SalesHubSiteProfileLabels.profileImg}
                  </div>
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
                        ? SalesHubSiteProfileLabels.uploadImage
                        : SalesHubSiteProfileLabels.changeImage}
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
                        accept="image/*"
                        ref={profileFileInput}
                        type="file"
                        style={{ display: 'none' }}
                        onChange={(e: any) => {
                          onProfileImageSelect(e, setFieldValue);
                          setIsFormEdited(true);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.profileInfoField}>
                  <div className={`${styles.semiField} ${styles.labelField}`}>
                    {SalesHubSiteProfileLabels.companyName}
                  </div>
                  <div className={`${styles.semiField} select_field`}>
                    <div className={styles.select_field}>
                      <Select
                        style={{ width: '100%', padding: '4px 10px' }}
                        name="companyName"
                        value={values.companyName}
                        displayEmpty
                        renderValue={
                          values.companyName !== ''
                            ? undefined
                            : () => (
                                <span
                                  style={{
                                    color: 'rgba(0, 0, 0, 0.3)',
                                    fontWeight: '500',
                                    fontSize: '14px',
                                  }}
                                >
                                  {' '}
                                  {SalesHubSiteProfileLabels.companyName}
                                </span>
                              )
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={styles.uploadAssetSelect}
                        inputProps={{ 'aria-label': 'Without label' }}
                      >
                        {companyInfo.map((list: any) => (
                          <MenuItem
                            value={list.company_information_id}
                            key={list.company_information_id}
                          >
                            {list.company_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                    <RenderErrorMessage name="companyName" />
                  </div>
                </div>
                <div className={styles.profileInfoField}>
                  <div className={`${styles.semiField} ${styles.labelField}`}>
                    {SalesHubSiteProfileLabels.role}
                  </div>
                  <div
                    className={`${styles.semiField} ${styles.select_field} select_field`}
                  >
                    {/* <div className={styles.select_field}> */}
                    <Select
                      style={{ width: '100%', padding: '4px 10px' }}
                      name="role"
                      defaultValue={1}
                      value={values.role}
                      displayEmpty
                      renderValue={
                        values.role !== ''
                          ? undefined
                          : () => (
                              <span style={{ color: '#00000059' }}>
                                {' '}
                                {SalesHubSiteProfileLabels.role}
                              </span>
                            )
                      }
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={styles.uploadAssetSelect}
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      {roleInfo.map((list: any) => (
                        <MenuItem value={list.role_id} key={list.role_id}>
                          {list.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {/* </div> */}
                    <RenderErrorMessage name="role" />
                  </div>
                </div>
                <div className={styles.profileInfoField}>
                  <div className={`${styles.semiField} ${styles.labelField}`}>
                    {SalesHubSiteProfileLabels.salesRegion}
                  </div>
                  <div className={styles.semiField}>
                    <Field
                      type="text"
                      name="salesRegion"
                      value={values.salesRegion}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={SalesHubSiteProfileLabels.salesRegion}
                      hasError={errors.salesRegion && touched.salesRegion}
                      errorMessage={errors.salesRegion}
                      classes={classes}
                      component={RenderTextField}
                    />
                    <RenderErrorMessage name="salesRegion" />
                  </div>
                </div>
                <div className={styles.profileInfoField}>
                  <div className={`${styles.semiField} ${styles.labelField}`}>
                    {SalesHubSiteProfileLabels.emailAddress}
                  </div>
                  <div className={`${styles.semiField} salesRepEmailField`}>
                    <Field
                      type="text"
                      name="email"
                      value={values.email}
                      readOnly
                      disabled
                      className={`Mui-disabled ${styles.mailDisabled}`}
                      placeholder={SalesHubSiteProfileLabels.emailAddress}
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
                        {SalesHubSiteProfileLabels.changePassword}
                      </div>
                    )}
                  </div>
                </div>
                {pWChangeShow === true && (
                  <>
                    <div className={styles.profileInfoField}>
                      <div
                        className={`${styles.semiField} ${styles.labelField}`}
                      >
                        {SalesHubSiteProfileLabels.currentPassword}
                      </div>
                      <div className={styles.semiField}>
                        <Field
                          type={visibilityCurrentPswd ? 'text' : 'password'}
                          name="currentPassword"
                          innerRef={currentPwRef}
                          value={values.currentPassword}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder={
                            SalesHubSiteProfileLabels.currentPassword
                          }
                          hasError={
                            errors.currentPassword && touched.currentPassword
                          }
                          errorMessage={errors.currentPassword}
                          classes={classes}
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
                              padding: '5px 0px',
                            }}
                          >
                            {fieldError}
                          </div>
                        ) : (
                          <RenderErrorMessage name="currentPassword" />
                        )}
                      </div>
                    </div>
                    <div className={styles.profileInfoField}>
                      <div
                        className={`${styles.semiField} ${styles.labelField}`}
                      >
                        {SalesHubSiteProfileLabels.newPassword}
                      </div>
                      <div className={styles.semiField}>
                        <Field
                          type={visibilityNewPswd ? 'text' : 'password'}
                          name="newPassword"
                          innerRef={newPwRef}
                          value={values.newPassword}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder={SalesHubSiteProfileLabels.newPassword}
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
                    <div className={styles.profileInfoField}>
                      <div
                        className={`${styles.semiField} ${styles.labelField}`}
                      >
                        {SalesHubSiteProfileLabels.confirmPassword}
                      </div>
                      <div className={styles.semiField}>
                        <Field
                          type={visibilityConfirmPswd ? 'text' : 'password'}
                          name="confirmPassword"
                          innerRef={confirmPwRef}
                          value={values.confirmPassword}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder={
                            SalesHubSiteProfileLabels.confirmPassword
                          }
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
                <div>
                  {userType && (
                    <SecondaryButton
                      onClick={handleDeleteProfileButton}
                      style={{ minWidth: '200px' }}
                    >
                      {SalesHubSiteProfileLabels.deleteProfile}
                    </SecondaryButton>
                  )}
                </div>
                {reqPassword === 'req' ? (
                  <DialogBox
                    title=""
                    primaryContent={SalesHubSiteProfileLabels.deleteProfile}
                    secondaryContent={
                      <>
                        <div>{SalesHubSiteProfileLabels.requestPassword}</div>
                        <DeleteProfileForm
                          pwFieldError={pwFieldError}
                          setPwFieldError={setPwFieldError}
                          cancelHandler={() => setShowDialog(false)}
                          deleteProfileAction={deleteProfileAction}
                        />
                      </>
                    }
                    // secondaryButton={SalesHubSiteProfileLabels.cancel}
                    // primaryButton={SalesHubSiteProfileLabels.delete}
                    show={showDialog}
                    handleDialogBoxClose={() => setShowDialog(false)}
                    handleAgree={() => deleteProfile()}
                  />
                ) : (
                  <DialogBox
                    title=""
                    primaryContent={SalesHubSiteProfileLabels.deleteProfile}
                    secondaryContent={
                      SalesHubSiteProfileLabels.deleteConfirmation
                    }
                    tertiaryContent=""
                    fieldValue="hello"
                    secondaryButton={SalesHubSiteProfileLabels.cancel}
                    primaryButton={SalesHubSiteProfileLabels.delete}
                    show={showDialog}
                    handleDialogBoxClose={() => setShowDialog(false)}
                    handleAgree={() => deleteProfile()}
                  />
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
                  {SalesHubSiteProfileLabels.cancel}
                </SecondaryButton>
                <PrimaryButton type="submit" style={{ minWidth: '160px' }}>
                  {SalesHubSiteProfileLabels.update}
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
export default ProfileForm;
