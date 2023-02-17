/* eslint-disable linebreak-style */
import React from 'react';
import { campaignHubLabels } from 'src/strings';
import styles from './Footer.module.css';

const Footer = ({ partnerShipDetail }) => {
  console.log(partnerShipDetail);
  return (
    <footer className={styles.footerContainer}>
      <div className={styles.footerContentContainer}>
        <div className={styles.imageContainer}>
          <img
            className={styles.companyLogo}
            src={partnerShipDetail.company_information.logo}
            alt="company_Logo"
          />
        </div>
        <div className={styles.address}>
          {partnerShipDetail.company_information.company_name}
        </div>
        <div className={styles.addressLine}>
          <p>{partnerShipDetail.company_information.company_address}</p>
          <p>
            <span>{`${partnerShipDetail.company_information.city}, `}</span>
            <span>{`${partnerShipDetail.company_information.state} -`}</span>
            <span>{` ${partnerShipDetail.company_information.zipcode}`}</span>
          </p>
          <p>{partnerShipDetail.company_information.country}</p>
        </div>
        <div className={styles.urlContainer}>
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
            className={styles.cookie}
            rel="noreferrer"
          >
            {campaignHubLabels.cookiePolicy}
          </a>
        </div>
        <div className={styles.copyrights}>
          <div style={{ display: 'flex' }}>
            <div style={{ marginRight: '3px' }}>©</div>
            <div>
              {`2022 ${partnerShipDetail.company_information.company_name}. All rights reserved`}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
