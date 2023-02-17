/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable operator-linebreak */
/* eslint-disable linebreak-style */
/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  postRequest,
  multiPartRequest,
  putRequest,
  multiPartPutRequest,
  getRequest,
  deleteRequest,
} from '../../service';
import { AppDispatch, RootState } from '../../store';
import {
  State,
  salesHubPayload,
  salesHubAssetCollectionInfo,
  SalesHubInfo,
} from './types';

const initialState: State = {
  errorMsg: '',
  assetCollectionInfo: [],
  selectedSalesHubId: '',
  salesHubInfo: [],
  refreshTimeStamp: Date.now(),
  isSalesHubFormEdited: false,
  showSalesHubWarningEditor: {
    show: false,
    navigateAction: null,
  },
};

interface salesHubValues {
  headerText: string;
  subHeaderText: string;
  headerImage: string;
}

// Slice
export const salesHubSlice = createSlice({
  name: 'salesHub',
  initialState,
  reducers: {
    setErrMsg(state, { payload }: PayloadAction<{ errorMsg: string }>) {
      state.errorMsg = payload.errorMsg;
    },
    setSalesHubAssetCollectionInfo(
      state,
      {
        payload,
      }: PayloadAction<{
        assetCollectionInfo: salesHubAssetCollectionInfo[];
      }>
    ) {
      state.assetCollectionInfo = payload.assetCollectionInfo;
    },
    setSalesHubId(
      state,
      { payload }: PayloadAction<{ selectedSalesHubId: string }>
    ) {
      state.selectedSalesHubId = payload.selectedSalesHubId;
    },
    setSalesHubInfo(
      state,
      { payload }: PayloadAction<{ salesHubInfo: SalesHubInfo[] }>
    ) {
      state.salesHubInfo = payload.salesHubInfo;
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
    setIsSalesHubFormEdited(
      state,
      { payload }: PayloadAction<{ isSalesHubFormEdited: boolean }>
    ) {
      state.isSalesHubFormEdited = payload.isSalesHubFormEdited;
    },
    setShowSalesHubWarningEditor(
      state,
      { payload }: PayloadAction<{ show: boolean; navigateAction: () => void }>
    ) {
      state.showSalesHubWarningEditor = { ...payload };
    },
  },
});

// Actions
export const {
  setErrMsg,
  setSalesHubAssetCollectionInfo,
  setSalesHubInfo,
  setSalesHubId,
  setRefreshTimeStamp,
  setIsSalesHubFormEdited,
  setShowSalesHubWarningEditor,
} = salesHubSlice.actions;

export const saveSalesHubAction =
  (
    payload: salesHubPayload,
    partnershipId: string,
    salesHubId: string,
    loaderAction: () => void,
    history: any,
    showAlert: (message: string) => void,
    cbFunc: () => void,
    setShowPreview: React.Dispatch<React.SetStateAction<boolean>>,
    setIsFromEdited: React.Dispatch<React.SetStateAction<boolean>>
  ) =>
  (dispatch: AppDispatch) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('header_text', payload.headerText);
    formData.append('sub_header_text', payload.subHeaderText);
    formData.append('header_image', payload.headerImg);
    formData.append('font_color_id', payload.fontColor);
    formData.append('font_family_id', payload.fontFamily);
    formData.append('partnership_id', partnershipId);
    formData.append(
      'solution_narrative_ids',
      JSON.stringify(payload.assetCollectionId)
    );

    if (salesHubId) {
      formData.append('sales_hub_id', salesHubId);
      multiPartPutRequest(`partnership/sales-hub/`, formData, {
        Accept: 'application/json',
        Authorization: `Token ${token}`,
      }).then((resp: any) => {
        if (resp.result === true) {
          setRefreshTimeStamp({
            refreshTimeStamp: Date.now(),
          });
          loaderAction();
          dispatch(
            setIsSalesHubFormEdited({
              isSalesHubFormEdited: false,
            })
          );
          setIsFromEdited(false);
          showAlert(resp.msg);
          cbFunc();
          setShowPreview(true);
        } else {
          dispatch(
            setErrMsg({
              errorMsg: resp.data.msg,
            })
          );
          loaderAction();
        }
      });
    } else {
      multiPartRequest(`partnership/sales-hub/`, formData, {
        Accept: 'application/json',
        Authorization: `Token ${token}`,
      }).then((resp: any) => {
        if (resp.result === true) {
          setRefreshTimeStamp({
            refreshTimeStamp: Date.now(),
          });
          loaderAction();
          dispatch(
            setIsSalesHubFormEdited({
              isSalesHubFormEdited: false,
            })
          );
          setIsFromEdited(false);
          history.push(
            `/salesHub?partner_id=${partnershipId}&sales_hub_id=${resp.data.sales_hub_id}`
          );
          showAlert(resp.msg);
          cbFunc();
          setShowPreview(true);
        } else {
          dispatch(
            setErrMsg({
              errorMsg: resp.data.msg,
            })
          );
          loaderAction();
        }
      });
    }
  };

export const deleteAssetCollectionAction =
  (
    partnershipId: string,
    salesHubId: string,
    loaderAction: () => void,
    // setAlert: (value: string) => void,
    refreshSalesHub: () => void
  ) =>
  (dispatch: AppDispatch) => {
    const token = localStorage.getItem('token');
    deleteRequest(
      `partnership/sales-hub/`,
      {
        Authorization: `Token ${token}`,
      },
      {
        partnership_id: partnershipId,
        sales_hub_id: salesHubId,
      }
    ).then((response: any) => {
      if (response.result === true) {
        setRefreshTimeStamp({
          refreshTimeStamp: Date.now(),
        });
        loaderAction();
        // setAlert('success');
        refreshSalesHub();
      }
    });
  };

// Selectors
export const salesHubResponse = (state: RootState) => state.salesHubSlice;

export default salesHubSlice.reducer;
