/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/require-default-props */
/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable linebreak-style */
import React, { useState, useEffect, useRef } from 'react';
import { Formik, FormikProps, Form, Field } from 'formik';
import * as Yup from 'yup';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { useDispatch, useSelector } from 'react-redux';
import ChipInput from 'material-ui-chip-input';
import { getRequest } from 'src/app/service';
import Loader from 'src/app/components/Loader';
import TagsInput from 'src/app/components/TagsInput';
import DialogBoxComponent from '../../../components/DialogBox/DialogBox';
import { RenderErrorMessage, GenTextField } from '../../SalesHubSite/Form';
import { useStyles } from '../../SalesHubSite/Styles';
import PrimaryButton from '../../../components/Button/PrimaryButton';
import SecondaryButton from '../../../components/Button/SecondaryButton';
import '../createPartnership.css';
import {
  ButtonLabels,
  CreatePartnershipLabels,
  errorMessageLabels,
  previewImageLables,
} from '../../../../strings';
import {
  selectCreatePartnershipResponse,
  PartnershipInfoAction,
  setErrMsg,
  setIsCreatePartnershipFormEdited,
  setCreatePartnershipWarningEditor,
} from '../CreatePartnerShipSlice';

import { InputAdornment } from '@material-ui/core';
import IconButton from '@mui/material/IconButton';
import uploadIcon from '../../../assets/upload-logo.svg';
import PreviewImage from 'src/app/components/PreviewImage/PreviewImage';
import useThumbnailImage from 'src/app/components/PreviewImage/CustomHook/useThumbnailImage';
import CloseIcon from '@mui/icons-material/Close';
import { Badge } from '@mui/material';

interface PartnershipInfoValues {
  partnershipName: string;
  websiteSubDomain: string;
  whitelistedDomains: string[];
  favIcon: string;
  favIconImg: any;
}

interface Props {
  steps: string[];
  history: any;
  isUpdate: boolean;
}

interface Ids {
  partnershipId: string;
  companyInfoId: string;
  partnerCompanyId: string;
  coordinatorInfoId: string;
}

