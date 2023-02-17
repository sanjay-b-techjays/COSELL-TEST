import React from 'react';
import { makeStyles, createStyles } from '@material-ui/styles';
import { BannerLabels } from 'src/strings';
import { BannerProps } from './types';

const useStyles = makeStyles(() =>
  createStyles({
    flexBackground: {
      background: '#02273c',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 'auto',
      height: '100vh',
    },
    container: {
      background: '#ffff',
      padding: '40px 15px',
      borderRadius: '10px',
      margin: 'auto',
      width: '60%',
    },
    content: {
      textAlign: 'center',
      fontWeight: 500,
      fontSize: '19px',
      marginBottom: '40px',
      color: '#02273c',
    },
    bannerPercentageDiv: {
      width: '70px',
      height: '70px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '18px',
      fontWeight: 500,
      marginLeft: 'auto',
      marginRight: 'auto',
      marginBottom: '20px',
    },
    tagLine: {
      fontSize: '12px',
      color: '#838383',
      textAlign: 'center',
    },
  })
);

const Banner = () => {
  const classes = useStyles();
  const banContent = [
    {
      percentage: '76%',
      color: '#fb8b48',
      background: '#f7fbb7',
      content: 'have increased ROI',
    },
    {
      percentage: '80%',
      color: '#fd03a2',
      background: '#fdc9ea',
      content: 'have Higher Customer LTV',
    },
    {
      percentage: '86%',
      color: '#0eabc5',
      background: '#b8f5ff',
      content: 'have Higher Win Rates',
    },
  ];
  const BannerContent = ({
    percentage,
    color,
    background,
    content,
  }: BannerProps) => {
    return (
      <div>
        <div
          className={classes.bannerPercentageDiv}
          style={{ background, color, borderRadius: '10px' }}
        >
          <div>{percentage}</div>
        </div>
        <div style={{ fontSize: '12px', color }}>{content}</div>
      </div>
    );
  };

  return (
    <div className={classes.flexBackground}>
      <div>
        <div className={classes.container}>
          <div className={classes.content}>{BannerLabels.content}</div>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            {banContent.map((data) => {
              return (
                <BannerContent
                  key={data.content}
                  percentage={data.percentage}
                  color={data.color}
                  background={data.background}
                  content={data.content}
                />
              );
            })}
          </div>
        </div>
        <p className={classes.tagLine}>{BannerLabels.tagLine}</p>
      </div>
    </div>
  );
};

export default Banner;
