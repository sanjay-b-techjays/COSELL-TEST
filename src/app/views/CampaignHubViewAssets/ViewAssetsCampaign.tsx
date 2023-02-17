/* eslint-disable no-nested-ternary */
/* eslint-disable indent */
/* eslint-disable object-curly-newline */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable linebreak-style */
/* eslint-disable comma-dangle */
/* eslint-disable operator-linebreak */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
import React, { useEffect, useState } from 'react';
import FileViewer from 'react-file-viewer';
import { useMediaQuery } from 'react-responsive';
import ReactGA from 'react-ga4';
import { makeStyles } from '@material-ui/styles';
import { getRequest } from 'src/app/service';
import Loader from 'src/app/components/Loader';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Fab, Link } from '@material-ui/core';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TreeView from '@mui/lab/TreeView';
import TreeItem, { treeItemClasses } from '@mui/lab/TreeItem';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import SnackbarAlert from 'src/app/components/Snackbar/Snackbar';
import folderCollapeIcon from '../../assets/viewAssetsFolderIcons/folderCollapseIcon.svg';
import folderExpandIcon from '../../assets/viewAssetsFolderIcons/folderExpandIcon.svg';
import wordIcon from '../../assets/word_mini_icon.svg';
import pdfIcon from '../../assets/pdf_mini_icon.svg';
import pptIcon from '../../assets/ppt_mini_icon.svg';
import excelIcon from '../../assets/excel_mini_icon.svg';
import videoIcon from '../../assets/video_mini_icon.svg';
import imageIcon from '../../assets/img_mini_icon.svg';
import othersIcon from '../../assets/others_mini_icon.svg';
import FabIcon from '../../assets/FloatingActionButtonImg.svg';
import FabCloseIcon from '../../assets/FloatingCloseButtonImg.svg';
import ViewAssetMenuIcon from '../CampaignHub/ViewAssetMenuIcon.svg';
import RightArrow from './ViewAssetIcons/RightArrow.svg';
import LeftArrow from './ViewAssetIcons/LeftArrow.svg';
import LinkIcon from '../../assets/CampaignHubIcons/LinkIcon.svg';
import { campaignHubLabels } from '../../../strings';

