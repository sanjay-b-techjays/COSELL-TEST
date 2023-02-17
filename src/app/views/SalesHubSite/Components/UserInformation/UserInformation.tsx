/* eslint-disable linebreak-style */
/* eslint-disable react/jsx-indent */
/* eslint-disable comma-dangle */
/* eslint-disable linebreak-style */
/* eslint-disable operator-linebreak */
import { IconButton } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import {
  createAccountDropdown,
  createAccount,
  ButtonLabels,
  AccountsEngagementsLabels,
} from 'src/strings';
import DownArrow from 'src/app/components/Icons/PreviewPartnership/DownArrow.svg';
import { Field, Formik, Form } from 'formik';
import SecondaryButton from 'src/app/components/Button/SecondaryButton';
import PrimaryButton from 'src/app/components/Button/PrimaryButton';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

import DialogBoxComponent from 'src/app/components/DialogBox/DialogBox';
import { useStyles } from '../../Styles';
import {
  handleSendAccTeamEmail,
  salesHubAccountResponse,
  setaccountTeamErrMsg,
} from '../../SalesHubSiteSlice';
import { GenTextField, RenderErrorMessage } from '../../Form';
import styles from '../CreateAccount/CreateAccount.module.css';

const UserInformation = (props: any) => {
  const initialValues = {
    accountTeamEmailList: '',
  };
  const emailSchema = Yup.object().shape({
    accountTeamEmailList: Yup.string()
      .trim()
      // .email('Enter a valid email')
      .required('Email is required'),
  });
  const classes = useStyles();
  const [showUserInformation, setShowUserInformation] = useState(true);
  const dispatch = useDispatch();
  const queryparams = new URLSearchParams(window.location.search);
  const salesHubAccountId: string =
    queryparams.get('sales_hub_account_id') || '0';
  const {
    clearLoader,
    setAlert,
    cancelHandler,
    setLoader,
    setIsDirty,
    setShowCloseWarning,
    showCloseWarning,
  } = props;
  const [accountTeamErr, setAccountTeamErr] = useState('');
  const salesHubSiteRespData = useSelector(salesHubAccountResponse);
  useEffect(() => {
    const timer = setTimeout(() => setAccountTeamErr(''), 15000);
    setAccountTeamErr(salesHubSiteRespData.accountTeamErrMsg);
    return () => clearTimeout(timer);
  }, [salesHubSiteRespData]);

  useEffect(() => {
    dispatch(
      setaccountTeamErrMsg({
        accountTeamErrMsg: '',
        accountTeamValidationField: '',
      })
    );
  }, []);
  return (
    <>
      <div
        className={styles.salesHubAccDropDown}
        onClickCapture={() => setShowUserInformation(!showUserInformation)}
      >
        {createAccountDropdown.userInformation}
        <IconButton>
          <img src={DownArrow} alt="" />
        </IconButton>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={emailSchema}
        onSubmit={(values) => {
          setLoader();
          dispatch(
            setaccountTeamErrMsg({
              accountTeamErrMsg: '',
              accountTeamValidationField: '',
            })
          );
          dispatch(
            handleSendAccTeamEmail(
              values.accountTeamEmailList,
              parseInt(salesHubAccountId, 10) || 0,
              true,
              () => clearLoader(),
              () =>
                setAlert((prevState: any) => ({
                  ...prevState,
                  showAlert: true,
                  message: AccountsEngagementsLabels.accountTeamSuccessMsg,
                  severity: 'success',
                })),
              cancelHandler
            )
          );
        }}
      >
        {(formik) => {
          const {
            handleChange,
            handleSubmit,
            handleBlur,
            values,
            errors,
            touched,
            dirty,
          } = formik;
          setIsDirty(dirty);
          return (
            <div className={styles.userInfoForm}>
              <Form
                style={{
                  width: '100%',
                }}
                onSubmit={(e) => {
                  e.preventDefault();
                  setShowUserInformation(true);
                  handleSubmit(e);
                }}
                id="userInfo"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                  }
                }}
              >
                {showUserInformation && (
                  <div className={styles.userInformationWrap}>
                    <div className={styles.userInformationFieldWrap}>
                      <div className={styles.salesHubAccLabel}>
                        {createAccount.enterEmailLabel}
                      </div>
                      <div className={`${styles.salesHubAccField} textArea`}>
                        <Field
                          type="text"
                          name="accountTeamEmailList"
                          value={values.accountTeamEmailList}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          hasError={
                            errors.accountTeamEmailList &&
                            touched.accountTeamEmailList
                          }
                          errorMessage={errors.accountTeamEmailList}
                          component={GenTextField}
                          classes={classes}
                          multiline
                        />
                        <small className={styles.inputHelper}>
                          {createAccount.seperateByCommaHelperText}
                        </small>
                        {accountTeamErr !== '' &&
                        salesHubSiteRespData.accountTeamValidationField ===
                          'emails' ? (
                          <div
                            style={{
                              color: 'red',
                              fontSize: '12px',
                              fontWeight: '500',
                              padding: '5px 0px',
                            }}
                          >
                            {accountTeamErr}
                          </div>
                        ) : (
                          <RenderErrorMessage name="accountTeamEmailList" />
                        )}
                      </div>
                    </div>
                  </div>
                )}
                <div
                  className={`${styles.accInfoBtnWrap} ${styles.UserInfoBottomLayer}`}
                >
                  <SecondaryButton
                    onClick={() => {
                      if (dirty) setShowCloseWarning(true);
                      else cancelHandler();
                    }}
                    style={{ minWidth: '160px', marginRight: '30px' }}
                  >
                    {ButtonLabels.cancel}
                  </SecondaryButton>
                  <PrimaryButton type="submit" style={{ minWidth: '160px' }}>
                    {ButtonLabels.sendInvite}
                  </PrimaryButton>
                </div>
              </Form>
            </div>
          );
        }}
      </Formik>
      {showCloseWarning && (
        <DialogBoxComponent
          title=""
          secondaryContent="Are you sure you want to discard changes made on this page?"
          primaryContent="Unsaved Changes"
          primaryButton="Discard"
          secondaryButton="Cancel"
          handleDialogBoxClose={() => setShowCloseWarning(false)}
          handleAgree={cancelHandler}
          show
        />
      )}
    </>
  );
};
export default UserInformation;
