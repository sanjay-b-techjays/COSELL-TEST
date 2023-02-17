/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable operator-linebreak */
/* eslint-disable linebreak-style */
/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { AccountsEngagementsLabels } from 'src/strings';
import {
  multiPartRequest,
  multiPartPutRequest,
  postRequest,
  putRequest,
} from '../../service';
import { AppDispatch, RootState } from '../../store';
import AccountsEngagements from '../AccountsEngagements';

import { State, salesHubValues, IdSetValues } from './types';

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
  currentSalesHubAccountId: '',
  accountTeamErrMsg: '',
  accountTeamValidationField: '',
};

// Slice
export const salesHubAccountSlice = createSlice({
  name: 'salesHub',
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
    setCurrentSalesHubAccId(
      state,
      { payload }: PayloadAction<{ currentSalesHubAccountId: string }>
    ) {
      state.currentSalesHubAccountId = payload.currentSalesHubAccountId;
    },
    setaccountTeamErrMsg(
      state,
      {
        payload,
      }: PayloadAction<{
        accountTeamErrMsg: string;
        accountTeamValidationField: string;
      }>
    ) {
      state.accountTeamErrMsg = payload.accountTeamErrMsg;
      state.accountTeamValidationField = payload.accountTeamValidationField;
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
  setCurrentSalesHubAccId,
  setaccountTeamErrMsg,
} = salesHubAccountSlice.actions;

// Selectors

export const salesHubAccountResponse = (state: RootState) =>
  state.salesHubAccountSlice;

export const handleSaveSalesOpportunity =
  (
    formValues: any,
    salesOpportunityId: any,
    isAdd: boolean,
    resetFormFunc: () => void,
    clearLoader: () => void,
    setAlert: () => void,
    cancelHandler: () => void,
    cbFunc: () => void
  ) =>
  (dispatch: AppDispatch, getState) => {
    const token = localStorage.getItem('token');
    const queryparams = new URLSearchParams(window.location.search);
    const partnershipID: string = queryparams.get('partner_id') || '0';
    const salesHubAccId: string =
      queryparams.get('sales_hub_account_id') || '0';
    const url = `partnership/sales-hub-account/sales-opportunity/`;
    const amountPayload =
      formValues.estimatedDealAmount !== ''
        ? { estimate_deal_amount: formValues.estimatedDealAmount }
        : {};
    const payload = {
      opportunity_name: formValues.opportunityName,
      sales_stage: formValues.salesStage,
      created_date: formValues.createdDate,
      estimated_close_date: formValues.estimatedCloseDate,
      sales_hub_account_id: salesHubAccId,
      partner_ship_id: partnershipID,
      ...amountPayload,
    };
    const headerPayload = {
      Authorization: `Token ${token}`,
    };
    const request =
      salesOpportunityId !== '0'
        ? putRequest(
            url,
            { ...payload, sales_opportunity_id: salesOpportunityId },
            headerPayload
          )
        : postRequest(url, payload, headerPayload);
    request.then((response: any) => {
      if (response.result === true) {
        console.log(response, 'rsp', formValues);
        setAlert();
        if (!isAdd) {
          cancelHandler();
        }
        cbFunc();
        if (resetFormFunc) {
          resetFormFunc();
        }
        clearLoader();
      } else {
        clearLoader();
        dispatch(
          setGeneralErrMsg({
            generalErrMsg: response.data.msg,
            generalValidationField: response.data.validation_error_field,
          })
        );
      }
    });
  };

export const handleSendAccTeamEmail =
  (
    email: string,
    currSalesHubAccId: number,
    isUserInvite,
    clearLoader: () => void,
    setAlert: () => void,
    cancelHandler: () => void
  ) =>
  (dispatch: AppDispatch, getState) => {
    const stateData = getState();
    const salesHubAccountSliceData = salesHubAccountResponse(stateData);

    const token = localStorage.getItem('token');
    const queryparams = new URLSearchParams(window.location.search);
    const partnershipID: string = queryparams.get('partner_id') || '0';
    const salesHubAccId: string =
      queryparams.get('sales_hub_account_id') || '0';
    if (isUserInvite) {
      const emailList = email
        .trim()
        .split(',')
        .filter((mail: string) => mail.trim() !== '')
        .map((mail: string) => mail.trim());
      postRequest(
        `partnership/sales-hub-account/account-team/`,
        {
          partnership_id: partnershipID,
          sales_hub_account_id: currSalesHubAccId,
          emails: emailList,
        },
        {
          Authorization: `Token ${token}`,
        }
      ).then((response: any) => {
        if (response.result === true) {
          setAlert();
          cancelHandler();
          clearLoader();
          dispatch(
            setCurrentSalesHubAccId({
              currentSalesHubAccountId: '',
            })
          );
          dispatch(
            setaccountTeamErrMsg({
              accountTeamErrMsg: '',
              accountTeamValidationField: '',
            })
          );
        } else {
          clearLoader();
          dispatch(
            setaccountTeamErrMsg({
              accountTeamErrMsg: response.data.msg,
              accountTeamValidationField: response.data.validation_error_field,
            })
          );
        }
      });
    } else if (salesHubAccId === '0' && !isUserInvite) {
      const emailList = email
        .trim()
        .split(',')
        .filter((mail: string) => mail.trim() !== '')
        .map((mail: string) => mail.trim());
      postRequest(
        `partnership/sales-hub-account/account-team/`,
        {
          partnership_id: partnershipID,
          sales_hub_account_id: currSalesHubAccId,
          emails: emailList,
        },
        {
          Authorization: `Token ${token}`,
        }
      ).then((response: any) => {
        if (response.result === true) {
          clearLoader();
          if (
            salesHubAccountSliceData.generalErrMsg === '' &&
            salesHubAccountSliceData.siteLayoutErrMsg === '' &&
            salesHubAccountSliceData.callOutOneErrMsg === '' &&
            salesHubAccountSliceData.callOutTwoErrMsg === '' &&
            salesHubAccountSliceData.ctaErrMsg === ''
          ) {
            setAlert();
            cancelHandler();
            clearLoader();
            dispatch(
              setCurrentSalesHubAccId({
                currentSalesHubAccountId: '',
              })
            );
            dispatch(
              setaccountTeamErrMsg({
                accountTeamErrMsg: '',
                accountTeamValidationField: '',
              })
            );
          }
        } else if (response.data.msg.includes('already exists')) {
          if (
            salesHubAccountSliceData.generalErrMsg === '' &&
            salesHubAccountSliceData.siteLayoutErrMsg === '' &&
            salesHubAccountSliceData.callOutOneErrMsg === '' &&
            salesHubAccountSliceData.callOutTwoErrMsg === '' &&
            salesHubAccountSliceData.ctaErrMsg === ''
          ) {
            setAlert();
            cancelHandler();
            clearLoader();
            dispatch(
              setCurrentSalesHubAccId({
                currentSalesHubAccountId: '',
              })
            );
            dispatch(
              setaccountTeamErrMsg({
                accountTeamErrMsg: '',
                accountTeamValidationField: '',
              })
            );
          }
        } else {
          clearLoader();
          dispatch(
            setaccountTeamErrMsg({
              accountTeamErrMsg: response.data.msg,
              accountTeamValidationField: response.data.validation_error_field,
            })
          );
        }
      });
    } else if (
      salesHubAccountSliceData.generalErrMsg === '' &&
      salesHubAccountSliceData.siteLayoutErrMsg === '' &&
      salesHubAccountSliceData.callOutOneErrMsg === '' &&
      salesHubAccountSliceData.callOutTwoErrMsg === '' &&
      salesHubAccountSliceData.ctaErrMsg === ''
    ) {
      setAlert();
      cancelHandler();
      clearLoader();
      dispatch(
        setCurrentSalesHubAccId({
          currentSalesHubAccountId: '',
        })
      );
      dispatch(
        setaccountTeamErrMsg({
          accountTeamErrMsg: '',
          accountTeamValidationField: '',
        })
      );
    }
  };
export const handleSaveCTA =
  (
    formValues: salesHubValues,
    currSalesHubAccId: number,
    layOutHeaderImage: any,
    callOutTwoHeaderImage: any,
    callOutOneHeaderImage: any,
    ctaImage: any,
    isUpdate: boolean,
    clearLoader: () => void,
    setAlert: () => void,
    cancelHandler: () => void,
    salesHubAccIdSet?: IdSetValues,
    setSalesHubAccIdSet?: (name: string, value: number) => void,
    staticLeadData?: any
  ) =>
  (dispatch: AppDispatch) => {
    const ctaImageFile = ctaImage?.cropped
      ? ctaImage.croppedFile
      : ctaImage.file;
    const token = localStorage.getItem('token');
    const queryparams = new URLSearchParams(window.location.search);
    const partnershipID: string = queryparams.get('partner_id') || '0';
    const formData = new FormData();
    formData.append('partnership_id', partnershipID);
    formData.append('sales_motion_id', formValues.salesMotion.toString());
    formData.append('sales_hub_account_id', currSalesHubAccId.toString());
    formData.append('cta_name', formValues.ctaName);
    formData.append('description', formValues.ctaDescription);
    formData.append('header_text', formValues.ctaHeaderTxt);
    formData.append('sub_header_text', formValues.ctaSubHeaderTxt);
    formData.append(
      'cta_image',
      ctaImageFile || ctaImage?.source?.replace(/(\?time=.*)/gm, '')
    );
    formData.append('embedded_code', formValues.ctaEmbeddedCode);
    formData.append('form_header', formValues.ctaFormHeader);
    formData.append(
      'display_names',
      formValues.staticFormShow
        ? JSON.stringify(staticLeadData)
        : JSON.stringify([])
    );
    formData.append(
      'is_static_form',
      JSON.stringify(formValues.staticFormShow)
    );

    if (salesHubAccIdSet.ctaId) {
      formData.append('cta_id', salesHubAccIdSet.ctaId);

      multiPartPutRequest(`partnership/sales-hub-account/cta/`, formData, {
        Authorization: `Token ${token}`,
      })
        .then((response: any) => {
          if (response.result === true) {
            dispatch(
              setCtaErrMsg({
                ctaErrMsg: '',
                ctaValidationField: '',
              })
            );
          } else {
            dispatch(
              setCtaErrMsg({
                ctaErrMsg: response.data.msg,
                ctaValidationField: response.data.validation_error_field,
              })
            );
          }
          clearLoader();
        })
        .finally(() => {
          dispatch(
            handleSendAccTeamEmail(
              formValues.accountTeamEmailList,
              currSalesHubAccId,
              false,
              clearLoader,
              setAlert,
              cancelHandler
            )
          );
        });
    } else {
      multiPartRequest(`partnership/sales-hub-account/cta/`, formData, {
        Authorization: `Token ${token}`,
      })
        .then((response: any) => {
          if (response.result === true && response.data) {
            clearLoader();
            if (response.data.cta.cta_id) {
              setSalesHubAccIdSet('ctaId', response.data.cta.cta_id);
            }
            dispatch(
              setCtaErrMsg({
                ctaErrMsg: '',
                ctaValidationField: '',
              })
            );
          } else {
            clearLoader();
            dispatch(
              setCtaErrMsg({
                ctaErrMsg: response.data.msg,
                ctaValidationField: response.data.validation_error_field,
              })
            );
          }
        })
        .finally(() => {
          dispatch(
            handleSendAccTeamEmail(
              formValues.accountTeamEmailList,
              currSalesHubAccId,
              false,
              clearLoader,
              setAlert,
              cancelHandler
            )
          );
        });
    }
  };

export const handleSaveCallOutSecTwo =
  (
    formValues: salesHubValues,
    staticLeadData: any,
    currSalesHubAccId: number,
    layOutHeaderImage: any,
    callOutTwoHeaderImage: any,
    callOutOneHeaderImage: any,
    ctaImage: any,
    isUpdate: boolean,
    clearLoader: () => void,
    setAlert: () => void,
    cancelHandler: () => void,
    salesHubAccIdSet?: IdSetValues,
    setSalesHubAccIdSet?: (name: string, value: number) => void
  ) =>
  (dispatch: AppDispatch) => {
    const headerFile = callOutTwoHeaderImage?.cropped
      ? callOutTwoHeaderImage.croppedFile
      : callOutTwoHeaderImage.file;
    const token = localStorage.getItem('token');
    const queryparams = new URLSearchParams(window.location.search);

    const partnershipID: string = queryparams.get('partner_id') || '0';
    const formData = new FormData();
    formData.append('partnership_id', partnershipID);
    formData.append('sales_hub_account_id', currSalesHubAccId.toString());
    formData.append('sales_motion_id', formValues.salesMotion.toString());
    formData.append('header_text', formValues.callOutTwoHeaderText);
    formData.append('sub_header_text', formValues.callOutTwoSubHeaderTxt);
    formData.append(
      'header_image',
      headerFile || callOutTwoHeaderImage?.source?.replace(/(\?time=.*)/gm, '')
    );
    formData.append('font_color_id', formValues.callOutTwoFontColor);
    formData.append('data_type', 'call_out_section_2');
    if (salesHubAccIdSet.callOutSecTwoId) {
      formData.append(
        'call_out_section_two_id',
        salesHubAccIdSet.callOutSecTwoId
      );
      multiPartPutRequest(
        `partnership/sales-hub-account/site-layout/`,
        formData,
        {
          Authorization: `Token ${token}`,
        }
      ).then((response: any) => {
        if (response.result === true) {
          dispatch(
            setCallOutTwoErrMsg({
              callOutTwoErrMsg: '',
              callOutTwoValidationField: '',
            })
          );
        } else {
          dispatch(
            setCallOutTwoErrMsg({
              callOutTwoErrMsg: response.data.msg,
              callOutTwoValidationField: response.data.validation_error_field,
            })
          );
        }
        dispatch(
          handleSaveCTA(
            formValues,
            currSalesHubAccId,
            layOutHeaderImage,
            callOutTwoHeaderImage,
            callOutOneHeaderImage,
            ctaImage,
            true,
            clearLoader,
            setAlert,
            cancelHandler,
            salesHubAccIdSet,
            setSalesHubAccIdSet,
            staticLeadData
          )
        );
      });
    } else {
      multiPartRequest(`partnership/sales-hub-account/site-layout/`, formData, {
        Authorization: `Token ${token}`,
      }).then((response: any) => {
        if (response.result === true) {
          if (response.data.call_out_section_two.call_out_section_two_id) {
            setSalesHubAccIdSet(
              'callOutSecTwoId',
              response.data.call_out_section_two.call_out_section_two_id
            );
          }
          dispatch(
            setCallOutTwoErrMsg({
              callOutTwoErrMsg: '',
              callOutTwoValidationField: '',
            })
          );
        } else {
          dispatch(
            setCallOutTwoErrMsg({
              callOutTwoErrMsg: response.data.msg,
              callOutTwoValidationField: response.data.validation_error_field,
            })
          );
        }
        dispatch(
          handleSaveCTA(
            formValues,
            currSalesHubAccId,
            layOutHeaderImage,
            callOutTwoHeaderImage,
            callOutOneHeaderImage,
            ctaImage,
            false,
            clearLoader,
            setAlert,
            cancelHandler,
            salesHubAccIdSet,
            setSalesHubAccIdSet,
            staticLeadData
          )
        );
      });
    }
  };

export const handleSaveCallOutSecOne =
  (
    formValues: salesHubValues,
    currSalesHubAccId: number,
    layOutHeaderImage: any,
    callOutTwoHeaderImage: any,
    callOutOneHeaderImage: any,
    ctaImage: any,
    isUpdate: boolean,
    clearLoader: () => void,
    setAlert: () => void,
    cancelHandler: () => void,
    salesHubAccIdSet?: IdSetValues,
    setSalesHubAccIdSet?: (name: string, value: number) => void,
    staticLeadData?: any
  ) =>
  (dispatch: AppDispatch) => {
    const headerFile = callOutOneHeaderImage?.cropped
      ? callOutOneHeaderImage.croppedFile
      : callOutOneHeaderImage.file;
    const token = localStorage.getItem('token');
    const queryparams = new URLSearchParams(window.location.search);
    const partnershipID: string = queryparams.get('partner_id') || '0';
    const formData = new FormData();
    formData.append('partnership_id', partnershipID);
    formData.append('sales_motion_id', formValues.salesMotion.toString());
    formData.append('sales_hub_account_id', currSalesHubAccId.toString());
    formData.append('header_text', formValues.callOutOneHeaderText);
    formData.append('sub_header_text', formValues.callOutOneSubHeaderTxt);
    formData.append(
      'header_image',
      headerFile || callOutOneHeaderImage?.source?.replace(/(\?time=.*)/gm, '')
    );
    formData.append('font_color_id', formValues.callOutOneFontColor);
    formData.append('data_type', 'call_out_section_1');
    if (salesHubAccIdSet.callOutSecOneId) {
      formData.append(
        'call_out_section_one_id',
        salesHubAccIdSet.callOutSecOneId
      );

      multiPartPutRequest(
        `partnership/sales-hub-account/site-layout/`,
        formData,
        {
          Authorization: `Token ${token}`,
        }
      ).then((response: any) => {
        if (response.result === true) {
          dispatch(
            setCallOutOneErrMsg({
              callOutOneErrMsg: '',
              callOutOneValidationField: '',
            })
          );
        } else {
          dispatch(
            setCallOutOneErrMsg({
              callOutOneErrMsg: response.data.msg,
              callOutOneValidationField: response.data.validation_error_field,
            })
          );
        }
        dispatch(
          handleSaveCallOutSecTwo(
            formValues,
            staticLeadData,
            currSalesHubAccId,
            layOutHeaderImage,
            callOutTwoHeaderImage,
            callOutOneHeaderImage,
            ctaImage,
            true,
            clearLoader,
            setAlert,
            cancelHandler,
            salesHubAccIdSet,
            setSalesHubAccIdSet
          )
        );
      });
    } else {
      multiPartRequest(`partnership/sales-hub-account/site-layout/`, formData, {
        Authorization: `Token ${token}`,
      }).then((response: any) => {
        if (response.result === true) {
          if (response.data.call_out_section_one.call_out_section_one_id) {
            setSalesHubAccIdSet(
              'callOutSecOneId',
              response.data.call_out_section_one.call_out_section_one_id
            );
          }
          dispatch(
            setCallOutOneErrMsg({
              callOutOneErrMsg: '',
              callOutOneValidationField: '',
            })
          );
        } else {
          dispatch(
            setCallOutOneErrMsg({
              callOutOneErrMsg: response.data.msg,
              callOutOneValidationField: response.data.validation_error_field,
            })
          );
        }
        dispatch(
          handleSaveCallOutSecTwo(
            formValues,
            staticLeadData,
            currSalesHubAccId,
            layOutHeaderImage,
            callOutTwoHeaderImage,
            callOutOneHeaderImage,
            ctaImage,
            false,
            clearLoader,
            setAlert,
            cancelHandler,
            salesHubAccIdSet,
            setSalesHubAccIdSet
          )
        );
      });
    }
  };

export const handleSaveSiteLayout =
  (
    formValues: salesHubValues,
    staticLeadData: any,
    currSalesHubAccId: number,
    layOutHeaderImageWeb: any,
    layOutHeaderImageMobile: any,
    callOutTwoHeaderImage: any,
    callOutOneHeaderImage: any,
    ctaImage: any,
    isUpdate: boolean,
    clearLoader: () => void,
    setAlert: () => void,
    cancelHandler: () => void,
    salesHubAccIdSet?: IdSetValues,
    setSalesHubAccIdSet?: (name: string, value: number) => void
  ) =>
  (dispatch: AppDispatch) => {
    const headerFileWeb = layOutHeaderImageWeb?.cropped
      ? layOutHeaderImageWeb.croppedFile
      : layOutHeaderImageWeb.file;
    const headerFileMobile = layOutHeaderImageMobile?.cropped
      ? layOutHeaderImageMobile.croppedFile
      : layOutHeaderImageMobile.file;

    const token = localStorage.getItem('token');
    const queryparams = new URLSearchParams(window.location.search);
    const partnershipID: string = queryparams.get('partner_id') || '0';
    const formData = new FormData();
    formData.append('partnership_id', partnershipID);
    formData.append('sales_motion_id', formValues.salesMotion.toString());
    formData.append('sales_hub_account_id', currSalesHubAccId.toString());
    formData.append('header_text', formValues.layOutHeaderText);
    formData.append('sub_header_text', formValues.layOutSubHeaderTxt);
    formData.append(
      'header_image',
      headerFileWeb ||
        layOutHeaderImageWeb?.source?.replace(/(\?time=.*)/gm, '')
    );
    formData.append(
      'mobile_header_image',
      headerFileMobile ||
        layOutHeaderImageMobile?.source?.replace(/(\?time=.*)/gm, '')
    );
    formData.append('font_color_id', formValues.layOutFontColor);
    formData.append('data_type', 'site_layout');
    formData.append('font_style_id', formValues.layOutFontStyle);
    if (salesHubAccIdSet.siteLayoutId) {
      formData.append('site_layout_id', salesHubAccIdSet.siteLayoutId);
      multiPartPutRequest(
        `partnership/sales-hub-account/site-layout/`,
        formData,
        {
          Authorization: `Token ${token}`,
        }
      ).then((response: any) => {
        if (response.result === true) {
          dispatch(
            setSiteLayoutErrMsg({
              siteLayoutErrMsg: '',
              siteLayoutValidationField: '',
            })
          );
        } else {
          dispatch(
            setSiteLayoutErrMsg({
              siteLayoutErrMsg: response.data.msg,
              siteLayoutValidationField: response.data.validation_error_field,
            })
          );
        }
        dispatch(
          handleSaveCallOutSecOne(
            formValues,
            currSalesHubAccId,
            layOutHeaderImageWeb,
            callOutTwoHeaderImage,
            callOutOneHeaderImage,
            ctaImage,
            true,
            clearLoader,
            setAlert,
            cancelHandler,
            salesHubAccIdSet,
            setSalesHubAccIdSet,
            staticLeadData
          )
        );
      });
    } else {
      multiPartRequest(`partnership/sales-hub-account/site-layout/`, formData, {
        Authorization: `Token ${token}`,
      }).then((response: any) => {
        if (response.result === true) {
          const siteLayoutValues = response.data.site_layout;
          if (response.data.site_layout.site_layout_id) {
            setSalesHubAccIdSet(
              'siteLayoutId',
              response.data.site_layout.site_layout_id
            );
          }
          dispatch(
            setSiteLayoutErrMsg({
              siteLayoutErrMsg: '',
              siteLayoutValidationField: '',
            })
          );
        } else {
          dispatch(
            setSiteLayoutErrMsg({
              siteLayoutErrMsg: response.data.msg,
              siteLayoutValidationField: response.data.validation_error_field,
            })
          );
        }
        dispatch(
          handleSaveCallOutSecOne(
            formValues,
            currSalesHubAccId,
            layOutHeaderImageWeb,
            callOutTwoHeaderImage,
            callOutOneHeaderImage,
            ctaImage,
            false,
            clearLoader,
            setAlert,
            cancelHandler,
            salesHubAccIdSet,
            setSalesHubAccIdSet,
            staticLeadData
          )
        );
      });
    }
  };

export const saveSalesHubAccountAction =
  (
    formValues: salesHubValues,
    staticLeadData: any,
    statusChosen: string,
    companyLogo: any,
    servicePartnerLogo: any,
    layOutHeaderImageWeb: any,
    layOutHeaderImageMobile: any,
    callOutTwoHeaderImage: any,
    callOutOneHeaderImage: any,
    ctaImage: any,
    salesHubAccountId: string,
    salesHubAccIdSet: IdSetValues,
    setSalesHubAccIdSet: (name: string, value: number) => void,
    clearLoader: () => void,
    setAlert: () => void,
    cancelHandler: () => void,
    currentSalesHubAccId: string
  ) =>
  (dispatch: AppDispatch) => {
    const companyLogoFile = companyLogo?.cropped
      ? companyLogo.croppedFile
      : companyLogo.file;

    const serviceProvicerLogoFile = servicePartnerLogo?.cropped
      ? servicePartnerLogo.croppedFile
      : servicePartnerLogo.file;

    const token = localStorage.getItem('token');
    const queryparams = new URLSearchParams(window.location.search);
    const partnershipID: string = queryparams.get('partner_id') || '0';
    const formData = new FormData();
    formData.append('partnership_id', partnershipID);
    formData.append('company_name', formValues.companyName);
    formData.append(
      'company_logo',
      companyLogoFile || companyLogo?.source?.replace(/(\?time=.*)/gm, '')
    );
    formData.append('company_website', formValues.companyWebsite);
    formData.append('domain_name', formValues.domainName);
    formData.append('account_type', formValues.accountType);
    formData.append('industry', formValues.industry);
    formData.append(
      'target_buyer_titles',
      JSON.stringify(formValues.targetBuyerTitles)
    );
    formData.append(
      'is_team_checkin_cadence',
      formValues.cadenceShow.toString()
    );
    formData.append(
      'team_checkin_cadence_frequency',
      formValues.candenceFrequency
    );
    formData.append('team_checkin_cadence_day', formValues.candenceValue);
    formData.append(
      'is_service_partner_involved',
      formValues.servicePartnerShow.toString()
    );
    formData.append('service_provider_name', formValues.servicePartnerName);
    formData.append(
      'service_provider_logo',
      serviceProvicerLogoFile ||
        servicePartnerLogo?.source?.replace(/(\?time=.*)/gm, '')
    );
    if (statusChosen !== '') {
      formData.append('status_id ', statusChosen);
    }

    if (salesHubAccountId !== '0' || currentSalesHubAccId !== '') {
      formData.append(
        'sales_hub_account_id',
        salesHubAccountId === '0' ? currentSalesHubAccId : salesHubAccountId
      );
      multiPartPutRequest(`partnership/sales-hub-account/`, formData, {
        Authorization: `Token ${token}`,
      }).then((resp: any) => {
        if (resp.result === true) {
          const currSalesHubAccId = resp.data && resp.data.sales_hub_account_id;
          dispatch(
            setCurrentSalesHubAccId({
              currentSalesHubAccountId:
                resp.data && resp.data.sales_hub_account_id.toString(),
            })
          );
          dispatch(
            setGeneralErrMsg({
              generalErrMsg: '',
              generalValidationField: '',
            })
          );
          dispatch(
            handleSaveSiteLayout(
              formValues,
              staticLeadData,
              currSalesHubAccId,
              layOutHeaderImageWeb,
              layOutHeaderImageMobile,
              callOutTwoHeaderImage,
              callOutOneHeaderImage,
              ctaImage,
              true,
              clearLoader,
              setAlert,
              cancelHandler,
              salesHubAccIdSet,
              setSalesHubAccIdSet
            )
          );
        } else {
          clearLoader();
          dispatch(
            setGeneralErrMsg({
              generalErrMsg: resp.data.msg,
              generalValidationField: resp.data.validation_error_field,
            })
          );
        }
      });
    } else {
      multiPartRequest(`partnership/sales-hub-account/`, formData, {
        Authorization: `Token ${token}`,
      }).then((resp: any) => {
        if (resp.result === true) {
          const currSalesHubAccId = resp.data && resp.data.sales_hub_account_id;

          dispatch(
            setGeneralErrMsg({
              generalErrMsg: '',
              generalValidationField: '',
            })
          );
          dispatch(
            setCurrentSalesHubAccId({
              currentSalesHubAccountId:
                resp.data && resp.data.sales_hub_account_id.toString(),
            })
          );
          dispatch(
            handleSaveSiteLayout(
              formValues,
              staticLeadData,
              currSalesHubAccId,
              layOutHeaderImageWeb,
              layOutHeaderImageMobile,
              callOutTwoHeaderImage,
              callOutOneHeaderImage,
              ctaImage,
              false,
              clearLoader,
              setAlert,
              cancelHandler,
              salesHubAccIdSet,
              setSalesHubAccIdSet
            )
          );
        } else {
          clearLoader();
          dispatch(
            setGeneralErrMsg({
              generalErrMsg: resp.data.msg,
              generalValidationField: resp.data.validation_error_field,
            })
          );
        }
      });
    }
  };

export default salesHubAccountSlice.reducer;
