/* eslint-disable linebreak-style */
import React from 'react';
import styles from './Header.module.css';

const Header = ({ LogoList, isServiceLogoPresent }) => {
  console.log(LogoList, 'LogoList');
  return (
    <div
      className={
        isServiceLogoPresent ? styles.ctaImgContainer : styles.ctaImgContainer2
      }
    >
      {LogoList?.map((logo, index) => (
        <>
          {logo && (
            <img
              src={logo ? `${logo}?t=${new Date().getTime()}` : logo}
              alt={logo}
              id={logo + index}
              className={styles.CtaLogoImg}
            />
          )}
        </>
      ))}
    </div>
  );
};

export default Header;
