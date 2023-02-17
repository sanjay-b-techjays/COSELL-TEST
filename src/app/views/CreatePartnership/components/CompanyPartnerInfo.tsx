/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
/* eslint-disable linebreak-style */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable object-curly-newline */
/* eslint-disable no-console */
/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */
/* eslint-disable linebreak-style */
import React, { useState, useEffect, useRef } from 'react';
import { Formik, FormikProps, Form, Field } from 'formik';
import * as Yup from 'yup';
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
import useThumbnailImage from 'src/app/components/PreviewImage/CustomHook/useThumbnailImage';
import PreviewImage from 'src/app/components/PreviewImage/PreviewImage';
import {
  ButtonLabels,
  CompanyPartnerInfoLabels,
  errorMessageLabels,
  previewImageLables,
} from '../../../../strings';
import { RenderErrorMessage, GenTextField } from '../../SalesHubSite/Form';
import { useStyles } from '../../SalesHubSite/Styles';
import SecondaryButton from '../../../components/Button/SecondaryButton';
import PrimaryButton from '../../../components/Button/PrimaryButton';
import uploadIcon from '../../../assets/upload-logo.svg';
import {
  selectCreatePartnershipResponse,
  CompanyPartnerInfoAction,
  setIsCreatePartnershipFormEdited,
  setCreatePartnershipWarningEditor,
} from '../CreatePartnerShipSlice';
import CroppedImage from 'src/app/components/CroppedImage/CroppedImage';
import DialogBoxComponent from 'src/app/components/DialogBox/DialogBox';

