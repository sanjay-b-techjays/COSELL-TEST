/* eslint-disable linebreak-style */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable comma-dangle */
/* eslint-disable function-paren-newline */
/* eslint-disable linebreak-style */
import React from 'react';
import { BannerLabels } from '../../../../../strings';
import { BannerProps } from './types';
import styles from './Banner.module.css';
import dottedBg from '../../../../assets/dotted_bg.svg';

const Banner = () => {
  const banContent = [
    {
      percentage: '76%',
      color: '#F2B952',
      background: '#FDF8EF',
      content: 'have increased ROI',
    },
    {
      percentage: '80%',
      color: '#EA6A93',
      background: '#FFECF2',
      content: 'have Higher Customer LTV',
    },
    {
      percentage: '86%',
      color: '#6FC4CA',
      background: '#E5F7F8',
      content: 'have Higher Win Rates',
    },
  ];
  const BannerContent = ({
    percentage,
    color,
    background,
    content,
  }: BannerProps) => (
    <div>
      <div
        className={styles.bannerPercentageDiv}
        style={{ background, color, borderRadius: '10px' }}
      >
        <div>{percentage}</div>
      </div>
      <div style={{ fontSize: '12px', color }}>{content}</div>
    </div>
  );

  return (
    <div className={styles.flexBackground}>
      <div>
        <div className={styles.container}>
          <div className={styles.dotted1}>
            <img src={dottedBg} alt="dotted" />
          </div>
          <div className={styles.dotted2}>
            <img src={dottedBg} alt="dotted" />
          </div>
          <div className={styles.content}>{BannerLabels.content}</div>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            {banContent.map((data) => (
              <BannerContent
                key={data.content}
                percentage={data.percentage}
                color={data.color}
                background={data.background}
                content={data.content}
              />
            ))}
          </div>
        </div>
        <p className={styles.tagLine}>{BannerLabels.tagLine}</p>
      </div>
    </div>
  );
};

export default Banner;
