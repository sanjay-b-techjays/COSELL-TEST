/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable comma-dangle */
/* eslint-disable linebreak-style */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Menu, MenuItem } from '@material-ui/core';
import SideBar from 'src/app/components/SideBar';
import SnackbarAlert from 'src/app/components/Snackbar/Snackbar';
import styles from './SalesHubSiteProfile.module.css';
import MyAccount from '../../../../layouts/Main/components/MyAccount';
import { getRequest, postRequest } from '../../../../service';
import profile from '../../../../assets/profile.png';
import ProfileForm from './Components/ProfileForm/ProfileForm';
import { selectCreatePartnershipResponse } from '../../../CreatePartnership/CreatePartnerShipSlice';
import { useSelector } from 'react-redux';

export default function SalesHubSiteProfile(props: any) {
  const history = useHistory();
  const { handleSelectMenu } = props;
  const profileImageUpdate = useSelector(selectCreatePartnershipResponse);
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileActive, setProfileActive] = useState(false);
  const [showCloseWarning, setShowCloseWarning] = useState(false);
  const [isDirty, setisDirty] = useState(false);
  const [isFormEdited, setIsFormEdited] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [userName, setUserName] = useState(null);
  const [alert, setAlert] = useState({
    showAlert: false,
    severity: '',
    message: '',
  });
  const open = Boolean(anchorEl);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
    console.log(event.currentTarget, 'event.currentTarget');
  };
  const handleMyAccountClick = () => {
    setAnchorEl(null);
    setProfileActive(true);
  };
  const handleClose = (menu: string) => {
    setAnchorEl(null);
    handleSelectMenu(menu);
  };

  const handleUserSignOut = () => {
    const token = localStorage.getItem('token');
    postRequest(
      `users/logout/`,
      {},
      {
        Authorization: `Token ${token}`,
      }
    ).then((resp: any) => {
      if (resp.result === true) {
        localStorage.clear();
        history.push('/');
      }
    });
  };
  const getMyAccountDetail = () => {
    const token = localStorage.getItem('token');
    getRequest(`users/my-account/`, {
      Authorization: `Token ${token}`,
    }).then((resp: any) => {
      if (resp.result === true) {
        if (resp.data?.image) {
          setProfileImage(resp.data?.image);
        } else {
          setProfileImage(null);
        }
        setUserName(resp.data?.first_name);
      }
    });
  };

  useEffect(() => {
    getMyAccountDetail();
  }, []);

  useEffect(() => {
    getMyAccountDetail();
  }, [profileImageUpdate.refreshAccDetailTimeStamp]);
  return (
    <div className={`${anchorEl === null ? '' : 'headerWithMenu'}`}>
      <div className={styles.userWrap}>
        <div className={styles.userName}>{userName}</div>
        <img
          className={styles.headerProfileImg}
          src={
            (profileImage && `${profileImage}?time=${new Date().getTime()}`) ||
            profile
          }
          alt="Profile"
          onClickCapture={handleClick}
        />
      </div>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleClose('')}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        className={`${styles.userMenu} userMenu`}
      >
        <MenuItem
          style={{ borderBottom: '0.5px solid rgba(194, 207, 224, 0.4)' }}
          onClick={() => handleMyAccountClick()}
        >
          My account
        </MenuItem>
        <MenuItem onClick={() => handleUserSignOut()}>Logout</MenuItem>
      </Menu>
      {profileActive && (
        <SideBar
          title="My account"
          closeHandler={() => {
            if (isDirty || isFormEdited) {
              setShowCloseWarning(true);
            } else setProfileActive(false);
          }}
          renderElement={
            localStorage.getItem('userType') === 'alliance manager' ? (
              <MyAccount
                cancelHandler={() => {
                  setProfileActive(false);
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
            ) : (
              <ProfileForm
                cancelHandler={() => {
                  setProfileActive(false);
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
            )
          }
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
}
