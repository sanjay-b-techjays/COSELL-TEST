/* eslint-disable react/jsx-curly-newline */
/* eslint-disable indent */
/* eslint-disable linebreak-style */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable indent */
/* eslint-disable linebreak-style */
/* eslint-disable comma-dangle */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable operator-linebreak */
import React, { useEffect, useState } from 'react';
import PrimaryButton from 'src/app/components/Button/PrimaryButton';

import SideBarWithPreview from 'src/app/components/SideBar/SideBarWithPreview';
import { getRequest } from 'src/app/service';
import Checkbox from '@material-ui/core/Checkbox/Checkbox';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Loader from 'src/app/components/Loader';
import SnackbarAlert from 'src/app/components/Snackbar/Snackbar';
import DialogBox from 'src/app/components/DialogBox';
import styles from './AssetCollection.module.css';
import {
  SalesHubLabels,
  AssetCollectionLabels,
  DialogBoxLabels,
} from '../../../strings';
import CreateIcon from '../../assets/create_icon.svg';
import AssetCollectionForm from './AssetCollectionForm';
import AssetCollectionPreview from './AssetCollectionPreview';
import AssetCollectionCard from './Components/AssetCollectionCard';

import {
  // assetCollectionSlice,
  // setSlectedAssetCollectionIds,
  // selectAssetCollectionResponse,
  // setSlectedAssetCollectionInfo,
  deleteAssetAction,
  setSelectedAssetsIds,
  setSelectedAssets,
} from './AssetCollectionSlice';
import {
  Alert,
  // AssetCollectionAssetInfo,
  AssetCollectionInfo,
} from './types';

interface assetValues {
  name: string;
  tags: string[];
  docType: string;
  id: number;
  file: string;
  accessDocType: string;
}
interface AssetCollectionValues {
  name: string;
  description: string;
  thumbnailImage: string;
  tags: string[];
  thumbnailImageSrc?: File;
}
interface AssetCollectionObject {
  assetCollectionID: number;
  name: string;
  description: string;
  thumbnailImage: string;
  tags: string[];
}
interface alert {
  showAlert: boolean;
  severity: string;
  message: string;
}

