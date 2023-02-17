/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable linebreak-style */
/* eslint-disable comma-dangle */
/* eslint-disable operator-linebreak */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
import React, { useEffect, useState } from 'react';
import FileViewer from 'react-file-viewer';
import { getRequest } from 'src/app/service';
import Loader from 'src/app/components/Loader';
import { useHistory } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TreeView from '@mui/lab/TreeView';
import SnackbarAlert from 'src/app/components/Snackbar/Snackbar';
import TreeItem, { treeItemClasses } from '@mui/lab/TreeItem';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import folderCollapeIcon from '../../assets/viewAssetsFolderIcons/folderCollapseIcon.svg';
import folderExpandIcon from '../../assets/viewAssetsFolderIcons/folderExpandIcon.svg';
import styles from './ViewAssets.module.css';
import wordIcon from '../../assets/word_mini_icon.svg';
import pdfIcon from '../../assets/pdf_mini_icon.svg';
import pptIcon from '../../assets/ppt_mini_icon.svg';
import excelIcon from '../../assets/excel_mini_icon.svg';
import videoIcon from '../../assets/video_mini_icon.svg';
import imageIcon from '../../assets/img_mini_icon.svg';
import othersIcon from '../../assets/others_mini_icon.svg';
import ViewAssetMenuIcon from '../CampaignHub/ViewAssetMenuIcon.svg';
import LinkIcon from '../../assets/CampaignHubIcons/LinkIcon.svg';
import './ViewAssets.css';
import SalesHubSiteProfile from '../SalesHubSite/Components/SalesHubSiteProfile';

