/* eslint-disable linebreak-style */
/* eslint-disable comma-dangle */
/* eslint-disable react/jsx-indent */
/* eslint-disable no-nested-ternary */
/* eslint-disable operator-linebreak */
/* eslint-disable indent */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/button-has-type */
/* eslint-disable linebreak-style */
import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { useHistory, useLocation } from 'react-router-dom';
import SnackbarAlert from 'src/app/components/Snackbar/Snackbar';
import SecondaryButton from 'src/app/components/Button/SecondaryButton';
import PrimaryButton from 'src/app/components/Button/PrimaryButton';
import { useDispatch, useSelector } from 'react-redux';
import SideBar from 'src/app/components/SideBar';
import { Dropdownlist } from './Dropdownlist';

// svg
import styles from './Menubar.module.css';
import './Menubar.css';
import AccountEngagements from '../../../../assets/Icons/Icons/SVG/accountEngagements.svg';
import accountEngagementsActive from '../../../../assets/Icons/Icons/SVG/accountEngagementsActive.svg';

import SalesMotions from '../../../../assets/Icons/Icons/SVG/salesMotions.svg';
import SalesMotionsActive from '../../../../assets/Icons/Icons/SVG/salesMotionActive.svg';
import accountSvg from '../../../../assets/Icons/Icons/SVG/Accounts_opportunities.svg';
import CampaignsSvg from '../../../../assets/Icons/Icons/SVG/Campaigns.svg';
import ContentSvg from '../../../../assets/Icons/Icons/SVG/Content.svg';
import SalesEnablementSvg from '../../../../assets/Icons/Icons/SVG/Sales_enablement.svg';
import ReportSvg from '../../../../assets/Icons/Icons/SVG/Report.svg';
import SetupSvg from '../../../../assets/Icons/Icons/SVG/Setup.svg';
import DownArrow from '../../../../assets/DownArrow.svg';
import setUpDone from '../../../../assets/setup_done.svg';
import settingsSvg from '../../../../assets/settings_icon.svg';
import settingsActive from '../../../../assets/settings_active_icon.svg';

// string
import { Sidebar, MenuBarLabels } from '../../../../../strings';

// services
import { getRequest, deleteRequest } from '../../../../service/index';
import {
  selectCreatePartnershipResponse,
  PartnershipInfoAction,
  setCreatePartnershipWarningEditor,
} from '../../../../views/CreatePartnership/CreatePartnerShipSlice';
import { selectuploadAssetResponse } from '../../../../views/UploadAssets/UploadAssetSlice';
import { selectAssetCollectionResponse } from '../../../../views/AssetCollection/AssetCollectionSlice';
import {
  salesHubResponse,
  setShowSalesHubWarningEditor,
} from '../../../../views/SalesHub/SalesHubSlice';
import { selectSalesMotionResponse } from '../../../../views/SalesMotion/SalesMotionSlice';
import {
  accountEngagementsResponse,
  setShowAccountEngagementWarningEditor,
} from 'src/app/views/AccountsEngagements/AccountEngagementsSlice';
import {
  PreviewPartnershipResponse,
  setShowPreviewPartnershipWarningEditor,
} from 'src/app/views/PreviewPartnership/PreviewPartnershipSlice';

