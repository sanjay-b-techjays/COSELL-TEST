/* eslint-disable linebreak-style */
/* eslint-disable react/jsx-indent */
/* eslint-disable indent */
/* eslint-disable object-curly-newline */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable operator-linebreak */
/* eslint-disable linebreak-style */
/* eslint-disable comma-dangle */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable linebreak-style */
import React, { useState, useRef, useEffect } from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field, FormikProps } from 'formik';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import PrimaryButton from 'src/app/components/Button/PrimaryButton';
import { MenuItem, Select } from '@material-ui/core';
import TagsInput from 'src/app/components/TagsInput';

import { getRequest } from 'src/app/service';
import { useDispatch } from 'react-redux';
import { ButtonLabels, uploadAssetsLabels } from '../../../../../strings';
import {
  GenTextField,
  RenderErrorMessage,
  RenderTextField,
} from '../../../SalesHubSite/Form';
import uploadIcon from '../../../../assets/upload-logo.svg';
import SecondaryButton from '../../../../components/Button/SecondaryButton';
import styles from './AssetForm.module.css';
import './AssetForm.css';
import { saveAssetAction } from '../../UploadAssetSlice';
import AssetPreview from '../../AssetPreview';
import { useStyles } from 'src/app/views/SalesHubSite/Styles';

