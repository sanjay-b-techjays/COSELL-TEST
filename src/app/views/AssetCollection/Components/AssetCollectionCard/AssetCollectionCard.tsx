/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable comma-dangle */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable linebreak-style */
import React from 'react';
import { AssetCollectionLabels } from '../../../../../strings';
import styles from './AssetCollectionCard.module.css';

interface assetCollectionCardValues {
  img: string;
  title: string;
  content: string;
}

function AssetCollectionCard(props: assetCollectionCardValues) {
  return (
    <div className={styles.solution_narrative_card_main_div}>
      <div className={styles.solution_narrative_card_img_div}>
        <img
          className={styles.solution_narrative_card_img}
          src={
            props?.img ? `${props?.img}?t=${new Date().getTime()}` : props?.img
          }
          alt="img"
        />
      </div>
      <div className={styles.solution_narrative_card_main_contents_div}>
        <div className={styles.solution_narrative_card_title_div}>
          {props.title.slice(0, 25)}
          {props.title?.length > 25 ? '...' : ''}
        </div>
        <div className={styles.solution_narrative_card_content_div}>
          {props.content.slice(0, 150)}
          {props.content?.length > 150 ? '...' : ''}
        </div>
        {/* <a className={styles.solution_narrative_card_link}>
          {AssetCollectionLabels.learnMore} {`>`}
        </a> */}
      </div>
    </div>
  );
}

export default AssetCollectionCard;
