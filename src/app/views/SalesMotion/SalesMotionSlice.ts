/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable operator-linebreak */
/* eslint-disable linebreak-style */
/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormikProps, replace } from 'formik';
import { string } from 'prop-types';
import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { postRequest, putRequest, deleteRequest } from '../../service';
import { AppDispatch, RootState } from '../../store';
import { State, salesMotionValues } from './types';

const initialState: State = {
  generalErrMsg: '',
  generalValidationField: '',
  siteLayoutErrMsg: '',
  siteLayoutValidationField: '',
  callOutOneErrMsg: '',
  callOutOneValidationField: '',
  callOutTwoErrMsg: '',
  callOutTwoValidationField: '',
  ctaErrMsg: '',
  ctaValidationField: '',
  refreshTimeStamp: Date.now(),
};
// Slice
export const salesMotionSlice = createSlice({
  name: 'salesMotion',
  initialState,
  reducers: {
    setGeneralErrMsg(
      state,
      {
        payload,
      }: PayloadAction<{
        generalErrMsg: string;
        generalValidationField: string;
      }>
    ) {
      state.generalErrMsg = payload.generalErrMsg;
      state.generalValidationField = payload.generalValidationField;
      console.log(payload, 'payload');
    },
    setSiteLayoutErrMsg(
      state,
      {
        payload,
      }: PayloadAction<{
        siteLayoutErrMsg: string;
        siteLayoutValidationField: string;
      }>
    ) {
      state.siteLayoutErrMsg = payload.siteLayoutErrMsg;
      state.siteLayoutValidationField = payload.siteLayoutValidationField;
    },
    setCallOutOneErrMsg(
      state,
      {
        payload,
      }: PayloadAction<{
        callOutOneErrMsg: string;
        callOutOneValidationField: string;
      }>
    ) {
      state.callOutOneErrMsg = payload.callOutOneErrMsg;
      state.callOutOneValidationField = payload.callOutOneValidationField;
    },
    setCallOutTwoErrMsg(
      state,
      {
        payload,
      }: PayloadAction<{
        callOutTwoErrMsg: string;
        callOutTwoValidationField: string;
      }>
    ) {
      state.callOutTwoErrMsg = payload.callOutTwoErrMsg;
      state.callOutTwoValidationField = payload.callOutTwoValidationField;
    },
    setCtaErrMsg(
      state,
      {
        payload,
      }: PayloadAction<{ ctaErrMsg: string; ctaValidationField: string }>
    ) {
      state.ctaErrMsg = payload.ctaErrMsg;
      state.ctaValidationField = payload.ctaValidationField;
    },
    setRefreshTimeStamp(
      state,
      {
        payload,
      }: PayloadAction<{
        refreshTimeStamp: number;
      }>
    ) {
      state.refreshTimeStamp = payload.refreshTimeStamp;
    },
  },
});
// Actions
export const {
  setGeneralErrMsg,
  setSiteLayoutErrMsg,
  setCallOutOneErrMsg,
  setCallOutTwoErrMsg,
  setCtaErrMsg,
  setRefreshTimeStamp,
} = salesMotionSlice.actions;
export const saveSalesMotionAction =
  (
    formValues: salesMotionValues,
    handleSaveSiteLayout: (
      formValues: salesMotionValues,
      currSalesMotionId: number
    ) => void,
    handleSaveCallOutSecOne: (
      formValues: salesMotionValues,
      currSalesMotionId: number
    ) => void,
    handleSaveCallOutSecTwo: (
      formValues: salesMotionValues,
      currSalesMotionId: number
    ) => void,
    handleSaveAssetCollectionForSalesMotion: (
      currSalesMotionId: number
    ) => void,
    handleSaveCTA: (
      formValues: salesMotionValues,
      currSalesMotionId: number
    ) => void,
    partnershipId: string,
    setInitialValues: Dispatch<SetStateAction<salesMotionValues>>,
    formikForm: MutableRefObject<FormikProps<salesMotionValues>>,
    loaderAction: () => void
  ) =>
  (dispatch: AppDispatch) => {
    const token = localStorage.getItem('token');
    postRequest(
      `partnership/sales-motion/`,
      {
        partnership_id: partnershipId,
        name: formValues.name,
        description: formValues.description,
        target_buyer_titles: JSON.stringify(formValues.targetBuyerTitles),
      },
      {
        Authorization: `Token ${token}`,
      }
    ).then((response: any) => {
      if (response.result === true) {
        const currSalesMotionId =
          response.data && response.data.sales_motion_id;
        dispatch(
          setGeneralErrMsg({
            generalErrMsg: '',
            generalValidationField: '',
          })
        );
        if (response.data.site_layout === null) {
          handleSaveSiteLayout(formValues, currSalesMotionId);
        }
        handleSaveAssetCollectionForSalesMotion(currSalesMotionId);
      } else {
        dispatch(
          setGeneralErrMsg({
            generalErrMsg: response.data.msg,
            generalValidationField: response.data.validation_error_field,
          })
        );
        loaderAction();
      }
    });
  };

