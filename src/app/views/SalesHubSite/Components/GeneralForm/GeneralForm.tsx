/* eslint-disable comma-dangle */
/* eslint-disable linebreak-style */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable operator-linebreak */
/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
/* eslint-disable linebreak-style */
import React, { useEffect, useState } from 'react';
import {
  IconButton,
  InputAdornment,
  Select,
  MenuItem,
} from '@material-ui/core';
import { Field } from 'formik';
import DownArrow from 'src/app/components/Icons/PreviewPartnership/DownArrow.svg';
import uploadIcon from 'src/app/assets/upload-logo.svg';
import { useDispatch, useSelector } from 'react-redux';
import PreviewImage from 'src/app/components/PreviewImage/PreviewImage';
import { RenderCheckbox } from 'src/app/components/Form';
import TagsInput from 'src/app/components/TagsInput';
import CroppedImage from 'src/app/components/CroppedImage/CroppedImage';
import {
  createAccount,
  createAccountDropdown,
  previewImageLables,
} from '../../../../../strings';
import { RenderErrorMessage, RenderTextField, GenTextField } from '../../Form';
import {
  salesHubAccountResponse,
  setGeneralErrMsg,
} from '../../SalesHubSiteSlice';
import styles from '../CreateAccount/CreateAccount.module.css';
import '../CreateAccount/CreateAccount.css';
import { useStyles } from '../../Styles';

