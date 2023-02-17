/* eslint-disable indent */
/* eslint-disable linebreak-style */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable linebreak-style */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable comma-dangle */
/* eslint-disable operator-linebreak */
import React, { useRef, useState, useEffect } from 'react';

import PrimaryButton from 'src/app/components/Button/PrimaryButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import Table from '@mui/material/Table';
import SearchIcon from '@material-ui/icons/Search';
import { useDispatch, useSelector } from 'react-redux';
import * as FileSaver from 'file-saver';
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
import Loader from 'src/app/components/Loader';
import { useHistory } from 'react-router-dom';

import SideBar from 'src/app/components/SideBar';
import {
  ButtonLabels,
  createAccount,
  salesHubTableLabels,
  salesHubSiteTitle,
  SignUpLabels,
} from 'src/strings';
import SnackbarAlert from 'src/app/components/Snackbar/Snackbar';

import { getRequest, getPdfRequest } from 'src/app/service';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import leftArrow from '../../assets/left_arrow.svg';
import CreateAccount from './Components/CreateAccount';
import styles from './SalesHubSite.module.css';
import Header from './Components/Header';
import Footer from './Components/Footer';
import { Alert } from './types';
import { listValues } from '../SalesMotion/types';
import { setCurrentSalesHubAccId } from './SalesHubSiteSlice';
import UserInformation from './Components/UserInformation';
import SalesHubSiteProfile from './Components/SalesHubSiteProfile';
import CreateSalesOpportunities from './Components/CreateSalesOpportunities';
import AccountAnalytics from './Components/AccountAnalytics';
import {
  accountEngagementsResponse,
  setIsAccountEngagementFormEdited,
  setShowAccountEngagementWarningEditor,
} from '../AccountsEngagements/AccountEngagementsSlice';

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

