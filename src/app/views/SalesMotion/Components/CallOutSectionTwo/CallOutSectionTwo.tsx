/* eslint-disable comma-dangle */
/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
/* eslint-disable linebreak-style */
import React, { useState, useRef } from 'react';

import { Field } from 'formik';
import IconButton from '@mui/material/IconButton';
import { previewImageLables, SalesMotionLabels } from 'src/strings';
import { InputAdornment, MenuItem, Select } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { RenderErrorMessage, GenTextField } from '../../../SalesHubSite/Form';
import uploadIcon from '../../../../assets/upload-logo.svg';
import DownArrow from '../../../../components/Icons/PreviewPartnership/DownArrow.svg';
import { listValues } from '../../types';
import styles from '../../SalesMotion.module.css';
import { useStyles } from 'src/app/views/SalesHubSite/Styles';
import PreviewImage from 'src/app/components/PreviewImage/PreviewImage';
import CroppedImage from 'src/app/components/CroppedImage/CroppedImage';

const CallOutSectionTwo = (props: any) => {
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
    callOutTwoThumbnailImage,
    OnImageCancel,
    setCallOutSectionTwoShow,
    callOutSectionTwoShow,
    validateField,
    setLoading,
    setPreviewImage,
  } = props;

  return (
    <div className={styles.generalFromMainDiv}>
      <div
        className={styles.salesMotionDropDownButton}
        onClickCapture={() => setCallOutSectionTwoShow(!callOutSectionTwoShow)}
      >
        Call out section#2
        <IconButton>
          <img src={DownArrow} alt="" />
        </IconButton>
      </div>
      {callOutSectionTwoShow ? (
        <div className={styles.salesMotionFormWrap}>
          <div className={styles.salesMotionFieldWrap}>
            <div className={styles.salesMotionLabel}>
              {SalesMotionLabels.headerTxt}
            </div>
            <div className={`${styles.salesMotionField} salesMotionTextArea`}>
              <Field
                type="text"
                name="callOutTwoHeaderText"
                placeholder={SalesMotionLabels.headerTxt}
                component={GenTextField}
                classes={classes}
                onChange={onChange}
                onBlur={onBlur}
                multiline
                value={sectionValues.callOutTwoHeaderText}
                errorMessage={errors.callOutTwoHeaderText}
                hasError={
                  errors.callOutTwoHeaderText && touched.callOutTwoHeaderText
                }
              />
              <RenderErrorMessage name="callOutTwoHeaderText" />
            </div>
          </div>

          <div className={styles.salesMotionFieldWrap}>
            <div className={styles.salesMotionLabel}>
              {SalesMotionLabels.subHeaderTxt}
            </div>
            <div className={`${styles.salesMotionField} salesMotionTextArea`}>
              <Field
                type="text"
                name="callOutTwoSubHeaderText"
                placeholder={SalesMotionLabels.subHeaderTxt}
                component={GenTextField}
                classes={classes}
                onChange={onChange}
                onBlur={onBlur}
                multiline
                className="salesMotionTextArea"
                value={sectionValues.callOutTwoSubHeaderText}
                hasError={
                  errors.callOutTwoSubHeaderText && touched.callOutTwoHeaderText
                }
                errorMessage={errors.callOutTwoSubHeaderText}
              />
              <RenderErrorMessage name="callOutTwoSubHeaderText" />
            </div>
          </div>

          <div className={styles.salesMotionFieldWrap}>
            <div className={styles.salesMotionLabel}>
              {SalesMotionLabels.headerImage}
            </div>
            <div className={`${styles.salesMotionField} disabledFile`}>
              <Field
                name="callOutTwoHeaderImage"
                placeholder={SalesMotionLabels.headerImage}
                component={GenTextField}
                classes={classes}
                // onChange={onChange}
                // onBlur={onBlur}
                style={{ width: '205px' }}
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
                              'callOutTwoHeaderImage',
                              sectionValues
                            );
                            validateField('callOutTwoHeaderImage');
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
              <div className="previewImageHelper">
                Recommended size 550 x 400 px
              </div>
              <RenderErrorMessage name="callOutTwoHeaderImage" />
            </div>
          </div>
          {callOutTwoThumbnailImage && (
            <div
              className={`${styles.salesMotionFieldWrap} ${styles.marginPaddingZero}`}
            >
              <div className={styles.salesMotionLabel} />
              <div className={styles.salesMotionField}>
                <PreviewImage
                  showCrop
                  classes={styles.thumbnailImg}
                  id="callOutTwoThumbnailImage"
                  src={
                    callOutTwoThumbnailImage?.cropped
                      ? callOutTwoThumbnailImage?.croppedSource
                      : callOutTwoThumbnailImage?.source
                  }
                  show={
                    callOutTwoThumbnailImage.name &&
                    callOutTwoThumbnailImage.source
                  }
                  alt="callOutTwoThumbnailImage"
                  CustomStyles={{}}
                  CloseHandler={() => {
                    fileInput.current.value = '';
                    OnImageCancel('callOutTwoHeaderImage');
                  }}
                  CropHandler={() => setShowCropImage(true)}
                  UndoHandler={() =>
                    setPreviewImage({
                      type: 'CLEAR_CROPPED_IMAGE',
                      payload: {
                        key: previewImageLables.calloutTwoImage,
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
                name="callOutTwoFontColor"
                onChange={onChange}
                onBlur={onBlur}
                value={sectionValues.callOutTwoFontColor}
                className={styles.salesMotionSelect}
                displayEmpty
                renderValue={
                  sectionValues.callOutTwoFontColor !== ''
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
              <RenderErrorMessage name="callOutTwoFontColor" />
            </div>
          </div>
        </div>
      ) : null}
      {showCropImage && (
        <CroppedImage
          previewImage={callOutTwoThumbnailImage}
          previewImageLable={previewImageLables.calloutTwoImage}
          setLoader={() => setLoading(true)}
          clearLoader={() => setLoading(false)}
          setPreviewImage={setPreviewImage}
          setShowCropImage={() => setShowCropImage(false)}
        />
      )}
    </div>
  );
};

export default CallOutSectionTwo;
