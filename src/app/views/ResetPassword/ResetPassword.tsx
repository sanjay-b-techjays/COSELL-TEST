/* eslint-disable linebreak-style */
/* eslint-disable no-confusing-arrow */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable comma-dangle */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable object-curly-newline */
/* eslint-disable linebreak-style */
/* eslint-disable import/extensions */
import React, { useEffect } from 'react';
// import { useDispatch } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import InputAdornment from '@material-ui/core/InputAdornment';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Loader from 'src/app/components/Loader';
import { useHistory } from 'react-router';
import { postRequest, getRequest } from '../../service';
import { ResetPasswordLabels } from '../../../strings';
import {
  RenderTextField,
  RenderLabel,
  RenderErrorMessage,
} from '../SalesHubSite/Form';
import styles from './resetpassword.module.css';
import { useStyles } from '../SalesHubSite/Styles';

interface Values {
  newPassword: '';
  confirmPassword: '';
}
const ResetPassword = () => {
  const classes = useStyles();
  const initialValues: Values = {
    newPassword: '',
    confirmPassword: '',
  };
  const history = useHistory();
  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .required('New password is required')
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{5,17}$/,
        'Valid password should include 5 to 17 characters, upper, lower case, numeric and special characters'
      ),
    confirmPassword: Yup.string()
      .required('Confirm password is required')
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
  });
  const [newPWShow, setNewPWShow] = React.useState(false);
  const [confirmPWShow, setconfirmPWShow] = React.useState(false);
  const [showMsg, setshowMsg] = React.useState(false);
  const [displayMsg, setDisplayMsg] = React.useState('');
  const [response, setResponse] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const token = new URLSearchParams(window.location.search).get('token');
  const newPwRef = React.useRef(null);
  const confirmPwRef = React.useRef(null);
  useEffect(() => {
    setLoading(true);
    getRequest(`users/password-reset?token=${token}`).then((resp: any) => {
      if (resp.result === true) {
        setshowMsg(false);
      } else {
        setDisplayMsg('Token Invalid');
        setshowMsg(true);
        setResponse(false);
      }
      setLoading(false);
    });
  }, []);

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };
  const handleClickShowPassword = (isNew: string, pwValue: string) => {
    if (isNew === 'newPass') {
      setNewPWShow(!newPWShow);
      newPwRef.current.children[0].children[0].focus();
      setTimeout(() => {
        const inputField: HTMLInputElement =
          newPwRef.current.children[0].children[0];
        inputField.setSelectionRange(pwValue.length, pwValue.length);
      }, 1);
    } else {
      setconfirmPWShow(!confirmPWShow);
      confirmPwRef.current.children[0].children[0].focus();
      setTimeout(() => {
        const inputField: HTMLInputElement =
          confirmPwRef.current.children[0].children[0];
        inputField.setSelectionRange(pwValue.length, pwValue.length);
      }, 1);
    }
  };
  const changePassword = (values: Values) => {
    setLoading(true);
    postRequest(`users/password-reset/`, {
      token,
      password: values.newPassword,
      confirm_password: values.confirmPassword,
    }).then((resp: any) => {
      if (resp.result === true) {
        setDisplayMsg(resp.msg);
        setResponse(resp.result);
        setshowMsg(true);
      } else {
        setDisplayMsg(resp.data.msg);
        setResponse(resp.data.result);
      }
      setLoading(false);
    });
  };
  return (
    <>
      {showMsg === false && (
        <div className={styles.flexBackground}>
          <div className={styles.container}>
            <h2>{ResetPasswordLabels.resetPassword}</h2>
            <>
              <Formik
                initialValues={initialValues}
                validate={() => ({})}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                  changePassword(values);
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
                  } = formik;
                  return (
                    <Form onSubmit={handleSubmit}>
                      <div className={styles.fieldWrap}>
                        <RenderLabel label={ResetPasswordLabels.newPassword} />
                        <Field
                          type={newPWShow ? 'text' : 'password'}
                          name="newPassword"
                          innerRef={newPwRef}
                          value={values.newPassword}
                          placeholder={ResetPasswordLabels.newPassword}
                          component={RenderTextField}
                          classes={classes}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          hasError={errors.newPassword && touched.newPassword}
                          errorMessage={errors.newPassword}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() =>
                                    handleClickShowPassword(
                                      'newPass',
                                      values.newPassword
                                    )
                                  }
                                  onMouseDown={handleMouseDownPassword}
                                >
                                  {newPWShow ? (
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
                      <div className={styles.fieldWrap}>
                        <RenderLabel
                          label={ResetPasswordLabels.confirmPassword}
                        />
                        <Field
                          type={confirmPWShow ? 'text' : 'password'}
                          name="confirmPassword"
                          innerRef={confirmPwRef}
                          value={values.confirmPassword}
                          placeholder={ResetPasswordLabels.confirmPassword}
                          component={RenderTextField}
                          classes={classes}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          hasError={
                            errors.confirmPassword && touched.confirmPassword
                          }
                          errorMessage={errors.confirmPassword}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() =>
                                    handleClickShowPassword(
                                      'confirmPass',
                                      values.confirmPassword
                                    )
                                  }
                                  onMouseDown={handleMouseDownPassword}
                                >
                                  {confirmPWShow ? (
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
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={styles.sendBtn}
                      >
                        {ResetPasswordLabels.changePassword}
                      </Button>
                      <div className={`${styles.link} ${styles.signIn}`}>
                        <Button onClick={() => history.push('/')} size="small">
                          {ResetPasswordLabels.signIn}
                        </Button>
                      </div>
                    </Form>
                  );
                }}
              </Formik>
            </>
          </div>
        </div>
      )}
      {showMsg === true && (
        <div className={styles.successMsg}>
          {response === true ? (
            <div className={styles.msgWrap}>
              <div className={styles.tickSvg}>
                <CheckCircleIcon color="primary" fontSize="large" />
              </div>
              <h3>{displayMsg}</h3>
              <Button onClick={() => history.push('/')} size="small">
                {ResetPasswordLabels.signInwithNewPw}
              </Button>
            </div>
          ) : (
            <h3
              style={{
                color: '#4C70E3',
                fontSize: '24px',
                textTransform: 'none',
              }}
            >
              {displayMsg}
            </h3>
          )}
        </div>
      )}
      {loading === true && <Loader />}
    </>
  );
};

export default ResetPassword;
