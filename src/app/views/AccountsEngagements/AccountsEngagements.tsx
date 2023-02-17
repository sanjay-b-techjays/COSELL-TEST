/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-indent */
/* eslint-disable linebreak-style */
/* eslint-disable function-paren-newline */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable no-nested-ternary */
/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable linebreak-style */
import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import * as FileSaver from 'file-saver';
import { deleteRequest, getRequest, getPdfRequest } from 'src/app/service';
import Table from '@mui/material/Table';
import SearchIcon from '@material-ui/icons/Search';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {
  Button,
  TableBody,
  MenuItem,
  Checkbox,
  Typography,
  Box,
} from '@material-ui/core';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import SnackbarAlert from 'src/app/components/Snackbar/Snackbar';
import DialogBox from 'src/app/components/DialogBox';

import SideBar from 'src/app/components/SideBar';

import Loader from 'src/app/components/Loader';
import { styled } from '@mui/material/styles';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useDispatch, useSelector } from 'react-redux';
import leftArrow from '../../assets/left_arrow.svg';
import CreateAccount from '../SalesHubSite/Components/CreateAccount';
import AccountContacts from '../SalesHubSite/Components/AccountContacts';
import createIcon from '../../assets/create_icon.svg';
import styles from './AccountsEngagements.module.css';

import {
  salesHubTableLabels,
  ButtonLabels,
  createAccount,
  AccountsEngagementsLabels,
} from '../../../strings';
import PrimaryButton from '../../components/Button/PrimaryButton';
import UserInformation from '../SalesHubSite/Components/UserInformation';
import CreateSalesOpportunities from '../SalesHubSite/Components/CreateSalesOpportunities';
import SalesForce from '../SalesHubSite/Components/SalesForce';
import AccountAnalytics from '../SalesHubSite/Components/AccountAnalytics';
import {
  accountEngagementsResponse,
  setIsAccountEngagementFormEdited,
  setShowAccountEngagementWarningEditor,
} from './AccountEngagementsSlice';

interface SalesHub {
  headerText: string;
  subHeaderText: string;
  headerImage: string;
  companyLogo: string;
  partnerLogo: string;
  solutinNarrative: [SolutinNarrative];
  address: object;
}
interface SolutinNarrative {
  name: string;
  description: string;
  image: string;
}

