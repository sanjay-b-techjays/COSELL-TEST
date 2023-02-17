/* eslint-disable linebreak-style */
/* eslint-disable react/jsx-indent */
/* eslint-disable comma-dangle */
/* eslint-disable linebreak-style */
/* eslint-disable operator-linebreak */
import { useEffect, useState, useRef } from 'react';
import { ButtonLabels, SalesHubSiteProfileLabels } from 'src/strings';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import InputAdornment from '@material-ui/core/InputAdornment';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { Field, Formik, Form } from 'formik';
import {
  GenTextField,
  RenderErrorMessage,
  RenderTextField,
} from 'src/app/components/Form';
import SecondaryButton from 'src/app/components/Button/SecondaryButton';
import PrimaryButton from 'src/app/components/Button/PrimaryButton';
import { useDispatch, useSelector } from 'react-redux';
import { useStyles } from '../../../Styles';
import styles from './ProfileForm/ProfileForm.module.css';
import { salesHubAccountResponse } from '../../../SalesHubSiteSlice';

const DeleteProfileForm = (props: any) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { deleteProfileAction, cancelHandler, pwFieldError, setPwFieldError } =
    props;
  console.log(pwFieldError, 'pwFieldError');
  const salesHubSiteRespData = useSelector(salesHubAccountResponse);
  const [visibilityConfirmPswd, setVisibilityConfirmPswd] = useState(false);
  const confirmPwRef = useRef(null);
  const handleClickShowConfirmPswd = (pwValue) => {
    setVisibilityConfirmPswd(!visibilityConfirmPswd);
    confirmPwRef.current.children[0].children[0].focus();
    setTimeout(() => {
      const inputField: HTMLInputElement =
        confirmPwRef.current.children[0].children[0];
      inputField.setSelectionRange(pwValue.length, pwValue.length);
    }, 1);
  };
  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setPwFieldError('');
    }, 15000);
    return () => clearTimeout(timer);
  }, [pwFieldError]);
  useEffect(() => {
    setPwFieldError('');
  }, []);

  return (
    <>
      <Formik
        initialValues={{ password: '' }}
        onSubmit={(values) => {
          deleteProfileAction(values);
        }}
      >
        {(formik) => {
          const { handleChange, handleSubmit, handleBlur, values } = formik;

          return (
            <div className={styles.deleteProfileWrap}>
              <Form
                style={{
                  width: '100%',
                }}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(e);
                }}
                id="userInfo"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                  }
                }}
                className={styles.deleteProfileWrapper}
              >
                <div className={styles.userInformationWrap}>
                  <div className={styles.deletePWLabel}>Password</div>
                  <div className={`${styles.salesHubAccField} textArea`}>
                    <Field
                      type={visibilityConfirmPswd ? 'text' : 'password'}
                      name="password"
                      innerRef={confirmPwRef}
                      value={values.password}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder={SalesHubSiteProfileLabels.currentPassword}
                      component={RenderTextField}
                      classes={classes}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                handleClickShowConfirmPswd(values.password)
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
                    {pwFieldError !== '' ? (
                      <div
                        style={{
                          color: 'red',
                          fontSize: '12px',
                          fontWeight: '500',
                          padding: '5px 0px',
                          textAlign: 'left',
                        }}
                      >
                        {pwFieldError}
                      </div>
                    ) : (
                      <RenderErrorMessage name="password" />
                    )}
                  </div>
                </div>
                <div className={styles.deleteProfileBtnWrap}>
                  <div
                    className={`${styles.accInfoBtnWrap} ${styles.UserInfoBottomLayer}`}
                  >
                    <SecondaryButton
                      onClick={cancelHandler}
                      style={{ minWidth: '160px', marginRight: '30px' }}
                    >
                      {ButtonLabels.cancel}
                    </SecondaryButton>
                    <PrimaryButton type="submit" style={{ minWidth: '160px' }}>
                      {ButtonLabels.delete}
                    </PrimaryButton>
                  </div>
                </div>
              </Form>
            </div>
          );
        }}
      </Formik>
    </>
  );
};
export default DeleteProfileForm;
