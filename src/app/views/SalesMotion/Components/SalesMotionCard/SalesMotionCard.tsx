/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable comma-dangle */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable linebreak-style */
import React from 'react';
import styles from './SalesMotionCard.module.css';

interface salesMotionCardValues {
  img: string;
  title: string;
  header: string;
  subHeader: string;
  logo: {
    companyLogo: string;
    partnerCompanyLogo: string;
  };
}

function SalesMotionCard(props: salesMotionCardValues) {
  return (
    <div className={styles.salesMotionCardMainDiv}>
      <div className={styles.salesMotionCardMainContentsDiv}>
        <div className={styles.salesMotionCardTitleDiv}>
          {props.title?.slice(0, 30)}
          {props.title?.length > 30 ? '...' : ''}
        </div>
        <div className={styles.salesMotionLogoContainer}>
          {props.logo.companyLogo && (
            <img
              className={styles.salesMotionLogo}
              src={props.logo.companyLogo}
              alt=""
            />
          )}
          {props.logo.partnerCompanyLogo && (
            <img
              className={styles.salesMotionLogo}
              src={props.logo.partnerCompanyLogo}
              alt=""
            />
          )}
        </div>
      </div>
      <div className={styles.salesMotionCardImgDiv}>
        <img className={styles.salesMotionCardImg} src={props.img} alt="" />
        <div className={styles.salesMotionCardHeader}>
          {props.header?.slice(0, 30)}
          {props.header?.length > 30 ? '...' : ''}
        </div>
        <div className={styles.salesMotionCardSubheader}>
          {props.subHeader?.slice(0, 30)}
          {props.subHeader?.length > 30 ? '...' : ''}
        </div>
      </div>
    </div>
  );
}

export default SalesMotionCard;
