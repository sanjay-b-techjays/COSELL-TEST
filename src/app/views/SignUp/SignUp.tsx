/* eslint-disable react/jsx-indent */
/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable object-curly-newline */
/* eslint-disable linebreak-style */
/* eslint-disable import/extensions */
import React, { useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import InputAdornment from '@material-ui/core/InputAdornment';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Loader from 'src/app/components/Loader';
import SnackbarAlert from 'src/app/components/Snackbar/Snackbar';
import { Select, MenuItem, Link } from '@material-ui/core';
import { getRequest } from 'src/app/service';
import { SignUpLabels } from '../../../strings';
import './SignUp.css';

import { selectSignUpResponse, signUpAction } from './SignUpSlice';

import {
  RenderTextField,
  RenderCheckbox,
  RenderLabel,
  RenderErrorMessage,
} from '../SalesHubSite/Form';
import styles from './SignUp.module.css';
import { signUpPayload } from './types';
import { useStyles } from '../SalesHubSite/Styles';

const SignUp = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const [url, setUrl] = useState(false);
  const [domainName, setDomainName] = useState('');
  const signUpRespData = useSelector(selectSignUpResponse);
  const [visibility, setVisibility] = useState(false);
  const [loading, setLoading] = React.useState(true);
  const [showAlert, setShowAlert] = React.useState(false);
  const [companyInfo, setCompanyInfo] = React.useState([]);
  const [roleInfo, setRoleInfo] = React.useState([]);
  const inputRef = React.useRef(null);

  const initialValues: signUpPayload = {
    firstName: '',
    lastName: '',
    workEmail: '',
    password: '',
    companyName: '',
    role: '1',
    salesRegion: '',
    termsAgreed: false,
  };
  const SalesRepSignUpSchema = Yup.object({
    firstName: Yup.string()
      .trim()
      .min(3, 'Minimum 3 characters is required')
      .required('First name is required'),
    lastName: Yup.string().trim().required('Last name is required'),
    workEmail: Yup.string()
      .trim()
      .email('Enter a valid email')
      .required('Email is required'),
    companyName: Yup.string().trim().required('Company name is required'),
    role: Yup.string().trim().required('Role is required'),
    salesRegion: Yup.string().trim().required('Sales region is required'),
    password: Yup.string()
      .trim()
      .required('Password is required')
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{5,17}$/,
        'Valid password should include 5 to 17 characters, upper, lower case, numeric and special characters'
      ),
  });
  const AMSignUpSchema = Yup.object({
    firstName: Yup.string()
      .trim()
      .min(3, 'Minimum 3 characters is required')
      .required('First name is required'),
    lastName: Yup.string().trim().required('Last name is required'),
    workEmail: Yup.string()
      .trim()
      .email('Enter a valid email')
      .required('Email is required'),
    password: Yup.string()
      .trim()
      .required('Password is required')
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{5,17}$/,
        'Valid password should include 5 to 17 characters, upper, lower case, numeric and special characters'
      ),
  });
  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };
  const handleClickShowPassword = (pwValue) => {
    setVisibility(!visibility);
    inputRef.current.children[0].children[0].focus();
    setTimeout(() => {
      const inputField: HTMLInputElement =
        inputRef.current.children[0].children[0];
      inputField.setSelectionRange(pwValue.length, pwValue.length);
    }, 1);
  };
  const handleSignUp = (formValues: signUpPayload) => {
    console.log(formValues);
    dispatch(
      signUpAction(
        formValues,
        history,
        url,
        domainName,
        () => setLoading(false),
        () => setShowAlert(true)
      )
    );
  };

  const getCompany = () => {
    const token = localStorage.getItem('token');
    const headerData = {
      Authorization: `Token ${token}`,
    };
    getRequest(
      `partnership/get-company-information-list/?domain_name=${domainName}`,
      {}
    )
      .then((resp: any) => {
        if (resp) {
          console.log(resp.data);
          const resData = resp.data;
          setCompanyInfo(resData);
        }
      })
      .catch((error) => console.log(error));
  };
  const getRole = () => {
    getRequest(`partnership/get-roles/`, {})
      .then((resp: any) => {
        if (resp) {
          console.log(resp.data);
          const resData = resp.data;
          setRoleInfo(resData);
        }
      })
      .catch((error) => console.log(error));
  };
  useEffect(() => {
    const urlLink = window.location.href;
    const splitUrl = urlLink.split('.');
    const domainname = splitUrl[0].split('//');
    setDomainName(domainname[1]);
    // const domainname = 'devport';
    // setDomainName(domainname);
    console.log('url', domainname, splitUrl[0]);
    // if (splitUrl[0].includes('localhost:3001')) {
    if (splitUrl[0] === 'https://portal') {
      setUrl(false);
    } else {
      setUrl(true);
    }
    setLoading(false);
  }, []);
  useEffect(() => {
    console.log('url', url);
    if (url === true) {
      getCompany();
      getRole();
    }
    setLoading(false);
  }, [domainName]);
  console.log(loading, 'load');
  return (
    <div className={styles.flexBackground}>
      <div className={styles.container}>
        <h2>{SignUpLabels.createAccount}</h2>
        <div className={styles.createAccountWrap}>
          {SignUpLabels.accountSetupContent}
        </div>
        <>
          <Formik
            initialValues={initialValues}
            validationSchema={url ? SalesRepSignUpSchema : AMSignUpSchema}
            onSubmit={async (values) => {
              setLoading(true);
              handleSignUp(values);
            }}
          >
            {(formik) => {
              const {
                values,
                handleChange,
                handleSubmit,
                errors,
                touched,
                handleBlur,
                setFieldValue,
              } = formik;
              return (
                <Form onSubmit={handleSubmit}>
                  <div className={styles.fieldWrap}>
                    <RenderLabel label={SignUpLabels.firstName} />
                    <Field
                      type="text"
                      name="firstName"
                      value={values.firstName}
                      placeholder={SignUpLabels.firstName}
                      component={RenderTextField}
                      classes={classes}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      hasError={errors.firstName && touched.firstName}
                      errorMessage={errors.firstName}
                    />
                    <RenderErrorMessage name="firstName" />
                  </div>

                  <div className={styles.fieldWrap}>
                    <RenderLabel label={SignUpLabels.lastName} />
                    <Field
                      type="text"
                      name="lastName"
                      value={values.lastName}
                      placeholder={SignUpLabels.lastName}
                      component={RenderTextField}
                      classes={classes}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      hasError={errors.lastName && touched.lastName}
                      errorMessage={errors.lastName}
                    />
                    <RenderErrorMessage name="lastName" />
                  </div>

                  {url && companyInfo.length > 0 ? (
                    <>
                      <div className={styles.fieldWrap}>
                        <RenderLabel label={SignUpLabels.companyName} />
                        <div
                          className={`${styles.semiField} ${styles.select_field} select_field`}
                        >
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
                                      {SignUpLabels.companyName}
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
                    </>
                  ) : null}
                  {url && roleInfo.length > 0 ? (
                    <>
                      <div className={styles.fieldWrap}>
                        <RenderLabel label={SignUpLabels.role} />
                        <div
                          className={`${styles.semiField} ${styles.select_field} select_field `}
                        >
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
                                    <span
                                      style={{
                                        color: 'rgba(0, 0, 0, 0.3)',
                                        fontWeight: '500',
                                        fontSize: '14px',
                                      }}
                                    >
                                      {' '}
                                      {SignUpLabels.role}
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
                        </div>
                        <RenderErrorMessage name="role" />
                      </div>
                      <div className={styles.fieldWrap}>
                        <RenderLabel label={SignUpLabels.salesRegion} />
                        <Field
                          type="text"
                          name="salesRegion"
                          value={values.salesRegion}
                          placeholder={SignUpLabels.salesRegion}
                          component={RenderTextField}
                          classes={classes}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          hasError
                          errorMessage={errors.salesRegion}
                        />
                        <RenderErrorMessage name="salesRegion" />
                      </div>
                    </>
                  ) : null}
                  <div className={styles.fieldWrap}>
                    <RenderLabel label={SignUpLabels.workEmail} />
                    <Field
                      type="email"
                      name="workEmail"
                      value={values.workEmail}
                      placeholder={SignUpLabels.workEmail}
                      component={RenderTextField}
                      classes={classes}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      hasError
                      errorMessage={errors.workEmail}
                    />
                    <RenderErrorMessage name="workEmail" />
                  </div>
                  <div className={styles.fieldWrap}>
                    <RenderLabel label={SignUpLabels.password} />
                    <Field
                      type={visibility ? 'text' : 'password'}
                      name="password"
                      innerRef={inputRef}
                      value={values.password}
                      placeholder={SignUpLabels.password}
                      component={RenderTextField}
                      classes={classes}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      hasError={errors.password && touched.password}
                      errorMessage={errors.password}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                handleClickShowPassword(values.password)
                              }
                              onMouseDown={handleMouseDownPassword}
                            >
                              {visibility ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <RenderErrorMessage name="password" />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    className={`${styles.link} ${styles.termsWrap} ${
                      values.termsAgreed ? styles.termsAgreed : ''
                    } termsWrap`}
                  >
                    <Field
                      name="termsAgreed"
                      type="checkbox"
                      component={RenderCheckbox}
                      label={SignUpLabels.agreeTxt}
                      checked={values.termsAgreed}
                      onChange={(e: any) => setFieldValue('termsAgreed', e)}
                    />

                    <Link href="/terms">{SignUpLabels.termsAndConditions}</Link>
                  </div>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={`${styles.sendBtn} ${
                      values.termsAgreed === false ||
                      values.firstName === '' ||
                      values.lastName === '' ||
                      values.password === '' ||
                      values.workEmail === ''
                        ? ''
                        : 'sendSignUpBtn'
                    }`}
                    disabled={
                      values.termsAgreed === false ||
                      values.firstName === '' ||
                      values.lastName === '' ||
                      values.password === '' ||
                      values.workEmail === ''
                    }
                  >
                    {SignUpLabels.signUpButton}
                  </Button>
                </Form>
              );
            }}
          </Formik>
        </>
        <div className={`${styles.link} ${styles.mailReceiveTxt}`}>
          <span>{SignUpLabels.alreadyHaveAccount}</span>
          <Button href="/" size="small" className={styles.linkBtn}>
            {SignUpLabels.signInlabel}
          </Button>
        </div>
      </div>
      {loading === true && <Loader />}
      {showAlert && (
        <SnackbarAlert
          severity="error"
          handler={() => setShowAlert(false)}
          showalert={signUpRespData.errorMsg !== ''}
          message={signUpRespData.errorMsg}
        />
      )}
    </div>
  );
};

export default SignUp;
