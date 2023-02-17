/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable linebreak-style */
/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';

import SnackbarAlert from 'src/app/components/Snackbar/Snackbar';
import { MyAccountLabels } from 'src/strings';
import { useDispatch, useSelector } from 'react-redux';
import SideBar from '../../components/SideBar';
import { Menubar, Toolbar } from './components';
import MyAccount from './components/MyAccount';
import { getRequest } from '../../service';
import { selectCreatePartnershipResponse } from '../../views/CreatePartnership/CreatePartnerShipSlice';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%',
    display: 'flex',
    background: 'rgba(194, 207, 224, 0.1)',
  },
  content: {
    marginTop: '80px',
    background: '#E5E5E5',
  },
  container: {
    width: '80%',
  },
  sibebar: {
    width: '20%',
    background: 'rgba(194, 207, 224, 0.1)',
    minHeight: '100vh',
    // margin: 'auto',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
}));

const Main = (props: any) => {
  const { children } = props;
  const classes = useStyles();
  const [activeMenu, setActiveMenu] = React.useState('');
  const [userData, setUserData] = React.useState({
    firstName: '',
    image: '',
  });
  const [showAlert, setShowAlert] = React.useState(false);
  const [alert, setAlert] = React.useState({
    showAlert: false,
    severity: '',
    message: '',
  });
  const userAccountUpdated = useSelector(selectCreatePartnershipResponse);
  const [showCloseWarning, setShowCloseWarning] = useState(false);
  const [isDirty, setisDirty] = useState(false);
  const [isFormEdited, setIsFormEdited] = useState(false);

  let renderElement = <></>;
  let title = '';
  switch (activeMenu) {
    case 'myAcc': {
      title = 'My account';
      renderElement = (
        <MyAccount
          cancelHandler={() => {
            setActiveMenu('');
            setisDirty(false);
            setIsFormEdited(false);
            setShowCloseWarning(false);
          }}
          showAlert={(msg: string, severity: string) =>
            setAlert((prevState: any) => ({
              ...prevState,
              showAlert: true,
              message: msg,
              severity,
            }))
          }
          setisDirty={setisDirty}
          setIsFormEdited={setIsFormEdited}
          isFormEdited={isFormEdited}
          showCloseWarning={showCloseWarning}
          setShowCloseWarning={setShowCloseWarning}
        />
      );
      break;
    }
    default:
      break;
  }
  const getUserDetail = () => {
    const token = localStorage.getItem('token');
    const headerData = {
      Authorization: `Token ${token}`,
    };
    getRequest(`users/my-account/`, headerData).then((resp: any) => {
      if (resp.result === true) {
        setUserData({
          firstName: resp.data.first_name,
          image: resp?.data?.image,
        });
      }
    });
  };

  useEffect(() => {
    getUserDetail();
  }, []);
  useEffect(() => {
    getUserDetail();
  }, [userAccountUpdated.refreshAccDetailTimeStamp]);

  return (
    <div className={classes.root}>
      <div className={classes.sibebar}>
        <Menubar />
      </div>
      <div className={classes.container}>
        <Toolbar handleSelectMenu={setActiveMenu} userData={userData} />
        <main className={classes.content}>{children}</main>
      </div>
      {activeMenu !== '' && (
        <SideBar
          title={title}
          closeHandler={() => {
            if (isDirty || isFormEdited) setShowCloseWarning(true);
            else setActiveMenu('');
          }}
          renderElement={renderElement}
        />
      )}
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

Main.propTypes = {
  // children: PropTypes.node,
};

export default Main;
