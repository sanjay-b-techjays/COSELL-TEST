/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-confusing-arrow */
/* eslint-disable comma-dangle */
/* eslint-disable linebreak-style */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable object-curly-newline */
/* eslint-disable linebreak-style */
/* eslint-disable import/extensions */
// import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import Loader from 'src/app/components/Loader';
import SnackbarAlert from 'src/app/components/Snackbar/Snackbar';
import { useHistory } from 'react-router';
import { InviteLabels } from '../../../strings';
import { getRequest, postRequest } from '../../service';
import verifyEmail from '../../assets/mailverification.png';
import styles from './AcceptInvite.module.css';
import { selectSignUpResponse } from '../SignUp/SignUpSlice';
const domainEnv = import.meta.env.VITE_ENVIRONMENT;
const AcceptInvite = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const signUpRespData = useSelector(selectSignUpResponse);
  const [valid, setValid] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState({
    showAlert: false,
    severity: '',
    message: '',
  });
  const [signInUrl, setSignInUrl] = React.useState('');
  const [showMsg, setShowMsg] = React.useState(false);

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
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get(
      'verifytoken'
    );
    setLoading(true);
    getRequest(
      `partnership/sales-hub-account/account-team/confirm-invite/?verifytoken=${token}`
    ).then((resp: any) => {
      if (resp.result === true) {
        console.log(resp, 'resp');
        setValid(true);
        if (domainEnv == 'prod') {
          setSignInUrl(
            `https://${resp.data.sales_hub_domain}.cosell.partners/signUp`
          );
        }else{
          setSignInUrl(
            `https://${resp.data.sales_hub_domain}.${domainEnv}.cosell.partners/signUp`
          );
        }
      } else {
        setValid(false);
      }
      setLoading(false);
      setShowMsg(true);
    });
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
              {InviteLabels.inviteHeader}
            </div>
            <div className={`${styles.verifyTxt} ${styles.mailSent}`}>
              <div>{InviteLabels.inviteSubHeader}</div>
            </div>
            <div className={`${styles.verifyTxt} ${styles.mailSent}`}>
              <div>{InviteLabels.inviteContent}</div>
            </div>
            <div className={styles.verifyTxt1}>
              <div className={`${styles.link} ${styles.mailReceiveTxt}`}>
                {InviteLabels.inviteSignup}{' '}
                <Button
                  size="small"
                  className={styles.linkBtn}
                  onClick={() =>
                    signInUrl !== ''
                      ? window.location.assign(signInUrl)
                      : console.log('')
                  }
                >
                  {InviteLabels.signUp}
                </Button>
              </div>
            </div>
          </>
        ) : (
          loading === false &&
          showMsg && <div className={styles.invalidToken}>Token Invalid</div>
        )}
        {loading === true && <Loader />}
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
export default AcceptInvite;
