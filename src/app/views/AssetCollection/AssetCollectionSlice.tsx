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
  multiPartRequest,
  multiPartPutRequest,
  deleteRequest,
} from '../../service';
import { AppDispatch, RootState } from '../../store';
import {
  State,
  assetCollectionPayload,
  AssetCollectionAssetInfo,
  AssetCollectionInfo,
} from './types';

const initialState: State = {
  errorMsg: '',
  assetInfo: [],
  thumbnailUploadedTime: Date.now(),
  selectedAssetCollectionIds: [],
  assetCollectionInfo: [],
  refreshTimeStamp: Date.now(),
  selectedAssets: [],
  selectedAssetsIds: [],
};

interface assetValues {
  name: string;
  tags: string[];
  docType: string;
  id: number;
  file: string;
  accessDocType: string;
}
// Slice
export const assetCollectionSlice = createSlice({
  name: 'uploadAsset',
  initialState,
  reducers: {
    setErrMsg(state, { payload }: PayloadAction<{ errorMsg: string }>) {
      state.errorMsg = payload.errorMsg;
    },
    setAssetInfo(
      state,
      { payload }: PayloadAction<{ assetInfo: AssetCollectionAssetInfo[] }>
    ) {
      state.assetInfo = payload.assetInfo;
    },
    setThumbnailUploadedTime(
      state,
      {
        payload,
      }: PayloadAction<{
        thumbnailUploadedTime: number;
      }>
    ) {
      state.thumbnailUploadedTime = payload.thumbnailUploadedTime;
    },
    setSlectedAssetCollectionIds(
      state,
      { payload }: PayloadAction<{ selectedAssetCollectionIds: number[] }>
    ) {
      state.selectedAssetCollectionIds = payload.selectedAssetCollectionIds;
    },
    setSlectedAssetCollectionInfo(
      state,
      { payload }: PayloadAction<{ assetCollectionInfo: AssetCollectionInfo[] }>
    ) {
      state.assetCollectionInfo = payload.assetCollectionInfo;
    },
    setSelectedAssets(
      state,
      { payload }: PayloadAction<{ selectedAssets: AssetCollectionAssetInfo[] }>
    ) {
      state.selectedAssets = payload.selectedAssets;
    },
    setSelectedAssetsIds(
      state,
      { payload }: PayloadAction<{ selectedAssetsIds: number[] }>
    ) {
      state.selectedAssetsIds = payload.selectedAssetsIds;
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
  setErrMsg,
  setAssetInfo,
  setThumbnailUploadedTime,
  setSlectedAssetCollectionIds,
  setSlectedAssetCollectionInfo,
  setRefreshTimeStamp,
  setSelectedAssets,
  setSelectedAssetsIds,
} = assetCollectionSlice.actions;

export const saveAssetCollectionAction =
  (
    payload: assetCollectionPayload,
    assetCollectionId: any,
    partnershipId: string,
    // thumbnailImage: File,
    loaderAction: () => void,
    setAlert: (value: string) => void,
    closeModal: () => void,
    cbFunc: () => void
  ) =>
  (dispatch: AppDispatch) => {
    console.log('inside asset collection action', assetCollectionId);
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('name', payload.name);
    formData.append('description', payload.description);
    formData.append('image', payload.thumbnailImage);
    formData.append('partnership_id', partnershipId);
    formData.append('tags', JSON.stringify(payload.tags));
    formData.append('asset_ids', JSON.stringify(payload.assetIds));

    if (assetCollectionId) {
      formData.append('solution_narrative_id', assetCollectionId);
      multiPartPutRequest(`partnership/solution-narrative/`, formData, {
        Accept: 'application/json',
        Authorization: `Token ${token}`,
      }).then((resp: any) => {
        if (resp.result === true) {
          setRefreshTimeStamp({
            refreshTimeStamp: Date.now(),
          });
          loaderAction();
          closeModal();
          setAlert('success');
          cbFunc();
        } else {
          closeModal();
          dispatch(
            setErrMsg({
              errorMsg: resp.data.msg,
            })
          );
          loaderAction();
          cbFunc();
        }
      });
    } else {
      multiPartRequest(`partnership/solution-narrative/`, formData, {
        Accept: 'application/json',
        Authorization: `Token ${token}`,
      }).then((resp: any) => {
        if (resp.result === true) {
          setRefreshTimeStamp({
            refreshTimeStamp: Date.now(),
          });
          loaderAction();
          closeModal();
          setAlert('success');
          cbFunc();
        } else {
          closeModal();
          dispatch(
            setErrMsg({
              errorMsg: resp.data.msg,
            })
          );
          loaderAction();
          cbFunc();
        }
      });
    }
  };

export const deleteAssetAction =
  (
    partnershipId: string,
    assetCollectionIds: number[],
    loaderAction: () => void,
    setAlert: (value: string) => void,
    refreshAssetCollection: () => void,
    closeDialogBox: () => void
  ) =>
  (dispatch: AppDispatch) => {
    const token = localStorage.getItem('token');
    deleteRequest(
      `partnership/solution-narrative/`,
      {
        Authorization: `Token ${token}`,
      },
      {
        partnership_id: partnershipId,
        solution_narrative_ids: assetCollectionIds,
      }
    ).then((response: any) => {
      if (response.result === true) {
        setRefreshTimeStamp({
          refreshTimeStamp: Date.now(),
        });
        loaderAction();
        setAlert('success');
        refreshAssetCollection();
        closeDialogBox();
      }
    });
  };

export const selectAssetCollectionResponse = (state: RootState) =>
  state.assetCollectionSlice;

export default assetCollectionSlice.reducer;
