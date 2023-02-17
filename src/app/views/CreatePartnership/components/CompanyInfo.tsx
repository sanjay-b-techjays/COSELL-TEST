/* eslint-disable linebreak-style */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable operator-linebreak */
/* eslint-disable object-curly-newline */
/* eslint-disable no-console */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable comma-dangle */
/* eslint-disable linebreak-style */
import React, { useState, useEffect, useRef } from 'react';
import * as Yup from 'yup';
import { Formik, FormikProps, Form, Field } from 'formik';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import '../createPartnership.css';
import { InputAdornment } from '@material-ui/core';
import IconButton from '@mui/material/IconButton';
import { useDispatch, useSelector } from 'react-redux';
import { getRequest } from 'src/app/service';
import Loader from 'src/app/components/Loader';
import SnackbarAlert from 'src/app/components/Snackbar/Snackbar';

import PreviewImage from 'src/app/components/PreviewImage/PreviewImage';
import useThumbnailImage from 'src/app/components/PreviewImage/CustomHook/useThumbnailImage';
import { RenderErrorMessage, GenTextField } from '../../SalesHubSite/Form';
import { useStyles } from '../../SalesHubSite/Styles';
import {
  errorMessageLabels,
  ButtonLabels,
  CompanyInfoLabels,
  previewImageLables,
} from '../../../../strings';
import SecondaryButton from '../../../components/Button/SecondaryButton';
import PrimaryButton from '../../../components/Button/PrimaryButton';
import uploadIcon from '../../../assets/upload-logo.svg';
import {
  selectCreatePartnershipResponse,
  CompanyInfoAction,
  setIsCreatePartnershipFormEdited,
  setCreatePartnershipWarningEditor,
} from '../CreatePartnerShipSlice';
import CroppedImage from 'src/app/components/CroppedImage/CroppedImage';
import DialogBoxComponent from 'src/app/components/DialogBox/DialogBox';

interface CompanyInfoValues {
  companyName: string;
  companyAddress: string;
  companyWebsite: string;
  city: string;
  country: string;
  privacyPolicyURL: string;
  siteTermsURL: string;
  cookiePolicy: string;
  companyLogo: string;
  state: string;
  zipCode: string;
}

interface Props {
  steps: string[];
  history: any;
  isUpdate: boolean;
}

interface alert {
  showAlert: boolean;
  severity: string;
  message: string;
}