const GeneralForm = (props: any) => {
  const classes = useStyles();
  const [generalErr, setGeneralErr] = useState('');

  const {
    formikValues,
    errors,
    touched,
    handleBlur,
    handleChange,
    accountTypeList,
    candenceList,
    onFileSelected,
    companyLogo,
    showGeneral,
    setShowGeneral,
    statusShow,
    statusChosen,
    setStatusChosen,
    statusList,
    OnImageCancel,
    validateField,
    servicePartnerLogo,
    prevDomainName,
    setFormEdited,
    setFieldValue,
    setPreviewImage,
    setLoader,
    clearLoader,
  } = props;
  const fileInput = React.useRef<HTMLInputElement>(null);
  const servicePartnerInput = React.useRef<HTMLInputElement>(null);
  const [showCropImage, setShowCropImage] = React.useState({
    companyLogo: false,
    servicePartnerLogo: false,
  });
  const salesHubSiteRespData = useSelector(salesHubAccountResponse);
  const queryparams = new URLSearchParams(window.location.search);
  const salesHubAccountId: string =
    queryparams.get('sales_hub_account_id') || '0';
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
  useEffect(() => {
    dispatch(
      setGeneralErrMsg({
        generalErrMsg: '',
        generalValidationField: '',
      })
    );
  }, []);
  return (
    <>
      <div
        className={`${styles.salesHubAccDropDown} ${
          !showGeneral ? styles.salesHubAccDropDownGap : ''
        }`}
        onClickCapture={() => setShowGeneral(!showGeneral)}
      >
        {createAccountDropdown.general}
        <IconButton>
          <img
            className={styles.salesHubAccDownArrowImg}
            src={DownArrow}
            alt=""
          />
        </IconButton>
      </div>
      {showGeneral ? (
        <>
          <div
            className={`${styles.salesHubAccFormWrap} ${styles.salesHubSectionFormWrap}`}
          >
            <div className={styles.salesHubAccFieldWrap}>
              <div className={styles.salesHubAccLabel}>
                {createAccount.companyName}
              </div>
              <div className={styles.salesHubAccField}>
                <Field
                  type="text"
                  name="companyName"
                  value={formikValues.companyName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={createAccount.companyName}
                  hasError={errors.companyName && touched.companyName}
                  errorMessage={errors.companyName}
                  component={RenderTextField}
                  classes={classes}
                />
                {generalErr !== '' &&
                salesHubSiteRespData.generalValidationField ===
                  'company_name' ? (
                  <div
                    style={{
                      color: 'red',
                      fontSize: '12px',
                      fontWeight: '500',
                      padding: '5px 0',
                    }}
                  >
                    {generalErr}
                  </div>
                ) : (
                  <RenderErrorMessage name="companyName" />
                )}
              </div>
            </div>

            <div className={styles.salesHubAccFieldWrap}>
              <div className={styles.salesHubAccLabel}>
                {createAccount.companyLogo}
              </div>
              <div className={`${styles.salesHubAccField} disabledFile`}>
                <Field
                  type="file"
                  name="companyLogo"
                  readOnly
                  disabled
                  hasError={errors.companyLogo && touched.companyLogo}
                  errorMessage={errors.companyLogo}
                  placeholder={createAccount.companyLogo}
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
                              onFileSelected(e, 'companyLogo');
                              validateField('companyLogo');
                              setFormEdited(true);
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
                  Recommended size 450 x 300 px
                </div>
                <RenderErrorMessage name="companyLogo" />
                {companyLogo && (
                  <PreviewImage
                    showCrop
                    id="headerImg"
                    classes={styles.thumbnailImg}
                    src={
                      companyLogo?.cropped
                        ? companyLogo?.croppedSource
                        : companyLogo?.source
                    }
                    show={companyLogo.name && companyLogo.source}
                    alt="companyLogo"
                    CustomStyles={{}}
                    CloseHandler={() => {
                      fileInput.current.value = '';
                      OnImageCancel('companyLogo');
                    }}
                    CropHandler={() =>
                      setShowCropImage({
                        companyLogo: true,
                        servicePartnerLogo: false,
                      })
                    }
                    UndoHandler={() =>
                      setPreviewImage({
                        type: 'CLEAR_CROPPED_IMAGE',
                        payload: {
                          key: previewImageLables.companyLogo,
                        },
                      })
                    }
                  />
                )}
              </div>
            </div>

            <div className={styles.salesHubAccFieldWrap}>
              <div className={styles.salesHubAccLabel}>
                {createAccount.companyWebsite}
              </div>
              <div className={styles.salesHubAccField}>
                <Field
                  type="text"
                  name="companyWebsite"
                  value={formikValues.companyWebsite}
                  onChange={salesHubAccountId === '0' && handleChange}
                  onBlur={salesHubAccountId === '0' && handleBlur}
                  placeholder={createAccount.companyWebsite}
                  className="Mui-disabled fieldDisabled"
                  hasError={errors.companyWebsite && touched.companyWebsite}
                  errorMessage={errors.companyWebsite}
                  classes={classes}
                  component={GenTextField}
                />
                {generalErr !== '' &&
                salesHubSiteRespData.generalValidationField ===
                  'companyWebsite' ? (
                  <div
                    style={{
                      color: 'red',
                      fontSize: '12px',
                      fontWeight: '500',
                      padding: '5px 0',
                    }}
                  >
                    {generalErr}
                  </div>
                ) : (
                  <RenderErrorMessage name="companyWebsite" />
                )}
              </div>
            </div>

            <div className={styles.salesHubAccFieldWrap}>
              <div className={styles.salesHubAccLabel}>
                {createAccount.accountType}
              </div>
              <div className={`${styles.salesHubAccField} salesHubAccSelect`}>
                <Select
                  style={{ width: '100%' }}
                  name="accountType"
                  value={formikValues.accountType}
                  displayEmpty
                  renderValue={
                    formikValues.accountType !== ''
                      ? undefined
                      : () => (
                          <span className="salesHubAccSelectName">
                            {' '}
                            {createAccount.accountType}
                          </span>
                        )
                  }
                  onChange={(e, data) => {
                    handleChange(e, data);
                  }}
                  onBlur={handleBlur}
                  className={styles.uploadAssetSelect}
                  inputProps={{ 'aria-label': 'Without label' }}
                >
                  {accountTypeList &&
                    accountTypeList.map((list: any) => (
                      <MenuItem
                        value={list.account_type_id}
                        key={list.account_type_id}
                      >
                        {list.name}
                      </MenuItem>
                    ))}
                </Select>
                <RenderErrorMessage name="accountType" />
              </div>
            </div>

            <div className={styles.salesHubAccFieldWrap}>
              <div className={styles.salesHubAccLabel}>
                {createAccount.industry}
              </div>
              <div className={styles.salesHubAccField}>
                <Field
                  type="text"
                  name="industry"
                  value={formikValues.industry}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={createAccount.industry}
                  hasError={errors.industry && touched.industry}
                  errorMessage={errors.industry}
                  component={RenderTextField}
                  classes={classes}
                />
                <RenderErrorMessage name="industry" />
              </div>
            </div>

            <div className={styles.salesHubAccFieldWrap}>
              <div
                className={`${styles.salesHubAccLabel} ${styles.salesHubAccTBLabel}`}
              >
                {createAccount.targetBuyerTitles}
              </div>
              <div
                className={`${styles.salesHubAccField} ${styles.tagsTxtArea} textArea`}
              >
                <TagsInput
                  selectedTags={(tags: string) => console.log(tags)}
                  fullWidth
                  selectedChip={formikValues.targetBuyerTitles}
                  className={`${styles.tagInput} tagsField`}
                  variant="outlined"
                  id="targetBuyerTitles"
                  name="targetBuyerTitles"
                  setFieldValue={setFieldValue}
                  placeholder={createAccount.targetBuyerTitles}
                  hasError={
                    errors.targetBuyerTitles && touched.targetBuyerTitles
                  }
                  errorMessage={
                    errors.targetBuyerTitles && touched.targetBuyerTitles
                  }
                  onBlur={(e) => {
                    handleBlur(e, 'targetBuyerTitles');
                  }}
                />
                <small
                  className={`styles.inputHelper ${
                    errors.targetBuyerTitles && touched.targetBuyerTitles
                      ? styles.hidden
                      : ''
                  }`}
                >
                  {createAccount.TargetBuyerHelperText}
                </small>
                <RenderErrorMessage name="targetBuyerTitles" />
              </div>
            </div>
            <div className={styles.salesHubAccFieldWrap}>
              <div className={styles.salesHubAccLabel}>
                {createAccount.domainName}
              </div>
              <div
                className={`${styles.salesHubAccField} ${styles.domainNameField}`}
              >
                <Field
                  type="text"
                  name="domainName"
                  value={formikValues.domainName}
                  onChange={salesHubAccountId === '0' && handleChange}
                  onBlur={salesHubAccountId === '0' && handleBlur}
                  readOnly={salesHubAccountId !== '0'}
                  disabled={salesHubAccountId !== '0'}
                  placeholder={createAccount.domainName}
                  className="Mui-disabled fieldDisabled"
                  hasError={errors.domainName && touched.domainName}
                  errorMessage={errors.domainName}
                  classes={classes}
                  component={GenTextField}
                />

                <div
                  style={{
                    color: 'grey',
                    fontSize: '14px',
                    padding: '5px 16px 0 0',
                    wordBreak: 'break-all',
                  }}
                >
                  {`${
                    prevDomainName || localStorage.getItem('subDomainName')
                  }.lp.partners/${formikValues.domainName}`}
                </div>

                {generalErr !== '' &&
                salesHubSiteRespData.generalValidationField ===
                  'domain_name' ? (
                  <div
                    style={{
                      color: 'red',
                      fontSize: '12px',
                      fontWeight: '500',
                      padding: '5px 0',
                    }}
                  >
                    {generalErr}
                  </div>
                ) : (
                  <RenderErrorMessage name="domainName" />
                )}
              </div>
            </div>

            <div className={styles.salesHubAccFieldWrap}>
              <div className={styles.salesHubAccLabel}>
                {createAccount.teamCadence}
              </div>
              <div className={`${styles.salesHubAccField}`}>
                <div className={`${styles.cadenceWrapper} cadenceWrapper`}>
                  <Field
                    name="cadenceShow"
                    type="checkbox"
                    component={RenderCheckbox}
                    label=""
                    style={{ color: '#707683', fontSize: '14px' }}
                    checked={formikValues.cadenceShow}
                  />
                  {formikValues.cadenceShow ? (
                    <>
                      <div
                        className={`${styles.salesHubAccMiniField} salesHubAccMiniSelect`}
                      >
                        <div className="cadenceInput">
                          <Field
                            type="text"
                            name="candenceValue"
                            value={formikValues.candenceValue}
                            onChange={(e) => {
                              if (e.target.value > 0) {
                                handleChange(e);
                              }
                            }}
                            style={{ padding: '0 5px' }}
                            onBlur={handleBlur}
                            placeholder={createAccount.cadenceId}
                            hasError={
                              errors.candenceValue && touched.candenceValue
                            }
                            errorMessage={errors.candenceValue}
                            component={GenTextField}
                            classes={classes.root}
                          />
                        </div>
                        <div
                          className="cadenceFrequencywrap"
                          style={{ width: '100%' }}
                        >
                          <Select
                            name="candenceFrequency"
                            value={formikValues.candenceFrequency || ''}
                            displayEmpty
                            fullWidth
                            renderValue={
                              formikValues.candenceFrequency !== '' &&
                              formikValues.candenceFrequency !== null
                                ? undefined
                                : () => (
                                    <span className="salesHubAccSelectName">
                                      {' '}
                                      Frequency
                                    </span>
                                  )
                            }
                            onChange={(e, data) => {
                              handleChange(e, data);
                            }}
                            onBlur={handleBlur}
                            className={styles.uploadAssetSelect}
                            inputProps={{ 'aria-label': 'Without label' }}
                          >
                            {candenceList &&
                              candenceList.map((list: any) => (
                                <MenuItem
                                  value={list.team_checkin_cadence_frequency_id}
                                  key={list.team_checkin_cadence_frequency_id}
                                >
                                  {list.name}
                                </MenuItem>
                              ))}
                          </Select>
                        </div>
                      </div>
                    </>
                  ) : (
                    ''
                  )}
                </div>
                <div className="candenceInputErrorMsg">
                  {errors.candenceValue &&
                  errors.candenceFrequency &&
                  touched.candenceValue &&
                  touched.candenceFrequency ? (
                    <div
                      style={{
                        color: 'red',
                        fontSize: '12px',
                        fontWeight: '500',
                        padding: '5px 0',
                      }}
                    >
                      Candence and Candence frequency are required
                    </div>
                  ) : (
                    <>
                      <RenderErrorMessage name="candenceValue" />
                      <RenderErrorMessage name="candenceFrequency" />
                    </>
                  )}
                </div>
              </div>
            </div>
            <div
              className={`${styles.salesHubAccFieldWrap} ${styles.fullField}`}
            >
              <div className={styles.salesHubAccFieldWrap}>
                <div className={styles.salesHubAccLabel}>
                  {createAccount.servicePartnerInvloved}
                </div>
                <div
                  className={`${styles.salesHubAccField} salesHubAccFieldCheckBox`}
                >
                  <Field
                    name="servicePartnerShow"
                    type="checkbox"
                    component={RenderCheckbox}
                    label=""
                    style={{ color: '#707683', fontSize: '14px' }}
                    checked={formikValues.servicePartnerShow}
                  />
                </div>
              </div>
            </div>
            {formikValues.servicePartnerShow && (
              <>
                <div className={styles.salesHubAccFieldWrap}>
                  <div className={styles.salesHubAccLabel}>
                    {createAccount.servicePartnerName}
                  </div>
                  <div className={styles.salesHubAccField}>
                    <Field
                      type="text"
                      name="servicePartnerName"
                      value={formikValues.servicePartnerName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={createAccount.servicePartnerName}
                      hasError={
                        errors.servicePartnerName && touched.servicePartnerName
                      }
                      errorMessage={errors.servicePartnerName}
                      component={RenderTextField}
                      classes={classes}
                    />
                    {generalErr !== '' &&
                    salesHubSiteRespData.generalValidationField ===
                      'servicePartnerName' ? (
                      <div
                        style={{
                          color: 'red',
                          fontSize: '12px',
                          fontWeight: '500',
                          padding: '5px 0',
                        }}
                      >
                        {generalErr}
                      </div>
                    ) : (
                      <RenderErrorMessage name="servicePartnerName" />
                    )}
                  </div>
                </div>
                <div className={styles.salesHubAccFieldWrap}>
                  <div className={styles.salesHubAccLabel}>
                    {createAccount.servicePartnerLogo}
                  </div>
                  <div className={`${styles.salesHubAccField} disabledFile`}>
                    <Field
                      type="file"
                      name="servicePartnerLogo"
                      readOnly
                      disabled
                      hasError={
                        errors.servicePartnerLogo && touched.servicePartnerLogo
                      }
                      errorMessage={errors.servicePartnerLogo}
                      placeholder={createAccount.servicePartnerLogo}
                      component={GenTextField}
                      classes={classes}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={(e) => {
                                if (
                                  servicePartnerInput &&
                                  servicePartnerInput.current
                                ) {
                                  servicePartnerInput.current.click();
                                }
                              }}
                            >
                              <input
                                accept="image/*"
                                ref={servicePartnerInput}
                                type="file"
                                style={{ display: 'none' }}
                                onChange={(e: any) => {
                                  onFileSelected(e, 'servicePartnerLogo');
                                  validateField('servicePartnerLogo');
                                  setFormEdited(true);
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
                    <RenderErrorMessage name="servicePartnerLogo" />
                    {servicePartnerLogo && (
                      <PreviewImage
                        showCrop
                        id="servicePartnerHeaderImg"
                        classes={styles.thumbnailImg}
                        src={
                          servicePartnerLogo?.cropped
                            ? servicePartnerLogo?.croppedSource
                            : servicePartnerLogo?.source
                        }
                        alt=""
                        show={
                          servicePartnerLogo.name && servicePartnerLogo.source
                        }
                        CustomStyles={{}}
                        CloseHandler={() => {
                          servicePartnerInput.current.value = '';
                          OnImageCancel('servicePartnerLogo');
                        }}
                        CropHandler={() =>
                          setShowCropImage({
                            companyLogo: false,
                            servicePartnerLogo: true,
                          })
                        }
                        UndoHandler={() =>
                          setPreviewImage({
                            type: 'CLEAR_CROPPED_IMAGE',
                            payload: {
                              key: previewImageLables.servicePartnerCompanyLogo,
                            },
                          })
                        }
                      />
                    )}
                  </div>
                </div>
              </>
            )}

            {statusShow && (
              <div className={styles.salesHubAccFieldWrap}>
                <div className={styles.salesHubAccLabel}>
                  {createAccount.status}
                </div>
                <div className={`${styles.salesHubAccField} salesHubAccSelect`}>
                  <Select
                    style={{ width: '100%' }}
                    name="status"
                    value={statusChosen}
                    displayEmpty
                    renderValue={
                      statusChosen !== ''
                        ? undefined
                        : () => (
                            <span className="salesHubAccSelectName">
                              {' '}
                              {createAccount.status}
                            </span>
                          )
                    }
                    onChange={(e, data) => {
                      handleChange(e, data);
                    }}
                    onBlur={handleBlur}
                    className={styles.uploadAssetSelect}
                    inputProps={{ 'aria-label': 'Without label' }}
                  >
                    {statusList &&
                      statusList.map((list: any) => (
                        <MenuItem
                          value={list.id}
                          key={list.key}
                          onClick={() => setStatusChosen(list.id)}
                        >
                          {list.value}
                        </MenuItem>
                      ))}
                  </Select>
                </div>
              </div>
            )}
          </div>
        </>
      ) : null}
      {showCropImage.companyLogo && (
        <CroppedImage
          previewImage={companyLogo}
          previewImageLable={previewImageLables.companyLogo}
          setLoader={setLoader}
          clearLoader={clearLoader}
          setPreviewImage={setPreviewImage}
          setShowCropImage={() =>
            setShowCropImage({ companyLogo: false, servicePartnerLogo: false })
          }
        />
      )}
      {showCropImage.servicePartnerLogo && (
        <CroppedImage
          previewImage={servicePartnerLogo}
          previewImageLable={previewImageLables.servicePartnerCompanyLogo}
          setLoader={setLoader}
          clearLoader={clearLoader}
          setPreviewImage={setPreviewImage}
          setShowCropImage={() =>
            setShowCropImage({ companyLogo: false, servicePartnerLogo: false })
          }
        />
      )}
    </>
  );
};

export default GeneralForm;
