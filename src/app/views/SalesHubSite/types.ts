/* eslint-disable linebreak-style */
export type State = {
  generalErrMsg: string;
  generalValidationField: string;
  siteLayoutErrMsg: string;
  siteLayoutValidationField: string;
  callOutOneErrMsg: string;
  callOutOneValidationField: string;
  callOutTwoErrMsg: string;
  callOutTwoValidationField: string;
  ctaErrMsg: string;
  ctaValidationField: string;
  currentSalesHubAccountId: string;
  accountTeamErrMsg: string;
  accountTeamValidationField: string;
};

export interface salesHubValues {
  companyName: string;
  companyLogo: string;
  domainName: string;
  staticFormShow: boolean;
  accountType: string;
  industry: string;
  companyWebsite: string;
  targetBuyerTitles: string[];
  cadenceShow: boolean;
  candenceValue: string;
  candenceFrequency: string;
  servicePartnerShow: boolean;
  servicePartnerName: string;
  servicePartnerLogo: string;
  salesMotion: string;
  layOutHeaderText: string;
  layOutSubHeaderTxt: string;
  layOutHeaderImgWeb: string;
  layOutHeaderImgMobile: string;
  layOutFontColor: string;
  layOutFontStyle: string;
  callOutOneHeaderText: string;
  callOutOneSubHeaderTxt: string;
  callOutOneHeaderImg: string;
  callOutOneFontColor: string;
  callOutTwoHeaderText: string;
  callOutTwoSubHeaderTxt: string;
  callOutTwoHeaderImg: string;
  callOutTwoFontColor: string;
  ctaName: string;
  ctaHeaderTxt: string;
  ctaSubHeaderTxt: string;
  ctaDescription: string;
  ctaImage: string;
  ctaEmbeddedCode: string;
  accountTeamEmailList: string;
  ctaFormHeader: string;
}

export interface Alert {
  showAlert: boolean;
  severity: string;
  message: string;
}

export interface IdSetValues {
  siteLayoutId: string;
  callOutSecOneId: string;
  callOutSecTwoId: string;
  ctaId: string;
}