import { campaignHubLabels } from 'src/strings';
import { Button, Fab } from '@material-ui/core';
import { SpecialZoomLevel, Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import SignIn from '../SignIn';

const ViewAssets = () => {
  const history = useHistory();
  const [selectedAsset, setSelectedAsset] = useState({
    file: '',
    fileType: '',
    id: '',
    name: '',
    nodeId: 0,
    originalName: '',
  });
  const [copiedAlert, setCopiedAlert] = useState(false);
  const [expanded, setExpanded] = useState(['']);
  const [solutionNarrativeList, setSolutionNarrativeList] = useState([]);
  const [assetCollectionName, setAssetCollectionName] = useState('');
  const [loading, setLoading] = useState(true);
  const [assetLoaded, setAssetLoaded] = useState(false);
  const [logo, setLogo] = useState({
    companyLogo: '',
    partnerCompanyLogo: '',
  });
  const [partnershipId, setPartnershipId] = useState('');
  const [assetData, setAssetData] = useState([]);
  const [resizerEnabled, setResizerEnabled] = useState(false);
  const [showAssetList, setShowAssetList] = useState(true);

  const queryparams = new URLSearchParams(window.location.search);
  const partnerShipId: string = queryparams.get('partner_id') || '0';
  const assetCollectionId: string = queryparams.get('assetCollection') || '0';
  const assetId: string = queryparams.get('asset') || '0';

  const getPartnershipById = (partnershipID: string) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    getRequest(`partnership/?partnership_id=${partnershipID}`, {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    }).then((resp: any) => {
      if (resp.result === true) {
        setLogo({
          companyLogo: resp.data.company_information.logo,
          partnerCompanyLogo: resp.data.partner_company_information.logo,
        });
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  };

  const getAssetCollectionAssetInfo = (
    partnershipID,
    assetCollectionId,
    assetId,
    reload
  ) => {
    if (reload) {
      setLoading(true);
    }
    const token = localStorage.getItem('token');
    getRequest(
      `partnership/solution-narrative/get-assets/?partnership_id=${partnershipID}&solution_narrative_id=${assetCollectionId}&is_selected=true`,
      {
        Accept: 'application/json',
        Authorization: `Token ${token}`,
      }
    )
      .then((response: any) => {
        if (response.result === true) {
          setAssetData(response.data);
          const deafultFile = response.data[0].file;
          const assetName = response.data[0].asset_name;
          const deafultFileId = response.data[0].asset_id;
          history.push({
            pathname: window.location.pathname,
            search: `?assetCollection=${assetCollectionId}&asset=${deafultFileId}`,
          });
          let extension = response.data[0].file.split('.').pop();
          if (extension === 'PNG') {
            extension = 'png';
          }
          setSelectedAsset({
            file: deafultFile,
            fileType: extension,
            id: deafultFileId,
            name: assetName,
            nodeId: parseInt(assetCollectionId),
            originalName: '',
          });
          setLoading(false);
        } else {
          setLoading(false);
        }
        setLoading(false);
      })
      .finally(() => {
        setAssetLoaded(true);
      });
  };

  const getSalesHubSite = () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const subDomain = localStorage.getItem('subDomainName');
    const headerData = {
      Authorization: `Token ${token}`,
    };
    getRequest(`partnership/sales-hub/site/?subdomain=${subDomain}`, headerData)
      .then((resp: any) => {
        if (resp.result === true) {
          const resData = resp.data;
          setLogo({
            companyLogo: resData.company_information.logo,
            partnerCompanyLogo: resData.partner_company_information.logo,
          });
        }
        setLoading(false);
      })
      .finally(() => setLoading(false));
  };

  const getAssetCollectionBySalesHubSite = () => {
    const token = localStorage.getItem('token');
    const subDomain = localStorage.getItem('subDomainName');
    const headerData = {
      Authorization: `Token ${token}`,
    };
    getRequest(
      `partnership/sales-hub/get-solution-narratives-assets/?sales_hub_domain=${subDomain}`,
      headerData
    ).then((resp: any) => {
      if (resp.result === true) {
        const assetIds = resp.data.map((assetCollection) =>
          assetCollection.solution_narrative_id.toString()
        );
        setSolutionNarrativeList(resp.data);
        if (assetId !== '0') {
          localStorage.getItem('token') ? (
            resp.data.filter((assetCollection) =>
              assetCollection.solution_narrative_id.toString() ===
              assetCollectionId
                ? assetCollection.assets.filter((asset) =>
                    asset.asset_id.toString() === assetId
                      ? setSelectedAsset({
                          file: asset.file,
                          fileType: asset.file.split('.').pop(),
                          id: asset.asset_id,
                          name: asset.asset_name,
                          nodeId: parseInt(
                            assetCollection.solution_narrative_id
                          ),
                          originalName: asset.asset_file,
                        })
                      : null
                  )
                : null
            )
          ) : (
            <SignIn />
          );
          setAssetLoaded(true);
        } else {
          getAssetCollectionAssetInfo(
            partnerShipId,
            assetCollectionId,
            assetId,
            ''
          );
        }
        setExpanded(assetIds);
        console.log(resp.data, 'getAssetCollectionBySalesHubSite');
      }
    });
  };

  useEffect(() => {
    const queryparams = new URLSearchParams(window.location.search);
    const partnerShipId: string = queryparams.get('partner_id') || '0';
    const assetCollectionId: string = queryparams.get('assetCollection') || '0';
    const assetId: string = queryparams.get('asset') || '0';
    setPartnershipId(partnerShipId);
    console.log(assetCollectionId, assetId, 'File selection');
    getAssetCollectionBySalesHubSite();
    getAssetCollectionAssetInfo(partnerShipId, assetCollectionId, assetId, '');
    getPartnershipById(partnerShipId);
    getSalesHubSite();
  }, []);

  const handleAssetClick = (asset: any, solutionNarrative: any) => {
    history.push({
      pathname: window.location.pathname,
      search: `?assetCollection=${solutionNarrative.solution_narrative_id}&asset=${asset.asset_id}`,
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
      nodeId: solutionNarrative.solution_narrative_id,
      originalName: asset.asset_file,
    });
  };

  const isIframeSupportedFileTypes = (fileType: string) => {
    if (
      fileType === 'pptx' ||
      fileType === 'ppt' ||
      fileType === 'doc' ||
      fileType === 'docx' ||
      fileType === 'xls' ||
      fileType === 'txt' ||
      fileType === 'json' ||
      fileType === 'svg' ||
      fileType === 'mov'
    ) {
      return true;
    }
    return false;
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

  const handleChange = (event, nodes) => {
    setExpanded(nodes);
  };

  const getFolderIcon = (nodeId: string) => {
    // console.log(nodeId, 'nodeId');
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
      color: theme.palette.text.secondary,
      borderTopRightRadius: theme.spacing(0),
      borderBottomRightRadius: theme.spacing(0),
      // paddingLeft: theme.spacing(0),
      borderRadius: '10px !important',
      marginLeft: '-.6em !important',
      fontWeight: theme.typography.fontWeightMedium,
      '&.Mui-expanded': {
        fontWeight: theme.typography.fontWeightRegular,
      },
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
      '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
        backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
        color: 'var(--tree-view-color)',
      },
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
            <img style={{ marginRight: '0.6rem' }} src={labelIcon} alt="" />
            <Typography
              variant="body2"
              sx={{ fontWeight: 'inherit', flexGrow: 1 }}
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

  const viewSolutionNarrative = () => (
    <div>
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
          {solutionNarrativeList.length > 0 &&
            solutionNarrativeList.map((solutionNarrative) => (
              <StyledTreeItem
                key={solutionNarrative.solution_narrative_id.toString()}
                bgColor="white"
                nodeId={solutionNarrative.solution_narrative_id.toString()}
                labelText={
                  resizerEnabled
                    ? ''
                    : solutionNarrative.assets.length > 0
                    ? solutionNarrative.name
                    : `${solutionNarrative.name} (no assets)`
                }
                labelIcon={getFolderIcon(
                  solutionNarrative.solution_narrative_id.toString()
                )}
              >
                {solutionNarrative.assets &&
                  solutionNarrative.assets.length > 0 &&
                  solutionNarrative.assets.map((asset) => (
                    <StyledTreeItem
                      isSelected={
                        selectedAsset.id === asset.asset_id &&
                        selectedAsset.nodeId ===
                          solutionNarrative.solution_narrative_id
                      }
                      onClick={() => {
                        handleAssetClick(asset, solutionNarrative);
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
          {solutionNarrativeList.length > 0 &&
            solutionNarrativeList.map((assetCollection) => (
              <StyledTreeItem
                key={assetCollection.solution_narrative_id.toString()}
                bgColor="white"
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
  const renderAssets = (fileType: string) => {
    if (
      fileType === 'svg' ||
      fileType === 'png' ||
      fileType === 'jpg' ||
      fileType === 'jpeg'
    ) {
      return (
        <img src={selectedAsset.file} width="100%" height="500px" alt="" />
      );
    }
    if (fileType === 'mp4' || fileType === 'mkv' || fileType === 'mov') {
      return (
        <video src={selectedAsset.file} width="100%" height="500px" controls>
          <track kind="captions" />
        </video>
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
          src={`https://docs.google.com/gview?url=${
            selectedAsset.file
          }&embedded=true&t=${new Date().getTime()}`}
          width="100%"
          height="500px"
          frameBorder="0"
          title="frame"
        />
      );
    }
    if (fileType === 'pdf') {
      return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.12.313/build/pdf.worker.min.js">
          <Viewer
            fileUrl={selectedAsset.file}
            plugins={[defaultLayoutPluginInstance]}
          />
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

    return (
      <FileViewer
        key={`${selectedAsset.file.toString()}asset`}
        fileType={selectedAsset.fileType}
        filePath={selectedAsset.file}
      />
    );
  };
  // console.log(selectedAsset.nodeId, selectedAsset.id, 'selected Asset Id');
  return (
    <div>
      {!loading && (
        <div className={styles.viewAssetsMainContainer}>
          <div className={styles.viewAssetsHeaderContainer}>
            <div className={styles.leftHeadWrap}>
              <Button
                onClick={() => {
                  const shPartnershipId = localStorage.getItem('partnershipId');
                  history.push(`/home?partner_id=${shPartnershipId}`);
                }}
              >
                <KeyboardBackspaceIcon
                  style={{
                    color: 'rgb(0, 0, 0)',
                    border: '1px solid rgb(205 205 205)',
                    borderRadius: '50%',
                    marginLeft: '5px',
                    height: '30px',
                    width: '30px',
                  }}
                />
              </Button>
              <div className={styles.logoImg}>
                {logo.companyLogo !== null && (
                  <img
                    className={styles.companyLogo}
                    src={logo.companyLogo}
                    alt=""
                  />
                )}
              </div>
              <div className={styles.logoImg}>
                {logo.partnerCompanyLogo !== null && (
                  <img
                    className={styles.companyLogo}
                    src={logo.partnerCompanyLogo}
                    alt=""
                  />
                )}
              </div>
            </div>
            <div className={styles.headerDiv}>
              <SalesHubSiteProfile />
            </div>
          </div>
          <div className={styles.viewAssetsListPreviewContainer}>
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
                  style={{ float: 'left', margin: '1em 1em 1em -1.5em' }}
                  // className={styles.viewAssetMenuIcon}
                  // style={
                  //   showAssetList
                  // ? {
                  //     float: 'left',
                  //   }
                  // : {
                  //     float: 'left',
                  //   }
                  // }
                  onClick={() => {
                    if (showAssetList) {
                      setShowAssetList(false);
                    } else {
                      setShowAssetList(true);
                    }
                  }}
                >
                  <img src={ViewAssetMenuIcon} alt="" />
                </Button>
              </div>
              {viewSolutionNarrative()}
            </div>

            {/* {assetData.length === 0 && (
                <div className={styles.solutionNarrativeNoAsset}>
                  No asset available
                </div>
              )} */}

            {/* {assetData.length !== 0 && (
              <div
                className={
                  resizerEnabled
                    ? styles.resizerEnabledWrap
                    : styles.resizerWrap
                }
              >
                <div
                  onClickCapture={() => setResizerEnabled(!resizerEnabled)}
                  className={styles.resizeBtn}
                >
                  <img
                    src={leftArrow}
                    className={resizerEnabled ? styles.pointRight : ''}
                    alt="arrow"
                  />
                </div>
              </div>
            )} */}
            {/* <div className={resizerEnabled ? '' : styles.paddingContainer} /> */}
            {selectedAsset.file !== '' && selectedAsset.fileType !== '' ? (
              <div className={styles.viewAssetsContainer}>
                <div className={styles.viewAssetsFileText}>
                  <div className={styles.viewAssetsFileText}>
                    <img
                      style={{
                        height: '1.5em',
                        width: '1.5em',
                      }}
                      src={getDocIcon(selectedAsset.fileType)}
                    />
                    <span style={{ padding: '0.2em' }}>
                      {' '}
                      {selectedAsset.name}{' '}
                    </span>
                  </div>
                  <div>
                    <Button
                      style={{ marginRight: '-0.8em' }}
                      onClick={() => {
                        console.log(window.location.href);
                        navigator.clipboard.writeText(window.location.href);
                        setCopiedAlert(true);
                      }}
                    >
                      <img src={LinkIcon} alt="" />
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
              <div className={styles.noAssetMsg}>
                {assetLoaded && campaignHubLabels.noAssetPreview}
              </div>
            )}
            <div className={styles.paddingContainer} />
            <div className={styles.paddingContainer} />
          </div>
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

export default ViewAssets;
