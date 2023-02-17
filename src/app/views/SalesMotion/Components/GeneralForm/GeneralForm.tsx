/* eslint-disable operator-linebreak */
/* eslint-disable object-curly-newline */
/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
/* eslint-disable linebreak-style */
import { useState, useEffect } from 'react';
import { Field } from 'formik';
import { useSelector, useDispatch } from 'react-redux';

import IconButton from '@mui/material/IconButton';
import { InputAdornment } from '@material-ui/core';
import { SalesMotionLabels } from 'src/strings';
import { useStyles } from 'src/app/views/SalesHubSite/Styles';
import { GenTextField, RenderErrorMessage } from '../../../SalesHubSite/Form';
import DownArrow from '../../../../components/Icons/PreviewPartnership/DownArrow.svg';
import styles from '../../SalesMotion.module.css';
import {
  selectSalesMotionResponse,
  setGeneralErrMsg,
} from '../../SalesMotionSlice';
import TagsInput from 'src/app/components/TagsInput';

const GeneralForm = (props: any) => {
  const classes = useStyles();
  const {
    onChange,
    onBlur,
    sectionValues,
    errors,
    touched,
    general,
    setGeneral,
    setFieldValue,
  } = props;

  const [generalError, setGeneralError] = useState('');
  const salesMotionRespData = useSelector(selectSalesMotionResponse);
  const dispatch = useDispatch();
  useEffect(() => {
    const timer = setTimeout(() => {
      setGeneralError('');
      dispatch(
        setGeneralErrMsg({
          generalErrMsg: '',
          generalValidationField: '',
        })
      );
    }, 15000);
    setGeneralError(salesMotionRespData.generalErrMsg);
    return () => clearTimeout(timer);
  }, [salesMotionRespData]);
  useEffect(() => {
    dispatch(
      setGeneralErrMsg({
        generalErrMsg: '',
        generalValidationField: '',
      })
    );
  }, []);
  return (
    <div className={styles.generalFromMainDiv}>
      <div
        className={styles.salesMotionDropDownButton}
        onClickCapture={() => setGeneral(!general)}
      >
        General
        <IconButton>
          <img src={DownArrow} alt="" />
        </IconButton>
      </div>
      {general ? (
        <div className={styles.salesMotionFormWrap}>
          <div className={styles.salesMotionFieldWrap}>
            <div className={styles.salesMotionLabel}>
              {SalesMotionLabels.name}
            </div>
            <div className={styles.salesMotionField}>
              <Field
                type="text"
                name="name"
                placeholder={SalesMotionLabels.name}
                component={GenTextField}
                classes={classes}
                onChange={onChange}
                onBlur={onBlur}
                value={sectionValues.callOutTwoHeaderText}
                errorMessage={errors.callOutTwoHeaderText}
                hasError={
                  errors.callOutTwoHeaderText && touched.callOutTwoHeaderText
                }
              />
              {generalError !== '' &&
              salesMotionRespData.generalValidationField === 'name' ? (
                <div
                  style={{
                    color: 'red',
                    fontSize: '12px',
                    fontWeight: '500',
                    padding: '5px 0',
                  }}
                >
                  {generalError}
                </div>
              ) : (
                <RenderErrorMessage name="name" />
              )}
            </div>
          </div>

          <div className={styles.salesMotionFieldWrap}>
            <div className={styles.salesMotionLabel}>
              {SalesMotionLabels.description}
            </div>
            <div className={`${styles.salesMotionField} salesMotionTextArea`}>
              <Field
                type="text"
                name="description"
                placeholder={SalesMotionLabels.description}
                component={GenTextField}
                classes={classes}
                onChange={onChange}
                onBlur={onBlur}
                multiline
                value={sectionValues.callOutTwoSubHeaderText}
                hasError={
                  errors.callOutTwoSubHeaderText && touched.callOutTwoHeaderText
                }
                errorMessage={errors.callOutTwoSubHeaderText}
              />
              <RenderErrorMessage name="description" />
            </div>
          </div>

          <div className={styles.salesMotionFieldWrap}>
            <div
              className={`${styles.salesMotionLabel} ${styles.salesMotionTBLabel}`}
            >
              {SalesMotionLabels.targetBuyerTitles}
            </div>
            <div className={`${styles.salesMotionField} salesMotionTextArea`}>
              <TagsInput
                selectedTags={(tags: string) => console.log(tags)}
                fullWidth
                selectedChip={sectionValues.targetBuyerTitles}
                className={`${styles.tagInput} tagsField`}
                variant="outlined"
                id="targetBuyerTitles"
                name="targetBuyerTitles"
                setFieldValue={setFieldValue}
                placeholder={SalesMotionLabels.targetBuyerTitles}
                hasError={errors.targetBuyerTitles && touched.targetBuyerTitles}
                errorMessage={
                  errors.targetBuyerTitles && touched.targetBuyerTitles
                }
                onBlur={(e) => {
                  onBlur(e, 'targetBuyerTitles');
                }}
              />
              <small
                className={`styles.inputHelper ${
                  errors.targetBuyerTitles && touched.targetBuyerTitles
                    ? styles.hidden
                    : ''
                }`}
              >
                {SalesMotionLabels.TargetBuyerHelperText}
              </small>
              <RenderErrorMessage name="targetBuyerTitles" />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default GeneralForm;
