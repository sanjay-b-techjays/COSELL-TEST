/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable comma-dangle */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable linebreak-style */
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { AssetCollectionLabels } from '../../../../../strings';
import styles from './CampaignHubCard.module.css';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { padding } from '@mui/system';
interface campaignHubCardValues {
  img: string;
  title: string;
  content: string;
  assetCollectionData: any;
  isHeaderImageRendered: boolean;
}

function CampaignHubCard(props) {
  const history = useHistory();

  return (
    <div
      onClickCapture={() => {
        props.onPageView(),
          window.location.assign(
            `${window.location.href}/viewAssets?assetCollection=${props.assetCollectionData.solution_narrative_id}`
          );
      }}
      className={styles.campaignHubCardMainDiv}
    >
      <div className={styles.campaignHubCardImgDiv}>
        {props.isHeaderImageRendered && (
          <img
            className={styles.campaignHubCardImg}
            src={`${
              props?.img
                ? `${props?.img}?t=${new Date().getTime()}`
                : props?.img
            }`}
            alt="img"
          />
        )}
      </div>
      <div className={styles.campaignHubCardMainContentsDiv}>
        <div className={styles.campaignHubCardTitleDivWrap}>
          <div className={styles.campaignHubCardTitleDiv}>
            {props?.title?.length > 50
              ? `${props.title.slice(0, 50)}...`
              : `${props.title.slice(0, 50)}`}
          </div>
          <div className={styles.campaignHubCardContentDiv}>
            {props?.content?.length > 200
              ? `${props.content.slice(0, 200)}...`
              : `${props.content.slice(0, 200)}`}
          </div>
        </div>
        <a className={styles.campaignHubCardLink}>
          {AssetCollectionLabels.learnMore}
          <ArrowForwardIosIcon
            style={{
              height: '15px',
              marginTop: '3px',
              width: '15px',
            }}
          />
        </a>
      </div>
    </div>
  );
}

export default CampaignHubCard;
