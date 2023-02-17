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

const CallOutSecTwo = (props: any) => {
  const classes = useStyles();
  const {
    formikValues,
    errors,
    touched,
    handleBlur,
    handleChange,
    fontColorList,
    onFileSelected,
    callOutTwoHeaderImage,
    setShowSection2,
    showSection2,
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
          !showSection2 ? styles.salesHubAccDropDownGap : ''
        }`}
        onClickCapture={() => setShowSection2(!showSection2)}
      >
        {createAccountDropdown.calloutSection2}
        <IconButton>
          <img
            className={styles.salesHubAccDownArrowImg}
            src={DownArrow}
            alt=""
          />
        </IconButton>
      </div>

      {showSection2 ? (
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
                  name="callOutTwoHeaderText"
                  value={formikValues.callOutTwoHeaderText}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  hasError={
                    errors.callOutTwoHeaderText && touched.callOutTwoHeaderText
                  }
                  errorMessage={errors.callOutTwoHeaderText}
                  component={GenTextField}
                  classes={classes}
                  multiline
                  disabled={
                    formikValues.salesMotion === '' ||
                    formikValues.salesMotion === undefined
                  }
                  placeholder={createAccount.headerText}
                />
                <RenderErrorMessage name="callOutTwoHeaderText" />
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
                  name="callOutTwoSubHeaderTxt"
                  value={formikValues.callOutTwoSubHeaderTxt}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  hasError={
                    errors.callOutTwoSubHeaderTxt &&
                    touched.callOutTwoSubHeaderTxt
                  }
                  errorMessage={errors.callOutTwoSubHeaderTxt}
                  component={GenTextField}
                  classes={classes}
                  multiline
                  disabled={
                    formikValues.salesMotion === '' ||
                    formikValues.salesMotion === undefined
                  }
                  placeholder={createAccount.subHeaderText}
                />
                <RenderErrorMessage name="callOutTwoSubHeaderTxt" />
              </div>
            </div>

            <div className={styles.salesHubAccFieldWrap}>
              <div className={styles.salesHubAccLabel}>
                {createAccount.headerImage}
              </div>
              <div className={`${styles.salesHubAccField} disabledFile`}>
                <Field
                  type="file"
                  name="callOutTwoHeaderImg"
                  // value={formikValues.callOutTwoHeaderImg}
                  disabled
                  readOnly
                  hasError={
                    errors.callOutTwoHeaderImg && touched.callOutTwoHeaderImg
                  }
                  errorMessage={errors.callOutTwoHeaderImg}
                  placeholder={createAccount.headerImage}
                  component={GenTextField}
                  classes={classes.root}
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
                              onFileSelected(e, 'callOutTwoHeaderImg')
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
                <div className={styles.previewImageHelper}>
                  Recommended size 550 x 400 px
                </div>
                <RenderErrorMessage name="callOutTwoHeaderImg" />
                {callOutTwoHeaderImage && (
                  <PreviewImage
                    showCrop
                    id="callOutTwoHeaderImg"
                    classes={styles.thumbnailImg}
                    src={
                      callOutTwoHeaderImage?.cropped
                        ? callOutTwoHeaderImage?.croppedSource
                        : callOutTwoHeaderImage?.source
                    }
                    show={
                      callOutTwoHeaderImage.name && callOutTwoHeaderImage.source
                    }
                    alt="callOutTwoHeaderImage"
                    CustomStyles={{}}
                    CloseHandler={() => {
                      fileInputHeaderImg.current.value = '';
                      OnImageCancel('callOutTwoHeaderImg');
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
                  name="callOutTwoFontColor"
                  value={formikValues.callOutTwoFontColor}
                  displayEmpty
                  renderValue={
                    formikValues.callOutTwoFontColor !== ''
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
                <RenderErrorMessage name="callOutTwoFontColor" />
              </div>
            </div>
          </div>
        </>
      ) : null}
      {showCropImage && (
        <CroppedImage
          previewImage={callOutTwoHeaderImage}
          previewImageLable={previewImageLables.calloutTwoImage}
          setLoader={setLoader}
          clearLoader={clearLoader}
          setPreviewImage={setPreviewImage}
          setShowCropImage={() => setShowCropImage(false)}
        />
      )}
    </>
  );
};
export default CallOutSecTwo;
