/* eslint-disable react/jsx-curly-newline */
/* eslint-disable indent */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable linebreak-style */
/* eslint-disable react/jsx-indent */
/* eslint-disable comma-dangle */
/* eslint-disable linebreak-style */
/* eslint-disable operator-linebreak */
import { IconButton, InputAdornment } from '@material-ui/core';
import React, { useState, useEffect, useRef } from 'react';
import {
  createAccountDropdown,
  createAccount,
  ButtonLabels,
  AccountsEngagementsLabels,
} from 'src/strings';
import DownArrow from 'src/app/components/Icons/PreviewPartnership/DownArrow.svg';
import { Field, Formik, Form, FormikProps } from 'formik';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
// import dateFns from 'date-fns';
import { format } from 'date-fns';

import SecondaryButton from 'src/app/components/Button/SecondaryButton';
import PrimaryButton from 'src/app/components/Button/PrimaryButton';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { getRequest } from 'src/app/service';
import DialogBoxComponent from 'src/app/components/DialogBox/DialogBox';
import { GenTextField, RenderErrorMessage } from '../../Form';
import { useStyles } from '../../Styles';

import {
  handleSaveSalesOpportunity,
  salesHubAccountResponse,
  setGeneralErrMsg,
} from '../../SalesHubSiteSlice';

import styles from '../CreateAccount/CreateAccount.module.css';
import '../CreateAccount/CreateAccount.css';

export interface salesOpportunityValues {
  opportunityName: string;
  salesStage: string;
  createdDate: Date;
  estimatedCloseDate: Date;
  estimatedDealAmount: string;
}

