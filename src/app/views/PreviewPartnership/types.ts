/* eslint-disable linebreak-style */
export type State = {
  user: {
    email: string;
    name: string;
    code: number;
    url: URL;
  };
};

export interface previewPartnershipPayload {
  partnershipName: string;
  webSubdomainName: string;
  companyName: string;
  companyLogo: string;
  companyAddress: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  privacyPolicyURL: string;
  siteTermsURL: string;
  cookiePolicy: string;
  partnerCompanyName: string;
  partnerCompanySiteTermsURL: string;
  partnerCompanyLogo: string;
  partnerCompanyCookiePolicy: string;
  partnerCompanyPrivacyPolicyURL: string;
}
