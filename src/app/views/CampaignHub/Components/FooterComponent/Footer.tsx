/* eslint-disable linebreak-style */
import React from 'react';
import './Footer.css';
import { campaignHubLabels } from 'src/strings';

const Footer = (props) => {
  const { partnerShipDetail } = props;
  return (
    <>
      {partnerShipDetail !== null && (
        <div className="footerMainDiv">
          <div className="footerPartnersAdressContainer">
            <div className="footerPartnersContainer">
              {partnerShipDetail.company_information.logo && (
                <div className="footerPartnersDiv">
                  <img
                    className="footerPartnersImg"
                    src={`${
                      partnerShipDetail?.company_information?.logo
                        ? `${
                            partnerShipDetail?.company_information?.logo
                          }?t=${new Date().getTime()}`
                        : partnerShipDetail?.company_information?.logo
                    }`}
                    alt=""
                  />
                </div>
              )}
            </div>
            <div className="footerAddressPolicyDiv">
              <div className="footerAddressDiv">
                <div className="footerPartnersTextDiv">
                  {partnerShipDetail.company_information.company_name}
                </div>
                {partnerShipDetail.company_information.company_address}
                <div>
                  {partnerShipDetail.company_information.city},{' '}
                  {partnerShipDetail.company_information.state}{' '}
                  {partnerShipDetail.company_information.zipcode}
                </div>
                <div>{partnerShipDetail.company_information.country}</div>
              </div>
              <div className="footerPolicyContainer">
                <a
                  target="_blank"
                  href={
                    partnerShipDetail.company_information.site_terms_url.includes(
                      'https://'
                    ) ||
                    partnerShipDetail.company_information.site_terms_url.includes(
                      'http://'
                    )
                      ? partnerShipDetail.company_information.site_terms_url
                      : `https://${partnerShipDetail.company_information.site_terms_url}`
                  }
                  className="footerPolicyDiv"
                  rel="noreferrer"
                >
                  {campaignHubLabels.siteTerms}
                </a>
                <a
                  target="_blank"
                  href={
                    partnerShipDetail.company_information.privacy_policy_url.includes(
                      'https://'
                    ) ||
                    partnerShipDetail.company_information.privacy_policy_url.includes(
                      'http://'
                    )
                      ? partnerShipDetail.company_information.privacy_policy_url
                      : `https://${partnerShipDetail.company_information.privacy_policy_url}`
                  }
                  className="footerPolicyDiv"
                  rel="noreferrer"
                >
                  {campaignHubLabels.privacyPolicy}
                </a>
                <a
                  target="_blank"
                  href={
                    partnerShipDetail.company_information.cookie_policy.includes(
                      'https://'
                    ) ||
                    partnerShipDetail.company_information.cookie_policy.includes(
                      'http://'
                    )
                      ? partnerShipDetail.company_information.cookie_policy
                      : `https://${partnerShipDetail.company_information.cookie_policy}`
                  }
                  className="footerPolicyDiv"
                  rel="noreferrer"
                >
                  {campaignHubLabels.cookiePolicy}
                </a>
              </div>
            </div>
          </div>
          <div className="footerCopyrightDiv">
            <div style={{ display: 'flex' }}>
              <div style={{ marginRight: '3px' }}>©</div>
              <div>
                {`2022 ${partnerShipDetail.company_information.company_name}. All rights reserved`}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
