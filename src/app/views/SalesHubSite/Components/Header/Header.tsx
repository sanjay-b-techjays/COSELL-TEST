/* eslint-disable linebreak-style */
import React from 'react';
import styles from './Header.module.css';

const Header = ({ companyLogo, partnerLogo }) => (
  <div className={styles.headerWrap}>
    <div className={styles.logoImg}>
      <img
        src={
          companyLogo
            ? `${companyLogo}?time=${new Date().getTime()}`
            : companyLogo
        }
        alt=""
      />
    </div>
    <div className={styles.logoImg}>
      <img
        src={
          partnerLogo
            ? `${partnerLogo}?time=${new Date().getTime()}`
            : partnerLogo
        }
        alt=""
      />
    </div>
  </div>
);
export default Header;
