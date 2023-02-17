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
import { State } from './types';

const initialState: State = {
  errorMsg: '',
  flag: '',
};

// Slice
export const campaignHubSlice = createSlice({
  name: 'campaignHub',
  initialState,
  reducers: {
    setErrMsg(
      state,
      { payload }: PayloadAction<{ errorMsg: string; flag: string }>
    ) {
      state.errorMsg = payload.errorMsg;
      state.flag = payload.flag;
      console.log(payload.errorMsg, payload.flag, 'inside setstae');
    },
  },
});

// Actions
export const { setErrMsg } = campaignHubSlice.actions;

export const getCampaignHubDetails =
  (
    domainName: string,
    accountName: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setPartnerShipDetail: React.Dispatch<React.SetStateAction<any[]>>,
    setSalesHubDetail: React.Dispatch<React.SetStateAction<any[]>>,
    setfontFamily?: React.Dispatch<React.SetStateAction<any>>,
    setAssetCollectionDetail?: React.Dispatch<React.SetStateAction<any[]>>,
    setfontColor?: React.Dispatch<React.SetStateAction<any>>,
    setCalloutOneFontColor?: React.Dispatch<React.SetStateAction<any>>,
    setCalloutTwoFontColor?: React.Dispatch<React.SetStateAction<any>>
  ) =>
  (dispatch: AppDispatch) => {
    const DomainName = localStorage.getItem('subDomainName');
    const AccountName = window.location.pathname.split('/')[1];
    getRequest(
      `partnership/sales-hub-account/site/?sales_hub_domain=${DomainName}&account_name=${AccountName}`,
      {}
    ).then((response: any) => {
      if (response.result === true) {
        if (response.data.partnership) {
          setPartnerShipDetail(response.data.partnership);
        }
        if (response.data.sales_hub_account) {
          console.log(
            'color',
            response.data.sales_hub_account.call_out_section_one.font_color
          );
          setSalesHubDetail(response.data.sales_hub_account);
          setfontFamily(
            response.data.sales_hub_account.site_layout.font_style.name
          );
          localStorage.setItem(
            'fontFamily',
            response.data.sales_hub_account.site_layout.font_style.name
          );
          setfontColor(
            response.data.sales_hub_account.site_layout.font_color.name
          );
          setCalloutOneFontColor(
            response.data.sales_hub_account.call_out_section_one.font_color.name
          );
          setCalloutTwoFontColor(
            response.data.sales_hub_account.call_out_section_two.font_color.name
          );
        }
        if (response.data.solution_narratives && setAssetCollectionDetail) {
          setAssetCollectionDetail(response.data.solution_narratives);
        }
      }
      setLoading(false);
    });
  };

export const getCampaignHubAssetCollectDetails =
  (
    domainName: string,
    accountName: string,
    setAssetCollectionList: React.Dispatch<React.SetStateAction<any[]>>,
    setAccountName?: React.Dispatch<React.SetStateAction<any>>
  ) =>
  (dispatch: AppDispatch) => {
    const DomainName = localStorage.getItem('subDomainName');
    const AccountName = window.location.pathname.split('/')[1];
    getRequest(
      `partnership/sales-hub-account/get-solution-narrative/?sales_hub_domain=${DomainName}&account_name=${AccountName}`,
      {}
    ).then((response: any) => {
      if (response.result === true) {
        if (response.data) {
          setAssetCollectionList(response.data);
          setAccountName(AccountName);
        }
        console.log(response, 'response sn');
      }
    });
  };

// Selectors
export const selectCampaignResponse = (state: RootState) =>
  state.campaignHubSlice;
export default campaignHubSlice.reducer;