const SalesHubSite = () => {
  const [activeMenu, setActiveMenu] = useState(false);
  const [fontFamily, setfontFamily] = useState('');
  const [fontColor, setfontColor] = useState('');
  const [table, setTable] = useState([]);
  const [alert, setAlert] = useState({
    showAlert: false,
    severity: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [accName, setAccName] = useState('');
  const [salesMotionMenu, setSalesMotionMenu] = useState(false);
  const [salesMotionSelected, setSalesMotionSelected] = useState('');
  const [statusMenu, setStatusMenu] = useState(false);
  const [statusSelected, setStatusSelected] = useState('');
  const [salesMotionList, setSalesMotionList] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [accountTitle, setAccountTitle] = useState('');
  const [cadenceFieldEnabled, setCadenceFieldEnabled] = useState(false);
  const [servicePartnerEnabled, setServicePartnerEnabled] = useState(false);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [isDataAvail, setIsDataAvail] = useState(false);

  const history = useHistory();
  const queryparams = new URLSearchParams(window.location.search);
  const partnershipId: string = queryparams.get('partner_id') || '0';
  const salesHubAccountId: string =
    queryparams.get('sales_hub_account_id') || '0';
  const [main, setMain] = useState<SalesHub>();
  const [tableStyle, setTableStyle] = useState({
    bgColor: '#FAFAFA',
    color: '#707683',
  });
  const dispatch = useDispatch();
  const accountEngagements = useSelector(accountEngagementsResponse);
  const refSalesMotionMenu: any = useRef();
  const refStatusMenu: any = useRef();
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [tabValue, setTabValue] = useState(1);
  const [activeAddUserMenu, setActiveAddUserMenu] = useState(false);
  const [accountTeamList, setAccountTeamList] = useState([]);
  const [accountTeamCount, setAccountTeamCount] = useState(0);
  const [accountTeamOffset, setAccountTeamOffset] = useState(0);
  const [accountTeamLimit, setAccountTeamLimit] = useState(10);
  const [showAccountTeam, setShowAccountTeam] = useState(true);
  const [salesOpportunityList, setSalesOpportunityList] = useState([]);
  const [showAddSalesOpportunity, setShowAddSalesOpportunity] = useState(null);
  const [formEdited, setFormEdited] = useState(false);
  const [isDirty, setisDirty] = useState(false);
  const [showCloseWarning, setShowCloseWarning] = useState(false);
  const [accContactsList, setAccContactsList] = useState([]);
  const [contactsCount, setContactsCount] = useState(0);
  const [contactsLimit, setContactsLimit] = useState(25);
  const [contactsOffset, setContactsOffset] = useState(0);
  const [contactsPage, setContactsPage] = useState(1);
  const [CsvData, setCsvData] = useState();

  const HanldeSalesRepAccountEngagementsCloseDropdown = (event) => {
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
    document.addEventListener(
      'mousedown',
      HanldeSalesRepAccountEngagementsCloseDropdown
    );
    console.log('window', document.referrer);
    // if (
    //   document.referrer === 'https://portal.dev.cosell.partners/' ||
    //   'https://portal.stg.cosell.partners/'
    // ) {
    //   const domain = window.location.href.split('.')[0].split('//');
    //   console.log('window', domain);
    //   const queryparams = new URLSearchParams(window.location.search);
    //   const token: string = queryparams.get('token');
    //   const userId: string = queryparams.get('user_id');
    //   localStorage.setItem('token', token);
    //   localStorage.setItem('userId', userId);
    //   localStorage.setItem('subDomainName', domain[0]);
    // }
    return () =>
      document.removeEventListener(
        'mousedown',
        HanldeSalesRepAccountEngagementsCloseDropdown
      );
  }, []);

  const editAccount = (id) => {
    history.push(
      `/home?partner_id=${partnershipId}&sales_hub_account_id=${id}`
    );
  };

  const cancelHandler = () => {
    history.push(`/home?partner_id=${partnershipId}`);
    setisDirty(false);
    setFormEdited(false);
  };

  const getSalesHubAccounts = (currOffset: number) => {
    const token = localStorage.getItem('token');
    const headerData = {
      Authorization: `Token ${token}`,
    };
    setOffset(currOffset);
    if (currOffset === 0) {
      setPage(1);
    }

    getRequest(
      `/partnership/sales-hub-account/?partnership_id=${partnershipId}&limit=${limit}&offset=${currOffset}`,
      headerData
    ).then((resp: any) => {
      if (resp.result === true) {
        if (resp.count) {
          setCount(resp.count);
        }
        const resData = resp.data;
        setTable(resData);
      }
    });
  };

  const getSalesHubSite = () => {
    const token = localStorage.getItem('token');
    const subDomain = localStorage.getItem('subDomainName');
    const headerData = {
      Authorization: `Token ${token}`,
    };
    setLoading(true);

    if (subDomain) {
      getRequest(
        `partnership/sales-hub/site/?subdomain=${subDomain}`,
        headerData
      ).then((resp: any) => {
        if (resp.result === true) {
          const resData = resp.data;
          const headerImg = `${
            resData.sales_hub.header_image
          }?t=${new Date().getTime()}`;
          setMain({
            headerText: resData.sales_hub.header_text,
            subHeaderText: resData.sales_hub.sub_header_text,
            headerImage: headerImg,
            solutinNarrative: resData.solution_narratives,
            companyLogo: resData.company_information?.logo
              ? `${resData.company_information.logo}?t=${new Date().getTime()}`
              : '',
            partnerLogo: resData.partner_company_information?.logo
              ? `${
                  resData.partner_company_information.logo
                }?t=${new Date().getTime()}`
              : '',
            address: resData.company_information,
          });
          setfontFamily(resData.sales_hub.font_family.name);
          setfontColor(resData.sales_hub.font_color.name);
        }
        setLoading(false);
      });
    }
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

  const getAccContactsDetails = (currOffset) => {
    const token = localStorage.getItem('token');
    const headerData = {
      Authorization: `Token ${token}`,
    };
    setContactsOffset(currOffset);
    setContactsLoading(true);

    if (currOffset === 0) {
      setContactsPage(1);
    }
    getRequest(
      `/partnership/sales-hub-account/account-contacts/?sales_hub_account_id=${salesHubAccountId}&offset=${currOffset}&limit=${25}`,

      headerData
    )
      .then((response: any) => {
        if (response.result === true) {
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

  useEffect(() => {
    getSalesHubSite();
    const isAnalyticsTab: boolean = !!queryparams.get('code') || false;
    if (isAnalyticsTab) {
      setTabValue(0);
      console.log(':::::inside tab value');
    }
    console.log(isAnalyticsTab, ':::::isAnalyticsTab');
    if (salesHubAccountId === '0') {
      fetchAccountTeamList(0);
      fetchSalesOpportunityList();
    }
    getSalesHubAccounts(0);
    fetchSalesMotionList();
    fetchStatusList();

    return () => {
      setIsAccountEngagementFormEdited({
        isAccountEngagementFormEdited: false,
      });
    };
  }, []);

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

  const handlePageChange = (data) => {
    setOffset((data - 1) * limit);
    setPage(data);
    getSalesHubAccounts((data - 1) * limit);
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
        const binaryData = [];
        binaryData.push(response);
        const Data = new Blob(binaryData, { type: 'application/pdf' });
        FileSaver.saveAs(Data, getFormattedTime());
      })
      .finally(() => setLoading(false));
  };

  const handleContactsPageChange = (e: any, data: any) => {
    setContactsOffset((data - 1) * contactsLimit);
    setContactsPage(data);
    getAccContactsDetails((data - 1) * contactsLimit);
  };

  const handleFilter = (name: string, value: string) => {
    if (name === 'salesMotion') {
      setSalesMotionSelected(value);
    } else if (name === 'status') {
      setStatusSelected(value);
    }
  };
  const handleSearch = () => {
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
    getRequest(
      `partnership/sales-hub-account/?partnership_id=${partnershipId}&limit=${20}&offset=${0}${nameSearch}${salesMotionSearch}${statusSearch}`,
      {
        Authorization: `Token ${token}`,
      }
    ).then((response: any) => {
      if (response.result === true) {
        if (response.data) {
          setTable(response.data);
        }
      }
    });
  };

  const handleAssetCollectionCardClick = (assetCollection) => {
    history.push(
      `/viewAssets?partner_id=${partnershipId}&assetCollection=${assetCollection.solution_narrative_id}`
    );
  };

  const StyledTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: tableStyle.bgColor,
      color: tableStyle.color,
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
  return (
    <div
      style={{ fontFamily }}
      className={styles.main}
      data-theme={darkMode ? 'dark' : 'light'}
    >
      {main && (
        <div>
          <div className={styles.headerDiv}>
            <Header
              companyLogo={main.companyLogo}
              partnerLogo={main.partnerLogo}
            />
            <SalesHubSiteProfile />
          </div>
          <div className={styles.headBg}>
            <img
              src={
                main?.headerImage
                  ? `${main?.headerImage}?time=${new Date().getTime()}`
                  : main?.headerImage
              }
              alt="Mountain"
            />
            <div
              className={styles.bannerTxtWrap}
              data-theme={fontColor === 'Dark' ? 'dark-text' : 'light-text'}
            >
              <div className={styles.srHeaderText}>{main.headerText}</div>
              <div className={styles.srSubHeaderText}>{main.subHeaderText}</div>
            </div>
          </div>

          <div className={styles.centerContentWrap}>
            <div
              className={`${styles.accEngagementWrap} ${
                salesHubAccountId !== '0' ? '' : styles.engagementEditMode
              }`}
            >
              {salesHubAccountId === '0' ? (
                <div className={styles.accHead}>
                  <div className={styles.accHeadTitle}>
                    {salesHubSiteTitle.tableTile}
                  </div>
                  <Button
                    className={styles.createBtn}
                    onClick={() => {
                      setActiveMenu(true);
                      dispatch(
                        setCurrentSalesHubAccId({
                          currentSalesHubAccountId: '',
                        })
                      );
                    }}
                  >
                    {salesHubSiteTitle.buttonCreate}
                  </Button>
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

                      <div className={styles.accountTitle}>{accountTitle}</div>
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
                              setTabValue(newValue);
                              history.push(
                                `/home?partner_id=${partnershipId}&sales_hub_account_id=${salesHubAccountId}`
                              );
                            },
                          })
                        );
                      } else {
                        history.push(
                          `/home?partner_id=${partnershipId}&sales_hub_account_id=${salesHubAccountId}`
                        );
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
                        textTransform: 'none',
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

              {salesHubAccountId === '0' ? (
                <div>
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
                          className={`${styles.searchbar} search`}
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
                            <span style={{ fontSize: '12px' }}>
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
                                salesMotionList.map((list: listValues) => (
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
                            <span style={{ fontSize: '12px' }}>
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
                                statusList.map((list: listValues) => (
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
                          handleSearch();
                        }}
                      >
                        {ButtonLabels.search}
                      </Button>
                    </div>
                  </div>
                  <TableContainer className={styles.salesHubTable}>
                    <Table aria-label="customized table">
                      <TableHead>
                        <TableRow>
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
                        {table.length > 0 ? (
                          table.map((row) => (
                            <StyledTableRow
                              key={row.sales_hub_account_id}
                              onClickCapture={() => {
                                editAccount(row.sales_hub_account_id);
                                setTabValue(1);
                              }}
                            >
                              <StyledTableCell>
                                {row.company_name}
                              </StyledTableCell>
                              <StyledTableCell>
                                {row.account_type_name}
                              </StyledTableCell>
                              <StyledTableCell>
                                {row.industry.slice(0, 17)}
                                {row.industry?.length > 17 ? '...' : ''}
                              </StyledTableCell>
                              <StyledTableCell>
                                {`${row.site_layout.sales_motion.name}${
                                  row.site_layout.sales_motion.is_active
                                    ? ''
                                    : ' (deleted)'
                                }`}
                              </StyledTableCell>
                              <StyledTableCell>{row.status}</StyledTableCell>
                              <StyledTableCell>
                                {row.created_by}
                              </StyledTableCell>
                            </StyledTableRow>
                          ))
                        ) : (
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
                        onChange={(e, data) => handlePageChange(data)}
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
                      <Box>
                        <AccountAnalytics
                          setSalesOpportunityList={setSalesOpportunityList}
                          salesOpportunityList={salesOpportunityList}
                          showAddSalesOpportunity={showAddSalesOpportunity}
                          setShowAddSalesOpportunity={
                            setShowAddSalesOpportunity
                          }
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
                                showAddSalesOpportunity={
                                  showAddSalesOpportunity
                                }
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
                      </Box>
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
                        <Typography>
                          <CreateAccount
                            cancelHandler={cancelHandler}
                            setAlert={setAlert}
                            darkMode={darkMode}
                            setLoader={() => setLoading(true)}
                            clearLoader={() => setLoading(false)}
                            salesMotionList={salesMotionList}
                            setAccountTitle={setAccountTitle}
                            statusList={statusList}
                            fetchSalesHubAccountsList={getSalesHubAccounts}
                            cadenceFieldEnabled={cadenceFieldEnabled}
                            setCadenceFieldEnabled={setCadenceFieldEnabled}
                            servicePartnerEnabled={servicePartnerEnabled}
                            setServicePartnerEnabled={setServicePartnerEnabled}
                            accountTeamList={accountTeamList}
                            setAccountTeamList={setAccountTeamList}
                            fetchAccountTeamList={fetchAccountTeamList}
                            showAddSalesOpportunity={showAddSalesOpportunity}
                            setShowAddSalesOpportunity={
                              setShowAddSalesOpportunity
                            }
                            setSalesOpportunityList={setSalesOpportunityList}
                            salesOpportunityList={salesOpportunityList}
                            fetchSalesOpportunityList={
                              fetchSalesOpportunityList
                            }
                            showCloseWarning={showCloseWarning}
                            setShowCloseWarning={setShowCloseWarning}
                            setFormEdited={setFormEdited}
                            formEdited={formEdited}
                            setIsDirty={setisDirty}
                            accountTeamCount={accountTeamCount}
                            accountTeamLimit={accountTeamLimit}
                            setActiveAddUserMenu={setActiveAddUserMenu}
                            getAccContactsDetails={getAccContactsDetails}
                            GetExportData={GetExportData}
                          />
                          {activeAddUserMenu ? (
                            <SideBar
                              title={salesHubSiteTitle.inviteAccTeam}
                              closeHandler={() => {
                                if (isDirty || formEdited) {
                                  setShowCloseWarning(true);
                                } else {
                                  setActiveAddUserMenu(false);
                                  fetchAccountTeamList(0);
                                }
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
                        </Typography>
                      </Box>
                    )}
                  </div>
                </>
              )}

              <div />
            </div>
            {salesHubAccountId === '0' ? (
              <>
                <div className={styles.recommendHeadTxt}>
                  {salesHubSiteTitle.cardTile}
                </div>
                <div className={styles.cardWrap}>
                  {main && main.solutinNarrative.length > 0 ? (
                    main.solutinNarrative.map((card) => (
                      <div
                        className={styles.bannerCard}
                        onClickCapture={() =>
                          handleAssetCollectionCardClick(card)
                        }
                      >
                        <img
                          src={
                            card?.image
                              ? `${card?.image}?time=${new Date().getTime()}`
                              : card?.image
                          }
                          alt="Avatar"
                        />
                        <div className={styles.cardContainer}>
                          <h4>
                            {card.name?.length > 25
                              ? `${card.name.slice(0, 25)}...`
                              : `${card.name.slice(0, 25)}`}
                          </h4>
                          <p>
                            {card.description?.length > 150
                              ? `${card.description.slice(0, 150)}...`
                              : `${card.description.slice(0, 150)}`}
                          </p>
                        </div>
                        <div className={styles.loadLink}>
                          <div>{`Learn more ${`>`}`}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={styles.noAssetCollectionMsg}>
                      {salesHubSiteTitle.noAssetCollection}
                    </div>
                  )}
                </div>
              </>
            ) : null}
          </div>
          <Footer
            address={main?.address}
            darkMode={darkMode}
            isPreview={null}
            companyLogo={main?.companyLogo}
          />
        </div>
      )}
      {activeMenu ? (
        <SideBar
          title={SignUpLabels.createAccount}
          closeHandler={() => {
            if (formEdited || isDirty) setShowCloseWarning(true);
            else setActiveMenu(false);
          }}
          renderElement={
            <CreateAccount
              cancelHandler={() => setActiveMenu(false)}
              setAlert={setAlert}
              darkMode={darkMode}
              setLoader={() => setLoading(true)}
              clearLoader={() => setLoading(false)}
              salesMotionList={salesMotionList}
              fetchSalesHubAccountsList={getSalesHubAccounts}
              cadenceFieldEnabled={cadenceFieldEnabled}
              setCadenceFieldEnabled={setCadenceFieldEnabled}
              servicePartnerEnabled={servicePartnerEnabled}
              setServicePartnerEnabled={setServicePartnerEnabled}
              setActiveAddUserMenu={setActiveAddUserMenu}
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
            setAlert((prevState: Alert) => ({
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

export default SalesHubSite;