export const deleteSalesMotionAction =
  (
    partnershipID: string,
    salesMotionIds: number[],
    loaderAction: () => void,
    setAlert: (value: string) => void,
    refreshSalesMotion: () => void,
    closeDialogBox: () => void
  ) =>
  (dispatch: AppDispatch) => {
    const token = localStorage.getItem('token');
    deleteRequest(
      `partnership/sales-motion/`,
      {
        Authorization: `Token ${token}`,
      },
      {
        partnership_id: partnershipID,
        sales_motion_ids: salesMotionIds,
      }
    ).then((response: any) => {
      if (response.result === true) {
        loaderAction();
        setAlert('success');
        refreshSalesMotion();
        closeDialogBox();
      }
    });
  };

export const updateSalesMotionAction =
  (
    formValues: salesMotionValues,
    handleUpdateSiteLayout: (
      formValues: salesMotionValues,
      currSalesMotionId: number
    ) => void,
    handleUpdateCallOutSecOne: (
      formValues: salesMotionValues,
      currSalesMotionId: number
    ) => void,
    handleUpdateCallOutSecTwo: (
      formValues: salesMotionValues,
      currSalesMotionId: number
    ) => void,
    handleSaveAssetCollectionForSalesMotion: (
      currSalesMotionId: number
    ) => void,
    handleUpdateCTA: (
      formValues: salesMotionValues,
      currSalesMotionId: number
    ) => void,
    partnershipID: string,
    setInitialValues: Dispatch<SetStateAction<salesMotionValues>>,
    formikForm: MutableRefObject<FormikProps<salesMotionValues>>,
    salesMotionID: string,
    loaderAction: () => void
  ) =>
  (dispatch: AppDispatch) => {
    const token = localStorage.getItem('token');
    putRequest(
      `partnership/sales-motion/`,
      {
        partnership_id: partnershipID,
        sales_motion_id: salesMotionID,
        name: formValues.name,
        description: formValues.description,
        target_buyer_titles: JSON.stringify(formValues.targetBuyerTitles),
      },
      {
        Authorization: `Token ${token}`,
      }
    ).then((response: any) => {
      if (response.result === true) {
        const currSalesMotionId =
          response.data && response.data.sales_motion_id;
        setInitialValues({
          ...formikForm.current.values,
          name: response.data.name,
          description: response.data.description,
          targetBuyerTitles: response.data.target_buyer_titles,
        });
        dispatch(
          setGeneralErrMsg({
            generalErrMsg: '',
            generalValidationField: '',
          })
        );
        handleUpdateSiteLayout(formValues, currSalesMotionId);
        handleUpdateCallOutSecOne(formValues, currSalesMotionId);
        handleUpdateCallOutSecTwo(formValues, currSalesMotionId);
        handleUpdateCTA(formValues, currSalesMotionId);
        handleSaveAssetCollectionForSalesMotion(currSalesMotionId);
      } else {
        dispatch(
          setGeneralErrMsg({
            generalErrMsg: response.data.msg,
            generalValidationField: response.data.validation_error_field,
          })
        );
        loaderAction();
      }
    });
  };
export const selectSalesMotionResponse = (state: RootState) =>
  state.salesMotionSlice;
export default salesMotionSlice.reducer;