const CreateSalesOpportunities = (props: any) => {
  const formikForm = useRef<FormikProps<salesOpportunityValues>>(null);
  const salesHubSiteRespData = useSelector(salesHubAccountResponse);
  const [generalErr, setGeneralErr] = useState('');
  const classes = useStyles();
  const [general, setGeneral] = useState(true);
  const queryparams = new URLSearchParams(window.location.search);
  const salesHubAccountId: string =
    queryparams.get('sales_hub_account_id') || '0';
  const {
    clearLoader,
    setAlert,
    cancelHandler,
    setLoader,
    showAddSalesOpportunity = '0',
    setIsDirty,
    setShowCloseWarning,
    showCloseWarning,
    fetchSalesOpportunityList,
  } = props;
  const dispatch = useDispatch();
  useEffect(() => {
    const timer = setTimeout(() => {
      setGeneralErr('');

      dispatch(
        setGeneralErrMsg({
          generalErrMsg: '',
          generalValidationField: '',
        })
      );
    }, 15000);
    setGeneralErr(salesHubSiteRespData.generalErrMsg);
    return () => clearTimeout(timer);
  }, [salesHubSiteRespData]);
  const [initialValues, setInitialValues] = useState({
    opportunityName: '',
    salesStage: '',
    createdDate: null,
    estimatedCloseDate: null,
    estimatedDealAmount: '',
  });
  const [isAdd, setIsAdd] = useState(false);
  const salesOpportunitySchema = Yup.object().shape({
    opportunityName: Yup.string()
      .trim()
      .required('Opportunity name is required'),
    salesStage: Yup.string().trim().required('Sales stage is required'),
    createdDate: Yup.date()
      .nullable()
      .typeError('Invalid Date')
      .required('Created date is required'),
    estimatedCloseDate: Yup.date()
      .when('createdDate', (createdDate, schema) => {
        if (createdDate) {
          // This can be calculated in many ways. Just be sure that its type is `Date` object
          const dayAfter = new Date(createdDate.getTime() + 86400000);

          return schema.min(
            dayAfter,
            'Estimated close date should be greater than the created date'
          );
        }

        return schema;
      })
      .nullable()
      .typeError('Invalid Date')
      .required('Estimated close date is required'),
    estimatedDealAmount: Yup.string()
      .matches(/^(?!0)\d+$/, 'Enter a valid amount(number)')
      .nullable(),
  });
  const fetchValidDateObj = (dateString) => {
    console.log('dateStringArr', dateString);
    const dateStringArr = dateString?.split('/');
    const dateFormat = `${dateStringArr[0]}/${dateStringArr[1]}/${dateStringArr[2]}`;
    return dateStringArr ? dateFormat : null;
  };
  const getSalesOpportunityDetail = () => {
    const token = localStorage.getItem('token');

    getRequest(
      `partnership/sales-hub-account/sales-opportunity/?sales_hub_account_id=${salesHubAccountId}&sales_opportunity_id=${showAddSalesOpportunity}`,
      {
        Authorization: `Token ${token}`,
      }
    ).then((resp: any) => {
      if (resp.result === true) {
        const resData = resp.data;

        setInitialValues({
          ...formikForm.current.values,
          opportunityName: resData.opportunity_name,
          salesStage: resData.sales_stage,
          createdDate:
            (resData?.created_date &&
              new Date(fetchValidDateObj(resData?.created_date))) ||
            null,
          estimatedCloseDate:
            (resData?.estimated_close_date &&
              new Date(fetchValidDateObj(resData?.estimated_close_date))) ||
            null,
          estimatedDealAmount: resData.estimate_deal_amount,
        });
      }
    });
  };
  useEffect(() => {
    if (showAddSalesOpportunity && showAddSalesOpportunity !== '0') {
      getSalesOpportunityDetail();
    }
    dispatch(
      setGeneralErrMsg({
        generalErrMsg: '',
        generalValidationField: '',
      })
    );
  }, []);

  const handleCreateSalesOpportunity = (
    values,
    isAddClicked,
    resetFormFunc
  ) => {
    setLoader();
    dispatch(
      handleSaveSalesOpportunity(
        {
          ...values,
          createdDate: format(new Date(values.createdDate), 'MM/dd/yyyy'),
          estimatedCloseDate: format(
            new Date(values.estimatedCloseDate),
            'MM/dd/yyyy'
          ),
        },
        showAddSalesOpportunity,
        isAddClicked,
        resetFormFunc,
        () => clearLoader(),
        () =>
          setAlert(
            showAddSalesOpportunity === '0'
              ? AccountsEngagementsLabels.salesOpportunitiesSuccessMsg
              : AccountsEngagementsLabels.salesOpportunitiesupdateSuccessMsg
          ),
        () => {
          cancelHandler();
          dispatch(
            setGeneralErrMsg({
              generalErrMsg: '',
              generalValidationField: '',
            })
          );
        },
        fetchSalesOpportunityList
      )
    );
  };
  console.log(initialValues, 'valll');
  return (
    <>
      <div
        className={styles.salesHubAccDropDown}
        onClickCapture={() => setGeneral(!general)}
      >
        {createAccountDropdown.general}
        <IconButton>
          <img src={DownArrow} alt="" />
        </IconButton>
      </div>

      <Formik
        initialValues={initialValues}
        enableReinitialize
        innerRef={formikForm}
        validate={() => ({})}
        validationSchema={salesOpportunitySchema}
        onSubmit={(values, { resetForm }) =>
          handleCreateSalesOpportunity(values, isAdd, resetForm)
        }
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
            setFieldValue,
            setFieldError,
          } = formik;
          setIsDirty(dirty);
          return (
            <div className={styles.salesInfoForm}>
              <Form
                style={{
                  width: '100%',
                }}
                onSubmit={(e) => {
                  e.preventDefault();
                  setGeneral(true);
                  handleSubmit(e);
                }}
                id="salesOpportunityCreation"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                  }
                }}
              >
                {general && (
                  <>
                    <div className={styles.userInformationWrap}>
                      <div className={styles.userInformationFieldWrap}>
                        <div className={styles.salesHubAccLabel}>
                          {createAccount.opportunityName}
                        </div>
                        <div className={`${styles.salesHubAccField}`}>
                          <Field
                            type="text"
                            name="opportunityName"
                            value={values.opportunityName}
                            onBlur={handleBlur}
                            placeholder={createAccount.opportunityName}
                            onChange={handleChange}
                            hasError={
                              errors.opportunityName && touched.opportunityName
                            }
                            errorMessage={errors.opportunityName}
                            component={GenTextField}
                            classes={classes}
                          />
                          {generalErr !== '' &&
                          salesHubSiteRespData.generalValidationField ===
                            'opportunity_name' ? (
                            <div
                              style={{
                                color: 'red',
                                fontSize: '12px',
                                fontWeight: '500',
                                padding: '5px 0px',
                                wordBreak: 'break-all',
                              }}
                            >
                              {generalErr}
                            </div>
                          ) : (
                            <RenderErrorMessage name="opportunityName" />
                          )}
                        </div>
                      </div>
                      <div className={styles.userInformationFieldWrap}>
                        <div className={styles.salesHubAccLabel}>
                          {createAccount.salesStage}
                        </div>
                        <div className={`${styles.salesHubAccField}`}>
                          <Field
                            type="text"
                            name="salesStage"
                            value={values.salesStage}
                            onBlur={handleBlur}
                            placeholder={createAccount.salesStage}
                            onChange={handleChange}
                            hasError={errors.salesStage && touched.salesStage}
                            errorMessage={errors.salesStage}
                            component={GenTextField}
                            classes={classes}
                          />

                          <RenderErrorMessage name="salesStage" />
                        </div>
                      </div>
                      <div className={styles.userInformationFieldWrap}>
                        <div className={styles.salesHubAccLabel}>
                          {createAccount.createdDate}
                        </div>
                        <div
                          className={`${styles.salesHubAccField} datePickerField`}
                        >
                          <LocalizationProvider
                            dateAdapter={AdapterDateFns}
                            style={{ width: '100%' }}
                          >
                            <DatePicker
                              views={['year', 'month', 'day']}
                              value={values.createdDate}
                              onChange={(newValue) => {
                                console.log(newValue, 'neww');
                                setFieldValue('createdDate', newValue);
                              }}
                              inputFormat="MM/dd/yyyy"
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  helperText={null}
                                  placeholder={createAccount.createdDate}
                                />
                              )}
                            />
                          </LocalizationProvider>
                          {errors.createdDate && touched.createdDate ? (
                            <div
                              style={{
                                color: 'red',
                                fontSize: '12px',
                                fontWeight: '500',
                                padding: '5px 0',
                                wordBreak: 'break-word',
                              }}
                            >
                              {errors.createdDate}
                            </div>
                          ) : (
                            <RenderErrorMessage name="createdDate" />
                          )}
                        </div>
                      </div>
                      <div className={styles.userInformationFieldWrap}>
                        <div className={styles.salesHubAccLabel}>
                          {createAccount.estimatedCloseDate}
                        </div>
                        <div
                          className={`${styles.salesHubAccField} datePickerField`}
                        >
                          <LocalizationProvider
                            dateAdapter={AdapterDateFns}
                            style={{ width: '100%' }}
                          >
                            <DatePicker
                              // disabled={values.createdDate === null}
                              // disablePast
                              // minDate={values.createdDate}
                              views={['year', 'month', 'day']}
                              value={values.estimatedCloseDate}
                              onChange={(newValue) => {
                                setFieldValue('estimatedCloseDate', newValue);
                                // const dateOne = new Date(values.createdDate);
                                // const dateTwo = new Date(newValue);
                                // if (dateOne > dateTwo) {
                                //   setFieldError('estimatedCloseDate', '');
                                //   console.log(1);
                                // } else {
                                //   setFieldError(
                                //     'estimatedCloseDate',
                                //     'Estimated close date must be after the created date'
                                //   );
                                //   console.log(2);
                                // }
                              }}
                              inputFormat="MM/dd/yyyy"
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  helperText={null}
                                  placeholder={createAccount.estimatedCloseDate}
                                />
                              )}
                            />
                          </LocalizationProvider>
                          {errors.estimatedCloseDate &&
                          touched.estimatedCloseDate ? (
                            <div
                              style={{
                                color: 'red',
                                fontSize: '12px',
                                fontWeight: '500',
                                padding: '5px 0',
                                wordBreak: 'break-word',
                              }}
                            >
                              {errors.estimatedCloseDate}
                            </div>
                          ) : (
                            <RenderErrorMessage name="estimatedCloseDate" />
                          )}
                        </div>
                      </div>
                      <div className={styles.userInformationFieldWrap}>
                        <div className={styles.salesHubAccLabel}>
                          {createAccount.estimatedDealAmount}
                        </div>
                        <div
                          className={`${styles.salesHubAccField} dealAmountField`}
                        >
                          <Field
                            type="text"
                            name="estimatedDealAmount"
                            value={`$${values.estimatedDealAmount}`}
                            onBlur={handleBlur}
                            placeholder={createAccount.estimatedDealAmount}
                            onChange={handleChange}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  $
                                </InputAdornment>
                              ),
                            }}
                            hasError={
                              errors.estimatedDealAmount &&
                              touched.estimatedDealAmount
                            }
                            errorMessage={errors.estimatedDealAmount}
                            prefix="$"
                            component={GenTextField}
                            classes={classes}
                          />

                          <RenderErrorMessage name="estimatedDealAmount" />
                        </div>
                      </div>

                      {showAddSalesOpportunity === '0' && (
                        <div style={{ textAlign: 'right', padding: '50px 0' }}>
                          <PrimaryButton
                            type="submit"
                            onClick={() => setIsAdd(true)}
                            style={{ minWidth: '160px', marginRight: '30px' }}
                          >
                            {ButtonLabels.add}
                          </PrimaryButton>
                        </div>
                      )}
                    </div>
                  </>
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
                  <PrimaryButton
                    type="submit"
                    style={{ minWidth: '160px' }}
                    onClick={() => setIsAdd(false)}
                  >
                    {showAddSalesOpportunity === '0'
                      ? ButtonLabels.save
                      : ButtonLabels.update}
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
          primaryContent="Unsaved changes"
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
export default CreateSalesOpportunities;
