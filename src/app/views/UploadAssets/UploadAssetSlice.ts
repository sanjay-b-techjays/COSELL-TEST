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
  getRequest,
} from '../../service';
import { AppDispatch, RootState } from '../../store';
import { State, uploadAssetPayload } from './types';

const initialState: State = {
  errorMsg: '',
  flag: '',
  refreshTimeStamp: Date.now(),
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
export const uploadAssetSlice = createSlice({
  name: 'uploadAsset',
  initialState,
  reducers: {
    setErrMsg(
      state,
      {
        payload,
      }: PayloadAction<{
        errorMsg: string;
        flag: string;
        refreshTimeStamp: number;
      }>
    ) {
      state.errorMsg = payload.errorMsg;
      state.flag = payload.flag;
      state.refreshTimeStamp = payload.refreshTimeStamp;
    },
  },
});

// Actions
export const { setErrMsg } = uploadAssetSlice.actions;

export const saveAssetAction =
  (
    payload: uploadAssetPayload,
    updateId: string,
    partnershipId: number,
    loaderAction: () => void,
    showAlert: (value: string, msg: string) => void,
    closeModal: () => void
  ) =>
  (dispatch: AppDispatch) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('asset_name', payload.assetName);
    formData.append('access_type', payload.assetType.toString());
    formData.append('file', payload.assetFile);
    formData.append('partnership_id', partnershipId.toString());
    formData.append('tags', JSON.stringify(payload.tags));

    if (updateId) {
      formData.append('asset_id', updateId);
      formData.append('status_id', payload.status);
      multiPartPutRequest(`partnership/asset/`, formData, {
        Accept: 'application/json',
        Authorization: `Token ${token}`,
      }).then((resp: any) => {
        if (resp.result === true) {
          loaderAction();
          closeModal();
          console.log(resp.msg, resp.result, 'inside success update');
          dispatch(
            setErrMsg({
              errorMsg: resp.msg,
              flag: resp.result.toString(),
              refreshTimeStamp: Date.now(),
            })
          );
          showAlert('success', resp.msg);
        } else {
          closeModal();
          console.log(resp.data.msg, resp.result, 'inside fail update');
          dispatch(
            setErrMsg({
              errorMsg: resp.data.msg,
              flag: resp.result.toString(),
              refreshTimeStamp: Date.now(),
            })
          );
          loaderAction();
          showAlert('error', resp.data.msg);
        }
      });
    } else {
      multiPartRequest(`partnership/asset/`, formData, {
        Accept: 'application/json',
        Authorization: `Token ${token}`,
      }).then((resp: any) => {
        if (resp.result === true) {
          loaderAction();
          closeModal();
          dispatch(
            setErrMsg({
              errorMsg: resp.msg,
              flag: resp.result.toString(),
              refreshTimeStamp: Date.now(),
            })
          );
          showAlert('success', resp.msg);
        } else {
          closeModal();
          dispatch(
            setErrMsg({
              errorMsg: resp.data.msg,
              flag: resp.result.toString(),
              refreshTimeStamp: Date.now(),
            })
          );
          loaderAction();
          showAlert('error', resp.data.msg);
        }
      });
    }
  };

export const deleteAssetAction =
  (
    partnershipId: string,
    assetId: string[],
    selected: string[],
    setSelected: (a: string[]) => void,
    deleteModal: () => void,
    clearLoader: () => void,
    showAlert: (value: string, msg: string) => void,
    cbFunc: () => void
  ) =>
  (dispatch: AppDispatch) => {
    const token = localStorage.getItem('token');
    deleteRequest(
      `partnership/asset`,
      {
        Authorization: `Token ${token}`,
      },
      {
        partnership_id: partnershipId,
        asset_ids: assetId,
      }
    ).then((response: any) => {
      if (response.result === true) {
        assetId.map((id: string) => {
          const index = selected.indexOf(id);
          if (index > -1) {
            selected.splice(index, 1);
          }
          return '';
        });
        setSelected(selected);
        deleteModal();
        clearLoader();
        dispatch(
          setErrMsg({
            errorMsg: response.msg,
            flag: response.result.toString(),
            refreshTimeStamp: Date.now(),
          })
        );
        showAlert('success', response.msg);
        cbFunc();
      } else {
        clearLoader();
        dispatch(
          setErrMsg({
            errorMsg: response.data.msg,
            flag: response.result.toString(),
            refreshTimeStamp: Date.now(),
          })
        );
        showAlert('error', response.data.msg);
      }
    });
  };

export const searchAssetAction =
  (
    partnershipId: string,
    limit: number,
    offset: number,
    nameSearch: string,
    accessTypeSearch: string,
    accessDocTypeSearch: string,
    setTableData: (data: any) => void,
    clearLoader: () => void,
    showAlert: (value: string, msg: string) => void,
    setCount: (data: any) => void
  ) =>
  (dispatch: AppDispatch) => {
    const token = localStorage.getItem('token');
    getRequest(
      `partnership/asset/?partnership_id=${partnershipId}${nameSearch}${accessTypeSearch}${accessDocTypeSearch}&offset=${offset}&limit=${limit}`,
      {
        Authorization: `Token ${token}`,
      }
    ).then((response: any) => {
      if (response.result === true) {
        const updatedData =
          response.data.length > 0 &&
          response.data.map((data: any) => {
            const assetObj = {} as assetValues;
            assetObj.name = data.asset_name;
            assetObj.tags = data.tags;
            assetObj.docType = data.file_type;
            assetObj.id = data.asset_id;
            assetObj.file = data.file;
            assetObj.accessDocType = data.access_type;
            return assetObj;
          });
        setTableData(updatedData);
        if (response.count) {
          setCount(response.count);
        }
        // showAlert('success');
        clearLoader();
      } else {
        clearLoader();
        dispatch(
          setErrMsg({
            errorMsg: response.data.msg,
            flag: response.result.toString(),
            refreshTimeStamp: Date.now(),
          })
        );
        showAlert('error', response.data.msg);
      }
    });
  };
// console.log(state, ''); // Selectors
export const selectuploadAssetResponse = (state: RootState) =>
  state.uploadAssetSlice;
export default uploadAssetSlice.reducer;
