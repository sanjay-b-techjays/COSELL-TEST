/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */
/* eslint-disable object-curly-newline */
/* eslint-disable no-console */
/* eslint-disable linebreak-style */
import { useEffect, useState, useRef } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Cookies from 'universal-cookie';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import InputAdornment from '@material-ui/core/InputAdornment';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Button from '@material-ui/core/Button';
import {
  RenderTextField,
  RenderCheckbox,
  RenderErrorMessage,
  RenderLabel,
} from '../SalesHubSite/Form';
import { SignInLabels } from '../../../strings';
import styles from './SignIn.module.css';
import { useStyles } from '../SalesHubSite/Styles';

interface Values {
  email: string;
  password: string;
  rememberMe: boolean;
}
interface Props {
  onSubmit: (values: Values) => void;
  signInRespData: any;
}

export const SignInForm: React.FC<Props> = ({ onSubmit, signInRespData }) => {
  const cookies = new Cookies();
  const classes = useStyles();
  const initialValues: Values = {
    email: cookies.get('rememberMe') === 'true' ? cookies.get('email') : '',
    password: '',
    rememberMe: cookies.get('rememberMe') === 'true',
  };
  const validationSchema = Yup.object({
    email: Yup.string()
      .trim()
      .email('Enter a valid email')
      .required('Email is required'),
    password: Yup.string().trim().required('Password is required'),
  });
  const [visibility, setVisibility] = useState(false);
  const inputRef = useRef(null);
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
  return (
    <div>
      <Formik
        initialValues={initialValues}
        validate={() => ({})}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onSubmit(values);
        }}
      >
        {(formik) => {
          const {
            values,
            handleChange,
            handleSubmit,
            errors,
            handleBlur,
            setFieldValue,
          } = formik;
          return (
            <Form onSubmit={handleSubmit}>
              <div className={styles.fieldWrap}>
                <RenderLabel label={SignInLabels.email} />
                <Field
                  type="email"
                  name="email"
                  value={values.email}
                  placeholder={SignInLabels.email}
                  component={RenderTextField}
                  classes={classes}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  hasError
                  errorMessage={
                    signInRespData.validationErrField === 'email'
                      ? signInRespData.errorMsg
                      : errors.email
                  }
                />
                <RenderErrorMessage name="email" />
              </div>

              <div className={styles.fieldWrap}>
                <RenderLabel label={SignInLabels.password} />
                <Field
                  name="password"
                  className="signInPwField"
                  innerRef={inputRef}
                  type={visibility ? 'text' : 'password'}
                  value={values.password}
                  placeholder={SignInLabels.password}
                  component={RenderTextField}
                  classes={classes}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  hasError
                  errorMessage={
                    signInRespData.validationErrField === 'password'
                      ? signInRespData.errorMsg
                      : errors.password
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
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
                  margin: '3% 0',
                }}
                className={`${styles.link} ${styles.forgetLink} ${
                  values.rememberMe ? styles.rememberMeActive : ''
                } forgetLink`}
              >
                {/* <Field
                  name="rememberMe"
                  type="checkbox"
                  component={RenderCheckbox}
                  label={SignInLabels.rememberMe}
                  style={{ color: '#707683', fontSize: '14px' }}
                  checked={values.rememberMe}
                  onChange={() =>
                    setFieldValue('rememberMe', !values.rememberMe)
                  }
                /> */}
                <div />

                <Button href="/forgotPassword" size="small">
                  {SignInLabels.forgotPassword}
                </Button>
              </div>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={styles.signInButton}
              >
                {SignInLabels.signInlabel}
              </Button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
