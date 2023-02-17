/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable linebreak-style */
/* eslint-disable operator-linebreak */
import React, { useEffect, useState, useRef } from 'react';
import {
  createAccount,
  createAccountDropdown,
  previewImageLables,
} from 'src/strings';
import DownArrow from 'src/app/components/Icons/PreviewPartnership/DownArrow.svg';
import uploadIcon from 'src/app/assets/upload-logo.svg';
import {
  TableBody,
  Checkbox,
  styled,
  TableCell,
  IconButton,
  InputAdornment,
} from '@material-ui/core';
import { tableCellClasses } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Table from '@mui/material/Table';
import Input from '@material-ui/core/Input';
import { Field, FastField, Form } from 'formik';
import { useSelector } from 'react-redux';
import PreviewImage from 'src/app/components/PreviewImage/PreviewImage';
import CroppedImage from 'src/app/components/CroppedImage/CroppedImage';
import { GenTextField, RenderErrorMessage } from '../../Form';
import styles from '../CreateAccount/CreateAccount.module.css';
import { salesHubAccountResponse, setCtaErrMsg } from '../../SalesHubSiteSlice';
import { useStyles } from '../../Styles';

const CtaLayout = (props: any) => {
  const classes = useStyles();
  const {
    formikValues,
    errors,
    touched,
    handleBlur,
    handleChange,
    onFileSelected,
    ctaImage,
    showCta,
    setShowCta,
    OnImageCancel,
    setPreviewImage,
    setLoader,
    clearLoader,
    keyNamesList,
    staticFormData,
    handleFormChange,
    leadselected,
    handleCheckboxClick,
    handleAllCheckBoxSelect,
    showFieldError,
    noStaticFormError,
  } = props;
  const [ctaErr, setCtaErr] = useState('');
  const salesHubSiteRespData = useSelector(salesHubAccountResponse);
  const [showCropImage, setShowCropImage] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const fileInputHeaderImg = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const timer = setTimeout(() => setCtaErr(''), 15000);
    setCtaErr(salesHubSiteRespData.ctaErrMsg);
    return () => clearTimeout(timer);
  }, [salesHubSiteRespData]);
  useEffect(() => {
    setCtaErrMsg({
      ctaErrMsg: '',
      ctaValidationField: '',
    });
    setCtaErr('')
  }, []);

  return (
    <>
      <div
        className={`${styles.salesHubAccDropDown} ${
          !showCta ? styles.salesHubAccDropDownGap : ''
        }`}
        onClickCapture={() => setShowCta(!showCta)}
      >
        {createAccountDropdown.cta}
        <IconButton>
          <img
            className={styles.salesHubAccDownArrowImg}
            src={DownArrow}
            alt=""
          />
        </IconButton>
      </div>
      {showCta ? (
        <>
          <div
            className={`${styles.salesHubAccFormWrap} ${styles.salesHubSectionFormWrap}`}
          >
            <div
              className={`${styles.salesHubAccFieldWrap} ${styles.fullField}`}
            >
              <div className={styles.salesHubAccFieldWrap}>
                {' '}
                <div className={styles.salesHubAccLabel}>
                  {createAccount.ctaName}
                </div>
                <div className={`${styles.salesHubAccField}`}>
                  <Field
                    type="text"
                    name="ctaName"
                    value={formikValues.ctaName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={createAccount.ctaName}
                    hasError={errors.ctaName && touched.ctaName}
                    errorMessage={errors.ctaName}
                    component={GenTextField}
                    classes={classes}
                    disabled={
                      formikValues.salesMotion === '' ||
                      formikValues.salesMotion === undefined
                    }
                  />
                  {ctaErr !== '' &&
                  salesHubSiteRespData.ctaValidationField === 'cta_name' ? (
                    <div
                      style={{
                        color: 'red',
                        fontSize: '12px',
                        fontWeight: '500',
                        padding: '5px 0px',
                      }}
                    >
                      {ctaErr}
                    </div>
                  ) : (
                    <RenderErrorMessage name="ctaName" />
                  )}
                </div>
              </div>
            </div>

            <div className={styles.salesHubAccFieldWrap}>
              <div className={styles.salesHubAccLabel}>
                {createAccount.headerText}
              </div>
              <div
                className={`${styles.salesHubAccField} ${styles.salesHubAccFieldTxtArea} textArea`}
              >
                <Field
                  type="text"
                  name="ctaHeaderTxt"
                  value={formikValues.ctaHeaderTxt}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  hasError={errors.ctaHeaderTxt && touched.ctaHeaderTxt}
                  errorMessage={errors.ctaHeaderTxt}
                  component={GenTextField}
                  classes={classes}
                  multiline
                  placeholder={createAccount.headerText}
                  disabled={
                    formikValues.salesMotion === '' ||
                    formikValues.salesMotion === undefined
                  }
                />
                <RenderErrorMessage name="ctaHeaderTxt" />
              </div>
            </div>

            <div className={styles.salesHubAccFieldWrap}>
              <div className={styles.salesHubAccLabel}>
                {createAccount.subHeaderText}
              </div>
              <div
                className={`${styles.salesHubAccField} ${styles.salesHubAccFieldTxtArea} textArea`}
              >
                <Field
                  type="text"
                  name="ctaSubHeaderTxt"
                  value={formikValues.ctaSubHeaderTxt}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  hasError={errors.ctaSubHeaderTxt && touched.ctaSubHeaderTxt}
                  errorMessage={errors.ctaSubHeaderTxt}
                  component={GenTextField}
                  classes={classes}
                  multiline
                  placeholder={createAccount.subHeaderText}
                  disabled={
                    formikValues.salesMotion === '' ||
                    formikValues.salesMotion === undefined
                  }
                />
                <RenderErrorMessage name="ctaSubHeaderTxt" />
              </div>
            </div>
            <div className={styles.salesHubAccFieldWrap}>
              <div className={styles.salesHubAccLabel}>
                {createAccount.ctaDescription}
              </div>
              <div
                className={`${styles.salesHubAccField} ${styles.salesHubAccFieldTxtArea} textArea`}
              >
                <Field
                  type="text"
                  name="ctaDescription"
                  value={formikValues.ctaDescription}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  hasError={errors.ctaDescription && touched.ctaDescription}
                  errorMessage={errors.ctaDescription}
                  component={GenTextField}
                  classes={classes}
                  multiline
                  placeholder={createAccount.ctaDescription}
                  disabled={
                    formikValues.salesMotion === '' ||
                    formikValues.salesMotion === undefined
                  }
                />
                <RenderErrorMessage name="ctaDescription" />
              </div>
            </div>
            <div className={styles.salesHubAccFieldWrap}>
              <div className={styles.salesHubAccLabel}>
                {createAccount.ctaImage}
              </div>
              <div className={`${styles.salesHubAccField} disabledFile`}>
                <Field
                  type="file"
                  name="ctaImage"
                  value={formikValues.ctaImage}
                  readOnly
                  disabled
                  hasError={errors.ctaImage && touched.ctaImage}
                  errorMessage={errors.ctaImage}
                  placeholder={createAccount.ctaImage}
                  component={GenTextField}
                  classes={classes}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={(e) => {
                            if (
                              fileInputHeaderImg &&
                              fileInputHeaderImg.current
                            ) {
                              fileInputHeaderImg.current.click();
                            }
                          }}
                        >
                          <input
                            accept="image/*"
                            ref={fileInputHeaderImg}
                            type="file"
                            style={{ display: 'none' }}
                            onChange={(e: any) => onFileSelected(e, 'ctaImage')}
                            disabled={
                              formikValues.salesMotion === '' ||
                              formikValues.salesMotion === undefined
                            }
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
                  Recommended size 500 x 300 px
                </div>
                <RenderErrorMessage name="ctaImage" />
                {ctaImage && (
                  <PreviewImage
                    showCrop
                    id="ctaImage"
                    classes={styles.thumbnailImg}
                    src={
                      ctaImage?.cropped
                        ? ctaImage?.croppedSource
                        : ctaImage?.source
                    }
                    show={ctaImage.source && ctaImage.name}
                    alt="ctaImage"
                    CustomStyles={{}}
                    CloseHandler={() => {
                      fileInputHeaderImg.current.value = '';
                      OnImageCancel('ctaImage');
                    }}
                    CropHandler={() => setShowCropImage(true)}
                    UndoHandler={() =>
                      setPreviewImage({
                        type: 'CLEAR_CROPPED_IMAGE',
                        payload: {
                          key: previewImageLables.ctaImage,
                        },
                      })
                    }
                  />
                )}
              </div>
            </div>
            <div className={styles.salesHubAccFieldWrap}>
              <div className={styles.salesHubAccLabel}>
                {createAccount.ctaStaticForm}
              </div>
              <div className={`${styles.salesHubAccField} `}>
                <div
                  className={`${styles.salesHubAccCheckbox} salesHubAccCheckbox`}
                >
                  <Checkbox
                    name="staticFormShow"
                    onChange={handleChange}
                    disabled={
                      formikValues.salesMotion === '' ||
                      formikValues.salesMotion === undefined
                    }
                    checked={formikValues.staticFormShow}
                  />
                </div>
              </div>
            </div>

            {formikValues.staticFormShow ? (
              <>
                <div className={`${styles.salesHubAccFieldWrap}`}>
                  <div
                    className={`${styles.salesHubAccFieldWrap} salesHubAccSectionFieldWrap`}
                  >
                    <div className={styles.salesHubAccLabel}>
                      {createAccount.ctaFormHeader}
                    </div>
                    <div className={styles.salesHubAccField}>
                      <Field
                        type="text"
                        name="ctaFormHeader"
                        placeholder={createAccount.ctaFormHeader}
                        component={GenTextField}
                        classes={classes}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        disabled={
                          formikValues.salesMotion === '' ||
                          formikValues.salesMotion === undefined
                        }
                        value={formikValues.ctaFormHeader}
                        errorMessage={errors.ctaFormHeader}
                        hasError={errors.ctaFormHeader && touched.ctaFormHeader}
                      />
                      {ctaErr !== '' &&
                      salesHubSiteRespData.ctaValidationField ===
                        'cta_form_hearder' ? (
                        <div
                          style={{
                            color: 'red',
                            fontSize: '12px',
                            fontWeight: '500',
                            padding: '5px 0',
                          }}
                        >
                          {ctaErr}
                        </div>
                      ) : (
                        <RenderErrorMessage name="ctaFormHeader" />
                      )}
                    </div>
                  </div>
                </div>
                <div className={styles.salesHubAccFieldWrap}>
                  <div className={`${styles.staticFormTableWrap}`}>
                    <table className={styles.staticFormTable}>
                      <thead>
                        <tr className={styles.staticFormTableRow}>
                          <th>
                            <div
                              className={`${styles.salesHubAccCheckbox} salesHubAccCheckbox`}
                            >
                              <Checkbox
                                checked={
                                  keyNamesList?.length > 0 &&
                                  keyNamesList?.length ===
                                    keyNamesList.filter((s: any) =>
                                      leadselected.includes(s.lead_master_id)
                                    ).length
                                }
                                onClick={(e) => handleAllCheckBoxSelect(e)}
                              />
                            </div>
                          </th>
                          <th className={styles.staticFormHeader}>
                            {createAccount.ctaKeyName}
                          </th>
                          <th className={styles.staticFormHeader}>
                            {createAccount.ctaDisplayName}
                          </th>
                        </tr>
                      </thead>
                      {keyNamesList &&
                        keyNamesList?.map((key, index) => (
                          <tr className={styles.staticFormTableRow}>
                            <td>
                              <div
                                className={`${styles.salesHubAccCheckbox} salesHubAccCheckbox`}
                              >
                                <Checkbox
                                  checked={
                                    leadselected.length > 0
                                      ? leadselected.includes(
                                          key.lead_master_id
                                        )
                                      : false
                                  }
                                  onClick={(e) =>
                                    handleCheckboxClick(e, key.lead_master_id)
                                  }
                                />
                              </div>
                            </td>
                            <td className={styles.staticFormText}>
                              {key.key_name}
                            </td>
                            <td>
                              {(keyNamesList?.length > 0 &&
                                keyNamesList?.length ===
                                  keyNamesList.filter((s: any) =>
                                    leadselected.includes(s.lead_master_id)
                                  ).length) ||
                              leadselected.includes(key.lead_master_id) ? (
                                <input
                                  type="text"
                                  name={key.key_name}
                                  className={styles.formFieldinput}
                                  placeholder={key.key_name}
                                  onChange={handleFormChange}
                                  value={
                                    `${staticFormData[key.key_name]}` ===
                                    'undefined'
                                      ? ''
                                      : `${staticFormData[key.key_name]}`
                                  }
                                />
                              ) : (
                                <input
                                  type="text"
                                  name={key.key_name}
                                  placeholder={key.key_name}
                                  className={styles.formFieldinputDisabled}
                                  onChange={handleFormChange}
                                  value={
                                    `${staticFormData[key.key_name]}` ===
                                    'undefined'
                                      ? ''
                                      : `${staticFormData[key.key_name]}`
                                  }
                                  disabled={disabled}
                                />
                              )}
                            </td>
                          </tr>
                        ))}
                    </table>
                    {showFieldError || noStaticFormError ? (
                      <div
                        style={{
                          color: 'red',
                          fontSize: '12px',
                          fontWeight: '500',
                          padding: '5px 0px',
                          marginLeft: '44%',
                        }}
                      >
                        {showFieldError
                          ? 'Please enter the value'
                          : 'Select at least 1 field'}
                      </div>
                    ) : null}
                  </div>
                </div>
              </>
            ) : (
              <div className={styles.salesHubAccFieldWrap}>
                <div className={styles.salesHubAccLabel}>
                  {createAccount.embeddedCode}
                </div>
                <div
                  className={`${styles.salesHubAccField} salesMotionTextArea`}
                >
                  <Field
                    type="text"
                    name="ctaEmbeddedCode"
                    placeholder={createAccount.embeddedCode}
                    component={GenTextField}
                    classes={classes}
                    disabled={
                      formikValues.salesMotion === '' ||
                      formikValues.salesMotion === undefined
                    }
                    onBlur={handleBlur}
                    onChange={handleChange}
                    multiline
                    value={formikValues.ctaEmbeddedCode}
                    hasError={errors.ctaEmbeddedCode && touched.ctaEmbeddedCode}
                    errorMessage={errors.ctaEmbeddedCode}
                  />
                  <RenderErrorMessage name="ctaEmbeddedCode" />
                </div>
              </div>
            )}
          </div>
        </>
      ) : null}
      {showCropImage && (
        <CroppedImage
          previewImage={ctaImage}
          previewImageLable={previewImageLables.ctaImage}
          setLoader={setLoader}
          clearLoader={clearLoader}
          setPreviewImage={setPreviewImage}
          setShowCropImage={() => setShowCropImage(false)}
        />
      )}
    </>
  );
};
export default CtaLayout;