import styles from './ViewAssetsCampaign.module.css';
import './ViewAssetsCampaign.css';
import CtaPopup from '../CampaignHub/Components/CtaPopup/CtaPopup';
import { SpecialZoomLevel, Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import { useCookies } from 'react-cookie';

// Import styles
import '@react-pdf-viewer/zoom/lib/styles/index.css';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import Footer from '../CampaignHub/Components/FooterComponent/Footer';

const trackingID = import.meta.env.VITE_TRACKING_ID;
const ViewAssetsCampaignHub = () => {
  const history = useHistory();
  const [firstTimeAssetChange, setFirstTimeAssetChange] = useState({
    firstTime: false,
    id: 0,
  });
  const [selectedAsset, setSelectedAsset] = useState({
    file: '',
    fileType: '',
    id: '',
    name: '',
    originalName: '',
    nodeId: 0,
    nodeName: '',
  });

  const [loading, setLoading] = useState(true);
  const [copiedAlert, setCopiedAlert] = useState(false);
  const [logo, setLogo] = useState({
    companyLogo: '',
    partnerCompanyLogo: '',
    serviceProviderLogo: '',
  });
  const [partnershipId, setPartnershipId] = useState('');
  const [assetID, setAssetID] = useState('');
  const [resizerEnabled, setResizerEnabled] = useState(false);
  const [expanded, setExpanded] = useState(['']);
  const [assetCollections, setAssetCollections] = useState([]);
  const [ctaPreviewSelected, setCtaPreviewSelected] = useState(false);
  const [salesHubDetail, setSalesHubDetail] = useState(null);
  const [partnershipDetails, setPartnershipDetails] = useState(null);
  const [lastClicked, setLastClicked] = useState(new Date().getTime());
  const [ipAddress, setIpAddress] = useState('');
  const [ipDetails, setIpDetails] = useState(null);
  const [showAssetList, setShowAssetList] = useState(true);
  const [showMobileAssetList, setShowMobileAssetList] = useState('');
  const [assetTitle, setAssetTitle] = useState('All Content');
  const subDomainName = localStorage.getItem('subDomainName');
  const accountName = window.location.pathname.split('/')[1];
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [cookies, setCookie] = useCookies(['path_name']);
  const [allowCookie, setAllowCookie] = useState(true);
  const location = useLocation();

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  const isMobile = useMediaQuery({ query: '(max-width: 750px)' });

  const handleCookie = () => {
    const cookieArr = [];
    if (cookies.path_name !== 'null' && cookies.path_name) {
      if (cookies.path_name.includes(accountName)) {
        setCookie('path_name', cookies.path_name);
      } else {
        cookies.path_name.map((val) => cookieArr.push(val));
        cookieArr.push(accountName);
        setCookie('path_name', cookieArr);
      }
    } else {
      cookieArr.push(accountName);
      setCookie('path_name', cookieArr);
    }
    setAllowCookie(false);
  };
  const getCompanyLogos = () => {
    getRequest(
      `partnership/sales-hub-account/site?sales_hub_domain=${subDomainName}&account_name=${accountName}`,
      {}
    ).then((response: any) => {
      if (response.result === true) {
        if (response.data.partnership) {
          const partnerShipDetail = response.data.partnership;
          const salesHubRespDetail = response.data.sales_hub_account;
          setLogo({
            companyLogo: partnerShipDetail?.company_information?.logo
              ? `${
                  partnerShipDetail?.company_information?.logo
                }?t=${new Date().getTime()}`
              : partnerShipDetail?.company_information?.logo,

            partnerCompanyLogo: partnerShipDetail?.partner_company_information
              ?.logo
              ? `${
                  partnerShipDetail?.partner_company_information?.logo
                }?t=${new Date().getTime()}`
              : partnerShipDetail?.partner_company_information?.logo,
            serviceProviderLogo: salesHubRespDetail?.service_provider_logo
              ? `${
                  salesHubRespDetail?.service_provider_logo
                }?t=${new Date().getTime()}`
              : salesHubRespDetail?.service_provider_logo,
          });
        }
        if (response.data.sales_hub_account) {
          setSalesHubDetail(response.data.sales_hub_account);
        }
        if (response.data.partnership) {
          setPartnershipDetails(response.data.partnership);
        }
      }
      setLoading(false);
    });
  };

  const getIpAddress = () => {
    getRequest(
      `partnership/sales-hub-account/site/is-available/?subdomain=${subDomainName}&campaign_hub_domain=${
        window.location.pathname.split('/')[1]
      }`,
      {}
    ).then((response: any) => {
      if (response.result === true) {
        if (response.data) {
          setIpAddress(response.data.ip_address);
          setIpDetails(response.data.ip_details);
        }
        console.log(response, 'getIpAddress response');
      }
    });
  };

  const getSelectedAssetCollectionData = (
    assetCollectionId: number,
    assetCollectionData: any
  ) => {
    const updatedData = assetCollectionData.filter(
      (assetCollection) =>
        assetCollection.solution_narrative_id === assetCollectionId
    );
    return updatedData;
  };

  const expandAndSetDefaultAsset = (assetCollectionData: any) => {
    const queryparams = new URLSearchParams(window.location.search);
    const assetCollectionIdFromQuery: string =
      queryparams.get('assetCollection') || '0';
    const assetIdFromQuery: string = queryparams.get('asset') || '0';
    console.log(assetIdFromQuery, 'assetIdFromQuery');

    const selectedAssetCollectionId =
      assetCollectionIdFromQuery !== '0'
        ? assetCollectionIdFromQuery
        : assetCollectionData[0].solution_narrative_id.toString();
    const deafultFile = getSelectedAssetCollectionData(
      parseInt(selectedAssetCollectionId, 10),
      assetCollectionData
    )[0]?.assets[0]?.file;
    let extension = deafultFile.split('.').pop();
    if (extension === 'PNG') {
      extension = 'png';
    }
    if (assetIdFromQuery !== '0') {
      assetCollectionData.filter((assetCollection) =>
        assetCollection.solution_narrative_id.toString() ===
        assetCollectionIdFromQuery
          ? assetCollection.assets.filter((asset) =>
              asset.asset_id.toString() === assetIdFromQuery
                ? (setSelectedAsset({
                    file: asset.file,
                    fileType: asset.file.split('.').pop(),
                    id: asset.asset_id,
                    name: asset.asset_name,
                    originalName: asset.asset_file,
                    nodeId: assetCollection.solution_narrative_id,
                    nodeName: assetCollection.name,
                  }),
                  setFirstTimeAssetChange({
                    ...firstTimeAssetChange,
                    id: asset.asset_id,
                  }),
                  setAssetTitle(assetCollection.name))
                : null
            )
          : null
      );
    } else {
      const deafultFile = getSelectedAssetCollectionData(
        parseInt(selectedAssetCollectionId, 10),
        assetCollectionData
      )[0]?.assets[0]?.file;
      const deafultFileId = getSelectedAssetCollectionData(
        parseInt(selectedAssetCollectionId, 10),
        assetCollectionData
      )[0]?.assets[0]?.asset_id;
      const deafultFileName = getSelectedAssetCollectionData(
        parseInt(selectedAssetCollectionId, 10),
        assetCollectionData
      )[0]?.assets[0].asset_name;
      const deafultFileOriginalName = getSelectedAssetCollectionData(
        parseInt(selectedAssetCollectionId, 10),
        assetCollectionData
      )[0]?.assets[0].file_name;
      const deafultFolderName = getSelectedAssetCollectionData(
        parseInt(selectedAssetCollectionId, 10),
        assetCollectionData
      )[0]?.name;
      history.push({
        pathname: window.location.pathname,
        search: `?assetCollection=${selectedAssetCollectionId}&asset=${deafultFileId}`,
      });
      setSelectedAsset({
        file: deafultFile,
        fileType: extension,
        id: deafultFileId,
        name: deafultFileName,
        originalName: deafultFileOriginalName,
        nodeId: parseInt(selectedAssetCollectionId),
        nodeName: deafultFolderName,
      });
      setAssetTitle(deafultFolderName);
      setFirstTimeAssetChange({
        ...firstTimeAssetChange,
        id: deafultFileId,
      });
    }
  };
  const getAssetCollections = () => {
    const subDomainName = localStorage.getItem('subDomainName');
    const accName = window.location.pathname.split('/')[1];
    setLoading(true);
    getRequest(
      `partnership/sales-hub-account/get-solution-narrative/?sales_hub_domain=${subDomainName}&account_name=${accName}`,
      {}
    ).then((resp: any) => {
      if (resp.result === true) {
        const assetCollectionData = resp.data;
        const assetIds = assetCollectionData.map((assetCollection) =>
          assetCollection.solution_narrative_id.toString()
        );
        setExpanded(assetIds);
        setAssetCollections(assetCollectionData);
        expandAndSetDefaultAsset(assetCollectionData);
      }
      setLoading(false);
    });
  };

  const handleChange = (event, nodes) => {
    setExpanded(nodes);
  };

  const getFolderIcon = (nodeId: string) => {
    console.log(nodeId, 'nodeId');
    if (expanded.includes(nodeId)) {
      return folderExpandIcon;
    }
    return folderCollapeIcon;
  };

  interface StyledTreeItemRootProps {
    isSelected?: boolean;
  }

  const StyledTreeItemRoot = styled(TreeItem, {
    shouldForwardProp: (prop) => true,
  })<StyledTreeItemRootProps>(({ theme, isSelected }) => ({
    color: theme.palette.text.secondary,
    [`& .${treeItemClasses.content}`]: {
      backgroundColor: isSelected ? '#efefef !important' : '#ffffff !important',
      borderTopRightRadius: theme.spacing(0),
      borderBottomRightRadius: theme.spacing(0),
      borderRadius: '10px !important',
      marginLeft: '-.6em !important',
      fontWeight: theme.typography.fontWeightMedium,
      '&.Mui-expanded': {
        fontWeight: theme.typography.fontWeightRegular,
      },
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
      // '&.Mui-focused': {
      //   backgroundColor: `white`,
      //   color: 'inherit',
      // },
      [`& .${treeItemClasses.label}`]: {
        marginLeft: isSelected ? '-8px !important' : '-8px !important',
        fontWeight: 'inherit',
        fontSize: '12px',
        width: 'auto',
        wordBreak: 'break-word',
        color: '#192A3E',
      },
      [`& .${treeItemClasses.iconContainer}`]: {
        marginRight: '0px ',
      },
    },
    [`& .${treeItemClasses.group}`]: {
      marginLeft: 0,
      [`& .${treeItemClasses.content}`]: {
        // paddingLeft: theme.spacing(0.5),
        width: 'auto',
      },
    },
  }));

  const StyledTreeItem = (props) => {
    const {
      bgColor,
      color,
      labelIcon,
      labelInfo,
      labelText,
      isSelected,
      ...other
    } = props;
    return (
      <StyledTreeItemRoot
        isSelected={isSelected}
        label={
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 1,
              pr: 0,
            }}
          >
            <img style={{ marginRight: '0.6em' }} src={labelIcon} alt="" />
            <Typography
              variant="body2"
              sx={{ fontWeight: 'inherit', flexGrow: 1, wordWrap: 'break-all' }}
            >
              {labelText}
            </Typography>
            <Typography variant="caption" color="inherit">
              {labelInfo}
            </Typography>
          </Box>
        }
        style={{
          '--tree-view-color': color,
          '--tree-view-bg-color': bgColor,
        }}
        {...other}
      />
    );
  };

  useEffect(() => {
    ReactGA.initialize([
      {
        trackingId: import.meta.env.VITE_TRACKING_ID,
        gaOptions: {
          debug_mode: true,
        },
      },
    ]);
  }, []);

  window.onpopstate = () => {
    onClickCheck();
  };

  window.onbeforeunload = () => {
    onClickCheck();
  };

  const onClickCheck = () => {
    const timeNow = new Date().getTime();
    if (timeNow > lastClicked) {
      const duration = timeNow - lastClicked;
      const seconds = Math.floor(duration / 1000);
      setLastClicked(timeNow);

      const data = {
        asset_id: selectedAsset.id,
        asset_name: selectedAsset.name,
        asset_type: selectedAsset.fileType,
        asset_url: selectedAsset.file,
        asset_viewing_time: seconds,
        ip: ipAddress,
        account_name: accountName,
        sub_domain_name: subDomainName,
        partnership_name: partnershipDetails.partnership_name,
        partnership_id: partnershipDetails.partnership_id,
        sales_hub_account_id: salesHubDetail.sales_hub_account_id,
        city: ipDetails.city,
        country: ipDetails.country,
        latitude: ipDetails.latitude,
        longitude: ipDetails.longitude,
        organization: ipDetails.organization,
        postal_code: ipDetails.postal_code,
        region: ipDetails.region,
      };
      console.log('view_asset_data', data);
      ReactGA.event('view_asset', data);
    }
  };

  const handleAssetClick = (asset: any, assetCollection: any) => {
    console.log('asset', asset);
    onClickCheck();
    if (
      !firstTimeAssetChange.firstTime &&
      firstTimeAssetChange.id !== asset.asset_id &&
      assetID !== '0'
    ) {
      setFirstTimeAssetChange({
        ...firstTimeAssetChange,
        firstTime: true,
      });
      setCtaPreviewSelected(true);
    }
    history.push({
      pathname: window.location.pathname,
      search: `?assetCollection=${assetCollection.solution_narrative_id}&asset=${asset.asset_id}`,
    });
    setSelectedAsset({
      file: '',
      fileType: '',
      id: '',
      name: '',
      originalName: '',
      nodeId: 0,
      nodeName: '',
    });
    let extension = asset.file.split('.').pop();
    if (extension === 'PNG') {
      extension = 'png';
    }

    setSelectedAsset({
      file: asset.file,
      fileType: extension,
      id: asset.asset_id,
      name: asset.asset_name,
      originalName: asset.file_name,
      nodeId: assetCollection.solution_narrative_id,
      nodeName: assetCollection.name,
    });
    setAssetTitle(assetCollection.name);
  };
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    toolbarPlugin: {
      fullScreenPlugin: {
        // Zoom to fit the screen after entering and exiting the full screen mode
        onEnterFullScreen: (zoom) => {
          zoom(SpecialZoomLevel.PageFit);
        },
        onExitFullScreen: (zoom) => {
          zoom(SpecialZoomLevel.PageFit);
        },
      },
    },
  });

  // const zoomPluginInstance = zoomPlugin(ZoomPluginProps);

  const renderAssets = (fileType: string) => {
    if (
      fileType === 'svg' ||
      fileType === 'png' ||
      fileType === 'jpg' ||
      fileType === 'jpeg'
    ) {
      return (
        <img
          src={
            selectedAsset?.file
              ? `${selectedAsset?.file}?t=${new Date().getTime()}`
              : selectedAsset?.file
          }
          width="100%"
          height="100%"
          alt=""
        />
      );
    }
    if (fileType === 'mp4' || fileType === 'mkv' || fileType === 'mov') {
      return (
        <video
          id={selectedAsset.id}
          className={styles.videoAssetView}
          src={selectedAsset.file}
          controls
        />
      );
    }
    if (
      fileType === 'pptx' ||
      fileType === 'ppt' ||
      fileType === 'doc' ||
      fileType === 'docx' ||
      fileType === 'xls' ||
      fileType === 'txt' ||
      fileType === 'json'
    ) {
      return (
        <iframe
          key={selectedAsset.id}
          className={styles.iframeAssetView}
          src={`https://docs.google.com/gview?url=${
            selectedAsset.file
          }&embedded=true&t=${new Date().getTime()}`}
          frameBorder="0"
          title="frame"
        />
      );
    }
    if (fileType === 'pdf') {
      return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.12.313/build/pdf.worker.min.js">
          <div className={styles.pdfOnlyDiv}>
            <Viewer
              defaultScale={isMobile ? 0.75 : 1.5}
              fileUrl={selectedAsset.file}
              plugins={[defaultLayoutPluginInstance]}
            />
          </div>
        </Worker>
      );
    }
    return (
      <FileViewer
        key={`${selectedAsset.file.toString()}asset`}
        fileType={selectedAsset.fileType}
        filePath={selectedAsset.file}
      />
    );
  };

  const getDocIcon = (docType: string) => {
    let icon = '';
    switch (docType) {
      case 'docx':
      case 'doc':
      case 'Word':
        icon = wordIcon;
        break;
      case 'TXT':
      case 'txt':
        icon = othersIcon;
        break;
      case 'pdf':
      case 'Pdf':
        icon = pdfIcon;
        break;
      case 'pptx':
      case 'ppt':
      case 'Powerpoint':
        icon = pptIcon;
        break;
      case 'mp4':
      case 'mkv':
      case 'MP4':
      case 'webm':
      case 'MOV':
      case 'mov':
      case 'Video':
        icon = videoIcon;
        break;
      case 'jpeg':
      case 'webp':
      case 'gif':
      case 'jfif':
      case 'jpg':
      case 'png':
      case 'svg':
      case 'Image':
        icon = imageIcon;
        break;
      case 'Excel':
      case 'csv':
      case 'xls':
      case 'xlsx':
        icon = excelIcon;
        break;
      default:
        icon = othersIcon;
    }
    return icon;
  };

  useEffect(() => {
    const queryparams = new URLSearchParams(window.location.search);
    const partnerShipId: string = queryparams.get('partner_id') || '0';
    setPartnershipId(partnerShipId);
    getCompanyLogos();
    getAssetCollections();
    getIpAddress();
    if (isMobile) {
      setShowAssetList(false);
    }
    cookies?.path_name?.includes(accountName) ? setAllowCookie(false) : null;
  }, []);

  useEffect(() => {
    const queryparams = new URLSearchParams(window.location.search);
    const assetId: string = queryparams.get('asset') || '0';
    setAssetID(assetId);
    console.log(window.location.href);
  }, [location]);

  const viewAssetCollection = () => (
    <div
      className={
        !showAssetList && isMobile
          ? styles.viewAssetsMobileFilesContainer
          : styles.viewAssetsFilesContainer
      }
    >
      {showAssetList ? (
        <TreeView
          aria-label="gmail"
          defaultExpanded={['3']}
          defaultCollapseIcon={<ArrowDropDownIcon />}
          defaultExpandIcon={<ArrowRightIcon />}
          defaultEndIcon={<div style={{ width: 24 }} />}
          sx={{ height: 'auto', flexGrow: 1, maxWidth: 400 }}
          multiSelect
          expanded={expanded}
          onNodeToggle={handleChange}
        >
          {assetCollections.length > 0 &&
            assetCollections.map((assetCollection) => (
              <StyledTreeItem
                onClick={() => {
                  console.log(assetCollection.assets, '<<');
                }}
                key={assetCollection.solution_narrative_id.toString()}
                bgColor="white"
                nodeId={assetCollection.solution_narrative_id.toString()}
                labelText={
                  resizerEnabled
                    ? ''
                    : assetCollection.assets.length > 0
                    ? assetCollection.name
                    : `${assetCollection.name} (no assets)`
                }
                labelIcon={getFolderIcon(
                  assetCollection.solution_narrative_id.toString()
                )}
              >
                {assetCollection.assets &&
                  assetCollection.assets.length > 0 &&
                  assetCollection.assets.map((asset) => (
                    <StyledTreeItem
                      isSelected={
                        selectedAsset.id === asset.asset_id &&
                        selectedAsset.nodeId ===
                          assetCollection.solution_narrative_id
                      }
                      onClick={() => {
                        handleAssetClick(asset, assetCollection);
                        if (isMobile) {
                          setShowAssetList(false);
                        }
                      }}
                      key={asset.asset_id}
                      labelText={resizerEnabled ? '' : asset.asset_name}
                      labelIcon={getDocIcon(asset.file_type)}
                    />
                  ))}
              </StyledTreeItem>
            ))}
        </TreeView>
      ) : (
        <TreeView
          aria-label="gmail"
          defaultExpanded={['3']}
          defaultCollapseIcon={<ArrowDropDownIcon />}
          defaultExpandIcon={<ArrowRightIcon />}
          defaultEndIcon={<div style={{ width: 24 }} />}
          sx={{ height: 'auto', flexGrow: 1, maxWidth: 400 }}
          multiSelect
          expanded={expanded}
          onNodeToggle={handleChange}
        >
          {assetCollections.length > 0 &&
            assetCollections.map((assetCollection) => (
              <StyledTreeItem
                key={assetCollection.solution_narrative_id.toString()}
                nodeId={assetCollection.solution_narrative_id.toString()}
                labelIcon={getFolderIcon(
                  assetCollection.solution_narrative_id.toString()
                )}
              >
                {assetCollection.assets &&
                  assetCollection.assets.length > 0 &&
                  assetCollection.assets.map((asset) => (
                    <StyledTreeItem
                      isSelected={
                        selectedAsset.id === asset.asset_id &&
                        selectedAsset.nodeId ===
                          assetCollection.solution_narrative_id
                      }
                      onClick={() => {
                        handleAssetClick(asset, assetCollection);
                      }}
                      key={asset.asset_id}
                      labelIcon={getDocIcon(asset.file_type)}
                    />
                  ))}
              </StyledTreeItem>
            ))}
        </TreeView>
      )}
    </div>
  );
  return (
    <div>
      {!loading && (
        <div className={styles.viewAssetsMainContainer}>
          <div className={styles.viewAssetsHeaderContainer}>
            <div
              className={
                logo.serviceProviderLogo !== null
                  ? styles.viewAssetsLogoContainer
                  : styles.viewAssetsLogoContainer2
              }
            >
              {logo.companyLogo !== null && (
                <img
                  className={styles.companyLogo}
                  src={logo.companyLogo}
                  alt=""
                />
              )}
              {logo.partnerCompanyLogo !== null && (
                <img
                  className={styles.companyLogo}
                  src={logo.partnerCompanyLogo}
                  alt=""
                />
              )}
              {logo.serviceProviderLogo !== null && (
                <img
                  className={styles.companyLogo}
                  src={logo.serviceProviderLogo}
                  alt=""
                />
              )}
            </div>
          </div>
          <div
            className={
              !showAssetList && isMobile
                ? `${styles.Breadcrumbs} Breadcrumbs`
                : `${styles.viewAssetsWrapContainer}`
            }
          >
            <Breadcrumbs
              separator={<KeyboardDoubleArrowRightIcon fontSize="small" />}
              aria-label="breadcrumb"
            >
              <Button
                className={styles.BreadcrumbsText}
                onClick={() => {
                  history.push(`/${window.location.pathname.split('/')[1]}`);
                  onClickCheck();
                }}
              >
                Home
              </Button>
              <span className={styles.typoText}> View Content </span>
            </Breadcrumbs>
          </div>
          <div
            className={`${styles.viewAssetsListPreviewContainer} ${
              selectedAsset.file !== '' && selectedAsset.fileType !== ''
                ? ''
                : styles.noAssetPreviewContainer
            }`}
          >
            {/* <div className={styles.mobileViewBackContainer}>
              <Button
                style={{
                  padding: '5px',
                }}
                onClick={() => {
                  window.location.assign(
                    localStorage.getItem('campaignHubUrl')
                  );
                  if (
                    selectedAsset.file !== '' &&
                    selectedAsset.fileType !== ''
                  ) {
                    onClickCheck();
                  }
                }}
              >
                <KeyboardBackspaceIcon
                  style={{
                    color: 'rgb(0, 0, 0)',
                    border: '1px solid rgb(205 205 205)',
                    borderRadius: '50%',
                    marginLeft: '5px',
                    height: '25px',
                    width: '25px',
                  }}
                />
              </Button>
            </div> */}
            {assetCollections.length > 0 && (
              <div
                className={
                  resizerEnabled
                    ? styles.resizedviewAssetsListContainer
                    : showAssetList
                    ? styles.viewAssetsListContainer
                    : styles.viewAssetsListMenuContainer
                }
              >
                <div className={styles.viewAssetMenuContainer}>
                  <Button
                    style={
                      showAssetList && !isMobile
                        ? {
                            float: 'left',
                            margin: '1em 1em 1em -1.35em',
                          }
                        : isMobile
                        ? {
                            float: 'right',
                            margin: '1em 1em 1em -2px',
                          }
                        : {
                            float: 'left',
                            margin: '1em 1em 1em -1.35em',
                          }
                    }
                    onClick={() => {
                      setShowMobileAssetList('show');
                      if (showAssetList) {
                        setShowAssetList(false);
                        setAssetTitle(selectedAsset.nodeName);
                      } else {
                        setShowAssetList(true);
                        setAssetTitle('All Content');
                      }
                    }}
                  >
                    <img src={ViewAssetMenuIcon} alt="" />
                  </Button>

                  <div className={styles.viewAssetMenuName}>{assetTitle}</div>
                  {/* {assetTitle !== 'All Content' && (
                    <div className={styles.viewAssetControl}>
                      <Button style={{ marginRight: '15px' }}>
                        <img src={LeftArrow} />
                      </Button>
                      <Button>
                        <img src={RightArrow} />
                      </Button>
                    </div>
                  )} */}
                </div>

                {viewAssetCollection()}
              </div>
            )}
            {selectedAsset.file !== '' && selectedAsset.fileType !== '' ? (
              <div
                className={
                  !showAssetList && isMobile
                    ? styles.viewAssetsMobileContainer
                    : styles.viewAssetsContainer
                }
              >
                <div className={styles.viewAssetsFileText}>
                  <div className={styles.viewAssetsFileText}>
                    <img
                      style={{
                        height: '1.5em',
                        width: '1.5em',
                      }}
                      src={getDocIcon(selectedAsset.fileType)}
                    />
                    <span> {selectedAsset.name} </span>
                  </div>
                  <div>
                    <Button
                      style={{ marginRight: '-1.1em' }}
                      onClick={() => {
                        console.log(window.location.href);
                        navigator.clipboard.writeText(window.location.href);
                        setCopiedAlert(true);
                      }}
                    >
                      <img className={styles.shareIcon} src={LinkIcon} alt="" />
                      <span className={styles.shareText}>
                        {campaignHubLabels.shareLink}
                      </span>
                    </Button>
                  </div>
                </div>
                <div className={styles.viewAssetsPreviewContainer}>
                  {renderAssets(selectedAsset.fileType)}
                </div>
              </div>
            ) : (
              <div
                className={
                  showAssetList && isMobile
                    ? styles.viewAssetsContainer
                    : styles.noAssetMsg
                }
              >
                {campaignHubLabels.noAssetPreview}
              </div>
            )}
            <div className={styles.paddingContainer} />
          </div>
          <Footer partnerShipDetail={partnershipDetails} />
          {salesHubDetail?.cta && (
            <div className={styles.fabCTADiv}>
              <Fab
                className={styles.fabCTA}
                onClick={() => {
                  setCtaPreviewSelected(!ctaPreviewSelected);
                }}
              >
                <img
                  className={
                    ctaPreviewSelected ? styles.fabCloseImg : styles.fabCTAImg
                  }
                  src={ctaPreviewSelected ? FabCloseIcon : FabIcon}
                  alt=""
                />
              </Fab>
              <CtaPopup
                ctaData={salesHubDetail?.cta}
                show={ctaPreviewSelected}
                fontFamily={localStorage.getItem('fontFamily')}
                onPageView={onClickCheck}
              />
            </div>
          )}
          <SnackbarAlert
            showalert={allowCookie}
            message={`We use cookies to improve user experience and analyze site traffic. By clicking “Accept“ or continuing, you agree to the use of cookies as described in our `}
            btnName="Accept"
            privacyLink={
              partnershipDetails?.company_information.cookie_policy.includes(
                'https://'
              ) ||
              partnershipDetails?.company_information.cookie_policy.includes(
                'http://'
              )
                ? partnershipDetails?.company_information.cookie_policy
                : `https://${partnershipDetails?.company_information.cookie_policy}`
            }
            Btnhandler={() => {
              handleCookie();
            }}
          />
        </div>
      )}
      {loading && <Loader />}
      {copiedAlert && (
        <SnackbarAlert
          handler={() => {
            setCopiedAlert(false);
          }}
          showalert={copiedAlert}
          message="Link copied"
          color="#F5F5F5"
        />
      )}
    </div>
  );
};

export default ViewAssetsCampaignHub;
