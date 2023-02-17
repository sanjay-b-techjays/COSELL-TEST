/* eslint-disable indent */
/* eslint-disable operator-linebreak */
/* eslint-disable object-curly-newline */
/* eslint-disable linebreak-style */
import React, { useState, useRef, useEffect } from 'react';
import { Field } from 'formik';
import IconButton from '@mui/material/IconButton';
import { InputAdornment } from '@material-ui/core';
import { Checkbox } from '@material-ui/core';
import { previewImageLables, SalesMotionLabels } from 'src/strings';
import { useSelector } from 'react-redux';
import { useStyles } from 'src/app/views/SalesHubSite/Styles';
import PreviewImage from 'src/app/components/PreviewImage/PreviewImage';
import { RenderErrorMessage, GenTextField } from '../../../SalesHubSite/Form';
import uploadIcon from '../../../../assets/upload-logo.svg';
import {
  selectSalesMotionResponse,
  setCtaErrMsg,
} from '../../SalesMotionSlice';
import DownArrow from '../../../../components/Icons/PreviewPartnership/DownArrow.svg';
import styles from '../../SalesMotion.module.css';
import CroppedImage from 'src/app/components/CroppedImage/CroppedImage';

const CTAConfiguration = (props: any) => {
  const classes = useStyles();
  const {
    onChange,
    onBlur,
    sectionValues,
    errors,
    touched,
    onFileSelected,
    ctaThumbnailImage,
    OnImageCancel,
    ctaShow,
    setCtaShow,
    validateField,
    setLoading,
    setPreviewImage,
    keyNamesList,
    setStaticFormShow,
    staticFormShow,
    staticFormData,
    handleFormChange,
    handleCheckboxClick,
    handleAllCheckBoxSelect,
    leadselected,
    showFieldError,
    noStaticFormError,
  } = props;

  const fileInput = useRef<HTMLInputElement>(null);
  const [ctaErr, setCtaErr] = React.useState('');
  const [showCropImage, setShowCropImage] = useState(false);
  const salesMotionRespData = useSelector(selectSalesMotionResponse);
  const [disabled, setDisabled] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setCtaErr(''), 15000);
    setCtaErr(salesMotionRespData.ctaErrMsg);
    return () => clearTimeout(timer);
  }, [salesMotionRespData]);

  useEffect(() => {
    setCtaErrMsg({
      ctaErrMsg: '',
      ctaValidationField: '',
    });
    setCtaErr('');
  }, []);
  return (
    <div className={styles.generalFromMainDiv}>
      <div
        className={styles.salesMotionDropDownButton}
        onClickCapture={() => setCtaShow(!ctaShow)}
      >
        CTA configuration
        <IconButton>
          <img src={DownArrow} alt="" />
        </IconButton>
      </div>
      {ctaShow ? (
        <div className={styles.salesMotionFormWrap}>
          <div className={styles.salesMotionFieldWrap}>
            <div className={styles.salesMotionLabel}>
              {SalesMotionLabels.ctaName}
            </div>
            <div className={styles.salesMotionField}>
              <Field
                type="text"
                name="ctaName"
                placeholder={SalesMotionLabels.ctaName}
                component={GenTextField}
                classes={classes}
                onChange={onChange}
                onBlur={onBlur}
                value={sectionValues.ctaName}
                errorMessage={errors.ctaName}
                hasError={errors.ctaName && touched.ctaName}
              />
              {ctaErr !== '' &&
              salesMotionRespData.ctaValidationField === 'cta_name' ? (
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
                <RenderErrorMessage name="ctaName" />
              )}
            </div>
          </div>

          <div className={styles.salesMotionFieldWrap}>
            <div className={styles.salesMotionLabel}>
              {SalesMotionLabels.headerTxt}
            </div>
            <div className={`${styles.salesMotionField} salesMotionTextArea`}>
              <Field
                type="text"
                name="ctaHeaderText"
                placeholder={SalesMotionLabels.headerTxt}
                component={GenTextField}
                classes={classes}
                onChange={onChange}
                onBlur={onBlur}
                multiline
                value={sectionValues.ctaHeaderText}
                errorMessage={errors.ctaHeaderText}
                hasError={errors.ctaHeaderText && touched.ctaHeaderText}
              />
              <RenderErrorMessage name="ctaHeaderText" />
            </div>
          </div>

          <div className={styles.salesMotionFieldWrap}>
            <div className={styles.salesMotionLabel}>
              {SalesMotionLabels.subHeaderTxt}
            </div>
            <div className={`${styles.salesMotionField} salesMotionTextArea`}>
              <Field
                type="text"
                name="ctaSubHeaderText"
                placeholder={SalesMotionLabels.subHeaderTxt}
                component={GenTextField}
                classes={classes}
                onChange={onChange}
                onBlur={onBlur}
                multiline
                value={sectionValues.ctaSubHeaderText}
                hasError={errors.ctaSubHeaderText && touched.ctaSubHeaderText}
                errorMessage={errors.ctaSubHeaderText}
              />
              <RenderErrorMessage name="ctaSubHeaderText" />
            </div>
          </div>
          <div className={styles.salesMotionFieldWrap}>
            <div className={styles.salesMotionLabel}>
              {SalesMotionLabels.ctaDescription}
            </div>
            <div className={`${styles.salesMotionField} salesMotionTextArea`}>
              <Field
                type="text"
                name="ctaDescription"
                placeholder={SalesMotionLabels.ctaDescription}
                component={GenTextField}
                classes={classes}
                onChange={onChange}
                onBlur={onBlur}
                multiline
                value={sectionValues.ctaDescription}
                errorMessage={errors.ctaDescription}
                hasError={errors.ctaDescription && touched.ctaDescription}
              />
              <RenderErrorMessage name="ctaDescription" />
            </div>
          </div>

          <div className={styles.salesMotionFieldWrap}>
            <div className={styles.salesMotionLabel}>
              {SalesMotionLabels.ctaImage}
            </div>
            <div className={`${styles.salesMotionField} disabledFile`}>
              <Field
                name="ctaImage"
                placeholder={SalesMotionLabels.ctaImage}
                component={GenTextField}
                classes={classes}
                // onChange={onChange}
                // onBlur={onBlur}
                disabled
                style={{ width: '205px' }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={(e: any) => {
                          if (fileInput && fileInput.current) {
                            fileInput.current.click();
                          }
                        }}
                      >
                        <input
                          accept="*"
                          ref={fileInput}
                          type="file"
                          style={{ display: 'none', width: '90%' }}
                          onChange={(e) => {
                            onFileSelected(e, 'ctaImage', sectionValues);
                            validateField('ctaImage');
                          }}
                        />
                        <img src={uploadIcon} alt="" />
                      </IconButton>
                    </InputAdornment>
                  ),
                  accept: '*',
                  readOnly: true,
                }}
              />
              <div className={styles.previewImageHelper}>
                Recommended size 500 x 300 px
              </div>
              <RenderErrorMessage name="ctaImage" />
            </div>
          </div>
          {ctaThumbnailImage && (
            <div
              className={`${styles.salesMotionFieldWrap} ${styles.marginPaddingZero}`}
            >
              <div className={styles.salesMotionLabel} />
              <div className={styles.salesMotionField}>
                <PreviewImage
                  showCrop
                  classes={styles.thumbnailImg}
                  id="ctaThumbnailImage"
                  src={
                    ctaThumbnailImage?.cropped
                      ? ctaThumbnailImage?.croppedSource
                      : ctaThumbnailImage?.source
                  }
                  show={ctaThumbnailImage.name && ctaThumbnailImage.source}
                  alt="ctaThumbnailImage"
                  CustomStyles={{}}
                  CloseHandler={() => {
                    fileInput.current.value = '';
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
              </div>
            </div>
          )}
          <div className={styles.salesMotionFieldWrap}>
            <div className={styles.salesMotionLabel}>
              {SalesMotionLabels.ctaStaticForm}
            </div>
            <div className={`${styles.salesMotionField} `}>
              <div
                className={`${styles.salesMotionCheckbox} salesMotionCheckbox`}
              >
                <Checkbox
                  name="staticFormShow"
                  onChange={onChange}
                  checked={sectionValues.staticFormShow}
                />
              </div>
            </div>
          </div>
          {sectionValues.staticFormShow ? (
            <div className={`${styles.salesMotionformField} `}>
              <div className={styles.salesMotionFieldWrap}>
                <div className={styles.salesMotionLabel}>
                  {SalesMotionLabels.ctaFormHeader}
                </div>
                <div className={styles.salesMotionField}>
                  <Field
                    type="text"
                    name="ctaFormHeader"
                    placeholder={SalesMotionLabels.ctaFormHeader}
                    component={GenTextField}
                    classes={classes}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={sectionValues.ctaFormHeader}
                    errorMessage={errors.ctaFormHeader}
                    hasError={errors.ctaFormHeader && touched.ctaFormHeader}
                  />
                    <RenderErrorMessage name="ctaFormHeader" />
                </div>
              </div>

              <div className={styles.staticFormTableWrap}>
                <table className={styles.staticFormTable}>
                  <thead>
                    <tr>
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
                        {SalesMotionLabels.ctaKeyName}
                      </th>
                      <th className={styles.staticFormHeader}>
                        {SalesMotionLabels.ctaDisplayName}
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
                                leadselected?.length > 0
                                  ? leadselected.includes(key.lead_master_id)
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
                          leadselected.includes(key.lead_master_id) ? (<>
                            <input
                              type="text"
                              name={key.key_name}
                              className={styles.formFieldinput}
                              placeholder={key.key_name}
                              onChange={handleFormChange}
                              value={
                                `${
                                  staticFormData[
                                    key.key_name
                                  ]
                                }` === 'undefined'
                                  ? ''
                                  : `${
                                      staticFormData[
                                        key.key_name
                                      ]
                                    }`
                              }
                            />
                            </>
                          ) : (
                            <input
                              type="text"
                              name={key.key_name}
                              className={styles.formFieldinputDisabled}
                              onChange={handleFormChange}
                              placeholder={key.key_name}
                              value={
                                `${
                                  staticFormData[
                                    key.key_name
                                  ]
                                }` === 'undefined'
                                  ? ''
                                  : `${
                                      staticFormData[
                                        key.key_name
                                      ]
                                    }`
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
                      padding:'5px 0px',
                      marginLeft: '44%',
                    }}
                  >
                    {showFieldError ? "Please enter the value" : "Select at least 1 field"}
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            <div className={styles.salesMotionFieldWrap}>
              <div className={styles.salesMotionLabel}>
                {SalesMotionLabels.embeddedCode}
              </div>
              <div className={`${styles.salesMotionField} salesMotionTextArea`}>
                <Field
                  type="text"
                  name="ctaEmbeddedCode"
                  placeholder={SalesMotionLabels.embeddedCode}
                  component={GenTextField}
                  classes={classes}
                  onChange={onChange}
                  onBlur={onBlur}
                  multiline
                  value={sectionValues.ctaEmbeddedCode}
                  hasError={errors.ctaEmbeddedCode && touched.ctaEmbeddedCode}
                  errorMessage={errors.ctaEmbeddedCode}
                />
                <RenderErrorMessage name="ctaEmbeddedCode" />
              </div>
            </div>
          )}
        </div>
      ) : null}
      {showCropImage && (
        <CroppedImage
          previewImage={ctaThumbnailImage}
          previewImageLable={previewImageLables.ctaImage}
          setLoader={() => setLoading(true)}
          clearLoader={() => setLoading(false)}
          setPreviewImage={setPreviewImage}
          setShowCropImage={() => setShowCropImage(false)}
        />
      )}
    </div>
  );
};

export default CTAConfiguration;
