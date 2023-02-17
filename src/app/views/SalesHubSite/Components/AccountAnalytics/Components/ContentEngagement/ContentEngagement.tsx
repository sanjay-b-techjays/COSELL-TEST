/* eslint-disable no-nested-ternary */
/* eslint-disable linebreak-style */
/* eslint-disable operator-linebreak */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable linebreak-style */
import React, { useEffect } from 'react';
import { createAccount, SalesRepFooterLabels } from 'src/strings';
import styles from '../../../CreateAccount/CreateAccount.module.css';
import '../../../CreateAccount/CreateAccount.css';

const ContentEngagement = (props) => {
  const { contentEngagement = {} } = props;

  return (
    <div className={styles.contentEngagementWrap}>
      <div className={styles.manageAccountWrap}>
        <div className={styles.manageAccLabel}>
          {createAccount.contentEngagement}
        </div>
      </div>
      <div className={styles.contentEngCardWrap}>
        {Object.keys(contentEngagement)?.map((data) => (
          <div className={styles.contentEngCard}>
            <div className={styles.contentEngCardContent}>
              <div className={styles.contentEngCardContentTitle}>
                {createAccount[data]}
              </div>
              <div className={styles.contentEngCardContentValue}>
                {contentEngagement[data]}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ContentEngagement;
