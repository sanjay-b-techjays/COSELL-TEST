/* eslint-disable linebreak-style */
export interface PartnershipInfoPayload {
  whitelistedDomains: string[];
  partnershipName: string;
  websiteSubDomain: string;
  favIcon: string | File;
}

export interface CompanyInfoPayload {
  companyName: string;
  companyAddress: string;
  companyWebsite: string;
  city: string;
  country: string;
  privacyPolicyURL: string;
  siteTermsURL: string;
  cookiePolicy: string;
  companyLogo: string;
  state: string;
  zipCode: string;
}

export interface CompanyPartnerInfoPayload {
  partnerCompanyName: string;
  partnerCompanyLogo: string;
  partnerCompanyPrivacyPolicyURL: string;
  partnerCompanySiteTermsURL: string;
  partnerCompanyCookiePolicy: string;
}

export interface CoordinatorPartnerInfoPayload {
  coordinatorname: string;
  email: string;
  role: string;
  companyName: string;
}

export interface PreviewPartnershipPayload {
  partnershipName: string;
  websiteSubDomain: string;
  whitelistedDomain: string[];
  companyName: string;
  companyLogo: string;
  companyAddress: string;
  companyWebsite: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  privacyPolicyURL: string;
  siteTermsURL: string;
  cookiePolicy: string;
  partnerCompanyName: string;
  partnerCompanySiteTermsURL: string;
  partnerCompanyLogo: string;
  partnerCompanyCookiePolicy: string;
  partnerCompanyPrivacyPolicyURL: string;
}
export interface warningEditorPayload {
  show: boolean;
  navigateAction: () => void;
}
export interface State {
  partnershipId: string;
  companyInformationId: string;
  partnerCompanyInformationId: string;
  errorMsg: string;
  validationErrField: string;
  timeStamp: number;
  refreshTimeStamp: number;
  refreshAccDetailTimeStamp: number;
  partnerCompanyName: string;
  isCreatePartnershipFormEdited: boolean;
  showCreatePartnershipWarningEditor: warningEditorPayload;
}
