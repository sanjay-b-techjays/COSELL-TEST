/* eslint-disable linebreak-style */
/* eslint-disable function-paren-newline */
/* eslint-disable comma-dangle */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable linebreak-style */
/* eslint-disable operator-linebreak */
/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
import React, { useEffect, useState } from 'react';
import {
  createAccount,
  createAccountDropdown,
  AccountTeamLabel,
  AccountsEngagementsLabels,
} from 'src/strings';
import { useDispatch, useSelector } from 'react-redux';
import DownArrow from 'src/app/components/Icons/PreviewPartnership/DownArrow.svg';
import emailRefresh from 'src/app/assets/emailRefresh.svg';

import {
  IconButton,
  TableBody,
  Checkbox,
  styled,
  TableCell,
} from '@material-ui/core';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Table from '@mui/material/Table';
import Avatar from '@mui/material/Avatar';
import { tableCellClasses } from '@mui/material';
import { Field } from 'formik';
import PrimaryButton from 'src/app/components/Button/PrimaryButton';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { deleteRequest, postRequest } from 'src/app/service';
import DialogBox from 'src/app/components/DialogBox';
import {
  salesHubAccountResponse,
  setaccountTeamErrMsg,
} from '../../SalesHubSiteSlice';

import { GenTextField, RenderErrorMessage } from '../../Form';
import styles from '../CreateAccount/CreateAccount.module.css';
import { useStyles } from '../../Styles';

