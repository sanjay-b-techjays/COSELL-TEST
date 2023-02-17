/* eslint-disable linebreak-style */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable linebreak-style */
/* eslint-disable operator-linebreak */
/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
import React from 'react';
import {
  createAccount,
  createAccountDropdown,
  previewImageLables,
} from 'src/strings';
import DownArrow from 'src/app/components/Icons/PreviewPartnership/DownArrow.svg';
import uploadIcon from 'src/app/assets/upload-logo.svg';

import {
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
} from '@material-ui/core';
import { Field } from 'formik';
import PreviewImage from 'src/app/components/PreviewImage/PreviewImage';
import { GenTextField, RenderErrorMessage } from '../../Form';
import styles from '../CreateAccount/CreateAccount.module.css';
import { useStyles } from '../../Styles';
import CroppedImage from 'src/app/components/CroppedImage/CroppedImage';

const CallOutSecOne = (props: any) => {
  const classes = useStyles();
  const {
    formikValues,
    errors,
    touched,
    handleBlur,
    handleChange,
    fontColorList,
    onFileSelected,
    callOutOneHeaderImage,
    setShowSection1,
    showSection1,
    OnImageCancel,
    setPreviewImage,
    setLoader,
    clearLoader,
  } = props;
  const fileInputHeaderImg = React.useRef<HTMLInputElement>(null);
  const [showCropImage, setShowCropImage] = React.useState(false);

  return (
    <>
      <div
        className={`${styles.salesHubAccDropDown} ${
          !showSection1 ? styles.salesHubAccDropDownGap : ''
        }`}
        onClickCapture={() => setShowSection1(!showSection1)}
      >
        {createAccountDropdown.calloutSection1}
        <IconButton>
          <img
            className={styles.salesHubAccDownArrowImg}
            src={DownArrow}
            alt=""
          />
        </IconButton>
      </div>

      {showSection1 ? (
        <>
          <div
            className={`${styles.salesHubAccFormWrap} ${styles.salesHubSectionFormWrap}`}
          >
            <div className={styles.salesHubAccFieldWrap}>
              <div className={styles.salesHubAccLabel}>
                {createAccount.headerText}
              </div>
              <div
                className={`${styles.salesHubAccField} ${styles.salesHubAccFieldTxtArea} textArea`}
              >
                <Field
                  type="text"
                  name="callOutOneHeaderText"
                  value={formikValues.callOutOneHeaderText}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  hasError={
                    errors.callOutOneHeaderText && touched.callOutOneHeaderText
                  }
                  errorMessage={errors.callOutOneHeaderText}
                  component={GenTextField}
                  classes={classes}
                  multiline
                  disabled={
                    formikValues.salesMotion === '' ||
                    formikValues.salesMotion === undefined
                  }
                  placeholder={createAccount.headerText}
                />
                <RenderErrorMessage name="callOutOneHeaderText" />
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
                  name="callOutOneSubHeaderTxt"
                  value={formikValues.callOutOneSubHeaderTxt}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  hasError={
                    errors.callOutOneSubHeaderTxt &&
                    touched.callOutOneSubHeaderTxt
                  }
                  errorMessage={errors.callOutOneSubHeaderTxt}
                  component={GenTextField}
                  classes={classes}
                  multiline
                  disabled={
                    formikValues.salesMotion === '' ||
                    formikValues.salesMotion === undefined
                  }
                  placeholder={createAccount.subHeaderText}
                />
                <RenderErrorMessage name="callOutOneSubHeaderTxt" />
              </div>
            </div>

            <div className={styles.salesHubAccFieldWrap}>
              <div className={styles.salesHubAccLabel}>
                {createAccount.headerImage}
              </div>
              <div className={`${styles.salesHubAccField} disabledFile`}>
                <Field
                  type="file"
                  name="callOutOneHeaderImg"
                  readOnly
                  hasError={
                    errors.callOutOneHeaderImg && touched.callOutOneHeaderImg
                  }
                  disabled
                  errorMessage={errors.callOutOneHeaderImg}
                  placeholder={createAccount.headerImage}
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
                            onChange={(e: any) =>
                              onFileSelected(e, 'callOutOneHeaderImg')
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
                  Recommended size 1350 x 150 px
                </div>
                <RenderErrorMessage name="callOutOneHeaderImg" />
                {callOutOneHeaderImage && (
                  <PreviewImage
                    showCrop
                    id="callOutOneHeaderImg"
                    classes={styles.thumbnailImg}
                    src={
                      callOutOneHeaderImage?.cropped
                        ? callOutOneHeaderImage?.croppedSource
                        : callOutOneHeaderImage?.source
                    }
                    show={
                      callOutOneHeaderImage.name && callOutOneHeaderImage.source
                    }
                    alt="callOutOneHeaderImage"
                    CustomStyles={{}}
                    CloseHandler={() => {
                      fileInputHeaderImg.current.value = '';
                      OnImageCancel('callOutOneHeaderImg');
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
                  name="callOutOneFontColor"
                  value={formikValues.callOutOneFontColor}
                  displayEmpty
                  renderValue={
                    formikValues.callOutOneFontColor !== ''
                      ? undefined
                      : () => (
                          <span className="salesHubAccSelectName">
                            {' '}
                            {createAccount.fontColor}
                          </span>
                        )
                  }
                  disabled={
                    formikValues.salesMotion === '' ||
                    formikValues.salesMotion === undefined
                  }
                  onChange={(e, data) => {
                    handleChange(e, data);
                  }}
                  onBlur={handleBlur}
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
                <RenderErrorMessage name="callOutOneFontColor" />
              </div>
            </div>
          </div>
        </>
      ) : null}
      {showCropImage && (
        <CroppedImage
          previewImage={callOutOneHeaderImage}
          previewImageLable={previewImageLables.calloutOneImage}
          setLoader={setLoader}
          clearLoader={clearLoader}
          setPreviewImage={setPreviewImage}
          setShowCropImage={() => setShowCropImage(false)}
        />
      )}
    </>
  );
};
export default CallOutSecOne;