const CompanyInfo = ({ steps, history, isUpdate }: Props) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  const queryparams = new URLSearchParams(window.location.search);
  const partnershipId: string = queryparams.get('partner_id') || '0';
  const dispatch = useDispatch();
  const partnershipResponseData = useSelector(selectCreatePartnershipResponse);
  const fileInput = useRef<HTMLInputElement>(null);
  const formikForm = useRef<FormikProps<CompanyInfoValues>>(null);

  const [initialValues, setInitialValues] = useState<CompanyInfoValues>();
  const [companyId, setCompanyId] = useState('');
  const [alert, setAlert] = useState({
    showAlert: false,
    severity: '',
    message: '',
  });
  const [previewImage, setPreviewImage, setPreviewImageFileData] =
    useThumbnailImage([
      { key: previewImageLables.companyLogo, aspectRatio: 3 / 1 },
    ]);
  const [showCropImage, setShowCropImage] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showCloseWarning, setShowCloseWarning] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (isUpdate) {
      getRequest(`partnership/?partnership_id=${partnershipId}`, {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      }).then((resp: any) => {
        if (resp.result === true) {
          const companyInfoId =
            resp.data.company_information.company_information_id;
          if (companyInfoId) {
            setCompanyId(companyInfoId);
            setInitialValues({
              companyName: resp.data.company_information.company_name,
              companyAddress: resp.data.company_information.company_address,
              companyWebsite: resp.data.company_information.company_website,
              city: resp.data.company_information.city,
              country: resp.data.company_information.country,
              privacyPolicyURL:
                resp.data.company_information.privacy_policy_url,
              siteTermsURL: resp.data.company_information.site_terms_url,
              cookiePolicy: resp.data.company_information.cookie_policy,
              companyLogo: resp.data.company_information.logo_name,
              state: resp.data.company_information.state,
              zipCode: resp.data.company_information.zipcode,
            });
            setPreviewImage({
              type: 'SET_API_IMAGE_DETAILS',
              payload: {
                key: previewImageLables.companyLogo,
                name: resp.data.company_information.logo_name,
                source: resp.data.company_information.logo,
              },
            });
          } else {
            setInitialValues({
              companyName: '',
              companyAddress: '',
              companyWebsite: '',
              city: '',
              country: '',
              privacyPolicyURL: '',
              siteTermsURL: '',
              cookiePolicy: '',
              companyLogo: '',
              state: '',
              zipCode: '',
            });
          }
        } else {
          console.log(resp.data, 'error');
        }
      });
      setLoading(false);
    } else {
      setInitialValues({
        companyName: '',
        companyAddress: '',
        companyWebsite: '',
        city: '',
        country: '',
        privacyPolicyURL: '',
        siteTermsURL: '',
        cookiePolicy: '',
        companyLogo: '',
        state: '',
        zipCode: '',
      });
      setLoading(false);
    }

    return () => {
      dispatch(
        setIsCreatePartnershipFormEdited({
          isCreatePartnershipFormEdited: false,
        })
      );
    };
  }, []);

  useEffect(() => {
    dispatch(
      setIsCreatePartnershipFormEdited({
        isCreatePartnershipFormEdited: isDirty,
      })
    );
  }, [isDirty]);

  useEffect(() => {
    if (partnershipResponseData.showCreatePartnershipWarningEditor.show) {
      setShowCloseWarning(true);
    }
  }, [partnershipResponseData.showCreatePartnershipWarningEditor]);

  useEffect(() => {
    if (previewImage[previewImageLables.companyLogo]?.cropped) {
      formikForm?.current?.setFieldError('companyLogo', '');
    }
  }, [previewImage[previewImageLables.companyLogo]]);

  const onFileSelected = (event: any, setFieldValue: any) => {
    const file = event.target.files[0];
    if (
      file &&
      file.name &&
      formikForm &&
      formikForm.current &&
      file.type.includes('image/')
    ) {
      const fileName = file.name as string;
      // setInitialValues({
      //   ...formikForm.current.values,
      //   companyLogo: fileName,
      // });
      setFieldValue('companyLogo', fileName);
      setPreviewImageFileData(previewImageLables.companyLogo, file);
    } else {
      setAlert((prevState: alert) => ({
        ...prevState,
        showAlert: true,
        message: errorMessageLabels.fileErrorMessage,
        severity: 'error',
      }));
    }
  };

  const companyInfoSchema = Yup.object().shape({
    companyName: Yup.string()
      .trim()
      .min(3, 'Minimum 3 characters is required')
      .required(errorMessageLabels.companyName),
    companyAddress: Yup.string()
      .trim()
      .min(3, 'Minimum 3 characters is required')
      .required(errorMessageLabels.companyAddress),
    companyWebsite: Yup.string()
      .trim()
      .required(errorMessageLabels.companyWebsite)
      .matches(
        /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi,
        errorMessageLabels.invalidURL
      ),
    city: Yup.string()
      .trim()
      .min(3, 'Minimum 3 characters is required')
      .required(errorMessageLabels.city)
      .matches(/^[^0-9]+$/, errorMessageLabels.invalidCity),
    country: Yup.string()
      .trim()
      .min(3, 'Minimum 3 characters is required')
      .required(errorMessageLabels.country)
      .matches(/^[^0-9]+$/, errorMessageLabels.invalidCountry),
    privacyPolicyURL: Yup.string()
      .trim()
      .required(errorMessageLabels.privacyPolicy)
      .matches(
        /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi,
        errorMessageLabels.invalidURL
      ),
    siteTermsURL: Yup.string()
      .trim()
      .required(errorMessageLabels.siteTermsURL)
      .matches(
        /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi,
        errorMessageLabels.invalidURL
      ),
    cookiePolicy: Yup.string()
      .trim()
      .required(errorMessageLabels.cookiePolicy)
      .matches(
        /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi,
        errorMessageLabels.invalidURL
      ),
    // companyLogo: Yup.string(),
    state: Yup.string()
      .trim()
      .min(2, 'Minimum 2 characters is required')
      .required(errorMessageLabels.state)
      .matches(/^[^0-9]+$/, errorMessageLabels.invalidState),
    zipCode: Yup.string()
      .trim()
      .required(errorMessageLabels.zipCode)
      .matches(/^(?=.*\d)[\d ]+$/, errorMessageLabels.invalidZipCode),
  });

  const onImageCancel = (setFieldValue) => {
    // setInitialValues({
    //   ...formikForm.current.values,
    //   companyLogo: '',
    // });
    setFieldValue('companyLogo', '');
    fileInput.current.value = '';
    setPreviewImage({
      type: 'SET_IMAGEFILE_CANCEL',
      payload: { key: previewImageLables.companyLogo },
    });
  };
  console.log(previewImage);
  return (
    <div className="create-partnership-main-container">
      <Box sx={{ width: '75%' }}>
        <Stepper activeStep={1} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      <div className="create-partnership-info-title">
        {CompanyInfoLabels.companyInfoTitle}{' '}
      </div>{' '}
      {initialValues && (
        <Formik
          innerRef={formikForm}
          enableReinitialize
          initialValues={initialValues}
          validate={() => ({})}
          validationSchema={companyInfoSchema}
          onSubmit={(values) => {
            if (
              previewImage[previewImageLables.companyLogo].error &&
              !previewImage[previewImageLables.companyLogo].cropped
            ) {
              formikForm?.current?.setFieldError(
                'companyLogo',
                previewImage[previewImageLables.companyLogo].error
              );
              return;
            }
            setLoading(true);
            const companyLogoFile = previewImage[previewImageLables.companyLogo]
              ?.cropped
              ? previewImage[previewImageLables.companyLogo].croppedFile
              : previewImage[previewImageLables.companyLogo].file;
            dispatch(
              CompanyInfoAction(
                values,
                history,
                isUpdate,
                partnershipId,
                companyId,
                partnershipResponseData.partnerCompanyInformationId,
                companyLogoFile,
                () => setLoading(false)
              )
            );
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
              validateField,
              dirty,
            } = formik;
            setIsDirty(dirty);
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
                <div className="company-info-form">
                  <div className="company-info-main-column-container">
                    <div className="company-info-div">
                      <div className="company-info-field">
                        <div className="create-partnership-label">
                          {CompanyInfoLabels.companyName}
                        </div>
                        <div>
                          <Field
                            type="text"
                            name="companyName"
                            value={values.companyName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder={CompanyInfoLabels.companyName}
                            hasError={errors.companyName && touched.companyName}
                            errorMessage={errors.companyName}
                            component={GenTextField}
                            classes={classes}
                          />
                          <RenderErrorMessage name="companyName" />
                        </div>
                      </div>
                      <div className="company-info-field">
                        <div className="company-logo-label create-partnership-label">
                          {CompanyInfoLabels.companyLogo}
                        </div>
                        <div>
                          <Field
                            type="file"
                            name="companyLogo"
                            value={values.companyLogo}
                            // onChange={handleChange}
                            // onBlur={handleBlur}
                            readOnly
                            hasError={errors.companyLogo && touched.companyLogo}
                            errorMessage={errors.companyLogo}
                            placeholder={CompanyInfoLabels.companyLogo}
                            component={GenTextField}
                            classes={classes}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={(e) => {
                                      if (fileInput && fileInput.current) {
                                        fileInput.current.click();
                                      }
                                    }}
                                  >
                                    <input
                                      accept="image/*"
                                      ref={fileInput}
                                      type="file"
                                      style={{ display: 'none' }}
                                      onChange={(e: any) => {
                                        onFileSelected(e, setFieldValue);
                                      }}
                                    />

                                    <img src={uploadIcon} alt="" />
                                  </IconButton>
                                </InputAdornment>
                              ),
                              accept: 'image/*',
                              readOnly: true,
                            }}
                          />
                          <div className="previewImageHelper">
                            Recommended size 150 x 50 px
                          </div>
                          <RenderErrorMessage
                            className="ImgErrMsg"
                            name="companyLogo"
                          />
                          <PreviewImage
                            showCrop
                            id="companyLogoCreatePage"
                            alt="company logo"
                            src={
                              previewImage[previewImageLables.companyLogo]
                                ?.cropped
                                ? previewImage[previewImageLables.companyLogo]
                                    ?.croppedSource
                                : previewImage[previewImageLables.companyLogo]
                                    ?.source
                            }
                            show={
                              previewImage[previewImageLables.companyLogo]
                                ?.source &&
                              previewImage[previewImageLables.companyLogo]?.name
                            }
                            classes="company-thumbnailImage"
                            CustomStyles={{
                              ContainerStyle: { position: 'absolute' },
                            }}
                            CloseHandler={() => onImageCancel(setFieldValue)}
                            CropHandler={() => setShowCropImage(true)}
                            UndoHandler={() =>
                              setPreviewImage({
                                type: 'CLEAR_CROPPED_IMAGE',
                                payload: {
                                  key: previewImageLables.companyLogo,
                                },
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="company-info-div">
                      <div className="company-info-field textAreaInput">
                        <div className="create-partnership-label">
                          {CompanyInfoLabels.companyAddress}
                        </div>
                        <div>
                          <Field
                            className="company-info-field-address-field"
                            type="text"
                            name="companyAddress"
                            value={values.companyAddress}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder={CompanyInfoLabels.companyAddress}
                            hasError={
                              errors.companyAddress && touched.companyAddress
                            }
                            multiline
                            errorMessage={errors.companyAddress}
                            component={GenTextField}
                            classes={classes}
                          />
                          <RenderErrorMessage name="companyAddress" />
                        </div>
                      </div>
                    </div>
                    <div className="company-info-div">
                      <div className="company-info-field">
                        <div className="create-partnership-label">
                          {CompanyInfoLabels.city}
                        </div>
                        <div>
                          <Field
                            name="city"
                            value={values.city}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            hasError={errors.city && touched.city}
                            errorMessage={errors.city}
                            component={GenTextField}
                            classes={classes}
                            placeholder={CompanyInfoLabels.city}
                          />
                          <RenderErrorMessage name="city" />
                        </div>
                      </div>
                      <div className="company-info-field">
                        <div className="create-partnership-label">
                          {CompanyInfoLabels.state}
                        </div>
                        <div>
                          <Field
                            type="text"
                            name="state"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            hasError={errors.state && touched.state}
                            errorMessage={errors.state}
                            placeholder={CompanyInfoLabels.state}
                            component={GenTextField}
                            classes={classes}
                          />
                          <RenderErrorMessage name="state" />
                        </div>
                      </div>
                    </div>
                    <div className="company-info-div">
                      <div className="company-info-field">
                        <div className="create-partnership-label">
                          {CompanyInfoLabels.country}
                        </div>
                        <div>
                          <Field
                            type="text"
                            name="country"
                            value={values.country}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder={CompanyInfoLabels.country}
                            hasError={errors.country && touched.country}
                            errorMessage={errors.country}
                            component={GenTextField}
                            classes={classes}
                          />
                          <RenderErrorMessage name="country" />
                        </div>
                      </div>
                      <div className="company-info-field">
                        <div className="create-partnership-label">
                          {CompanyInfoLabels.zipCode}
                        </div>
                        <div>
                          <Field
                            type="text"
                            name="zipCode"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            hasError={errors.zipCode && touched.zipCode}
                            errorMessage={errors.zipCode}
                            placeholder={CompanyInfoLabels.zipCode}
                            component={GenTextField}
                            classes={classes}
                          />
                          <RenderErrorMessage name="zipCode" />
                        </div>
                      </div>
                    </div>
                    <div className="company-info-div">
                      <div className="company-info-field">
                        <div className="create-partnership-label">
                          {CompanyInfoLabels.privacyPolicyURL}
                        </div>
                        <div>
                          <Field
                            type="text"
                            name="privacyPolicyURL"
                            value={values.privacyPolicyURL}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            hasError={
                              errors.privacyPolicyURL &&
                              touched.privacyPolicyURL
                            }
                            errorMessage={errors.privacyPolicyURL}
                            component={GenTextField}
                            classes={classes}
                            placeholder={CompanyInfoLabels.privacyPolicyURL}
                          />
                          <RenderErrorMessage name="privacyPolicyURL" />
                        </div>
                      </div>
                      <div className="company-info-field">
                        <div className="create-partnership-label">
                          {CompanyInfoLabels.companyWebsite}
                        </div>
                        <div>
                          <Field
                            type="text"
                            name="companyWebsite"
                            value={values.companyWebsite}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            hasError={
                              errors.companyWebsite && touched.companyWebsite
                            }
                            errorMessage={errors.companyWebsite}
                            component={GenTextField}
                            classes={classes}
                            placeholder={CompanyInfoLabels.companyWebsite}
                          />
                          <RenderErrorMessage name="companyWebsite" />
                        </div>
                      </div>
                    </div>
                    <div className="company-info-div">
                      <div className="company-info-field">
                        <div className="create-partnership-label">
                          {CompanyInfoLabels.siteTermsURL}
                        </div>
                        <div>
                          <Field
                            type="text"
                            name="siteTermsURL"
                            value={values.siteTermsURL}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            hasError={
                              errors.siteTermsURL && touched.siteTermsURL
                            }
                            errorMessage={errors.siteTermsURL}
                            component={GenTextField}
                            classes={classes}
                            placeholder={CompanyInfoLabels.siteTermsURL}
                          />
                          <RenderErrorMessage name="siteTermsURL" />
                        </div>
                      </div>
                    </div>
                    <div className="company-info-div">
                      <div className="company-info-field">
                        <div className="create-partnership-label">
                          {CompanyInfoLabels.cookiePolicy}
                        </div>
                        <div>
                          <Field
                            type="text"
                            name="cookiePolicy"
                            value={values.cookiePolicy}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            hasError={
                              errors.cookiePolicy && touched.cookiePolicy
                            }
                            errorMessage={errors.cookiePolicy}
                            placeholder={CompanyInfoLabels.cookiePolicy}
                            component={GenTextField}
                            classes={classes}
                          />
                          <RenderErrorMessage name="cookiePolicy" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="create-partnership-info-button-container">
                    <SecondaryButton
                      onClick={() => {
                        if (isDirty) setShowCloseWarning(true);
                        else {
                          history.push(
                            `/createPartnership?form=PartnerShipInfo&type=update&partner_id=${partnershipId}`
                          );
                        }
                      }}
                      style={{ marginRight: '30px', minWidth: '160px' }}
                    >
                      {ButtonLabels.previous}
                    </SecondaryButton>
                    <PrimaryButton type="submit" style={{ minWidth: '160px' }}>
                      {ButtonLabels.continue}
                    </PrimaryButton>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      )}
      {showCloseWarning && (
        <DialogBoxComponent
          title=""
          secondaryContent="Are you sure you want to discard changes made on this page?"
          primaryContent="Unsaved changes"
          primaryButton="Discard"
          secondaryButton="Cancel"
          handleDialogBoxClose={() => {
            setShowCloseWarning(false);
            if (
              partnershipResponseData.showCreatePartnershipWarningEditor.show
            ) {
              dispatch(
                setCreatePartnershipWarningEditor({
                  show: false,
                  navigateAction: null,
                })
              );
            }
          }}
          handleAgree={() => {
            dispatch(
              setCreatePartnershipWarningEditor({
                show: false,
                navigateAction: null,
              })
            );
            dispatch(
              setIsCreatePartnershipFormEdited({
                isCreatePartnershipFormEdited: false,
              })
            );
            if (
              partnershipResponseData.showCreatePartnershipWarningEditor.show
            ) {
              setIsDirty(false);
              setShowCloseWarning(false);
              partnershipResponseData.showCreatePartnershipWarningEditor.navigateAction();
              return;
            }
            history.push(
              `/createPartnership?form=PartnerShipInfo&type=update&partner_id=${partnershipId}`
            );
            setIsDirty(false);
          }}
          show
        />
      )}
      {loading === true && <Loader />}
      {alert.showAlert && (
        <SnackbarAlert
          severity={alert.severity}
          handler={() => {
            setAlert((prevState: alert) => ({
              ...prevState,
              showAlert: false,
            }));
          }}
          showalert={alert.showAlert}
          message={alert.message}
        />
      )}
      {showCropImage && (
        <CroppedImage
          previewImage={previewImage[previewImageLables.companyLogo]}
          previewImageLable={previewImageLables.companyLogo}
          setLoader={() => setLoading(true)}
          clearLoader={() => setLoading(false)}
          setPreviewImage={setPreviewImage}
          setShowCropImage={() => setShowCropImage(false)}
        />
      )}
    </div>
  );
};
export default CompanyInfo;
