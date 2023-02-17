/* eslint-disable linebreak-style */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable object-curly-newline */
/* eslint-disable linebreak-style */
/* eslint-disable import/extensions */
// import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import { useDispatch, useSelector } from 'react-redux';
import React, { useState } from 'react';
import Loader from 'src/app/components/Loader';
import SnackbarAlert from 'src/app/components/Snackbar/Snackbar';
import { useHistory } from 'react-router';
import { VerifyMailLabels } from '../../../strings';
import { postRequest } from '../../service';
import verifyEmail from '../../assets/mailverification.png';
import styles from './verifyemail.module.css';
import { selectSignUpResponse } from '../SignUp/SignUpSlice';

const VerifyMail = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const signUpRespData = useSelector(selectSignUpResponse);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    showAlert: false,
    severity: '',
    message: '',
  });

  const mailResend = () => {
    setLoading(true);
    postRequest(`users/resend-verification-mail/`, {
      email: signUpRespData.email,
    }).then((resp: any) => {
      if (resp.result === true) {
        setLoading(false);
        console.log(resp.data.result, resp.result, resp.data.msg, resp.msg);
        setAlert((prevState: any) => ({
          ...prevState,
          showAlert: true,
          message: resp.msg,
          severity: 'success',
        }));
      } else {
        setLoading(false);
        setAlert((prevState: any) => ({
          ...prevState,
          showAlert: true,
          message: resp.data.msg,
          severity: 'error',
        }));
      }
    });
  };
  return (
    <div className={styles.flexBackground}>
      <div className={styles.container}>
        <div className={styles.mailImgWrap}>
          {' '}
          <img src={verifyEmail} alt="" className="mailImg" />
        </div>
        <div className={styles.verifyTitle}>{VerifyMailLabels.verifyEmail}</div>
        <div className={`${styles.verifyTxt} ${styles.mailSent}`}>
          <div className={styles.mailSentTxt}>
            {VerifyMailLabels.emailSentTxt}
          </div>
          <div className={styles.mailSentTxt}>
            {VerifyMailLabels.address}{' '}
            <span className={styles.mail}>{signUpRespData.email}</span>
          </div>
        </div>
        <div className={styles.verifyTxt}>
          <div className={`${styles.link} ${styles.mailReceiveTxt}`}>
            {VerifyMailLabels.mailReceiveLabel}{' '}
            <Button
              size="small"
              className={styles.linkBtn}
              onClick={() => dispatch(mailResend)}
            >
              {VerifyMailLabels.resend}
            </Button>
          </div>
          <div>
            {VerifyMailLabels.checkTxt}{' '}
            <span className={styles.spam}>{VerifyMailLabels.spamMail}</span>
          </div>
          <div className={`${styles.link} ${styles.signIn}`}>
            <Button size="small" onClick={() => history.push('/')}>
              {VerifyMailLabels.signIn}
            </Button>
          </div>
        </div>
      </div>
      {loading === true && <Loader />}
      {alert.showAlert && (
        <SnackbarAlert
          severity={alert.severity}
          handler={() => {
            setAlert((prevState: any) => ({
              ...prevState,
              showAlert: false,
            }));
          }}
          showalert={alert.showAlert}
          message={alert.message}
        />
      )}
    </div>
  );
};
export default VerifyMail;
