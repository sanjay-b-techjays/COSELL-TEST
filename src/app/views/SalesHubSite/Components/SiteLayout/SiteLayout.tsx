/* eslint-disable linebreak-style */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable operator-linebreak */
/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
import {
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
} from '@material-ui/core';
import { Field } from 'formik';
import React from 'react';
import PreviewImage from 'src/app/components/PreviewImage/PreviewImage';
import {
  createAccount,
  createAccountDropdown,
  previewImageLables,
} from '../../../../../strings';
import DownArrow from '../../../../components/Icons/PreviewPartnership/DownArrow.svg';
import uploadIcon from '../../../../assets/upload-logo.svg';
import { GenTextField, RenderErrorMessage } from '../../Form';
import styles from '../CreateAccount/CreateAccount.module.css';
import { useStyles } from '../../Styles';
import CroppedImage from 'src/app/components/CroppedImage/CroppedImage';

const SiteLayout = (props: any) => {
  const classes = useStyles();
  const {
    formikValues,
    errors,
    touched,
    handleBlur,
    handleChange,
    onFileSelected,
    salesMotionList,
    fontStyleList,
    fontColorList,
    fetchSalesMotionDataById,
    layOutHeaderImageWeb,
    layOutHeaderImageMobile,
    showSiteLayout,
    setShowSiteLayout,
    OnImageCancel,
    setFormEdited,
    fetchDeletedSalesMotion,
    fetchSalesHubAccountDetailById,
    setPreviewImage,
    setLoader,
    clearLoader,
  } = props;
  const fileInputHeaderImgWeb = React.useRef<HTMLInputElement>(null);
  const fileInputHeaderImgMobile = React.useRef<HTMLInputElement>(null);
  const [showCropImage, setShowCropImage] = React.useState({
    web: false,
    mobile: false,
  });
  console.log(
    layOutHeaderImageWeb,
    layOutHeaderImageMobile,
    'SiteLayoutThumbnailImages'
  );

  return (
    <>
      <div
        className={`${styles.salesHubAccDropDown} ${
          !showSiteLayout ? styles.salesHubAccDropDownGap : ''
        }`}
        onClickCapture={() => setShowSiteLayout(!showSiteLayout)}
      >
        {createAccountDropdown.siteLayout}
        <IconButton>
          <img
            className={styles.salesHubAccDownArrowImg}
            src={DownArrow}
            alt=""
          />
        </IconButton>
      </div>
      {showSiteLayout ? (
        <>
          <div
            className={`${styles.salesHubAccFormWrap} ${styles.salesHubSectionFormWrap}`}
          >
            <div
              className={`${styles.salesHubAccFieldWrap} ${styles.fullField}`}
            >
              <div className={styles.salesHubAccFieldWrap}>
                <div className={styles.salesHubAccLabel}>
                  {createAccount.salesMotion}
                </div>
                <div className={`${styles.salesHubAccField} salesHubAccSelect`}>
                  <Select
                    style={{ width: '100%' }}
                    name="salesMotion"
                    value={formikValues.salesMotion || 1}
                    displayEmpty
                    renderValue={
                      formikValues.salesMotion !== ''
                        ? undefined
                        : () => (
                            <span className="salesHubAccSelectName">
                              {' '}
                              {createAccount.salesMotion}
                            </span>
                          )
                    }
                    onChange={(e, data) => {
                      handleChange(e, data);
                      const isDeletedId = salesMotionList
                        .filter((smObj) => smObj.id === e.target.value)[0]
                        ?.value.includes('(deleted)');

                      if (isDeletedId) {
                        fetchDeletedSalesMotion(e.target.value, true);
                      } else {
                        fetchSalesMotionDataById(e.target.value);
                      }
                      setFormEdited(true);
                    }}
                    onBlur={handleBlur}
                    className={styles.uploadAssetSelect}
                    inputProps={{ 'aria-label': 'Without label' }}
                  >
                    {salesMotionList &&
                      salesMotionList.map((list: any) => (
                        <MenuItem value={list.id} key={list.id}>
                          {list.value}
                        </MenuItem>
                      ))}
                  </Select>
                  <RenderErrorMessage name="salesMotion" />
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
                  name="layOutHeaderText"
                  value={formikValues.layOutHeaderText}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  hasError={errors.layOutHeaderText && touched.layOutHeaderText}
                  errorMessage={errors.layOutHeaderText}
                  disabled={
                    formikValues.salesMotion === '' ||
                    formikValues.salesMotion === undefined
                  }
                  component={GenTextField}
                  classes={classes}
                  multiline
                  placeholder={createAccount.headerText}
                />
                <RenderErrorMessage name="layOutHeaderText" />
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
                  name="layOutSubHeaderTxt"
                  value={formikValues.layOutSubHeaderTxt}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  hasError={
                    errors.layOutSubHeaderTxt && touched.layOutSubHeaderTxt
                  }
                  errorMessage={errors.layOutSubHeaderTxt}
                  disabled={
                    formikValues.salesMotion === '' ||
                    formikValues.salesMotion === undefined
                  }
                  component={GenTextField}
                  classes={classes}
                  multiline
                  placeholder={createAccount.subHeaderText}
                />
                <RenderErrorMessage name="layOutSubHeaderTxt" />
              </div>
            </div>

            <div className={styles.salesHubAccFieldWrap}>
              <div className={styles.salesHubAccLabel}>
                {createAccount.headerImageWeb}
              </div>
              <div className={styles.salesHubAccField}>
                <Field
                  type="file"
                  name="layOutHeaderImgWeb"
                  value={formikValues.layOutHeaderImgWeb}
                  readOnly
                  hasError={
                    errors.layOutHeaderImgWeb && touched.layOutHeaderImgWeb
                  }
                  errorMessage={errors.layOutHeaderImgWeb}
                  disabled={
                    formikValues.salesMotion === '' ||
                    formikValues.salesMotion === undefined
                  }
                  placeholder={createAccount.headerImage}
                  component={GenTextField}
                  classes={classes}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={(e) => {
                            if (
                              fileInputHeaderImgWeb &&
                              fileInputHeaderImgWeb.current
                            ) {
                              fileInputHeaderImgWeb.current.click();
                            }
                          }}
                        >
                          <input
                            accept="image/*"
                            ref={fileInputHeaderImgWeb}
                            type="file"
                            style={{ display: 'none' }}
                            onClick={() => console.log('file')}
                            onChange={(e: any) => {
                              onFileSelected(e, 'layOutHeaderImgWeb');
                              console.log('file');
                            }}
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
                  Recommended size 1450 x 650 px
                </div>
                <RenderErrorMessage name="layOutHeaderImgWeb" />
                {layOutHeaderImageWeb && (
                  <PreviewImage
                    showCrop
                    id="layOutHeaderImgWeb"
                    classes={styles.thumbnailImg}
                    src={
                      layOutHeaderImageWeb?.cropped
                        ? layOutHeaderImageWeb?.croppedSource
                        : layOutHeaderImageWeb?.source
                    }
                    show={
                      layOutHeaderImageWeb.name && layOutHeaderImageWeb.source
                    }
                    alt="layOutHeaderImageWeb"
                    CustomStyles={{}}
                    CloseHandler={() => {
                      fileInputHeaderImgWeb.current.value = '';
                      OnImageCancel('layOutHeaderImgWeb');
                    }}
                    CropHandler={() =>
                      setShowCropImage({
                        web: true,
                        mobile: false,
                      })
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
                )}
              </div>
            </div>

            <div className={styles.salesHubAccFieldWrap}>
              <div className={styles.salesHubAccLabel}>
                {createAccount.headerImageMobile}
              </div>
              <div className={styles.salesHubAccField}>
                <Field
                  type="file"
                  name="layOutHeaderImgMobile"
                  value={formikValues.layOutHeaderImgMobile}
                  readOnly
                  hasError={
                    errors.layOutHeaderImgMobile &&
                    touched.layOutHeaderImgMobile
                  }
                  errorMessage={errors.layOutHeaderImgMobile}
                  disabled={
                    formikValues.salesMotion === '' ||
                    formikValues.salesMotion === undefined
                  }
                  placeholder={createAccount.headerImage}
                  component={GenTextField}
                  classes={classes}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={(e) => {
                            if (
                              fileInputHeaderImgMobile &&
                              fileInputHeaderImgMobile.current
                            ) {
                              fileInputHeaderImgMobile.current.click();
                            }
                          }}
                        >
                          <input
                            accept="image/*"
                            ref={fileInputHeaderImgMobile}
                            type="file"
                            style={{ display: 'none' }}
                            onChange={(e: any) =>
                              onFileSelected(e, 'layOutHeaderImgMobile')
                            }
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
                  Recommended size 375 x 600 px
                </div>
                <RenderErrorMessage name="layOutHeaderImgMobile" />
                {layOutHeaderImageMobile && (
                  <PreviewImage
                    showCrop
                    id="layOutHeaderImgMobile"
                    classes={styles.thumbnailImg}
                    src={
                      layOutHeaderImageMobile?.cropped
                        ? layOutHeaderImageMobile?.croppedSource
                        : layOutHeaderImageMobile?.source
                    }
                    show={
                      layOutHeaderImageMobile.name &&
                      layOutHeaderImageMobile.source
                    }
                    alt="layOutHeaderImageMobile"
                    CustomStyles={{}}
                    CloseHandler={() => {
                      fileInputHeaderImgMobile.current.value = '';
                      OnImageCancel('layOutHeaderImgMobile');
                    }}
                    CropHandler={() =>
                      setShowCropImage({
                        web: false,
                        mobile: true,
                      })
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
                )}
              </div>
            </div>

            <div className={styles.salesHubAccFieldWrap}>
              <div className={styles.salesHubAccLabel}>
                {createAccount.fontColor}
              </div>
              <div className={`${styles.salesHubAccField} salesHubAccSelect`}>
                <Select
                  style={{ width: '100%' }}
                  name="layOutFontColor"
                  value={formikValues.layOutFontColor}
                  displayEmpty
                  renderValue={
                    formikValues.layOutFontColor !== ''
                      ? undefined
                      : () => (
                          <span className="salesHubAccSelectName">
                            {' '}
                            {createAccount.fontColor}
                          </span>
                        )
                  }
                  onChange={(e, data) => {
                    handleChange(e, data);
                  }}
                  onBlur={handleBlur}
                  disabled={
                    formikValues.salesMotion === '' ||
                    formikValues.salesMotion === undefined
                  }
                  className={styles.uploadAssetSelect}
                  inputProps={{ 'aria-label': 'Without label' }}
                >
                  {fontColorList &&
                    fontColorList.map((list: any) => (
                      <MenuItem value={list.id} key={list.id}>
                        {list.value}
                      </MenuItem>
                    ))}
                </Select>
                <RenderErrorMessage name="layOutFontColor" />
              </div>
            </div>
            <div className={styles.salesHubAccFieldWrap}>
              <div className={styles.salesHubAccLabel}>
                {createAccount.fontStyle}
              </div>
              <div className={`${styles.salesHubAccField} salesHubAccSelect`}>
                <Select
                  style={{ width: '100%' }}
                  name="layOutFontStyle"
                  value={formikValues.layOutFontStyle}
                  displayEmpty
                  renderValue={
                    formikValues.layOutFontStyle !== ''
                      ? undefined
                      : () => (
                          <span className="salesHubAccSelectName">
                            {' '}
                            {createAccount.fontStyle}
                          </span>
                        )
                  }
                  onChange={(e, data) => {
                    handleChange(e, data);
                  }}
                  onBlur={handleBlur}
                  disabled={
                    formikValues.salesMotion === '' ||
                    formikValues.salesMotion === undefined
                  }
                  className={styles.uploadAssetSelect}
                  inputProps={{ 'aria-label': 'Without label' }}
                >
                  {fontStyleList &&
                    fontStyleList.map((list: any) => (
                      <MenuItem value={list.id} key={list.id}>
                        {list.value}
                      </MenuItem>
                    ))}
                </Select>
                <RenderErrorMessage name="layOutFontStyle" />
              </div>
            </div>
          </div>
        </>
      ) : null}
      {showCropImage.web && (
        <CroppedImage
          previewImage={layOutHeaderImageWeb}
          previewImageLable={previewImageLables.siteLayoutImageWeb}
          setLoader={setLoader}
          clearLoader={clearLoader}
          setPreviewImage={setPreviewImage}
          setShowCropImage={() =>
            setShowCropImage({
              web: false,
              mobile: false,
            })
          }
        />
      )}
      {showCropImage.mobile && (
        <CroppedImage
          previewImage={layOutHeaderImageMobile}
          previewImageLable={previewImageLables.siteLayoutImageMobile}
          setLoader={setLoader}
          clearLoader={clearLoader}
          setPreviewImage={setPreviewImage}
          setShowCropImage={() =>
            setShowCropImage({
              web: false,
              mobile: false,
            })
          }
        />
      )}
    </>
  );
};
export default SiteLayout;