const PartnerShipInfo = ({ steps, history, isUpdate }: Props, props: any) => {
  const classes = useStyles();
  const token = localStorage.getItem('token');
  const compId = '';
  const queryparams = new URLSearchParams(window.location.search);
  const partnershipId: string = queryparams.get('partner_id') || '0';
  const companyInfoId: string = queryparams.get('company_info_id') || '0';
  const partnershipResponseData = useSelector(selectCreatePartnershipResponse);
  const [initialValues, setInitialValues] = useState<PartnershipInfoValues>();
  const [companyId, setCompanyId] = useState('');
  const [partnerInfoId, setPartnerInfoId] = useState('');
  const [partnershipIds, setPartnershipIds] = useState<Ids>();
  const [loading, setLoading] = useState(false);
  const [whitelistedDomainsTouched, setWhitelistedDomainsTouched] =
    useState(false);
  const [loginError, setLoginError] = useState('');
  const [isFormEdited, setIsFormEdited] = useState(false);
  const [showCloseWarning, setShowCloseWarning] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const formikForm = useRef<FormikProps<PartnershipInfoValues>>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [selectedFile, setSelectedFile] = React.useState();
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    dispatch(
      setErrMsg({
        errorMsg: '',
        validationErrField: '',
        timeStamp: Date.now(),
      })
    );
    setLoading(true);
    if (isUpdate) {
      getRequest(`partnership/?partnership_id=${partnershipId}`, {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      }).then((resp: any) => {
        if (resp.result === true) {
          if (resp.data.company_information) {
            setCompanyId(resp.data.company_information.company_information_id);
          }

          if (resp.data.partner_company_information) {
            setPartnerInfoId(
              resp.data.partner_company_information
                .partner_company_information_id
            );
          }
          setInitialValues({
            partnershipName: resp.data.partnership_name,
            websiteSubDomain: resp.data.content_hub_subdomain_name,
            whitelistedDomains: resp.data.whitelisted_domains,
            favIcon: resp.data.favicon_name,
            favIconImg: `${resp.data.favicon}?time=${new Date().getTime()}`,
          });
          setIsFormEdited(true);
        } else {
          console.log(resp.data, 'error');
        }
        setLoading(false);
      });
    } else {
      setInitialValues({
        partnershipName: '',
        websiteSubDomain: '',
        whitelistedDomains: [],
        favIcon: '',
        favIconImg: '',
      });
      setLoading(false);
      setShowPreview(false);
    }
    setLoginError('');

    return () => {
      dispatch(
        setIsCreatePartnershipFormEdited({
          isCreatePartnershipFormEdited: false,
        })
      );
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoginError(''), 10000);
    setLoginError(partnershipResponseData.errorMsg);
    return () => clearTimeout(timer);
  }, [partnershipResponseData]);
  const dispatch = useDispatch();

  const PartnerShipInfoSchema = Yup.object().shape({
    partnershipName: Yup.string()
      .trim()
      .min(3, 'Minimum 3 characters is required')
      .required(errorMessageLabels.partnershipName),
    websiteSubDomain: Yup.string()
      .trim()
      .min(3, 'Minimum 3 characters is required')
      .matches(
        /^[a-zA-Z]+[a-zA-Z\d\-]+[a-zA-Z\d]$/,
        'Enter a valid subdomain name'
      )
      .required(errorMessageLabels.subDomain),
    favIcon: Yup.string().required('fav icon image is required'),
  });

  const handleAddChip = (chip) => {
    formikForm?.current?.setFieldValue('whitelistedDomains', [
      ...formikForm?.current?.values?.whitelistedDomains,
      chip,
    ]);
  };

  const handleDeleteChip = (chip) => {
    const newWhitelistedDomains =
      formikForm?.current?.values?.whitelistedDomains.filter(
        (item) => item !== chip
      );
    formikForm?.current?.setFieldValue(
      'whitelistedDomains',
      newWhitelistedDomains
    );
    // setFieldValue('whitelistedDomain', newWhitelistedDomains);
    if (newWhitelistedDomains.length === 0) {
      setWhitelistedDomainsTouched(true);
    }
  };

  const onFileSelected = (event: any) => {
    const file = event.target.files[0];
    console.log('filename', file.File);
    fileInput.current.value = '';
    if (
      file &&
      file.name &&
      formikForm &&
      formikForm.current &&
      file.type.includes('image/')
    ) {
      setSelectedFile(file);
      setShowPreview(true);
      const fileName = file.name as string;
      formikForm?.current?.setFieldValue('favIcon', fileName);
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = function (e) {
        formikForm?.current?.setFieldValue(
          'favIconImg',
          e.target.result.toString()
        );
      };
    }
  };

  const OnImageCancel = () => {
    formikForm?.current?.setFieldValue('favIcon', '');
    formikForm?.current?.setFieldValue('favIconImg', '');
    setShowPreview(false);
  };

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

  // useEffect(() => {
  //   if (
  //     isFormEdited &&
  //     formikForm?.current?.values?.whitelistedDomains?.length === 0
  //   ) {
  //     setIsFormEdited(false);
  //   }
  // }, [initialValues]);

  return (
    <div className="create-partnership-main-container">
      <Box sx={{ width: '75%' }}>
        <Stepper activeStep={0} alternativeLabel>
          {steps.map((label: string) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      <div className="create-partnership-info-title">
        {CreatePartnershipLabels.partnershipInfoTitle}{' '}
      </div>{' '}
      {initialValues && (
        <Formik
          innerRef={formikForm}
          enableReinitialize
          initialValues={initialValues}
          validationSchema={PartnerShipInfoSchema}
          validate={() => ({})}
          onSubmit={(values) => {
            if (formikForm?.current?.values?.whitelistedDomains.length === 0) {
              setWhitelistedDomainsTouched(true);
            } else {
              setLoading(true);
              dispatch(
                PartnershipInfoAction(
                  {
                    ...values,
                    whitelistedDomains:
                      formikForm?.current?.values?.whitelistedDomains,
                  },
                  history,
                  isUpdate,
                  partnershipId,
                  companyId,
                  partnerInfoId,
                  selectedFile,
                  () => setLoading(false)
                )
              );
            }
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
                onSubmit={(e) => {
                  e.preventDefault();
                  if (
                    formikForm?.current?.values?.whitelistedDomains.length === 0
                  ) {
                    setWhitelistedDomainsTouched(true);
                  }
                  handleSubmit(e);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                  }
                }}
                // onSubmit={handleSubmit}
              >
                <div className="create-partnership-info-form">
                  <div className="create-partnership-info-field">
                    <div className="create-partnership-label">
                      {CreatePartnershipLabels.partnershipName}
                    </div>
                    <div style={{ marginLeft: '25px' }}>
                      <Field
                        type="text"
                        name="partnershipName"
                        value={values.partnershipName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={CreatePartnershipLabels.partnershipName}
                        hasError={
                          errors.partnershipName && touched.partnershipName
                        }
                        errorMessage={errors.partnershipName}
                        component={GenTextField}
                        classes={classes}
                      />
                      <RenderErrorMessage name="partnershipName" />
                    </div>
                  </div>
                  <div className="create-partnership-info-field">
                    <div className="create-partnership-label create-partnership-info-field-subdomain">
                      {CreatePartnershipLabels.websiteSubDomainName}
                    </div>
                    <div>
                      <div className="domainEndPointWrap">
                        <Field
                          type="text"
                          name="websiteSubDomain"
                          value={values.websiteSubDomain}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder={
                            CreatePartnershipLabels.websiteSubDomainNameLabel
                          }
                          hasError={
                            errors.websiteSubDomain && touched.websiteSubDomain
                          }
                          errorMessage={
                            partnershipResponseData.validationErrField ===
                            'content_hub_subdomain_name'
                              ? partnershipResponseData.errorMsg
                              : errors.websiteSubDomain
                          }
                          component={GenTextField}
                          classes={classes}
                        />
                        <div className="partnerDomainEndPoint">
                          {CreatePartnershipLabels.domainEndPoint}
                        </div>
                      </div>
                      {loginError !== '' &&
                      partnershipResponseData.validationErrField ===
                        'content_hub_subdomain_name' ? (
                        <div
                          style={{
                            color: 'red',
                            fontWeight: '500',
                            fontSize: '12px',
                            padding: '5px 0',
                            maxWidth: '270px',
                          }}
                        >
                          {loginError}
                        </div>
                      ) : (
                        <RenderErrorMessage name="websiteSubDomain" />
                      )}
                    </div>
                  </div>
                  <div className="create-partnership-info-field whitelistDominWrap">
                    <div className="create-partnership-label create-partnership-whitelisted-label">
                      {CreatePartnershipLabels.whitelistedDomainLabel}
                    </div>
                    <div
                      style={{
                        marginLeft: '25px',
                        minWidth: '270px',
                        width: '270px',
                      }}
                      className="wsTagsWrap"
                    >
                      <ChipInput
                        value={values.whitelistedDomains}
                        onAdd={(chip) => handleAddChip(chip)}
                        onDelete={(chip) => handleDeleteChip(chip)}
                        variant="outlined"
                        blurBehavior="add"
                        // placeholder="Press enter to add domain names"
                        // style={{ width: '100%' }}
                        onBlur={() => setWhitelistedDomainsTouched(true)}
                        onChangeCapture={() =>
                          setWhitelistedDomainsTouched(false)
                        }
                        error={
                          whitelistedDomainsTouched &&
                          formikForm?.current?.values?.whitelistedDomains
                            .length === 0
                        }
                        placeholder={
                          formikForm?.current?.values?.whitelistedDomains
                            .length === 0
                            ? CreatePartnershipLabels.whitelistedDomainLabel
                            : ''
                        }
                        helperText={
                          loginError === '' &&
                          whitelistedDomainsTouched &&
                          formikForm?.current?.values?.whitelistedDomains
                            .length === 0
                            ? errorMessageLabels.whitelistedDomains
                            : loginError !== '' &&
                              partnershipResponseData.validationErrField ===
                                'whitelisted_domains'
                            ? ''
                            : 'Press enter to add domain names'
                        }
                      />
                      {loginError !== '' &&
                        partnershipResponseData.validationErrField ===
                          'whitelisted_domains' && (
                          <div
                            style={{
                              color: 'red',
                              fontSize: '12px',
                              fontWeight: '500',
                              padding: '5px 0',
                            }}
                          >
                            {loginError}
                          </div>
                        )}
                    </div>
                  </div>
                  <div className="create-partnership-info-field">
                    <div className="create-partnership-label">
                      {CreatePartnershipLabels.favicon}
                    </div>
                    <div style={{ marginLeft: '25px' }}>
                      <div>
                        <Field
                          name="favIcon"
                          component={GenTextField}
                          classes={classes}
                          type="file"
                          value={values.favIcon}
                          // onChange={handleChange}
                          // onBlur={handleBlur}
                          hasError={errors.favIcon && touched.favIcon}
                          errorMessage={errors.favIcon}
                          placeholder={CreatePartnershipLabels.favicon}
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
                                      onFileSelected(e);
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
                        {showPreview ? (
                          <div className="favIconImgDiv">
                            <img
                              className="favIconImg"
                              src={values.favIconImg}
                              alt="favIconImg"
                            />
                            <IconButton className="closeicon">
                              <CloseIcon
                                onClick={() => {
                                  OnImageCancel();
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
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                      <RenderErrorMessage name="favIcon" />
                    </div>
                  </div>
                  <div className="create-partnership-info-button-container">
                    <SecondaryButton
                      style={{ minWidth: '160px', marginRight: '30px' }}
                      onClick={() => {
                        if (dirty || isFormEdited) setShowCloseWarning(true);
                        else history.push('/accountSetup');
                      }}
                    >
                      {ButtonLabels.cancel}
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
              setIsFormEdited(false);
              setShowCloseWarning(false);
              partnershipResponseData.showCreatePartnershipWarningEditor.navigateAction();
              return;
            }
            history.push('/accountSetup');
            setIsFormEdited(false);
          }}
          show
        />
      )}
      {loading === true && <Loader />}
    </div>
  );
};

export default PartnerShipInfo;