interface partnership {
  partnership_name: string;
  partnership_id: number;
  content_hub_subdomain_name: string;
}
interface sidebar {
  title: string;
  href: string;
  icon: string;
}
export default function Menubar() {
  const pages = [
    {
      title: Sidebar.accountsEngagements,
      href: '/not-found',
      icon: AccountEngagements,
    },
    {
      title: Sidebar.salesMotion,
      href: '/not-found',
      icon: SalesMotions,
    },
    {
      title: Sidebar.content,
      href: '/not-found',
      icon: ContentSvg,
    },
    {
      title: Sidebar.sales,
      href: '/not-found',
      icon: SalesEnablementSvg,
    },
    {
      title: Sidebar.setup,
      href: '/accountSetup',
      icon: SetupSvg,
    },
    {
      title: Sidebar.settings,
      href: '/previewPartnership',
      icon: settingsSvg,
    },
  ];
  const pagesContent = [
    {
      title: Sidebar.accountsEngagements,
      href: '/not-found',
      icon: AccountEngagements,
    },
    {
      title: Sidebar.salesMotion,
      href: '/not-found',
      icon: SalesMotions,
    },
    {
      title: Sidebar.content,
      href: '/not-found',
      icon: ContentSvg,
    },
    {
      title: Sidebar.assets,
      href: ``,
      icon: '',
    },
    {
      title: Sidebar.assetCollection,
      href: '/assetCollection',
      icon: '',
    },
    {
      title: Sidebar.sales,
      href: '/not-found',
      icon: SalesEnablementSvg,
    },
    {
      title: Sidebar.setup,
      href: '/accountSetup',
      icon: SetupSvg,
    },
    {
      title: Sidebar.settings,
      href: '/previewPartnership',
      icon: settingsSvg,
    },
  ];
  const pagesSales = [
    {
      title: Sidebar.accountsEngagements,
      href: '/not-found',
      icon: AccountEngagements,
    },
    {
      title: Sidebar.salesMotion,
      href: '/not-found',
      icon: SalesMotions,
    },
    {
      title: Sidebar.content,
      href: '/not-found',
      icon: ContentSvg,
    },
    {
      title: Sidebar.sales,
      href: '/not-found',
      icon: SalesEnablementSvg,
    },
    {
      title: Sidebar.salesHub,
      href: '/salesHub',
      icon: '',
    },
    {
      title: Sidebar.salesContact,
      href: '/salesContacts',
      icon: '',
    },
    {
      title: Sidebar.setup,
      href: '/accountSetup',
      icon: SetupSvg,
    },
    {
      title: Sidebar.settings,
      href: '/previewPartnership',
      icon: settingsSvg,
    },
  ];
  const history = useHistory();
  const dispatch = useDispatch();
  const accountEngagementData = useSelector(accountEngagementsResponse);
  const previewPartnershipData = useSelector(PreviewPartnershipResponse);
  const partnershipResponseData = useSelector(selectCreatePartnershipResponse);
  const uploadAssetResponse = useSelector(selectuploadAssetResponse);
  const assetCollectionResponse = useSelector(selectAssetCollectionResponse);
  const salesHubStoreResponse = useSelector(salesHubResponse);
  const salesMotionResponse = useSelector(selectSalesMotionResponse);
  const [selectedIndex, setSelectedIndex] = React.useState(4);
  const [partnerships, setPartnerships] = useState<partnership[]>();
  const [partnerId, setpartnerId] = useState(0);
  const [isDropDownActive, setDropDownActive] = React.useState(true);
  const [isModalActive, setModalActive] = React.useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [partnershipName, setPartnershipName] = useState('');
  const [contentSelected, setContentSelected] = useState(false);
  const [salesSelected, setSalesSelected] = useState(false);
  const [sidebarContent, setSidebarContent] = useState(pages);
  const [partnershipId, setPartnershipId] = useState('');
  const [partnershipSelected, setPartnershipSelected] = useState(true);
  const [isPartnerSelected, setIsPartnerSelected] = useState(false);
  const [partnershipCreated, setPartnershipCreated] = useState(false);
  const [assetCreated, setAssetCreated] = useState(false);
  const [assetCollectionCreated, setAssetCollectionCreated] = useState(false);
  const [salesHubCreated, setSalesHubCreated] = useState(false);
  const [salesMotionCreated, setSalesMotionCreated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const queryparams = new URLSearchParams(window.location.search);
    const partnershipID: string = queryparams.get('partner_id') || '0';
    setPartnershipId(partnershipID);
    console.log(partnershipID);
    const id: number = +partnershipID;
    getPartnerships();
    getPartnershipById(id);
  }, [location, partnershipResponseData.refreshTimeStamp]);

  useEffect(() => {
    const queryparams = new URLSearchParams(window.location.search);
    const partnershipID: string = queryparams.get('partner_id') || '0';
    setPartnershipId(partnershipID);
    const id: number = +partnershipID;
    getPartnershipById(id);
  }, []);

  useEffect(() => {
    const queryparams = new URLSearchParams(window.location.search);
    const partnershipID: string = queryparams.get('partner_id') || '0';
    setPartnershipId(partnershipID);
    const id: number = +partnershipID;
    getPartnershipById(id);
  }, [
    uploadAssetResponse.refreshTimeStamp,
    assetCollectionResponse.refreshTimeStamp,
    salesHubStoreResponse.refreshTimeStamp,
    salesMotionResponse.refreshTimeStamp,
  ]);

  const ToggleClass = () => {
    setDropDownActive(!isDropDownActive);
    setSalesSelected(false);
    setContentSelected(false);
    setSidebarContent(pages);
  };

  const createPartnershipClickHandler = () => {
    const createPartnershipNavigateFn = () => {
      window.location.href = '/createPartnership';
    };

    if (salesHubStoreResponse.isSalesHubFormEdited) {
      dispatch(
        setShowSalesHubWarningEditor({
          show: true,
          navigateAction: createPartnershipNavigateFn,
        })
      );
    } else if (accountEngagementData.isAccountEngagementFormEdited) {
      dispatch(
        setShowAccountEngagementWarningEditor({
          show: true,
          navigateAction: createPartnershipNavigateFn,
        })
      );
    } else if (previewPartnershipData.isPreviewPartnershipFormEdited) {
      dispatch(
        setShowPreviewPartnershipWarningEditor({
          show: true,
          navigateAction: createPartnershipNavigateFn,
        })
      );
    } else if (partnershipResponseData.isCreatePartnershipFormEdited) {
      dispatch(
        setCreatePartnershipWarningEditor({
          show: true,
          navigateAction: createPartnershipNavigateFn,
        })
      );
    } else {
      createPartnershipNavigateFn();
    }
  };

  const getPartnerships = () => {
    const token = localStorage.getItem('token');
    const headerData = {
      Authorization: `Token ${token}`,
    };
    getRequest('partnership/?', headerData).then((resp: any) => {
      if (resp) {
        const resData = resp.data;
        setPartnerships(resData);
      }
    });
  };

  const getPartnershipById = (partnershipId: number) => {
    const token = localStorage.getItem('token');
    getRequest(`partnership/?partnership_id=${partnershipId}`, {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    }).then((resp: any) => {
      if (resp.result === true) {
        if (resp.data.is_sales_motion_available === true) {
          setSalesMotionCreated(true);
          setSalesHubCreated(true);
          setAssetCollectionCreated(true);
          setAssetCreated(true);
          setPartnershipCreated(true);
        } else if (resp.data.is_sales_hub_available === true) {
          setSalesMotionCreated(false);
          setSalesHubCreated(true);
          setAssetCollectionCreated(true);
          setAssetCreated(true);
          setPartnershipCreated(true);
        } else if (resp.data.is_solution_narrative_available === true) {
          setSalesMotionCreated(false);
          setSalesHubCreated(false);
          setAssetCollectionCreated(true);
          setAssetCreated(true);
          setPartnershipCreated(true);
          console.log('came12');
        } else if (resp.data.is_asset_available === true) {
          setSalesMotionCreated(false);
          setSalesHubCreated(false);
          setAssetCollectionCreated(false);
          setAssetCreated(true);
          setPartnershipCreated(true);
          console.log('came12 asset', resp.data);
        } else if (
          resp.data.partner_company_information !== null &&
          resp.data.company_information !== null
        ) {
          setPartnershipCreated(true);
          setAssetCreated(false);
          setAssetCollectionCreated(false);
          setSalesHubCreated(false);
          setSalesMotionCreated(false);
        } else {
          setPartnershipCreated(false);
          setAssetCreated(false);
          setSalesHubCreated(false);
          setSalesMotionCreated(false);
        }
        setPartnershipName(resp.data.partnership_name);
        localStorage.setItem(
          'subDomainName',
          resp.data.content_hub_subdomain_name
        );
        if (
          resp.data.partner_company_information === null ||
          resp.data.company_information === null
        ) {
          setPartnershipSelected(false);
        } else {
          setPartnershipSelected(true);
        }
      } else {
        setPartnershipName('Create partnership');
        setPartnershipSelected(false);
      }
    });
  };

  const handleListItemClick = (index: number, href: string, title: string) => {
    let returnFn;
    if (title === Sidebar.content) {
      returnFn = () => {
        setSalesSelected(false);
        setContentSelected(!contentSelected);
        setSidebarContent(contentSelected ? pages : pagesContent);
      };
    } else if (title === Sidebar.sales) {
      returnFn = () => {
        setContentSelected(false);
        setSalesSelected(!salesSelected);
        setSidebarContent(salesSelected ? pages : pagesSales);
      };
    } else {
      setSelectedIndex(index);
      if (
        title === Sidebar.salesMotion &&
        partnershipSelected &&
        salesHubCreated
      ) {
        returnFn = () => {
          history.push(`/salesMotion?partner_id=${partnershipId}`);
          setSalesSelected(false);
          setContentSelected(false);
          setSidebarContent(pages);
        };
      } else if (
        title === Sidebar.assets &&
        partnershipSelected &&
        partnershipCreated
      ) {
        returnFn = () => {
          history.push(`/uploadAsset?partner_id=${partnershipId}`);
        };
      } else if (
        title === Sidebar.assetCollection &&
        partnershipSelected &&
        assetCreated
      ) {
        returnFn = () => {
          history.push(`/assetCollection?partner_id=${partnershipId}`);
        };
      } else if (
        title === Sidebar.salesHub &&
        partnershipSelected &&
        assetCollectionCreated
      ) {
        returnFn = () => {
          history.push(`/salesHub?partner_id=${partnershipId}`);
        };
      } else if (
        title === Sidebar.salesContact &&
        partnershipSelected &&
        assetCollectionCreated
      ) {
        returnFn = () => {
          history.push(`/salesContacts?partner_id=${partnershipId}`);
        };
      } else if (title === Sidebar.setup) {
        if (partnershipId !== '0') {
          returnFn = () => {
            history.push(`/accountSetup?partner_id=${partnershipId}`);
            setSalesSelected(false);
            setContentSelected(false);
            setSidebarContent(pages);
          };
        } else {
          returnFn = () => {
            history.push(`/accountSetup`);
            setSalesSelected(false);
            setContentSelected(false);
            setSidebarContent(pages);
          };
        }
      } else if (title === Sidebar.settings && partnershipId !== '0') {
        returnFn = () => {
          history.push(`/previewPartnership?partner_id=${partnershipId}`);
          setSalesSelected(false);
          setContentSelected(false);
          setSidebarContent(pages);
        };
      } else if (
        title === Sidebar.accountsEngagements &&
        partnershipSelected &&
        salesMotionCreated
      ) {
        returnFn = () => {
          history.push(`/accountsEngagements?partner_id=${partnershipId}`);
          setSalesSelected(false);
          setContentSelected(false);
          setSidebarContent(pages);
        };
      }
    }
    return () => {
      setDropDownActive(true);
      returnFn();
    };
  };
  const editPartnership = (id: number) => {
    return () => {
      getPartnershipById(id);
      history.push(`/accountSetup?partner_id=${id}`);
      setIsPartnerSelected(true);
      setDropDownActive(!isDropDownActive);
    };
  };
  const refCreatePartnership: any = React.useRef();
  const HanldeCloseCreatePartnershipDropdown = (event) => {
    if (
      refCreatePartnership.current &&
      !refCreatePartnership.current.contains(event.target)
    ) {
      setDropDownActive(true);
    }
  };
  useEffect(() => {
    document.addEventListener(
      'mousedown',
      HanldeCloseCreatePartnershipDropdown
    );

    return () =>
      document.removeEventListener(
        'mousedown',
        HanldeCloseCreatePartnershipDropdown
      );
  }, []);
  return (
    <Box sx={{ width: '100%' }}>
      <div className={styles.dropdown} ref={refCreatePartnership}>
        <button
          className={styles.dropdownBtn}
          onClick={(event) => ToggleClass()}
        >
          <div
            className={
              isPartnerSelected || partnershipName !== 'Create partnership'
                ? styles.dropdownBtnLabelSelected
                : styles.dropdownBtnLabel
            }
          >
            {partnershipName}
          </div>
          <KeyboardArrowDownIcon
            className={`${styles.arrowIcon}  ${
              isDropDownActive ? styles.arrowIconActive : ''
            }`}
          />
        </button>
        <div
          className={
            isDropDownActive ? styles.dropdownMenu : styles.dropdownMenuActive
          }
        >
          {partnerships && (
            <Dropdownlist
              createPartnershipClickHandler={createPartnershipClickHandler}
              partnerships={partnerships}
              editPartnership={(id) => {
                if (salesHubStoreResponse.isSalesHubFormEdited) {
                  dispatch(
                    setShowSalesHubWarningEditor({
                      show: true,
                      navigateAction: editPartnership(id),
                    })
                  );
                } else if (
                  accountEngagementData.isAccountEngagementFormEdited
                ) {
                  dispatch(
                    setShowAccountEngagementWarningEditor({
                      show: true,
                      navigateAction: editPartnership(id),
                    })
                  );
                } else if (
                  previewPartnershipData.isPreviewPartnershipFormEdited
                ) {
                  dispatch(
                    setShowPreviewPartnershipWarningEditor({
                      show: true,
                      navigateAction: editPartnership(id),
                    })
                  );
                } else if (
                  partnershipResponseData.isCreatePartnershipFormEdited
                ) {
                  dispatch(
                    setCreatePartnershipWarningEditor({
                      show: true,
                      navigateAction: editPartnership(id),
                    })
                  );
                } else {
                  editPartnership(id)();
                }
              }}
            />
          )}
        </div>
      </div>

      <List
        className={styles.list}
        component="nav"
        aria-label="secondary mailbox folder"
      >
        {sidebarContent.map((page, index) => (
          <ListItemButton
            className="listButton"
            key={page.title}
            selected={selectedIndex === index}
            onClick={(event) => {
              if (
                salesHubStoreResponse.isSalesHubFormEdited ||
                accountEngagementData.isAccountEngagementFormEdited ||
                previewPartnershipData.isPreviewPartnershipFormEdited ||
                partnershipResponseData.isCreatePartnershipFormEdited
              ) {
                if (
                  page.title === Sidebar.content ||
                  page.title === Sidebar.sales
                ) {
                  handleListItemClick(index, page.href, page.title)();
                  return;
                }
              }
              if (salesHubStoreResponse.isSalesHubFormEdited) {
                dispatch(
                  setShowSalesHubWarningEditor({
                    show: true,
                    navigateAction: handleListItemClick(
                      index,
                      page.href,
                      page.title
                    ),
                  })
                );
              } else if (accountEngagementData.isAccountEngagementFormEdited) {
                dispatch(
                  setShowAccountEngagementWarningEditor({
                    show: true,
                    navigateAction: handleListItemClick(
                      index,
                      page.href,
                      page.title
                    ),
                  })
                );
              } else if (
                previewPartnershipData.isPreviewPartnershipFormEdited
              ) {
                dispatch(
                  setShowPreviewPartnershipWarningEditor({
                    show: true,
                    navigateAction: handleListItemClick(
                      index,
                      page.href,
                      page.title
                    ),
                  })
                );
              } else if (
                partnershipResponseData.isCreatePartnershipFormEdited
              ) {
                if (
                  page.title === Sidebar.setup ||
                  page.title === Sidebar.settings
                ) {
                  dispatch(
                    setCreatePartnershipWarningEditor({
                      show: true,
                      navigateAction: handleListItemClick(
                        index,
                        page.href,
                        page.title
                      ),
                    })
                  );
                } else {
                  handleListItemClick(index, page.href, page.title)();
                }
              } else {
                handleListItemClick(index, page.href, page.title)();
              }
            }}
          >
            <ListItemIcon className={styles.icon}>
              {window.location.pathname.includes('accountSetup') &&
              page.title === 'Setup' ? (
                <img src={setUpDone} alt="setup" />
              ) : window.location.pathname.includes('salesMotion') &&
                page.title === 'Sales Motions' ? (
                <img src={SalesMotionsActive} alt="setup" />
              ) : window.location.pathname.includes('accountsEngagements') &&
                page.title === 'Account Engagements' ? (
                <img src={accountEngagementsActive} alt="setup" />
              ) : window.location.pathname.includes('previewPartnership') &&
                page.title === 'Partnership Settings' ? (
                <img src={settingsActive} alt="settings" />
              ) : (
                <img src={page.icon} alt="" />
              )}
            </ListItemIcon>
            <ListItemText
              className={
                (window.location.pathname.includes('accountSetup') &&
                  page.title === 'Setup') ||
                (window.location.pathname.includes('uploadAsset') &&
                  page.title === 'Assets') ||
                (window.location.pathname.includes('assetCollection') &&
                  page.title === 'Asset Collections') ||
                (window.location.pathname.includes('salesHub') &&
                  page.title === 'Sales Hub') ||
                (window.location.pathname.includes('salesContact') &&
                  page.title === 'Sales Contacts') ||
                (window.location.pathname.includes('salesMotion') &&
                  page.title === 'Sales Motions') ||
                (window.location.pathname.includes('previewPartnership') &&
                  page.title === 'Partnership Settings') ||
                (window.location.pathname.includes('accountsEngagements') &&
                  page.title === 'Account Engagements')
                  ? styles.clicked
                  : styles.icon
              }
            >
              {page.title === Sidebar.assets ||
              page.title === Sidebar.assetCollection ||
              page.title === Sidebar.salesHub ||
              page.title === Sidebar.salesContact ? (
                <span className={styles.title}>
                  &bull;&nbsp; &nbsp;{page.title}
                </span>
              ) : page.title === Sidebar.content ||
                page.title === Sidebar.sales ? (
                <span className={styles.title}>
                  {page.title}
                  <img className={styles.arrow} src={DownArrow} alt="" />
                </span>
              ) : (
                <span className={styles.title}>{page.title} </span>
              )}
            </ListItemText>
          </ListItemButton>
        ))}
      </List>

      {showAlert && (
        <SnackbarAlert
          severity="success"
          handler={() => setShowAlert(false)}
          showalert={showAlert}
          message={MenuBarLabels.snackbarMsg}
        />
      )}
    </Box>
  );
}
