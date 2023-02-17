/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
/* eslint-disable linebreak-style */
import { useState, useRef, useEffect } from 'react';
import { Field } from 'formik';
import { previewImageLables, SalesMotionLabels } from 'src/strings';
import { InputAdornment, MenuItem, Select } from '@material-ui/core';
import IconButton from '@mui/material/IconButton';
import { Close } from '@material-ui/icons';
import { GenTextField, RenderErrorMessage } from '../../../SalesHubSite/Form';
import UploadLogo from '../../../../components/Icons/PreviewPartnership/UploadLogoIcon.svg';
import DownArrow from '../../../../components/Icons/PreviewPartnership/DownArrow.svg';
import styles from '../../SalesMotion.module.css';
import { useStyles } from 'src/app/views/SalesHubSite/Styles';
import PreviewImage from 'src/app/components/PreviewImage/PreviewImage';
import CroppedImage from 'src/app/components/CroppedImage/CroppedImage';
import { useMediaQuery } from 'react-responsive';

const SiteLayout = (props: any) => {
  const classes = useStyles();
  const fileInput = useRef<HTMLInputElement>(null);
  const fileInputMobile = useRef<HTMLInputElement>(null);
  const isMobile = useMediaQuery({ query: '(max-width: 750px)' });
  const [showCropImage, setShowCropImage] = useState({
    web: false,
    mobile: false,
  });
  const {
    onChange,
    onBlur,
    sectionValues,
    errors,
    touched,
    onFileSelected,
    fontColorList,
    fontStyleList,
    siteLayoutThumbnailImageWeb,
    siteLayoutThumbnailImageMobile,
    OnImageCancel,
    setSiteLayout,
    siteLayout,
    validateField,
    setLoading,
    setPreviewImage,
  } = props;

  return (
    <div className={styles.generalFromMainDiv}>
      <div
        className={styles.salesMotionDropDownButton}
        onClickCapture={() => setSiteLayout(!siteLayout)}
      >
        Site layout
        <IconButton>
          <img src={DownArrow} alt="" />
        </IconButton>
      </div>
      {siteLayout ? (
        <div className={styles.salesMotionFormWrap}>
          <div className={styles.salesMotionFieldWrap}>
            <div className={styles.salesMotionWrap}>
              <div className={styles.salesMotionLabel}>
                {SalesMotionLabels.headerTxt}
              </div>
              <div className={`${styles.salesMotionField} salesMotionTextArea`}>
                <Field
                  type="text"
                  name="layoutHeaderText"
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
                <RenderErrorMessage name="layoutHeaderText" />
              </div>
            </div>
          </div>

          <div className={styles.salesMotionFieldWrap}>
            <div className={styles.salesMotionLabel}>
              {SalesMotionLabels.subHeaderTxt}
            </div>
            <div className={`${styles.salesMotionField} salesMotionTextArea`}>
              <Field
                type="text"
                name="layoutSubHeaderText"
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
              <RenderErrorMessage name="layoutSubHeaderText" />
            </div>
          </div>

          <div className={styles.salesMotionFieldWrap}>
            <div className={styles.salesMotionLabel}>
              {SalesMotionLabels.headerImageWeb}
            </div>
            <div className={`${styles.salesMotionField} disabledFile`}>
              <Field
                type="text"
                name="layoutHeaderImageWeb"
                placeholder={SalesMotionLabels.headerImage}
                component={GenTextField}
                classes={classes}
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
                            onFileSelected(
                              e,
                              'layoutHeaderImageWeb',
                              sectionValues
                            );
                            validateField('layoutHeaderImageWeb');
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
                Recommended size 1450 x 650 px
              </div>
              <RenderErrorMessage name="layoutHeaderImageWeb" />
            </div>
          </div>
          {siteLayoutThumbnailImageWeb && (
            <div
              className={`${styles.salesMotionFieldWrap} ${styles.marginPaddingZero}`}
            >
              <div className={styles.salesMotionLabel} />
              <div className={styles.salesMotionField}>
                <PreviewImage
                  showCrop
                  classes={styles.thumbnailImg}
                  id="siteLayoutThumbnailImageWeb"
                  src={
                    siteLayoutThumbnailImageWeb?.cropped
                      ? siteLayoutThumbnailImageWeb?.croppedSource
                      : siteLayoutThumbnailImageWeb?.source
                  }
                  show={
                    siteLayoutThumbnailImageWeb?.name &&
                    siteLayoutThumbnailImageWeb?.source
                  }
                  alt="siteLayoutThumbnailImageWeb"
                  CustomStyles={{}}
                  CloseHandler={() => {
                    fileInput.current.value = '';
                    OnImageCancel('layoutHeaderImageWeb');
                  }}
                  CropHandler={() =>
                    setShowCropImage({ web: true, mobile: false })
                  }
                  UndoHandler={() =>
                    setPreviewImage({
                      type: 'CLEAR_CROPPED_IMAGE',
                      payload: {
                        key: previewImageLables.siteLayoutImageWeb,
                      },
                    })
                  }
                />
              </div>
            </div>
          )}

          <div className={styles.salesMotionFieldWrap}>
            <div className={styles.salesMotionLabel}>
              {SalesMotionLabels.headerImageMobile}
            </div>
            <div className={`${styles.salesMotionField} disabledFile`}>
              <Field
                type="text"
                name="layoutHeaderImageMobile"
                placeholder={SalesMotionLabels.headerImage}
                component={GenTextField}
                classes={classes}
                disabled
                style={{ width: '205px' }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={(e: any) => {
                          if (fileInputMobile && fileInputMobile.current) {
                            fileInputMobile.current.click();
                          }
                        }}
                      >
                        <input
                          accept="*"
                          ref={fileInputMobile}
                          type="file"
                          style={{ display: 'none', width: '90%' }}
                          onChange={(e) => {
                            onFileSelected(
                              e,
                              'layoutHeaderImageMobile',
                              sectionValues
                            );
                            validateField('layoutHeaderImageMobile');
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
                Recommended size 375 x 600 px
              </div>
              <RenderErrorMessage name="layoutHeaderImageMobile" />
            </div>
          </div>
          {siteLayoutThumbnailImageMobile && (
            <div
              className={`${styles.salesMotionFieldWrap} ${styles.marginPaddingZero}`}
            >
              <div className={styles.salesMotionLabel} />
              <div className={styles.salesMotionField}>
                <PreviewImage
                  showCrop
                  classes={styles.thumbnailImg}
                  id="siteLayoutThumbnailImageMobile"
                  src={
                    siteLayoutThumbnailImageMobile?.cropped
                      ? siteLayoutThumbnailImageMobile?.croppedSource
                      : siteLayoutThumbnailImageMobile?.source
                  }
                  show={
                    siteLayoutThumbnailImageMobile?.name &&
                    siteLayoutThumbnailImageMobile?.source
                  }
                  alt="siteLayoutThumbnailImageMobile"
                  CustomStyles={{}}
                  CloseHandler={() => {
                    fileInput.current.value = '';
                    OnImageCancel('layoutHeaderImageMobile');
                  }}
                  CropHandler={() =>
                    setShowCropImage({ web: false, mobile: true })
                  }
                  UndoHandler={() =>
                    setPreviewImage({
                      type: 'CLEAR_CROPPED_IMAGE',
                      payload: {
                        key: previewImageLables.siteLayoutImageMobile,
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
                name="layoutFontColor"
                onChange={onChange}
                onBlur={onBlur}
                value={sectionValues.layoutFontColor}
                className={styles.salesMotionSelect}
                displayEmpty
                renderValue={
                  sectionValues.layoutFontColor !== ''
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
                {fontColorList.map((list: any) => (
                  <MenuItem
                    value={list.id}
                    key={list.id}
                    className="salesMotionMenu"
                  >
                    {list.value}
                  </MenuItem>
                ))}
              </Select>
              <RenderErrorMessage name="layoutFontColor" />
            </div>
          </div>

          <div className={styles.salesMotionFieldWrap}>
            <div className={styles.salesMotionLabel}>
              {SalesMotionLabels.fontStyle}
            </div>
            <div className={`${styles.salesMotionField} salesMotionField`}>
              <Select
                type="text"
                name="layoutFontStyle"
                onChange={onChange}
                onBlur={onBlur}
                value={sectionValues.layoutFontStyle}
                className={styles.salesMotionSelect}
                displayEmpty
                renderValue={
                  sectionValues.layoutFontStyle !== ''
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
                          {SalesMotionLabels.fontStyle}
                        </span>
                      )
                }
                inputProps={{ 'aria-label': 'Without label' }}
              >
                {fontStyleList.map((list: any) => (
                  <MenuItem
                    value={list.id}
                    key={list.id}
                    className="salesMotionMenu"
                  >
                    {list.value}
                  </MenuItem>
                ))}
              </Select>
              <RenderErrorMessage name="layoutFontStyle" />
            </div>
          </div>
        </div>
      ) : null}
      {showCropImage.web && (
        <CroppedImage
          previewImage={siteLayoutThumbnailImageWeb}
          previewImageLable={previewImageLables.siteLayoutImageWeb}
          setLoader={() => setLoading(true)}
          clearLoader={() => setLoading(false)}
          setPreviewImage={setPreviewImage}
          setShowCropImage={() =>
            setShowCropImage({ web: false, mobile: false })
          }
        />
      )}
      {showCropImage.mobile && (
        <CroppedImage
          previewImage={siteLayoutThumbnailImageMobile}
          previewImageLable={previewImageLables.siteLayoutImageMobile}
          setLoader={() => setLoading(true)}
          clearLoader={() => setLoading(false)}
          setPreviewImage={setPreviewImage}
          setShowCropImage={() =>
            setShowCropImage({ web: false, mobile: false })
          }
        />
      )}
    </div>
  );
};

export default SiteLayout;
