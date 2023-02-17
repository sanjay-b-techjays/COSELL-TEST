/* eslint-disable linebreak-style */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable object-curly-newline */
/* eslint-disable linebreak-style */
/* eslint-disable import/extensions */
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
import React from 'react';
import Loader from 'src/app/components/Loader';
import SnackbarAlert from 'src/app/components/Snackbar/Snackbar';
import { useHistory } from 'react-router';
import { ForgotPasswordLabels } from '../../../strings';
import {
  RenderTextField,
  RenderLabel,
  RenderErrorMessage,
} from '../SalesHubSite/Form';
import { postRequest } from '../../service';
import styles from './ForgotPassword.module.css';
import { useStyles } from '../SalesHubSite/Styles';

interface Values {
  email: string;
}
const ForgotPassword = () => {
  const classes = useStyles();
  const initialValues: Values = { email: '' };
  const history = useHistory();
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Enter a valid email')
      .required('Email is required'),
  });
  const [loginError, setLoginError] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [showAlert, setShowAlert] = React.useState(false);
  const [isSubmittedOnce, setIsSubmittedOnce] = React.useState(false);

  const [response, setResponse] = React.useState({
    msg: '',
    result: false,
  });
  const handleForgotPW = (values: Values) => {
    setLoading(true);
    postRequest(`users/forgot-password/`, {
      email: values.email,
    }).then((resp) => {
      setIsSubmittedOnce(true);
      if (resp.result === true) {
        setResponse(resp);
        setEmail(values.email);
        setShowAlert(true);
        setLoading(false);
      } else {
        setResponse(resp.data);
        setEmail(values.email);
        setShowAlert(true);
        setLoading(false);
      }
    });
  };
  return (
    <div className={styles.flexBackground}>
      <div className={styles.container}>
        <h2>{ForgotPasswordLabels.forgotPasswordLabel}</h2>
        <div className={styles.forgotPasswordContent}>
          {ForgotPasswordLabels.forgotPasswordContent}
        </div>
        <>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              handleForgotPW(values);
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
                    <RenderLabel label={ForgotPasswordLabels.email} />
                    <Field
                      type="email"
                      name="email"
                      value={values.email}
                      placeholder={ForgotPasswordLabels.email}
                      component={RenderTextField}
                      classes={classes}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      hasError={errors.email && touched.email}
                      errorMessage={errors.email}
                    />
                    {/* <RenderErrorMessage name="email" /> */}
                    {loginError !== '' ? (
                      <div
                        style={{
                          color: `${
                            response.result === false ? 'red' : 'green'
                          }`,
                          fontSize: '12px',
                          padding: '5px 0px',
                        }}
                      >
                        {loginError}
                      </div>
                    ) : (
                      <RenderErrorMessage name="email" />
                    )}
                  </div>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={styles.sendBtn}
                  >
                    {ForgotPasswordLabels.send}
                  </Button>
                </Form>
              );
            }}
          </Formik>
        </>
        {isSubmittedOnce && (
          <div className={`${styles.link} ${styles.mailReceiveTxt}`}>
            {ForgotPasswordLabels.mailReceiveLabel}{' '}
            <Button
              onClick={() => handleForgotPW({ email })}
              size="small"
              className={styles.linkBtn}
            >
              {ForgotPasswordLabels.resend}
            </Button>
          </div>
        )}
        <div className={`${styles.link} ${styles.signIn}`}>
          <Button onClick={() => history.push('/')} size="small">
            {ForgotPasswordLabels.signIn}
          </Button>
        </div>
      </div>
      {loading === true && <Loader />}
      {showAlert && (
        <SnackbarAlert
          severity={response.result ? 'success' : 'error'}
          handler={() => setShowAlert(false)}
          showalert={response.msg !== ''}
          message={response.msg}
        />
      )}
    </div>
  );
};

export default ForgotPassword;
