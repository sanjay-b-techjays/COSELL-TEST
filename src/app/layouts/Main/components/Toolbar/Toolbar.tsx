/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */
/* eslint-disable linebreak-style */
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import SearchIcon from '@material-ui/icons/Search';
import { Menu, MenuItem } from '@material-ui/core';
import styles from './Toolbar.module.css';
import { postRequest } from '../../../../service';
import profile from '../../../../assets/profile.png';
import './Toolbar.css';

export default function Toolbar(props: any) {
  const { handleSelectMenu, userData } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const token = localStorage.getItem('token');
  const history = useHistory();

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
    console.log(event.currentTarget, 'event.currentTarget');
  };
  const handleClose = (menu: string) => {
    setAnchorEl(null);
    handleSelectMenu(menu);
  };

  const handleUserSignOut = () => {
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
  return (
    <div className={`${anchorEl === null ? '' : 'toolbarWrapWithMenu'}`}>
      <div
        className={`${
          anchorEl === null ? styles.toolbar : styles.toolbarWithMenu
        }`}
      >
        <div className={styles.inputWrap} />
        <div className={styles.userWrap}>
          <div className={styles.userName}>{userData.firstName}</div>
          <img
            src={
              (userData?.image &&
                `${userData?.image}?time=${new Date().getTime()}`) ||
              profile
            }
            alt="Paris"
            onClickCapture={handleClick}
          />
        </div>
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
        className={`${styles.userAMMenu} userAMMenu`}
      >
        <MenuItem
          style={{ borderBottom: '0.5px solid rgba(194, 207, 224, 0.4)' }}
          onClick={() => handleClose('myAcc')}
        >
          My account
        </MenuItem>
        <MenuItem onClick={() => handleUserSignOut()}>Logout</MenuItem>
      </Menu>
    </div>
  );
}
