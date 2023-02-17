/* eslint-disable comma-dangle */
/* eslint-disable linebreak-style */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable object-curly-newline */
/* eslint-disable linebreak-style */
/* eslint-disable import/extensions */
// import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import React, { useEffect } from 'react';
import Loader from 'src/app/components/Loader';
import { useHistory } from 'react-router';
import { mailVerificationLabels } from '../../../strings';
import { getRequest } from '../../service';
import verifyEmail from '../../assets/mailverification.png';
import styles from './MailVerification.module.css';

const VerifyMail = () => {
  const history = useHistory();
  const [loading, setLoading] = React.useState(false);
  const [valid, setValid] = React.useState(false);
  const [showMsg, setShowMsg] = React.useState(false);
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get(
      'verifytoken'
    );
    setLoading(true);
    getRequest(`users/confirm-email-verification/?verifytoken=${token}`).then(
      (resp: any) => {
        if (resp.result === true) {
          console.log(resp, 'resp');
          setValid(true);
        } else {
          setValid(false);
        }
        setLoading(false);
        setShowMsg(true);
      }
    );
  }, []);

  return (
    <div className={styles.flexBackground}>
      <div className={styles.container}>
        {valid === true ? (
          <>
            <div className={styles.mailImgWrap}>
              {' '}
              <img src={verifyEmail} alt="" className="mailImg" />
            </div>
            <div className={styles.verifyTitle}>
              {mailVerificationLabels.verifiedTxt}
            </div>
            <div className={styles.thanksWrap}>
              <div>{mailVerificationLabels.thanksTxt}</div>
              <div>{mailVerificationLabels.cosellTeam}</div>
            </div>
            <div className={styles.verifyTxt}>
              <div className={`${styles.link} ${styles.mailReceiveTxt}`}>
                {mailVerificationLabels.signInLabel}
                <Button
                  size="small"
                  className={styles.linkBtn}
                  onClick={() => history.push('/')}
                >
                  {mailVerificationLabels.here}
                </Button>
              </div>
            </div>
          </>
        ) : (
          loading === false &&
          showMsg && <div className={styles.invalidToken}>Token Invalid</div>
        )}
      </div>
      {loading === true && <Loader />}
    </div>
  );
};
export default VerifyMail;