interface Values {
  assetName: string;
  assetType: string;
  assetFile: string;
  assetFileType: string;
  tags: string[];
  status: string;
}
const AssetForm = (props: any) => {
  const classes = useStyles();
  const {
    cancelHandler,
    updateId,
    accessTypeList,
    partnershipId,
    setLoader,
    accessDocTypeList,
    clearLoader,
    showAlert,
    setShowCloseWarning,
    setFormEdited,
    formEdited,
    setIsDirty,
  } = props;
  const dispatch = useDispatch();
  const statusList = [
    { key: 'active', id: 1, value: 'Active' },
    { key: 'Inactive', id: 2, value: 'Inactive' },
  ];
  const [selectedFile, setSelectedFile] = React.useState('');
  const [tagErr, setTagErr] = React.useState('');
  const fileInput = useRef<HTMLInputElement>(null);
  const formikForm = useRef<FormikProps<Values>>(null);
  const [initialValues, setInitialValues] = useState<Values>();
  const [fileSize, setFileSize] = useState('');
  const [filePath, setFilePath] = useState('');
  const onFileSelected = (event: any) => {
    setFormEdited(true);
    const file = event.target.files[0];

    if (file && file.name && formikForm && formikForm.current) {
      setSelectedFile(file);
      const fileName = file.name as string;
      formikForm?.current?.setFieldValue('assetFile', fileName);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (updateId) {
      getRequest(
        `partnership/asset/?partnership_id=${partnershipId}&asset_id=${updateId}`,
        {
          Accept: 'application/json',
          Authorization: `Token ${token}`,
        }
      ).then((response: any) => {
        if (response.result === true) {
          setInitialValues({
            assetName: response.data.asset_name,
            assetType: response.data.access_type_id,
            assetFile: response.data.file_name,
            assetFileType: response.data.file_type_id,
            tags: response.data.tags,
            status: response.data.status_id || 1,
          });
          setFileSize(response.data.file_size);
          setFilePath(response.data.file);
        }
      });
    } else {
      setInitialValues({
        assetName: '',
        assetType: '',
        assetFile: '',
        assetFileType: '',
        tags: [],
        status: '',
      });
    }
  }, []);

  const assetSchema = Yup.object().shape({
    assetName: Yup.string()
      .trim()
      .min(3, 'Minimum 3 characters is required')
      .required('Asset name is required'),
    assetType: Yup.string().trim().required('Access type is required'),
    assetFile: Yup.string().trim().required('Upload file is required'),
  });

  return (
    <div className={styles.uploadFormWrap}>
      <div className={styles.subTitle}>{uploadAssetsLabels.assetInfo}</div>

      <div className={styles.myAccWrap}>
        {initialValues && (
          <Formik
            innerRef={formikForm}
            enableReinitialize
            initialValues={initialValues}
            validate={() => ({})}
            validationSchema={assetSchema}
            onSubmit={(values, { setFieldError }) => {
              setLoader();
              dispatch(
                saveAssetAction(
                  {
                    assetName: values.assetName,
                    assetType: values.assetType,
                    assetFileType: values.assetFileType,
                    assetFile: selectedFile,
                    tags: values.tags,
                    status: values.status,
                  },
                  updateId,
                  partnershipId,
                  clearLoader,
                  showAlert,
                  cancelHandler
                )
              );
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
                setErrors,
                dirty,
                setFieldValue,
                setFieldError,
                setFieldTouched,
              } = formik;
              // console.log(errors, 'errors');

              setIsDirty(dirty);
              return (
                <Form
                  className={styles.assetForm}
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(e);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                    }
                  }}
                >
                  <div className={styles.accInfoForm}>
                    <div className={styles.accInfoField}>
                      <div
                        className={`${styles.semiField} ${styles.labelField}`}
                      >
                        {uploadAssetsLabels.assetName}
                      </div>
                      <div className={styles.semiField}>
                        <Field
                          type="text"
                          name="assetName"
                          // required
                          value={values.assetName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder={uploadAssetsLabels.assetName}
                          hasError={errors.assetName && touched.assetName}
                          errorMessage={errors.assetName}
                          component={GenTextField}
                          classes={classes}
                        />
                        <RenderErrorMessage name="assetName" />
                      </div>
                    </div>

                    <div className={styles.accInfoField}>
                      <div
                        className={`${styles.semiField} ${styles.labelField}`}
                      >
                        {uploadAssetsLabels.accessType}
                      </div>
                      <div className={`${styles.semiField} uploadAssetSelect`}>
                        <Select
                          name="assetType"
                          value={values.assetType}
                          displayEmpty
                          renderValue={
                            values.assetType !== ''
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
                                    {uploadAssetsLabels.accessType}
                                  </span>
                                )
                          }
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={styles.uploadAssetSelect}
                          inputProps={{ 'aria-label': 'Without label' }}
                        >
                          {accessTypeList.map((list: any) => (
                            <MenuItem value={list.id} key={list.id}>
                              {list.value}
                            </MenuItem>
                          ))}
                        </Select>
                        <RenderErrorMessage name="assetType" />
                      </div>
                    </div>

                    <div className={styles.accInfoField}>
                      <div
                        className={`${styles.semiField} ${styles.labelField}`}
                      >
                        {uploadAssetsLabels.uploadFile}
                      </div>
                      <div className={`${styles.semiField} disabledFile`}>
                        <Field
                          name="assetFile"
                          component={GenTextField}
                          classes={classes}
                          type="file"
                          disabled
                          placeholder={uploadAssetsLabels.uploadFile}
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
                                    style={{ display: 'none' }}
                                    onChange={(e) => {
                                      onFileSelected(e);
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
                        <RenderErrorMessage name="assetFile" />
                      </div>
                    </div>
                    <div className={styles.accInfoField}>
                      <div
                        className={`${styles.semiField} ${styles.labelField}`}
                      >
                        {uploadAssetsLabels.tags}
                      </div>
                      <div
                        className={`${styles.semiField} ${styles.tagsFieldWrapper}`}
                      >
                        <TagsInput
                          selectedTags={(tags: string) => console.log(tags)}
                          fullWidth
                          selectedChip={values.tags}
                          className={`${styles.tagInput} tagsField`}
                          variant="outlined"
                          id="tags"
                          name="tags"
                          errorMessage={errors.tags && touched.tags}
                          placeholder="Add tags"
                          hasError
                          setFieldValue={setFieldValue}
                        />
                        <RenderErrorMessage name="tags" />
                      </div>
                    </div>
                    {updateId !== '' && (
                      <div className={styles.accInfoField}>
                        <div
                          className={`${styles.semiField} ${styles.labelField}`}
                        >
                          {uploadAssetsLabels.status}
                        </div>
                        <div
                          className={`${styles.semiField} uploadAssetSelect`}
                        >
                          <Select
                            name="status"
                            value={values.status}
                            className={styles.uploadAssetSelect}
                            displayEmpty
                            renderValue={
                              values.status !== ''
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
                                      {uploadAssetsLabels.status}
                                    </span>
                                  )
                            }
                            onChange={handleChange}
                            onBlur={handleBlur}
                            inputProps={{ 'aria-label': 'Without label' }}
                          >
                            {statusList.map((list: any) => (
                              <MenuItem value={list.id} key={list.id}>
                                {list.value}
                              </MenuItem>
                            ))}
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className={styles.previewWrap}>
                    {(selectedFile !== '' || values.assetFile !== '') && (
                      <AssetPreview
                        uploadedFile={selectedFile}
                        fileURL={values.assetFile}
                        filePath={filePath}
                        uploadedFileSize={fileSize}
                      />
                    )}
                  </div>

                  <div
                    className={`${styles.accInfoBtnWrap} ${styles.bottomLayer}`}
                  >
                    <SecondaryButton
                      onClick={() => {
                        if (dirty || formEdited) setShowCloseWarning(true);
                        else cancelHandler();
                      }}
                      style={{ minWidth: '160px', marginRight: '30px' }}
                    >
                      {ButtonLabels.cancel}
                    </SecondaryButton>
                    <PrimaryButton type="submit" style={{ minWidth: '160px' }}>
                      {ButtonLabels.save}
                    </PrimaryButton>
                  </div>
                </Form>
              );
            }}
          </Formik>
        )}
      </div>
    </div>
  );
};
export default AssetForm;
