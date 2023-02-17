/* eslint-disable comma-dangle */
/* eslint-disable linebreak-style */
import React, { useEffect } from 'react';
import closeIcon from '../../assets/closeIcon.svg';
import styles from './SideBarWithPreview.module.css';

const SideBarWithPreview = (props: any) => {
  const {
    renderRightElement,
    renderLeftElement,
    closeHandler,
    title,
    previewTitle,
  } = props;
  useEffect(() => {
    document.body.style.overflow = 'hidden';
  }, []);
  useEffect(
    () => () => {
      setTimeout(() => {
        document.body.removeAttribute('style');
      }, 1);
    },
    []
  );
  return (
    <div className={styles.sideGrayBackground}>
      <div className={styles.sideBarLayoutRight}>
        <div className={styles.sidebarLeftContent}>
          <div className={styles.sideBarHeaderRight}>
            <p className={styles.sideHeadTextRight}>{previewTitle}</p>
          </div>
          <div>
            <div className={styles.sideBarContent}>{renderLeftElement}</div>
          </div>
        </div>
        <div className={styles.marginGapDiv} />
        <div className={styles.sidebarRightContent}>
          <div className={styles.sideBarHeaderRight}>
            <p className={styles.sideHeadTextRight}>{title}</p>
            <div className={styles.closeWrap}>
              <img
                className={styles.closeIcon}
                onClickCapture={closeHandler}
                src={closeIcon}
                alt="close"
              />
            </div>
          </div>
          <div>
            <div className={styles.sideBarContent}>{renderRightElement}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBarWithPreview;
