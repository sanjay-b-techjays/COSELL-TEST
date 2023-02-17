/* eslint-disable no-nested-ternary */
/* eslint-disable linebreak-style */
/* eslint-disable operator-linebreak */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable linebreak-style */
import React, { useEffect } from 'react';
import { SalesRepFooterLabels } from 'src/strings';
import styles from './Footer.module.css';

const Footer = ({ address, darkMode, isPreview, companyLogo }) => (
  <div
    className={styles.footWrap}
    data-theme={isPreview ? '' : darkMode ? 'dark' : 'light'}
  >
    <div className={styles.footerImgWrap}>
      <img
        src={
          companyLogo
            ? `${companyLogo}?time=${new Date().getTime()}`
            : companyLogo
        }
        alt=""
      />
    </div>
    <div className={styles.footerDataWrap}>
      <div className={styles.addressTxt}>
        <div>
          <div>{address.company_name}</div>
          <div>{address.company_address}</div>
          <div>{`${address.city}, ${address.state}, ${address.zipcode}`}</div>
          <div>{address.country}</div>

          <div
            className={`${
              isPreview ? styles.disabledLinksWrap : styles.linksWrap
            }`}
          >
            <a
              className={styles.link}
              target="_blank"
              rel="noreferrer"
              href={
                address.site_terms_url.includes('https://') ||
                address.site_terms_url.includes('http://')
                  ? address.site_terms_url
                  : `https://${address.site_terms_url}`
              }
            >
              {SalesRepFooterLabels.siteUrl}
            </a>
            <a
              className={styles.link}
              rel="noreferrer"
              target="_blank"
              href={
                address.privacy_policy_url.includes('https://') ||
                address.privacy_policy_url.includes('http://')
                  ? address.privacy_policy_url
                  : `https://${address.privacy_policy_url}`
              }
            >
              {SalesRepFooterLabels.privacyPolicyUrl}
            </a>
            <a
              className={styles.link}
              target="_blank"
              rel="noreferrer"
              href={
                address.cookie_policy.includes('https://') ||
                address.cookie_policy.includes('http://')
                  ? address.cookie_policy
                  : `https://${address.cookie_policy}`
              }
            >
              {SalesRepFooterLabels.cookiePolicyUrl}
            </a>
          </div>
        </div>
      </div>
      <div className={styles.reservedTxt}>
        <div style={{ display: 'flex' }}>
          <div style={{ marginRight: '3px' }}>©</div>
          <div>{`2022 ${address.company_name}. All rights reserved`}</div>
        </div>
      </div>
    </div>
  </div>
);
export default Footer;