const AccountTeam = (props: any) => {
  const classes = useStyles();
  const {
    formikValues,
    errors,
    touched,
    handleBlur,
    handleChange,
    setShowAccountTeam,
    showAccountTeam,
    setActiveAddUserMenu = '',
    accountTeamList = [],
    setAccountTeamList = null,
    fetchAccountTeamList = '',
    accountTeamCount,
    accountTeamLimit,
    setLoader,
    clearLoader,
    setAlert,
  } = props;
  const [accountTeamErr, setAccountTeamErr] = useState('');
  const salesHubSiteRespData = useSelector(salesHubAccountResponse);
  const queryparams = new URLSearchParams(window.location.search);
  const partnershipID: string = queryparams.get('partner_id') || '0';
  const salesHubAccountId: string =
    queryparams.get('sales_hub_account_id') || '0';
  const [userSelected, setUserSelected] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    const timer = setTimeout(() => {
      setAccountTeamErr('');
      dispatch(
        setaccountTeamErrMsg({
          accountTeamErrMsg: '',
          accountTeamValidationField: '',
        })
      );
    }, 15000);
    setAccountTeamErr(salesHubSiteRespData.accountTeamErrMsg);
    return () => clearTimeout(timer);
  }, [salesHubSiteRespData]);

  useEffect(() => {
    dispatch(
      setaccountTeamErrMsg({
        accountTeamErrMsg: '',
        accountTeamValidationField: '',
      })
    );
  }, []);

  const StyledTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#FAFAFA',
      color: '#707683',
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(() => ({
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));
  const handleSelectAllClick = (event: any) => {
    if (event.target.checked) {
      const selectedData = accountTeamList.map(
        (data: any) => data.sales_hub_account_team_id
      );
      setUserSelected(Array.from(new Set([...userSelected, ...selectedData])));
      return;
    }

    const selectedData = accountTeamList.map(
      (data: any) => data.sales_hub_account_team_id
    );
    const value = userSelected.filter((s: any) => !selectedData.includes(s));
    setUserSelected(value);
  };
  const handleCheckboxClick = (event: any, id: number) => {
    event.stopPropagation();
    const selectedIndex = userSelected.indexOf(id);
    let newSelected: any[] = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(userSelected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(userSelected.slice(1));
    } else if (selectedIndex === userSelected.length - 1) {
      newSelected = newSelected.concat(userSelected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        userSelected.slice(0, selectedIndex),
        userSelected.slice(selectedIndex + 1)
      );
    }
    setUserSelected(newSelected);
  };

  const handleDeleteAccountTeamUser = () => {
    setDeleteModal(false);
    setLoader();
    const token = localStorage.getItem('token');
    const headerData = {
      Authorization: `Token ${token}`,
    };
    deleteRequest(
      `partnership/sales-hub-account/account-team/`,
      {
        Authorization: `Token ${token}`,
      },
      {
        partnership_id: partnershipID,
        sales_hub_account_team_ids: userSelected,
      }
    ).then((response: any) => {
      if (response.result === true) {
        setUserSelected([]);
        fetchAccountTeamList(0);
        clearLoader();
        setAlert(AccountsEngagementsLabels.deleteAccountUserSuccessMsg);
      } else {
        clearLoader();
      }
    });
  };
  const handleResendMailToUser = (teamUserId: number) => {
    const token = localStorage.getItem('token');
    postRequest(
      `partnership/sales-hub-account/account-team/resend-invite/`,
      {
        sales_hub_account_team_id: teamUserId,
        sales_hub_account_id: salesHubAccountId,
      },
      {
        Authorization: `Token ${token}`,
      }
    ).then((response: any) => {
      if (response.result === true) {
        clearLoader();
        setAlert(AccountsEngagementsLabels.resendSucessMsg);
      } else {
        clearLoader();
      }
    });
  };

  useEffect(() => {
    if (salesHubAccountId !== '0') {
      fetchAccountTeamList(0);
    }
  }, []);

  return (
    <>
      <div
        className={`${styles.salesHubAccDropDown} ${
          !showAccountTeam ? styles.salesHubAccDropDownGap : ''
        }`}
        onClickCapture={() => setShowAccountTeam(!showAccountTeam)}
      >
        {createAccountDropdown.accountsTeam}
        <IconButton>
          <img
            className={styles.salesHubAccDownArrowImg}
            src={DownArrow}
            alt=""
          />
        </IconButton>
      </div>

      {showAccountTeam ? (
        <>
          {salesHubAccountId !== '0' ? (
            <>
              <div className={styles.manageAccountWrap}>
                <div className={styles.manageAccLabel}>
                  {AccountTeamLabel.manageAccountTeamLabel}
                </div>
                <div>
                  {userSelected.length > 0 ? (
                    <PrimaryButton
                      style={{ minWidth: '160px' }}
                      onClick={() => setDeleteModal(true)}
                    >
                      {AccountTeamLabel.removeUser}
                    </PrimaryButton>
                  ) : (
                    <PrimaryButton
                      style={{ minWidth: '160px' }}
                      onClick={() => setActiveAddUserMenu(true)}
                    >
                      {AccountTeamLabel.addUser}
                    </PrimaryButton>
                  )}
                </div>
              </div>
              <div className={styles.accTeamTableWrap}>
                <TableContainer className={styles.accTeamTable}>
                  <Table
                    aria-label="customized table"
                    className={styles.accountTable}
                  >
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>
                          <Checkbox
                            className={
                              accountTeamList.length > 0 &&
                              accountTeamList.filter((s: any) =>
                                userSelected.includes(
                                  s.sales_hub_account_team_id
                                )
                              ).length === accountTeamList.length
                                ? styles.accountCheckBox
                                : ''
                            }
                            checked={
                              accountTeamList.length > 0 &&
                              accountTeamList.length ===
                                accountTeamList.filter((s: any) =>
                                  userSelected.includes(
                                    s.sales_hub_account_team_id
                                  )
                                ).length
                            }
                            onChange={(e) => handleSelectAllClick(e)}
                          />
                        </StyledTableCell>
                        <StyledTableCell>
                          {AccountTeamLabel.firstName}
                        </StyledTableCell>
                        <StyledTableCell>
                          {AccountTeamLabel.lastName}
                        </StyledTableCell>
                        <StyledTableCell>
                          {AccountTeamLabel.role}
                        </StyledTableCell>
                        <StyledTableCell>
                          {AccountTeamLabel.company}
                        </StyledTableCell>
                        <StyledTableCell>
                          {AccountTeamLabel.email}
                        </StyledTableCell>
                        <StyledTableCell>
                          {AccountTeamLabel.inviteStatus}
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {accountTeamList.length > 0 ? (
                        accountTeamList.map((data: any) => (
                          <StyledTableRow>
                            <StyledTableCell component="td">
                              <Checkbox
                                className={
                                  userSelected.includes(
                                    data.sales_hub_account_team_id
                                  )
                                    ? styles.accountCheckBox
                                    : ''
                                }
                                checked={
                                  userSelected.length > 0
                                    ? userSelected.includes(
                                        data.sales_hub_account_team_id
                                      )
                                    : false
                                }
                                onClick={(e) =>
                                  handleCheckboxClick(
                                    e,
                                    data.sales_hub_account_team_id
                                  )
                                }
                              />
                              {data.invite_status === 'Pending' && (
                                <img
                                  src={emailRefresh}
                                  alt=""
                                  className={styles.mailRefreshImg}
                                  onClickCapture={() =>
                                    handleResendMailToUser(
                                      data.sales_hub_account_team_id
                                    )
                                  }
                                />
                              )}
                            </StyledTableCell>
                            <StyledTableCell>
                              {data.user && data.user.first_name}
                            </StyledTableCell>
                            <StyledTableCell>
                              {data.user && data.user.last_name}
                            </StyledTableCell>
                            <StyledTableCell>{data.role}</StyledTableCell>
                            <StyledTableCell>{data.company}</StyledTableCell>
                            <StyledTableCell>
                              <div className={styles.avatarCell}>
                                <Avatar className={styles.emailavatar}>
                                  {data.email && data.email[0].toUpperCase()}
                                </Avatar>
                                <div>{data.email}</div>
                              </div>
                            </StyledTableCell>
                            <StyledTableCell>
                              {' '}
                              {data.invite_status}
                            </StyledTableCell>
                          </StyledTableRow>
                        ))
                      ) : (
                        <StyledTableCell
                          colSpan={7}
                          className={styles.noResults}
                        >
                          <div className={styles.noResults}>
                            No records found
                          </div>
                        </StyledTableCell>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                {accountTeamCount > accountTeamLimit && (
                  <Stack spacing={2} className={styles.paginationWrap}>
                    <Pagination
                      count={Math.ceil(accountTeamCount / accountTeamLimit)}
                      shape="rounded"
                      onChange={(e, data) =>
                        fetchAccountTeamList((data - 1) * accountTeamLimit)
                      }
                    />
                  </Stack>
                )}
              </div>

              <DialogBox
                title=""
                primaryContent={AccountsEngagementsLabels.deleteAccountTeamUser}
                secondaryContent={
                  AccountsEngagementsLabels.confirmDeleteAccountTeamUser
                }
                secondaryButton={AccountsEngagementsLabels.cancel}
                primaryButton={AccountsEngagementsLabels.deleteAccountUser}
                show={deleteModal}
                handleDialogBoxClose={() => setDeleteModal(false)}
                handleAgree={() => handleDeleteAccountTeamUser()}
              />
            </>
          ) : (
            <div
              className={`${styles.salesHubAccFormWrap} ${styles.salesHubSectionFormWrap}`}
            >
              <div className={styles.salesHubAccFieldWrap}>
                <div className={styles.salesHubAccLabel}>
                  {createAccount.enterEmailLabel}
                </div>
                <div className={`${styles.salesHubAccField} textArea`}>
                  <Field
                    type="text"
                    name="accountTeamEmailList"
                    value={formikValues.accountTeamEmailList}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    hasError={
                      errors.accountTeamEmailList &&
                      touched.accountTeamEmailList
                    }
                    placeholder={createAccount.enterEmailLabel}
                    errorMessage={errors.accountTeamEmailList}
                    component={GenTextField}
                    classes={classes}
                    multiline
                  />
                  <small className={styles.inputHelper}>
                    {createAccount.seperateByCommaHelperText}
                  </small>
                  {accountTeamErr !== '' &&
                  salesHubSiteRespData.accountTeamValidationField ===
                    'emails' ? (
                    <div
                      style={{
                        color: 'red',
                        fontSize: '12px',
                        fontWeight: '500',
                        padding: '5px 0px',
                      }}
                    >
                      {accountTeamErr}
                    </div>
                  ) : (
                    <RenderErrorMessage name="accountTeamEmailList" />
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      ) : null}
    </>
  );
};
export default AccountTeam;