interface CompanyPartnerInfoValues {
  partnerCompanyName: string;
  partnerCompanyLogo: string;
  partnerCompanyPrivacyPolicyURL: string;
  partnerCompanySiteTermsURL: string;
  partnerCompanyCookiePolicy: string;
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

const CompanyPartnerInfo = ({ steps, history, isUpdate }: Props) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage, setPreviewImageFileData] =
    useThumbnailImage([
      { key: previewImageLables.partnerCompanyLogo, aspectRatio: 3 / 1 },
    ]);
  const [showCropImage, setShowCropImage] = useState(false);

  const token = localStorage.getItem('token');
  const queryparams = new URLSearchParams(window.location.search);
  const partnershipId: string = queryparams.get('partner_id') || '0';
  const dispatch = useDispatch();
  const partnershipResponseData = useSelector(selectCreatePartnershipResponse);
  const fileInput = useRef<HTMLInputElement>(null);
  const formikForm = useRef<FormikProps<CompanyPartnerInfoValues>>(null);
  const [partnerCompanyInfoId, setPartnerCompanyInfoId] = useState('');
  const [alert, setAlert] = useState({
    showAlert: false,
    severity: '',
    message: '',
  });

  const [initialValues, setInitialValues] =
    useState<CompanyPartnerInfoValues>();
  const [companyNameError, setcompanyNameError] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [showCloseWarning, setShowCloseWarning] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setcompanyNameError(''), 8000);
    setcompanyNameError(partnershipResponseData.errorMsg);
    return () => clearTimeout(timer);
  }, [partnershipResponseData]);
  useEffect(() => {
    setLoading(true);
    if (isUpdate) {
      getRequest(`partnership/?partnership_id=${partnershipId}`, {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      }).then((resp: any) => {
        if (resp.result === true) {
          const partnercompanyInfoID =
            resp.data.partner_company_information
              .partner_company_information_id;
          if (partnercompanyInfoID) {
            setPartnerCompanyInfoId(partnercompanyInfoID);
            setInitialValues({
              partnerCompanyName:
                resp.data.partner_company_information.company_name,
              partnerCompanyLogo:
                resp.data.partner_company_information.logo_name,
              partnerCompanyPrivacyPolicyURL:
                resp.data.partner_company_information.privacy_policy_url,
              partnerCompanySiteTermsURL:
                resp.data.partner_company_information.site_terms_url,
              partnerCompanyCookiePolicy:
                resp.data.partner_company_information.cookie_policy,
            });
            setPreviewImage({
              type: 'SET_API_IMAGE_DETAILS',
              payload: {
                key: previewImageLables.partnerCompanyLogo,
                name: resp.data.partner_company_information.logo_name,
                source: resp.data.partner_company_information.logo,
              },
            });
          } else {
            setInitialValues({
              partnerCompanyName: '',
              partnerCompanyLogo: '',
              partnerCompanyPrivacyPolicyURL: '',
              partnerCompanySiteTermsURL: '',
              partnerCompanyCookiePolicy: '',
            });
          }
        } else {
          console.log(resp.data, 'error');
        }
        setLoading(false);
      });
    } else {
      setInitialValues({
        partnerCompanyName: '',
        partnerCompanyLogo: '',
        partnerCompanyPrivacyPolicyURL: '',
        partnerCompanySiteTermsURL: '',
        partnerCompanyCookiePolicy: '',
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
    if (previewImage[previewImageLables.partnerCompanyLogo]?.cropped) {
      formikForm?.current?.setFieldError('partnerCompanyLogo', '');
    }
  }, [previewImage[previewImageLables.partnerCompanyLogo]]);

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
      //   partnerCompanyLogo: fileName,
      // });
      setFieldValue('partnerCompanyLogo', fileName);
      setPreviewImageFileData(previewImageLables.partnerCompanyLogo, file);
    } else {
      setAlert((prevState: alert) => ({
        ...prevState,
        showAlert: true,
        message: errorMessageLabels.fileErrorMessage,
        severity: 'error',
      }));
    }
  };

  const onImageCancel = (setFieldValue: any) => {
    // setInitialValues({
    //   ...formikForm.current.values,
    //   partnerCompanyLogo: '',
    // });
    fileInput.current.value = '';
    setFieldValue('partnerCompanyLogo', '');

    setPreviewImage({
      type: 'SET_IMAGEFILE_CANCEL',
      payload: { key: previewImageLables.partnerCompanyLogo },
    });
  };

  const CompanyPartnerInfoSchema = Yup.object().shape({
    partnerCompanyName: Yup.string()
      .trim()
      .min(3, 'Minimum 3 characters is required')
      .required(errorMessageLabels.partnerCompanyName),
    partnerCompanyPrivacyPolicyURL: Yup.string()
      .trim()
      .required(errorMessageLabels.partnerCompanyPrivacyPolicyURL)
      .matches(
        /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi,
        errorMessageLabels.invalidURL
      ),
    partnerCompanySiteTermsURL: Yup.string()
      .trim()
      .required(errorMessageLabels.partnerCompanySiteTermsURL)
      .matches(
        /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi,
        errorMessageLabels.invalidURL
      ),
    partnerCompanyCookiePolicy: Yup.string()
      .trim()
      .required(errorMessageLabels.partnerCompanyCookiePolicy)
      .matches(
        /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi,
        errorMessageLabels.invalidURL
      ),
    // partnerCompanyLogo: Yup.string().required('Company Logo Required'),
  });

  return (
    <div className="create-partnership-main-container">
      <Box sx={{ width: '75%' }}>
        <Stepper activeStep={2} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      <div className="create-partnership-info-title">
        {CompanyPartnerInfoLabels.companyPartnerInfoTitle}{' '}
      </div>{' '}
      {initialValues && (
        <Formik
          innerRef={formikForm}
          enableReinitialize
          initialValues={initialValues}
          validate={() => ({})}
          validationSchema={CompanyPartnerInfoSchema}
          onSubmit={(values) => {
            if (
              previewImage[previewImageLables.partnerCompanyLogo].error &&
              !previewImage[previewImageLables.partnerCompanyLogo].cropped
            ) {
              formikForm?.current?.setFieldError(
                'partnerCompanyLogo',
                previewImage[previewImageLables.partnerCompanyLogo].error
              );
              return;
            }
            setLoading(true);
            const partnerCompanyLogoFile = previewImage[
              previewImageLables.partnerCompanyLogo
            ]?.cropped
              ? previewImage[previewImageLables.partnerCompanyLogo].croppedFile
              : previewImage[previewImageLables.partnerCompanyLogo].file;
            dispatch(
              CompanyPartnerInfoAction(
                values,
                history,
                isUpdate,
                partnershipId,
                partnerCompanyInfoId,
                partnerCompanyLogoFile,
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
                <div className="create-partnership-info-form">
                  <div className="create-partnership-info-field">
                    <div className="create-partnership-label">
                      {CompanyPartnerInfoLabels.partnerCompanyName}
                    </div>
                    <div>
                      <Field
                        className="materialui-field"
                        name="partnerCompanyName"
                        type="text"
                        value={values.partnerCompanyName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        hasError={
                          errors.partnerCompanyName &&
                          touched.partnerCompanyName
                        }
                        errorMessage={
                          partnershipResponseData.validationErrField ===
                          'company_name'
                            ? partnershipResponseData.errorMsg
                            : errors.partnerCompanyName
                        }
                        placeholder={
                          CompanyPartnerInfoLabels.partnerCompanyName
                        }
                        component={GenTextField}
                        classes={classes}
                      />
                      {companyNameError !== '' &&
                      partnershipResponseData.validationErrField ===
                        'company_name' ? (
                        <div
                          style={{
                            color: 'red',
                            fontSize: '12px',
                            fontWeight: '500',
                            padding: '5px 0px',
                            maxWidth: '270px',
                          }}
                        >
                          {companyNameError}
                        </div>
                      ) : (
                        <RenderErrorMessage name="partnerCompanyName" />
                      )}
                    </div>
                  </div>
                  <div className="create-partnership-info-field position-relative">
                    <div className="create-partnership-label">
                      {CompanyPartnerInfoLabels.partnerCompanyLogo}
                    </div>
                    <div>
                      <Field
                        name="partnerCompanyLogo"
                        component={GenTextField}
                        classes={classes}
                        type="file"
                        value={values.partnerCompanyLogo}
                        // onChange={handleChange}
                        // onBlur={handleBlur}
                        hasError={
                          errors.partnerCompanyLogo &&
                          touched.partnerCompanyLogo
                        }
                        errorMessage={errors.partnerCompanyLogo}
                        placeholder={
                          CompanyPartnerInfoLabels.partnerCompanyLogoLabel
                        }
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
                        name="partnerCompanyLogo"
                      />
                    </div>
                    <PreviewImage
                      showCrop
                      id="PartnerCompanyLogoCreatePage"
                      alt="partner company logo"
                      src={
                        previewImage[previewImageLables.partnerCompanyLogo]
                          ?.cropped
                          ? previewImage[previewImageLables.partnerCompanyLogo]
                              ?.croppedSource
                          : previewImage[previewImageLables.partnerCompanyLogo]
                              ?.source
                      }
                      show={
                        previewImage[previewImageLables.partnerCompanyLogo]
                          ?.source &&
                        previewImage[previewImageLables.partnerCompanyLogo]
                          ?.name
                      }
                      classes="partner-company-thumbnailImage"
                      CustomStyles={{
                        ContainerStyle: {
                          position: 'absolute',
                          width: '100%',
                          justifyContent: 'flex-end',
                          margin: ' 0 0 0 220px',
                          alignItems: 'flex-start',
                          height: '80px',
                          marginTop: '-5px',
                        },
                      }}
                      CloseHandler={() => onImageCancel(setFieldValue)}
                      CropHandler={() => setShowCropImage(true)}
                      UndoHandler={() =>
                        setPreviewImage({
                          type: 'CLEAR_CROPPED_IMAGE',
                          payload: {
                            key: previewImageLables.partnerCompanyLogo,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="create-partnership-info-field">
                    <div className="create-partnership-info-field-policy-url create-partnership-label">
                      {CompanyPartnerInfoLabels.partnerCompanyPrivacyPolicyURL}
                    </div>
                    <div>
                      <Field
                        type="text"
                        name="partnerCompanyPrivacyPolicyURL"
                        placeholder={
                          CompanyPartnerInfoLabels.partnerCompanyPrivacyPolicyURLLabel
                        }
                        value={values.partnerCompanyPrivacyPolicyURL}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        hasError={
                          errors.partnerCompanyPrivacyPolicyURL &&
                          touched.partnerCompanyPrivacyPolicyURL
                        }
                        errorMessage={errors.partnerCompanyPrivacyPolicyURL}
                        component={GenTextField}
                        classes={classes}
                      />
                      <RenderErrorMessage name="partnerCompanyPrivacyPolicyURL" />
                    </div>
                  </div>
                  <div className="create-partnership-info-field">
                    <div className="create-partnership-info-field-siteterms-url create-partnership-label">
                      {CompanyPartnerInfoLabels.partnerCompanySiteTermsURL}
                    </div>
                    <div>
                      <Field
                        type="text"
                        name="partnerCompanySiteTermsURL"
                        placeholder={
                          CompanyPartnerInfoLabels.partnerCompanySiteTermsURLLabel
                        }
                        value={values.partnerCompanySiteTermsURL}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        hasError={
                          errors.partnerCompanySiteTermsURL &&
                          touched.partnerCompanySiteTermsURL
                        }
                        errorMessage={errors.partnerCompanySiteTermsURL}
                        component={GenTextField}
                        classes={classes}
                      />
                      <RenderErrorMessage name="partnerCompanySiteTermsURL" />
                    </div>
                  </div>
                  <div className="create-partnership-info-field">
                    <div className="create-partnership-info-field-cookie-policy create-partnership-label">
                      {CompanyPartnerInfoLabels.partnerCompanyCookiePolicy}
                    </div>
                    <div>
                      <Field
                        type="text"
                        name="partnerCompanyCookiePolicy"
                        placeholder={
                          CompanyPartnerInfoLabels.partnerCompanyCookiePolicyLabel
                        }
                        value={values.partnerCompanyCookiePolicy}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        hasError={
                          errors.partnerCompanyCookiePolicy &&
                          touched.partnerCompanyCookiePolicy
                        }
                        errorMessage={errors.partnerCompanyCookiePolicy}
                        component={GenTextField}
                        classes={classes}
                      />
                      <RenderErrorMessage name="partnerCompanyCookiePolicy" />
                    </div>
                  </div>
                  <div className="create-partnership-info-button-container">
                    <SecondaryButton
                      onClick={() => {
                        if (isDirty) setShowCloseWarning(true);
                        else {
                          history.push(
                            `/createPartnership?form=CompanyInfo&type=update&partner_id=${partnershipId}`
                          );
                        }
                      }}
                      style={{ marginRight: '30px', minWidth: '160px' }}
                    >
                      {ButtonLabels.previous}
                    </SecondaryButton>
                    <PrimaryButton type="submit" style={{ minWidth: '160px' }}>
                      {ButtonLabels.previewAndSave}
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
              `/createPartnership?form=CompanyInfo&type=update&partner_id=${partnershipId}`
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
          previewImage={previewImage[previewImageLables.partnerCompanyLogo]}
          previewImageLable={previewImageLables.partnerCompanyLogo}
          setLoader={() => setLoading(true)}
          clearLoader={() => setLoading(false)}
          setPreviewImage={setPreviewImage}
          setShowCropImage={() => setShowCropImage(false)}
        />
      )}
    </div>
  );
};
export default CompanyPartnerInfo;