const AssetCollection = () => {
  const dispatch = useDispatch();
  // const assetCollectionStoreData = useSelector(
  //   selectAssetCollectionResponse
  // );
  // const assetCollections = useSelector(
  //   selectAssetCollectionResponse
  // ).assetCollectionInfo;
  const [assetCollections, setAssetCollections] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showCloseWarning, setShowCloseWarning] = useState(false);
  const [formValues, setFormValues] = useState<AssetCollectionValues>();
  const [selected, setSelected] = useState([]);
  const [selectedAssetInfo, setSelectedAssetInfo] = useState({});
  const [partnershipID, setPartnershipID] = useState('');
  const [assetCollectionID, setAssetCollectionID] = useState<number | string>();
  const [selectedAssetIds, setSelectedAssetIds] = useState([]);
  const [assetCollectionOffset, setAssetCollectionOffset] = useState(0);
  const [assetCollectionlimit, setAssetCollectionlimit] = useState(9);
  const [assetCollectionCount, setAssetCollectionCount] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [alert, setAlert] = useState({
    showAlert: false,
    severity: '',
    message: '',
  });

  const [selectedAssetCollectId, setSelectedAssetCollectId] = useState([]);
  const [initialSelectedAssetCollectId, setInitialSelectedAssetCollectId] =
    useState([]);
  const [selectedAssetCollectativeObj, setSelectedAssetCollectativeObj] =
    useState([]);
  const [page, setPage] = useState(1);
  const queryparams = new URLSearchParams(window.location.search);
  const partnershipId: string = queryparams.get('partner_id') || '0';
  const isModalOpen: string =
    queryparams.get('assetCollectionModal') || 'false';
  const history = useHistory();
  const [isFormEdited, setIsFormEdited] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const fetchAssetCollectionData = (currOffset) => {
    setAssetCollections([]);
    setPartnershipID(partnershipId);
    const token = localStorage.getItem('token');
    setAssetCollectionOffset(currOffset);
    getRequest(
      `partnership/solution-narrative/?partnership_id=${partnershipId}&offset=${currOffset}&limit=${assetCollectionlimit}`,
      {
        Authorization: `Token ${token}`,
      }
    ).then((response: any) => {
      if (response.result === true) {
        // dispatch(
        //   setSlectedAssetCollectionInfo({
        //     assetCollectionInfo: response.data,
        //   })
        // );
        setAssetCollections(response.data);

        if (response.count) {
          setAssetCollectionCount(response.count);
        }
      }
    });
  };
  const handlePageChange = (e, data) => {
    setPage(data);
    setAssetCollectionOffset((data - 1) * assetCollectionlimit);
    fetchAssetCollectionData((data - 1) * assetCollectionlimit);
  };
  useEffect(() => {
    fetchAssetCollectionData(0);
    if (isModalOpen === 'true') {
      setShowForm(true);
    }
  }, []);

  // useEffect(() => {
  //   fetchAssetCollectionData();
  // }, [assetCollectionOffset]);

  // const handleGetAssetCollectionData = (e: any, data: any) => {
  //   setAssetCollectionOffset((data - 1) * assetCollectionlimit);
  // };
  const setAssetData = (tableData: any) => {
    setSelectedAssetInfo(tableData);
  };

  const setFromValues = (values: AssetCollectionValues) => {
    setFormValues(values);
  };

  const handleAssetCollectionCardClick = (
    assetCollection: AssetCollectionInfo
  ) => {
    setAssetCollectionID(assetCollection.solution_narrative_id.toString());
    setShowForm(true);
  };

  const deleteAssetCollection = () => {
    setLoading(true);
    dispatch(
      deleteAssetAction(
        partnershipID,
        selected,
        () => setLoading(false),
        (value: string) =>
          setAlert((prevState: Alert) => ({
            ...prevState,
            showAlert: true,
            message: DialogBoxLabels.deleteAssetCollectMsg,
            severity: value,
          })),
        () => fetchAssetCollectionData(0),
        () => setShowDialog(false)
      )
    );
    setAssetCollectionOffset(0);
    setSelected([]);
  };

  const handleCreateAndDeleteButtonClick = () => {
    if (selected.length > 0) {
      setShowDialog(true);
    } else {
      setShowForm(true);
      setAssetCollectionID(null);
      setSelected([]);
      setAssetData({});
      setFormValues({
        description: '',
        name: '',
        tags: [''],
        thumbnailImage: '',
      });
      setSelectedAssetCollectativeObj([]);
      setSelectedAssetCollectId([]);
    }
  };
  const handleDeleteSalesMotionDialogClose = () => {
    setSelected([]);
    setShowDialog(false);
  };

  const handleAssetCollectionCheckboxClick = (event: any, id: number) => {
    // event.stopPropagation();
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
  return (
    <div className={styles.assetCollectionMainContainer}>
      <div className={styles.assetCollectionContainer}>
        <div className={styles.assetCollectionTitleContainer}>
          <div className={styles.assetCollectionTitle}>
            {AssetCollectionLabels.title}
          </div>
          <div>
            <PrimaryButton
              style={{ minWidth: '200px' }}
              onClick={() => {
                handleCreateAndDeleteButtonClick();
              }}
            >
              {selected.length > 0 ? (
                ''
              ) : (
                <img
                  className={styles.createIconButtonImage}
                  src={CreateIcon}
                  alt=""
                />
              )}
              {selected.length > 0
                ? AssetCollectionLabels.deleteTitle
                : AssetCollectionLabels.createButton}
            </PrimaryButton>
          </div>
        </div>
        <div>
          <div className={styles.assetCollectionCard}>
            {assetCollections.length > 0 &&
              assetCollections.map((assetCollection: AssetCollectionInfo) => (
                <div className={styles.assetCollectionEachCard}>
                  <Checkbox
                    onChange={(e) => {
                      handleAssetCollectionCheckboxClick(
                        e.target.checked,
                        assetCollection.solution_narrative_id
                      );
                    }}
                    checked={selected.includes(
                      assetCollection.solution_narrative_id
                    )}
                    className={
                      selected.includes(assetCollection.solution_narrative_id)
                        ? styles.assetCollectionEachCardCheckboxClicked
                        : styles.assetCollectionEachCardCheckbox
                    }
                  />
                  <div
                    onClickCapture={() => {
                      handleAssetCollectionCardClick(assetCollection);
                    }}
                  >
                    <AssetCollectionCard
                      img={`${
                        assetCollection.image
                      }?time=${new Date().getTime()}`}
                      title={assetCollection.name}
                      content={assetCollection.description}
                    />
                  </div>
                </div>
              ))}
          </div>
          {assetCollections.length > 0 && (
            <div className={styles.assetCollectionPaginationContainer}>
              {assetCollectionCount > assetCollectionlimit && (
                <div className={styles.assetCollectionPaginationContainer}>
                  <Stack spacing={2}>
                    <Pagination
                      count={Math.ceil(
                        assetCollectionCount / assetCollectionlimit
                      )}
                      shape="rounded"
                      page={page}
                      onChange={handlePageChange}
                    />
                  </Stack>
                </div>
              )}
            </div>
          )}
        </div>
        {showForm && (
          <SideBarWithPreview
            title={
              assetCollectionID
                ? AssetCollectionLabels.updateTitle
                : AssetCollectionLabels.formTitle
            }
            previewTitle={AssetCollectionLabels.previewTitle}
            closeHandler={() => {
              if (isDirty || isFormEdited) setShowCloseWarning(true);
              else {
                setShowForm(false);
                setShowCloseWarning(false);
                setIsFormEdited(false);
                setIsDirty(false);
                setSelectedAssetCollectId([]);
                setInitialSelectedAssetCollectId([]);
                setSelectedAssetCollectativeObj([]);
                dispatch(
                  setSelectedAssets({
                    selectedAssets: [],
                  })
                );

                dispatch(
                  setSelectedAssetsIds({
                    selectedAssetsIds: [],
                  })
                );
                history.push(`/assetCollection?partner_id=${partnershipId}`);
              }
            }}
            renderLeftElement={
              <AssetCollectionPreview
                reArrangedAssetIds={(assetIds) => {
                  setSelectedAssetIds(assetIds);
                }}
                assetCollectionId={assetCollectionID}
                assetInfo={selectedAssetInfo}
                // selected={selected}
                formValues={formValues}
                selectedAssetCollectativeObj={selectedAssetCollectativeObj}
              />
            }
            renderRightElement={
              <AssetCollectionForm
                selectedAssetIdsFromPreview={selectedAssetIds}
                assetCollectionId={assetCollectionID}
                sendAssetData={setAssetData}
                // assetData={assetData}
                // handleGetAssetData={handleGetAssetData}
                // showAlert={() => setShowAlert(true)}
                showAlert={(values: any) =>
                  setAlert((prevState: alert) => ({
                    ...prevState,
                    showAlert: true,
                    message:
                      assetCollectionID === undefined ||
                      assetCollectionID === null ||
                      assetCollectionID === ''
                        ? 'Asset Collection created successfully'
                        : 'Asset Collection updated successfully',
                    severity: 'success',
                  }))
                }
                sendFormValues={setFromValues}
                fetchAssetCollectionData={fetchAssetCollectionData}
                cancelHandler={() => {
                  setShowForm(false);
                  setShowCloseWarning(false);
                  setIsFormEdited(false);
                  setIsDirty(false);
                  setSelectedAssetCollectId([]);
                  dispatch(
                    setSelectedAssets({
                      selectedAssets: [],
                    })
                  );
                  dispatch(
                    setSelectedAssetsIds({
                      selectedAssetsIds: [],
                    })
                  );
                  setSelectedAssetCollectativeObj([]);
                  setInitialSelectedAssetCollectId([]);
                  history.push(`/assetCollection?partner_id=${partnershipId}`);
                }}
                selectedAssetCollectId={selectedAssetCollectId}
                setSelectedAssetCollectId={setSelectedAssetCollectId}
                initialSelectedAssetCollectId={initialSelectedAssetCollectId}
                setInitialSelectedAssetCollectId={
                  setInitialSelectedAssetCollectId
                }
                // selectedAssetCollectativeObj={selectedAssetCollectativeObj}
                // setSelectedAssetCollectativeObj={
                //   setSelectedAssetCollectativeObj
                // }
                refreshAssetCollectionInformation={() => {
                  fetchAssetCollectionData(0);
                  setPage(1);
                }}
                showCloseWarning={showCloseWarning}
                setShowCloseWarning={setShowCloseWarning}
                isFormEdited={isFormEdited}
                setIsFormEdited={setIsFormEdited}
                setIsDirty={setIsDirty}
              />
            }
          />
        )}
        {console.log(assetCollectionID, 'assetColl')}
        <DialogBox
          title=""
          primaryContent={
            DialogBoxLabels.deleteDialogAssetCollectPrimaryContent
          }
          secondaryContent={
            DialogBoxLabels.deleteDialogAssetCollectSecondaryContent
          }
          secondaryButton={DialogBoxLabels.deleteDialogSecondaryButton}
          primaryButton={DialogBoxLabels.deleteDialogPrimaryButton}
          show={showDialog}
          handleDialogBoxClose={() => handleDeleteSalesMotionDialogClose()}
          handleAgree={() => deleteAssetCollection()}
        />
        {/* {assetCollectionCount >= assetCollectionlimit && ( */}
      </div>

      {/* )} */}
      {loading === true && <Loader />}
      {alert.showAlert && (
        <SnackbarAlert
          severity={alert.severity}
          handler={() => {
            setAlert((prevState: alert) => ({
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

export default AssetCollection;