const AccountsEngagements = () => {
  const history = useHistory();
  const queryparams = new URLSearchParams(window.location.search);
  const partnershipId: string = queryparams.get('partner_id') || '0';
  const salesHubAccountId: string =
    queryparams.get('sales_hub_account_id') || '0';
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [tabValue, setTabValue] = useState(1);
  const [activeMenu, setActiveMenu] = useState(false);
  const [accountEngagementsList, setAccountEngagementsList] = useState([]);
  const [alert, setAlert] = useState({
    showAlert: false,
    severity: '',
    message: '',
  });
  const [accName, setAccName] = useState('');
  const [salesMotionMenu, setSalesMotionMenu] = useState(false);
  const [salesMotionSelected, setSalesMotionSelected] = useState('');
  const [statusMenu, setStatusMenu] = useState(false);
  const [statusSelected, setStatusSelected] = useState('');
  const [salesMotionList, setSalesMotionList] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [accountTitle, setAccountTitle] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
  const refSalesMotionMenu: any = useRef();
  const refStatusMenu: any = useRef();
  const [activeAddUserMenu, setActiveAddUserMenu] = useState(false);
  const [accountTeamList, setAccountTeamList] = useState([]);
  const [accountTeamCount, setAccountTeamCount] = useState(0);
  const [accountTeamOffset, setAccountTeamOffset] = useState(0);
  const [accountTeamLimit, setAccountTeamLimit] = useState(10);
  const [showCloseWarning, setShowCloseWarning] = useState(false);
  const [formEdited, setFormEdited] = useState(false);
  const [isDirty, setisDirty] = useState(false);
  const [showAddSalesOpportunity, setShowAddSalesOpportunity] = useState(null);
  const [salesOpportunityList, setSalesOpportunityList] = useState([]);
  const [accContactsList, setAccContactsList] = useState([]);
  const [contactsCount, setContactsCount] = useState(0);
  const [contactsLimit, setContactsLimit] = useState(25);
  const [contactsOffset, setContactsOffset] = useState(0);
  const [contactsPage, setContactsPage] = useState(1);
  const [CsvData, setCsvData] = useState();
  const [contactsLoading, setContactsLoading] = useState(false);
  const [isDataAvail, setIsDataAvail] = useState(false);
  const dispatch = useDispatch();
  const accountEngagements = useSelector(accountEngagementsResponse);

  const SalesForceState: boolean = !!queryparams.get('state') || false;

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
    '&:nth-of-type(odd)': {
      border: 0,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  const editAccount = (e, id) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    history.push(
      `/accountsEngagements?partner_id=${partnershipId}&sales_hub_account_id=${id}`
    );
  };

  const HanldeAMAccountEngagementsCloseDropdown = (event) => {
    if (
      refSalesMotionMenu.current &&
      !refSalesMotionMenu.current.contains(event.target)
    ) {
      setSalesMotionMenu(false);
    }
    if (
      refStatusMenu.current &&
      !refStatusMenu.current.contains(event.target)
    ) {
      setStatusMenu(false);
    }
  };

  useEffect(() => {
    const showModal: boolean = !!queryparams.get('accountModal') || false;
    setActiveMenu(showModal);
    const isAnalyticsTab: boolean = !!queryparams.get('code') || false;
    if (isAnalyticsTab) {
      setTabValue(0);
      console.log(':::::inside tab value');
    }
    console.log(isAnalyticsTab, ':::::isAnalyticsTab');
    if (SalesForceState === true) {
      const ids = queryparams.get('state').split('/');
      const code = queryparams.get('code');
      const domainName = ids[0].split('.');
      let path;
      if (domainName[0] === 'portal') {
        path = 'accountsEngagements';
      } else {
        path = 'home';
      }
      console.log('showModal', ids);
      // window.open(`/accountsEngagements?partner_id=${ids[1]}&sales_hub_account_id=${ids[2]}`, '_self');
      if (import.meta.env.VITE_ENVIRONMENT == 'prod') {
        window.open(
          `https://${domainName[0]}.cosell.partners/${path}?code=${code}&partner_id=${ids[1]}&sales_hub_account_id=${ids[2]}`,
          '_self'
        );
      } else {
        window.open(
          `https://${domainName[0]}.${
            import.meta.env.VITE_ENVIRONMENT
          }.cosell.partners/${path}?code=${code}&partner_id=${
            ids[1]
          }&sales_hub_account_id=${ids[2]}`,
          '_self'
        );
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener(
      'mousedown',
      HanldeAMAccountEngagementsCloseDropdown
    );

    return () =>
      document.removeEventListener(
        'mousedown',
        HanldeAMAccountEngagementsCloseDropdown
      );
  }, []);

  const fetchAccountTeamList = (currOffset: number) => {
    const token = localStorage.getItem('token');
    const headerData = {
      Authorization: `Token ${token}`,
    };
    setAccountTeamOffset(currOffset);
    getRequest(
      `partnership/sales-hub-account/account-team/?partnership_id=${partnershipId}&sales_hub_account_id=${salesHubAccountId}&offset=${currOffset}&limit=${accountTeamLimit}`,
      headerData
    ).then((resp: any) => {
      if (resp.result === true) {
        setAccountTeamList(resp.data);
        if (resp.count) {
          setAccountTeamCount(resp.count);
        }
      }
    });
  };

  const fetchSalesHubAccountsList = (currOffset: number) => {
    setLoading(true);

    const salesMotionId =
      salesMotionSelected !== '' && salesMotionSelected !== 'All'
        ? salesMotionList.length > 0 &&
          salesMotionList.filter((li) => li.value === salesMotionSelected)[0].id
        : '';
    const statusId =
      statusSelected !== '' && statusSelected !== 'All'
        ? statusList.length > 0 &&
          statusList.filter((li) => li.value === statusSelected)[0].id
        : '';
    const nameSearch = accName !== '' ? `&company_name=${accName}` : '';
    const salesMotionSearch =
      salesMotionId !== '' ? `&sales_motion_id=${salesMotionId}` : '';
    const statusSearch = statusId !== '' ? `&status_id=${statusId}` : '';
    const token = localStorage.getItem('token');
    const headerData = {
      Authorization: `Token ${token}`,
    };
    setOffset(currOffset);
    if (currOffset === 0) {
      setPage(1);
    }
    getRequest(
      `partnership/sales-hub-account/?partnership_id=${partnershipId}&limit=${limit}&offset=${currOffset}${nameSearch}${salesMotionSearch}${statusSearch}`,
      headerData
    ).then((resp: any) => {
      if (resp.result === true) {
        const resData = resp.data;
        setAccountEngagementsList(resData);
        if (resp.count) {
          setCount(resp.count);
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  };
  const cancelHandler = () => {
    history.push(`/accountsEngagements?partner_id=${partnershipId}`);
    fetchSalesHubAccountsList(0);
    setisDirty(false);
    setFormEdited(false);
  };

  const fetchSalesMotionList = () => {
    const token = localStorage.getItem('token');
    getRequest(
      `partnership/sales-motion/?partnership_id=${partnershipId}&offset=${0}&limit=${50}&is_inactive=true`,
      {
        Authorization: `Token ${token}`,
      }
    ).then((response: any) => {
      if (response.result === true) {
        const salesMotionData =
          response.data &&
          response.data.map((data: any) => ({
            key: data.name,
            id: data.sales_motion_id,
            value: `${data.name}${data.is_active ? '' : ' (deleted)'}`,
          }));
        setSalesMotionList(salesMotionData);
      }
    });
  };
  const fetchStatusList = () => {
    const token = localStorage.getItem('token');

    getRequest(`partnership/sales-hub-account/get-status/`, {
      Authorization: `Token ${token}`,
    }).then((response: any) => {
      if (response.result === true) {
        const statusData =
          response.data &&
          response.data.map((data: any) => ({
            key: data.name,
            id: data.status_id,
            value: data.name,
          }));
        setStatusList(statusData);
      }
    });
  };

  const handleFilter = (name: string, value: string) => {
    if (name === 'salesMotion') {
      setSalesMotionSelected(value);
    } else if (name === 'status') {
      setStatusSelected(value);
    }
  };

  const handlePageChange = (e: any, data: any) => {
    setOffset((data - 1) * limit);
    setPage(data);
  };

  const handleDeleteAccount = () => {
    setDeleteModal(false);
    setLoading(true);
    const token = localStorage.getItem('token');
    deleteRequest(
      `partnership/sales-hub-account/`,
      {
        Authorization: `Token ${token}`,
      },
      {
        partnership_id: partnershipId,
        sales_hub_account_ids: selected,
      }
    ).then((response: any) => {
      if (response.result === true) {
        fetchSalesHubAccountsList(0);
        setLoading(false);
        setAlert((prevState: any) => ({
          ...prevState,
          showAlert: true,
          severity: 'success',
          message: AccountsEngagementsLabels.deleteAccountMsg,
        }));
        setSelected([]);
      } else {
        setLoading(false);
      }
    });
  };
  const handleCheckboxClick = (e: any, id: string) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    const selectedIndex = selected.indexOf(id);
    let newSelected: any[] = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };
  const handleSelectAllClick = (event: any) => {
    if (event.target.checked) {
      const selectedData = accountEngagementsList.map(
        (data: any) => data.sales_hub_account_id
      );
      setSelected(Array.from(new Set([...selected, ...selectedData])));
      return;
    }
    const selectedData = accountEngagementsList.map(
      (data: any) => data.sales_hub_account_id
    );
    const value = selected.filter((s: any) => !selectedData.includes(s));
    setSelected(value);
  };

  const getAccContactsDetails = (currOffset) => {
    const token = localStorage.getItem('token');
    const headerData = {
      Authorization: `Token ${token}`,
    };
    setContactsLoading(true);
    setContactsOffset(currOffset);
    if (currOffset === 0) {
      setContactsPage(1);
    }
    getRequest(
      `/partnership/sales-hub-account/account-contacts/?sales_hub_account_id=${salesHubAccountId}&offset=${currOffset}&limit=${25}`,
      headerData
    )
      .then((response: any) => {
        if (response.result === true) {
          setContactsLoading(false);
          if (response.data) {
            setAccContactsList(response.data);
          }
          if (response.count) {
            setContactsCount(response.count);
          }
        } else {
          setContactsLoading(false);
        }
      })
      .finally(() => {
        setContactsLoading(false);
      });
  };

  const GetExportData = () => {
    const token = localStorage.getItem('token');
    const headerData = {
      Authorization: `Token ${token}`,
    };
    getRequest(
      `partnership/sales-hub-account/account-contacts/export/?sales_hub_account_id=${salesHubAccountId}`,
      headerData
    ).then((response: any) => {
      setCsvData(response);
    });
  };
  function getFormattedTime() {
    const newDate = new Date();
    const date = newDate.toLocaleDateString('en-US', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
    });
    return `${localStorage.getItem('accName')}_Analytics_(${date})`;
  }
  const getAnalyticsExportData = () => {
    const token = localStorage.getItem('token');
    const headerData = {
      Authorization: `Token ${token}`,
    };
    setLoading(true);
    getPdfRequest(
      `partnership/sales-hub-account/analytics/export/?sales_hub_account_id=${salesHubAccountId}`,
      headerData
    )
      .then((response: any) => {
        setLoading(false);
        const Data = new Blob([response], {
          type: 'application/pdf',
        });
        FileSaver.saveAs(Data, getFormattedTime());
      })
      .finally(() => setLoading(false));
  };
  const handleContactsPageChange = (e: any, data: any) => {
    setContactsOffset((data - 1) * contactsLimit);
    setContactsPage(data);
    getAccContactsDetails((data - 1) * contactsLimit);
  };
  const fetchSalesOpportunityList = () => {
    const token = localStorage.getItem('token');
    const headerData = {
      Authorization: `Token ${token}`,
    };
    getRequest(
      `partnership/sales-hub-account/sales-opportunity/?sales_hub_account_id=${salesHubAccountId}&limit=${50}&offset=${0}`,
      headerData
    ).then((resp: any) => {
      if (resp.result === true) {
        setSalesOpportunityList(resp.data);
      }
    });
  };
  useEffect(() => {
    if (salesHubAccountId === '0') {
      fetchSalesHubAccountsList(0);
      fetchSalesOpportunityList();
    }
    fetchSalesMotionList();
    fetchStatusList();

    return () => {
      setIsAccountEngagementFormEdited({
        isAccountEngagementFormEdited: false,
      });
    };
  }, []);
  useEffect(() => {
    fetchSalesHubAccountsList(offset);
  }, [offset]);

  useEffect(() => {
    dispatch(
      setIsAccountEngagementFormEdited({
        isAccountEngagementFormEdited: formEdited || isDirty,
      })
    );
  }, [formEdited, isDirty]);

  useEffect(() => {
    if (accountEngagements.AccountEngagementWarningEditor.show) {
      setShowCloseWarning(true);
    }
  }, [accountEngagements.AccountEngagementWarningEditor]);

  return (
    <div className={styles.accEngagementMainDiv}>
      <div className={styles.accountEngagementMainCard}>
        {salesHubAccountId === '0' ? (
          <div className={styles.accEngagementTitleDiv}>
            {AccountsEngagementsLabels.title}
            <div>
              {selected.filter((s) => s !== '').length > 0 ? (
                <PrimaryButton
                  style={{ minWidth: '225px' }}
                  onClick={() => setDeleteModal(true)}
                >
                  {AccountsEngagementsLabels.deleteAccount}
                </PrimaryButton>
              ) : (
                <PrimaryButton
                  style={{ minWidth: '225px' }}
                  onClick={() => {
                    setActiveMenu(true);
                  }}
                >
                  <div className={styles.plusWrap}>
                    {' '}
                    <img
                      style={{ marginRight: '10px' }}
                      src={createIcon}
                      alt=""
                    />
                  </div>
                  {AccountsEngagementsLabels.createAccount}
                </PrimaryButton>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className={styles.stickyCard}>
              <div className={styles.backWrap}>
                <img
                  src={leftArrow}
                  alt="arrow"
                  className={styles.backArrowBtn}
                  onClickCapture={() => {
                    if (isDirty || formEdited) setShowCloseWarning(true);
                    else cancelHandler();
                  }}
                />
                <div>{accountTitle}</div>
              </div>
              <div>
                {tabValue === 0 && isDataAvail && (
                  <PrimaryButton
                    style={{ minWidth: '160px' }}
                    onClick={() => getAnalyticsExportData()}
                  >
                    {ButtonLabels.export}
                  </PrimaryButton>
                )}
              </div>
            </div>
            <Tabs
              value={tabValue}
              onChange={(event, newValue) => {
                if (accountEngagements.isAccountEngagementFormEdited) {
                  dispatch(
                    setShowAccountEngagementWarningEditor({
                      show: true,
                      navigateAction: () => {
                        history.push(
                          `/accountsEngagements?partner_id=${partnershipId}&sales_hub_account_id=${salesHubAccountId}`
                        );
                        setTabValue(newValue);
                      },
                    })
                  );
                } else {
                  history.push(
                    `/accountsEngagements?partner_id=${partnershipId}&sales_hub_account_id=${salesHubAccountId}`
                  );
                  // let params = new URLSearchParams(window.location.href);
                  // params.delete('code');
                  setTabValue(newValue);
                }
              }}
              aria-label=""
              style={{
                borderBottom: '1px solid #334D6E33',
                marginBottom: '20px',
              }}
            >
              <Tab
                label="Account Analytics"
                style={{
                  textTransform: 'capitalize',
                  fontSize: '14px',
                  color: `${tabValue !== 0 ? '#707683' : '#4C70E3'}`,
                }}
              />
              <Tab
                label="Account Details"
                style={{
                  textTransform: 'none',
                  fontSize: '14px',
                  color: `${tabValue !== 1 ? '#707683' : '#4C70E3'}`,
                }}
              />
            </Tabs>
          </>
        )}
        <div className={styles.contentDiv}>
          {salesHubAccountId === '0' ? (
            <div className={styles.accListTableWrap}>
              <div className={styles.filterWrap}>
                <div className={styles.inputWrap}>
                  <form>
                    <input
                      type="text"
                      name="name"
                      onKeyDown={(e: any) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                        }
                      }}
                      onChange={(event: any) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                        } else {
                          setAccName(event.target.value);
                        }
                      }}
                      placeholder="Search Account Engagements"
                      className={styles.searchbar}
                    />
                  </form>
                  <SearchIcon className={styles.searchIcon} />
                </div>
                <div className={styles.centerDropDown}>
                  <div className={styles.dropdown} ref={refSalesMotionMenu}>
                    <button
                      type="button"
                      className={styles.dropdownBtn}
                      onClick={() => setSalesMotionMenu(!salesMotionMenu)}
                    >
                      {' '}
                      {salesMotionSelected === '' ? (
                        <span
                          style={{ fontSize: '12px', letterSpacing: 'normal' }}
                        >
                          {createAccount.filterBySalesMotion}
                        </span>
                      ) : (
                        salesMotionSelected
                      )}
                      <KeyboardArrowDownIcon
                        className={`${styles.arrowIcon}  ${
                          salesMotionMenu ? styles.arrowIconActive : ''
                        }`}
                      />
                    </button>
                    <div
                      className={`${styles.menuWrap} ${
                        salesMotionMenu
                          ? styles.dropdownMenuActive
                          : styles.dropdownMenu
                      }`}
                    >
                      {salesMotionMenu && (
                        <>
                          <MenuItem
                            value=""
                            onClick={() => {
                              handleFilter('salesMotion', 'All');
                              setSalesMotionMenu(false);
                            }}
                          >
                            All
                          </MenuItem>

                          {salesMotionList &&
                            salesMotionList.map((list: any) => (
                              <MenuItem
                                value={list.value}
                                key={list.id}
                                onClick={() => {
                                  handleFilter('salesMotion', list.value);
                                  setSalesMotionMenu(false);
                                }}
                              >
                                {list.value}
                              </MenuItem>
                            ))}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <div className={styles.dropdown} ref={refStatusMenu}>
                    <button
                      type="button"
                      className={styles.dropdownBtn}
                      onClick={() => setStatusMenu(!statusMenu)}
                    >
                      {' '}
                      {statusSelected === '' ? (
                        <span
                          style={{ fontSize: '12px', letterSpacing: 'normal' }}
                        >
                          {createAccount.filterByStatus}
                        </span>
                      ) : (
                        statusSelected
                      )}
                      <KeyboardArrowDownIcon
                        className={`${styles.arrowIcon}  ${
                          salesMotionMenu ? styles.arrowIconActive : ''
                        }`}
                      />
                    </button>
                    <div
                      className={`${styles.menuWrap} ${
                        statusMenu
                          ? styles.dropdownMenuActive
                          : styles.dropdownMenu
                      }`}
                    >
                      {statusMenu && (
                        <>
                          <MenuItem
                            value=""
                            onClick={() => {
                              handleFilter('status', 'All');
                              setStatusMenu(false);
                            }}
                          >
                            All
                          </MenuItem>
                          {statusList &&
                            statusList.map((list: any) => (
                              <MenuItem
                                value={list.value}
                                key={list.id}
                                onClick={() => {
                                  handleFilter('status', list.value);
                                  setStatusMenu(false);
                                }}
                              >
                                {list.value}
                              </MenuItem>
                            ))}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className={styles.searchBtnWrap}>
                  <Button
                    className={styles.searchBtn}
                    onClick={() => {
                      setOffset(0);
                      setPage(1);
                      setSelected([]);
                      fetchSalesHubAccountsList(0);
                      // handleSearch(0);
                    }}
                  >
                    {ButtonLabels.search}
                  </Button>
                </div>
              </div>
              <TableContainer className={styles.accEngagementTable}>
                <Table aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>
                        <Checkbox
                          className={
                            accountEngagementsList.filter((s: any) =>
                              selected.includes(s.sales_hub_account_id)
                            ).length === accountEngagementsList.length &&
                            accountEngagementsList.length > 0
                              ? styles.assetCheckBox
                              : ''
                          }
                          checked={
                            accountEngagementsList.length > 0 &&
                            accountEngagementsList.length ===
                              accountEngagementsList.filter((s: any) =>
                                selected.includes(s.sales_hub_account_id)
                              ).length
                          }
                          onChange={(e) => handleSelectAllClick(e)}
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        {salesHubTableLabels.accountName}
                      </StyledTableCell>
                      <StyledTableCell>
                        {salesHubTableLabels.accountType}
                      </StyledTableCell>
                      <StyledTableCell>
                        {salesHubTableLabels.industry}
                      </StyledTableCell>
                      <StyledTableCell>
                        {salesHubTableLabels.salesMotion}
                      </StyledTableCell>
                      <StyledTableCell>
                        {salesHubTableLabels.status}
                      </StyledTableCell>
                      <StyledTableCell>
                        {salesHubTableLabels.createdBy}
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {accountEngagementsList.length > 0
                      ? accountEngagementsList.map((row) => (
                          <StyledTableRow
                            key={row.sales_hub_account_id}
                            onClick={(e) => {
                              editAccount(e, row.sales_hub_account_id);
                              setTabValue(1);
                            }}
                          >
                            <StyledTableCell component="td">
                              <Checkbox
                                className={
                                  selected.includes(row.sales_hub_account_id)
                                    ? styles.assetCheckBox
                                    : ''
                                }
                                checked={
                                  selected.length > 0
                                    ? selected.includes(
                                        row.sales_hub_account_id
                                      )
                                    : false
                                }
                                onClick={(e) =>
                                  handleCheckboxClick(
                                    e,
                                    row.sales_hub_account_id
                                  )
                                }
                              />
                            </StyledTableCell>
                            <StyledTableCell>
                              {row.company_name}
                            </StyledTableCell>
                            <StyledTableCell>
                              {row.account_type_name}
                            </StyledTableCell>
                            <StyledTableCell>{row.industry}</StyledTableCell>
                            <StyledTableCell>
                              {`${row.site_layout.sales_motion.name}${
                                row.site_layout.sales_motion.is_active
                                  ? ''
                                  : ' (deleted)'
                              }`}
                            </StyledTableCell>
                            <StyledTableCell>{row.status}</StyledTableCell>
                            <StyledTableCell>{row.created_by}</StyledTableCell>
                          </StyledTableRow>
                        ))
                      : !loading && (
                          <StyledTableCell
                            colSpan={6}
                            className={styles.noResults}
                          >
                            No records found
                          </StyledTableCell>
                        )}
                  </TableBody>
                </Table>
              </TableContainer>

              {count > limit && (
                <Stack spacing={2} className={styles.paginationWrap}>
                  <Pagination
                    count={Math.ceil(count / limit)}
                    shape="rounded"
                    page={page}
                    onChange={handlePageChange}
                  />
                </Stack>
              )}
            </div>
          ) : (
            <>
              <div
                role="tabpanel"
                hidden={tabValue !== 0}
                id={`simple-tabpanel-${0}`}
                aria-labelledby={`simple-tab-${0}`}
              >
                {tabValue === 0 && (
                  <>
                    <AccountAnalytics
                      setSalesOpportunityList={setSalesOpportunityList}
                      salesOpportunityList={salesOpportunityList}
                      showAddSalesOpportunity={showAddSalesOpportunity}
                      setShowAddSalesOpportunity={setShowAddSalesOpportunity}
                      setLoading={() => setLoading(true)}
                      clearLoading={() => setLoading(false)}
                      fetchSalesOpportunityList={fetchSalesOpportunityList}
                      setIsDataAvail={setIsDataAvail}
                    />
                    {showAddSalesOpportunity ? (
                      <SideBar
                        title={
                          showAddSalesOpportunity === '0'
                            ? createAccount.createSalesOpportunity
                            : createAccount.updateSalesOpportunity
                        }
                        closeHandler={() => {
                          if (isDirty) setShowCloseWarning(true);
                          else setShowAddSalesOpportunity(null);
                          fetchSalesOpportunityList();
                        }}
                        renderElement={
                          <CreateSalesOpportunities
                            showAddSalesOpportunity={showAddSalesOpportunity}
                            setShowAddSalesOpportunity={
                              setShowAddSalesOpportunity
                            }
                            fetchSalesOpportunityList={
                              fetchSalesOpportunityList
                            }
                            setLoader={() => setLoading(true)}
                            clearLoader={() => setLoading(false)}
                            setAlert={(msg: string) =>
                              setAlert((prevState: any) => ({
                                ...prevState,
                                showAlert: true,
                                message: msg,
                                severity: 'success',
                              }))
                            }
                            cancelHandler={() => {
                              setShowAddSalesOpportunity(null);
                              setisDirty(false);
                              setShowCloseWarning(false);
                            }}
                            setIsDirty={setisDirty}
                            showCloseWarning={showCloseWarning}
                            setShowCloseWarning={setShowCloseWarning}
                          />
                        }
                      />
                    ) : null}
                  </>
                )}
              </div>
              <div
                role="tabpanel"
                hidden={tabValue !== 1}
                id={`simple-tabpanel-${1}`}
                aria-labelledby={`simple-tab-${1}`}
              >
                {tabValue === 1 && (
                  <Box>
                    <CreateAccount
                      cancelHandler={cancelHandler}
                      setAlert={setAlert}
                      setLoader={() => setLoading(true)}
                      clearLoader={() => setLoading(false)}
                      salesMotionList={salesMotionList}
                      setAccountTitle={setAccountTitle}
                      statusShow
                      statusList={statusList}
                      setActiveAddUserMenu={setActiveAddUserMenu}
                      accountTeamList={accountTeamList}
                      setAccountTeamList={setAccountTeamList}
                      fetchAccountTeamList={fetchAccountTeamList}
                      accountTeamCount={accountTeamCount}
                      accountTeamLimit={accountTeamLimit}
                      fetchSalesHubAccountsList={fetchSalesHubAccountsList}
                      showCloseWarning={showCloseWarning}
                      setShowCloseWarning={setShowCloseWarning}
                      setFormEdited={setFormEdited}
                      formEdited={formEdited}
                      setIsDirty={setisDirty}
                      getAccContactsDetails={getAccContactsDetails}
                      GetExportData={GetExportData}
                    />
                    {activeAddUserMenu ? (
                      <SideBar
                        title={AccountsEngagementsLabels.inviteAccTeam}
                        closeHandler={() => {
                          if (isDirty) setShowCloseWarning(true);
                          else setActiveAddUserMenu(false);
                        }}
                        renderElement={
                          <UserInformation
                            setLoader={() => setLoading(true)}
                            clearLoader={() => setLoading(false)}
                            setAlert={setAlert}
                            cancelHandler={() => {
                              setActiveAddUserMenu(false);
                              fetchAccountTeamList(0);
                              setisDirty(false);
                              setShowCloseWarning(false);
                            }}
                            setIsDirty={setisDirty}
                            showCloseWarning={showCloseWarning}
                            setShowCloseWarning={setShowCloseWarning}
                          />
                        }
                      />
                    ) : null}
                  </Box>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {activeMenu ? (
        <SideBar
          title={AccountsEngagementsLabels.createAccount}
          closeHandler={() => {
            if (formEdited || isDirty) setShowCloseWarning(true);
            else setActiveMenu(false);
          }}
          renderElement={
            <CreateAccount
              cancelHandler={() => {
                setActiveMenu(false);
              }}
              setAlert={setAlert}
              setLoader={() => setLoading(true)}
              clearLoader={() => setLoading(false)}
              salesMotionList={salesMotionList}
              fetchSalesHubAccountsList={fetchSalesHubAccountsList}
              showCloseWarning={showCloseWarning}
              setShowCloseWarning={setShowCloseWarning}
              setFormEdited={setFormEdited}
              formEdited={formEdited}
              setIsDirty={setisDirty}
            />
          }
        />
      ) : null}
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
      <DialogBox
        title=""
        primaryContent={AccountsEngagementsLabels.deleteAccount}
        secondaryContent={AccountsEngagementsLabels.confirmDeleteAccount}
        secondaryButton={AccountsEngagementsLabels.cancel}
        primaryButton={AccountsEngagementsLabels.deleteAccount}
        show={deleteModal}
        handleDialogBoxClose={() => setDeleteModal(false)}
        handleAgree={() => handleDeleteAccount()}
      />

      {/* <SalesForce isOpen={showImport} /> */}
    </div>
  );
};

export default AccountsEngagements;
