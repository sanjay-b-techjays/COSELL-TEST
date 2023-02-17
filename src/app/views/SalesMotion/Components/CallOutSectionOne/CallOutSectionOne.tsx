/* eslint-disable comma-dangle */
/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
/* eslint-disable linebreak-style */
import React, { useState, useRef } from 'react';

import { Field } from 'formik';
import { previewImageLables, SalesMotionLabels } from 'src/strings';
import { InputAdornment, MenuItem, Select } from '@material-ui/core';
import IconButton from '@mui/material/IconButton';
import { Close } from '@material-ui/icons';
import { RenderErrorMessage, GenTextField } from '../../../SalesHubSite/Form';
import UploadLogo from '../../../../components/Icons/PreviewPartnership/UploadLogoIcon.svg';
import DownArrow from '../../../../components/Icons/PreviewPartnership/DownArrow.svg';
import styles from '../../SalesMotion.module.css';
import { listValues } from '../../types';
import { useStyles } from 'src/app/views/SalesHubSite/Styles';
import PreviewImage from 'src/app/components/PreviewImage/PreviewImage';
import CroppedImage from 'src/app/components/CroppedImage/CroppedImage';

const CallOutSectionOne = (props: any) => {
  const classes = useStyles();
  const fileInput = useRef<HTMLInputElement>(null);
  const [showCropImage, setShowCropImage] = useState(false);
  const {
    onChange,
    onBlur,
    sectionValues,
    errors,
    touched,
    onFileSelected,
    fontColorList,
    callOutOneThumbnailImage,
    OnImageCancel,
    callOutSectionOneShow,
    setCallOutSectionOneShow,
    validateField,
    setLoading,
    setPreviewImage,
  } = props;

  return (
    <div className={styles.generalFromMainDiv}>
      <div
        className={styles.salesMotionDropDownButton}
        onClickCapture={() => setCallOutSectionOneShow(!callOutSectionOneShow)}
      >
        Call out section#1
        <IconButton>
          <img src={DownArrow} alt="" />
        </IconButton>
      </div>
      {callOutSectionOneShow ? (
        <div className={styles.salesMotionFormWrap}>
          <div className={styles.salesMotionFieldWrap}>
            <div className={styles.salesMotionLabel}>
              {SalesMotionLabels.headerTxt}
            </div>
            <div className={`${styles.salesMotionField} salesMotionTextArea`}>
              <Field
                type="text"
                name="callOutOneheaderText"
                placeholder={SalesMotionLabels.headerTxt}
                component={GenTextField}
                classes={classes}
                onChange={onChange}
                onBlur={onBlur}
                value={sectionValues.callOutTwoHeaderText}
                errorMessage={errors.callOutTwoHeaderText}
                hasError={
                  errors.callOutTwoHeaderText && touched.callOutTwoHeaderText
                }
                multiline
              />
              <RenderErrorMessage name="callOutOneheaderText" />
            </div>
          </div>

          <div className={styles.salesMotionFieldWrap}>
            <div className={styles.salesMotionLabel}>
              {SalesMotionLabels.subHeaderTxt}
            </div>
            <div className={`${styles.salesMotionField} salesMotionTextArea`}>
              <Field
                type="text"
                name="callOutOneSubHeaderText"
                placeholder={SalesMotionLabels.subHeaderTxt}
                component={GenTextField}
                classes={classes}
                onChange={onChange}
                onBlur={onBlur}
                value={sectionValues.callOutTwoSubHeaderText}
                hasError={
                  errors.callOutTwoSubHeaderText && touched.callOutTwoHeaderText
                }
                multiline
                errorMessage={errors.callOutTwoSubHeaderText}
              />
              <RenderErrorMessage name="callOutOneSubHeaderText" />
            </div>
          </div>

          <div className={styles.salesMotionFieldWrap}>
            <div className={styles.salesMotionLabel}>
              {SalesMotionLabels.headerImage}
            </div>
            <div className={`${styles.salesMotionField} disabledFile`}>
              <Field
                type="text"
                name="callOutOneHeaderImage"
                placeholder={SalesMotionLabels.headerImage}
                component={GenTextField}
                classes={classes}
                // onChange={onChange}
                // onBlur={onBlur}
                // value={sectionValues.callOutTwoHeaderImg}
                // hasError={
                //   errors.callOutTwoHeaderImg && touched.callOutTwoHeaderImg
                // }
                // errorMessage={errors.callOutTwoHeaderImg}
                disabled
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
                            onFileSelected(
                              e,
                              'callOutOneHeaderImage',
                              sectionValues
                            );
                            validateField('callOutOneHeaderImage');
                          }}
                        />
                        <img src={UploadLogo} alt="" />
                      </IconButton>
                    </InputAdornment>
                  ),
                  accept: '*',
                  readOnly: true,
                }}
              />
              <div className={styles.previewImageHelper}>
                Recommended size 1350 x 150 px
              </div>
              <RenderErrorMessage name="callOutOneHeaderImage" />
            </div>
          </div>
          {callOutOneThumbnailImage && (
            <div
              className={`${styles.salesMotionFieldWrap} ${styles.marginPaddingZero}`}
            >
              <div className={styles.salesMotionLabel} />
              <div className={styles.salesMotionField}>
                <PreviewImage
                  showCrop
                  classes={styles.thumbnailImg}
                  id="callOutOneThumbnailImage"
                  src={
                    callOutOneThumbnailImage?.cropped
                      ? callOutOneThumbnailImage?.croppedSource
                      : callOutOneThumbnailImage?.source
                  }
                  show={
                    callOutOneThumbnailImage.name &&
                    callOutOneThumbnailImage.source
                  }
                  alt="callOutOneThumbnailImage"
                  CustomStyles={{}}
                  CloseHandler={() => {
                    fileInput.current.value = '';
                    OnImageCancel('callOutOneHeaderImage');
                  }}
                  CropHandler={() => setShowCropImage(true)}
                  UndoHandler={() =>
                    setPreviewImage({
                      type: 'CLEAR_CROPPED_IMAGE',
                      payload: {
                        key: previewImageLables.calloutOneImage,
                      },
                    })
                  }
                />
              </div>
            </div>
          )}
          <div className={styles.salesMotionFieldWrap}>
            <div className={styles.salesMotionLabel}>
              {SalesMotionLabels.fontColor}
            </div>
            <div className={`${styles.salesMotionField} salesMotionField`}>
              <Select
                type="text"
                name="callOutOneFontColor"
                onChange={onChange}
                onBlur={onBlur}
                value={sectionValues.callOutOneFontColor}
                className={styles.salesMotionSelect}
                displayEmpty
                renderValue={
                  sectionValues.callOutOneFontColor !== ''
                    ? undefined
                    : () => (
                        <span
                          style={{
                            color: 'rgba(0, 0, 0, 0.3)',
                            fontWeight: '500',
                            fontSize: '14px',
                          }}
                        >
                          {' '}
                          {SalesMotionLabels.fontColor}
                        </span>
                      )
                }
                inputProps={{ 'aria-label': 'Without label' }}
              >
                {fontColorList.map((list: listValues) => (
                  <MenuItem
                    value={list.id}
                    key={list.id}
                    className="salesMotionMenu"
                  >
                    {list.value}
                  </MenuItem>
                ))}
              </Select>
              <RenderErrorMessage name="callOutOneFontColor" />
            </div>
          </div>
        </div>
      ) : null}
      {showCropImage && (
        <CroppedImage
          previewImage={callOutOneThumbnailImage}
          previewImageLable={previewImageLables.calloutOneImage}
          setLoader={() => setLoading(true)}
          clearLoader={() => setLoading(false)}
          setPreviewImage={setPreviewImage}
          setShowCropImage={() => setShowCropImage(false)}
        />
      )}
    </div>
  );
};

export default CallOutSectionOne;
