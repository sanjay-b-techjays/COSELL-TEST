/* eslint-disable linebreak-style */
// export interface generalValues {
//   name: string;
//   description: string;
//   targetBuyerTitles: string;
// }
// export interface siteLayoutValues {
//   headerText: string;
//   subHeaderText: string;
//   headerImg: string | File;
//   fontColor: string;
//   fontFamily: string;
// }
// export interface callOutSectionOneValues {
//   headerText: string;
//   subHeaderText: string;
//   headerImg: string | File;
//   fontColor: string;
// }
// export interface callOutSectionTwoValues {
//   headerText: string;
//   subHeaderText: string;
//   headerImg: string | File;
//   fontColor: string;
// }

import { FormikErrors, FormikTouched } from 'formik';

// export interface assetCollection {
//   name: string;
// }
// export interface ctaConfigurationValues {
//   headerText: string;
//   subHeaderText: string;
//   ctaImg: string | File;
//   embeddedCode: string;
// }

export interface salesMotionValues {
  name: string;
  description: string;
  targetBuyerTitles: string[];
  staticFormShow: boolean;

  layoutHeaderText: string;
  layoutSubHeaderText: string;
  layoutHeaderImageWeb: string | File;
  layoutHeaderImageMobile: string | File;
  layoutFontColor: string;
  layoutFontStyle: string;

  callOutOneheaderText: string;
  callOutOneSubHeaderText: string;
  callOutOneHeaderImage: string | File;
  callOutOneFontColor: string;

  callOutTwoHeaderText: string;
  callOutTwoSubHeaderText: string;
  callOutTwoHeaderImage: string | File;
  callOutTwoFontColor: string;

  ctaName: string;
  ctaHeaderText: string;
  ctaSubHeaderText: string;
  ctaDescription: string;
  ctaImage: string | File;
  ctaFormHeader: string;
  ctaEmbeddedCode: string;
}
export interface sectionProps {
  sectionValues: salesMotionValues;
  onChange: () => void;
  onBlur: () => void;
  errors: FormikErrors<salesMotionValues>;
  touched: FormikTouched<salesMotionValues>;
}
export interface listValues {
  key: string;
  id: number;
  value: string;
}

export interface savedValues {
  general: boolean;
  siteLayout: boolean;
  callOutSecOne: boolean;
  callOutSecTwo: boolean;
  assetCollectative: boolean;
  cta: boolean;
}
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
  refreshTimeStamp: number;
};
export interface Alert {
  showAlert: boolean;
  severity: string;
  message: string;
}
