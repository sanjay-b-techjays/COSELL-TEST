/* eslint-disable linebreak-style */
/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable operator-linebreak */
/* eslint-disable no-confusing-arrow */
/* eslint-disable linebreak-style */
/* eslint-disable comma-dangle */
/* eslint-disable linebreak-style */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable linebreak-style */
/* eslint-disable import/extensions */
// import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import React, { useEffect, useState } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import SideBar from 'src/app/components/SideBar';
import PrimaryButton from 'src/app/components/Button/PrimaryButton';
import SecondaryButton from 'src/app/components/Button/SecondaryButton';
import { getRequest } from 'src/app/service';
import { MenuItem } from '@material-ui/core';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import SnackbarAlert from 'src/app/components/Snackbar/Snackbar';
import Loader from 'src/app/components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import plusIcon from '../../assets/white_plus_icon.svg';
import { uploadAssetsLabels } from '../../../strings';
import {
  selectuploadAssetResponse,
  deleteAssetAction,
  searchAssetAction,
} from './UploadAssetSlice';

import UploadAssetForm from './components/AssetForm/AssetForm';
import styles from './UploadAssets.module.css';
import AssetTable from './components/AssetTable';
import DialogBoxComponent from 'src/app/components/DialogBox/DialogBox';

const UploadAssets = () => {
  const accessTypeList = [
    { key: 'Internal', id: 1, value: 'Internal' },
    { key: 'External', id: 2, value: 'External' },
  ];

  const statusList = [
    { key: 'active', id: 1, value: 'Active' },
    { key: 'inActive', id: 2, value: 'Inactive' },
  ];

  interface assetValues {
    name: string;
    tags: string[];
    docType: string;
    id: number;
    file: string;
    accessDocType: string;
    status: number;
  }
  interface listObjectType {
    key: string;
    value: string;
    id: number;
  }
  const [accessTypeMenu, setaccessTypeMenu] = useState(false);
  const [accessDocTypeMenu, setaccessDocTypeMenu] = useState(false);
  const [assetName, setAssetName] = useState('');
  const [accessType, setAccessType] = useState('');
  const [accessDocType, setAccessDocType] = useState('');
  const [updateId, setUpdateId] = useState('');
  const [tableData, setTableData] = useState([]);
  const [selected, setSelected] = useState(['']);
  const [deleteModal, showDeleteModal] = useState(false);
  const [uploadModalShow, setUploadModalShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [accessDocTypeList, setDocTypeList] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [alert, setAlert] = useState({
    showAlert: false,
    severity: '',
    message: '',
  });
  const [showCloseWarning, setShowCloseWarning] = useState(false);
  const [formEdited, setFormEdited] = useState(false);
  const [isDirty, setisDirty] = useState(false);
  const queryparams = new URLSearchParams(window.location.search);
  const partnershipId: string = queryparams.get('partner_id') || '0';
  const uploadAssetRespData = useSelector(selectuploadAssetResponse);
  const dispatch = useDispatch();

  const fetchAssetData = () => {
    const token = localStorage.getItem('token');
    const accessTypeId =
      accessType !== '' && accessType !== 'All'
        ? accessTypeList.filter((li) => li.value === accessType)[0].id
        : '';
    const accessDocTypeId =
      accessDocType !== '' && accessDocType !== 'All'
        ? accessDocTypeList.length > 0 &&
          accessDocTypeList.filter((li) => li.value === accessDocType)[0].id
        : '';
    const nameSearch = assetName !== '' ? `&name=${assetName}` : '';
    const accessTypeSearch =
      accessType !== '' && accessTypeId !== ''
        ? `&access_type_id=${accessTypeId}`
        : '';
    const accessDocTypeSearch =
      accessDocType !== '' && accessDocTypeId !== ''
        ? `&file_type_id=${accessDocTypeId}`
        : '';
    if (offset === 0) {
      setPage(1);
    }
    getRequest(
      `partnership/asset/?partnership_id=${partnershipId}${nameSearch}${accessTypeSearch}${accessDocTypeSearch}&offset=${offset}&limit=${limit}&is_inactive=true`,
      {
        Authorization: `Token ${token}`,
      }
    ).then((response: any) => {
      if (response.result === true) {
        const updatedData =
          response.data.length > 0 &&
          response.data.map((data: any) => {
            const assetObj = {} as assetValues;
            assetObj.name = data.asset_name;
            assetObj.tags = data.tags;
            assetObj.docType = data.file_type;
            assetObj.id = data.asset_id;
            assetObj.file = data.file;
            assetObj.accessDocType = data.access_type;
            assetObj.status = data.status_id;
            return assetObj;
          });
        setTableData(updatedData);
        if (response.count) {
          setCount(response.count);
        }
      }
    });
  };

  const fetchFileTypeList = () => {
    const token = localStorage.getItem('token');

    getRequest(`partnership/asset/get-file-type-list/`, {
      Authorization: `Token ${token}`,
    }).then((response: any) => {
      if (response.result === true) {
        const typeList = response.data.map((li: any) => ({
          key: li.name,
          id: li.file_type_id,
          value: li.name,
        }));
        setDocTypeList(typeList);
      }
    });
  };
  const refAccessDocTypeMenu: any = React.useRef();
  const refAccessTypeMenu: any = React.useRef();

  const HanldeCloseDropdown = (event) => {
    if (
      refAccessDocTypeMenu.current &&
      !refAccessDocTypeMenu.current.contains(event.target)
    ) {
      setaccessDocTypeMenu(false);
    }
    if (
      refAccessTypeMenu.current &&
      !refAccessTypeMenu.current.contains(event.target)
    ) {
      setaccessTypeMenu(false);
    }
  };

  useEffect(() => {
    const modalShow: boolean = !!queryparams.get('assetModal') || false;
    fetchAssetData();
    fetchFileTypeList();
    setUploadModalShow(modalShow);
    document.addEventListener('mousedown', HanldeCloseDropdown);

    return () => document.removeEventListener('mousedown', HanldeCloseDropdown);
  }, []);

  // useEffect(() => {
  //   if (uploadAssetRespData.errorMsg !== '') {
  //     setShowAlert(true);
  //   }
  // }, [uploadAssetRespData]);

  const handleDeleteAsset = (assets: string[]) => {
    const assetId = assets.filter((s: string) => s !== '');
    dispatch(
      deleteAssetAction(
        partnershipId,
        assetId,
        selected,
        setSelected,
        () => showDeleteModal(false),
        () => setLoading(false),
        (value: string, msg: string) =>
          setAlert((prevState: any) => ({
            ...prevState,
            showAlert: true,
            message: uploadAssetRespData.errorMsg,
            severity: value,
          })),
        fetchAssetData
      )
    );
  };
  const handleGetAssetData = (e: any, data: any) => {
    setOffset((data - 1) * limit);
    setPage(data);
  };

  const handleUpdateAsset = (id: number) => {
    setUpdateId(id.toString());
    setUploadModalShow(true);
    fetchAssetData();
  };

  // const handleSearch = () => {
  //   setSelected([]);
  //   const accessTypeId =
  //     accessType !== '' && accessType !== 'All'
  //       ? accessTypeList.filter((li) => li.value === accessType)[0].id
  //       : '';
  //   const accessDocTypeId =
  //     accessDocType !== '' && accessDocType !== 'All'
  //       ? accessDocTypeList.length > 0 &&
  //         accessDocTypeList.filter((li) => li.value === accessDocType)[0].id
  //       : '';
  //   const nameSearch = assetName !== '' ? `&name=${assetName}` : '';
  //   const accessTypeSearch =
  //     accessType !== '' && accessTypeId !== ''
  //       ? `&access_type_id=${accessTypeId}`
  //       : '';
  //   const accessDocTypeSearch =
  //     accessDocType !== '' && accessDocTypeId !== ''
  //       ? `&file_type_id=${accessDocTypeId}`
  //       : '';

  //   dispatch(
  //     searchAssetAction(
  //       partnershipId,
  //       limit,
  //       offset,
  //       nameSearch,
  //       accessTypeSearch,
  //       accessDocTypeSearch,
  //       setTableData,
  //       () => setLoading(false),
  //       (value: string, msg: string) =>
  //         setAlert((prevState: any) => ({
  //           ...prevState,
  //           showAlert: true,
  //           message: msg,
  //           severity: value,
  //         })),
  //       setCount
  //     )
  //   );
  // };

  useEffect(() => {
    // if (
    //   (accessType === '' || accessType === 'All') &&
    //   (accessDocType === '' || accessDocType === 'All') &&
    //   assetName === ''
    // ) {
    fetchAssetData();
    // }
    //  else {
    //   handleSearch();
    // }
  }, [offset]);

  const handleFilter = (name: string, value: string) => {
    if (name === 'accDocType') {
      setAccessDocType(value);
    } else if (name === 'accType') {
      setAccessType(value);
    }
  };

  const handleSelectAllClick = (event: any) => {
    if (event.target.checked) {
      const selectedData = tableData.map((data: assetValues) =>
        data.id.toString()
      );
      setSelected(Array.from(new Set([...selected, ...selectedData])));
      return;
    }

    const selectedData = tableData.map((data: assetValues) =>
      data.id.toString()
    );
    const value = selected.filter((s: any) => !selectedData.includes(s));
    setSelected(value);
  };
  const handleCheckboxClick = (event: any, id: string) => {
    event.stopPropagation();
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

  const cancelHandler = () => {
    setUploadModalShow(false);
    setUpdateId('');
    fetchAssetData();
    setShowCloseWarning(false);
    setFormEdited(false);
    setisDirty(false);
  };
  return (
    <div className={styles.flexBackground}>
      <div className={styles.assetHeadWrap}>
        <div className={styles.assetHead}>
          <div className={styles.assetTitle}>
            {uploadAssetsLabels.manageAssets}
          </div>
          <div className={styles.btnTopWrap}>
            {selected.filter((s) => s !== '').length > 0 ? (
              <Button
                className={styles.assetBtn}
                onClick={() => showDeleteModal(true)}
              >
                {uploadAssetsLabels.deleteAsset}
              </Button>
            ) : (
              <Button
                className={styles.assetBtn}
                onClick={() => setUploadModalShow(true)}
              >
                <div className={styles.plusWrap}>
                  {' '}
                  <img src={plusIcon} alt="add" />{' '}
                </div>
                {uploadAssetsLabels.addAsset}
              </Button>
            )}
          </div>
        </div>
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
                    setAssetName(event.target.value);
                  }
                }}
                placeholder="Search Assets"
                className={`${styles.searchbar} search`}
              />
            </form>
            <SearchIcon className={styles.searchIcon} />
          </div>
          <div className={styles.centerDropDown}>
            <div className={styles.dropdown} ref={refAccessTypeMenu}>
              <button
                type="button"
                className={styles.dropdownBtn}
                onClick={() => setaccessTypeMenu(!accessTypeMenu)}
              >
                {' '}
                {accessType === '' ? (
                  <span style={{ fontSize: '12px', letterSpacing: 'normal' }}>
                    {uploadAssetsLabels.filterByAccessType}
                  </span>
                ) : (
                  accessType
                )}
                <KeyboardArrowDownIcon
                  className={`${styles.arrowIcon}  ${
                    accessTypeMenu ? styles.arrowIconActive : ''
                  }`}
                />
              </button>
              <div
                className={`${styles.menuWrap} ${
                  accessTypeMenu
                    ? styles.dropdownMenuActive
                    : styles.dropdownMenu
                }`}
              >
                {accessTypeMenu && (
                  <>
                    <MenuItem
                      value=""
                      onClick={() => {
                        handleFilter('accType', 'All');
                        setaccessTypeMenu(false);
                      }}
                    >
                      All
                    </MenuItem>

                    {accessTypeList.map((list: listObjectType) => (
                      <MenuItem
                        value={list.value}
                        key={list.id}
                        onClick={() => {
                          handleFilter('accType', list.value);
                          setaccessTypeMenu(false);
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
            <div className={styles.dropdown} ref={refAccessDocTypeMenu}>
              <button
                type="button"
                className={styles.dropdownBtn}
                onClick={() => setaccessDocTypeMenu(!accessDocTypeMenu)}
              >
                {' '}
                {accessDocType === '' ? (
                  <span style={{ fontSize: '12px', letterSpacing: 'normal' }}>
                    {uploadAssetsLabels.filterByDocType}
                  </span>
                ) : (
                  accessDocType
                )}
                <KeyboardArrowDownIcon
                  className={`${styles.arrowIcon}  ${
                    accessTypeMenu ? styles.arrowIconActive : ''
                  }`}
                />
              </button>
              <div
                className={`${styles.menuWrap} ${
                  accessDocTypeMenu
                    ? styles.dropdownMenuActive
                    : styles.dropdownMenu
                }`}
              >
                {accessDocTypeMenu && (
                  <>
                    <MenuItem
                      value=""
                      onClick={() => {
                        handleFilter('accDocType', 'All');
                        setaccessDocTypeMenu(false);
                      }}
                    >
                      All
                    </MenuItem>
                    {accessDocTypeList.map((list: any) => (
                      <MenuItem
                        value={list.value}
                        key={list.id}
                        onClick={() => {
                          handleFilter('accDocType', list.value);
                          setaccessDocTypeMenu(false);
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

          <div className={styles.searchBtn}>
            <Button
              className={styles.assetBtn}
              onClick={() => {
                setOffset(0);
                setPage(1);
                // handleSearch();
                setSelected([]);
                fetchAssetData();
              }}
              // disabled={tableData.length === 0}
            >
              {uploadAssetsLabels.search}
            </Button>
          </div>
        </div>
      </div>
      <div className={styles.tableWrap}>
        <AssetTable
          tableData={tableData}
          selected={selected}
          handleUpdateAsset={handleUpdateAsset}
          handleSelectAllClick={handleSelectAllClick}
          handleCheckboxClick={handleCheckboxClick}
        />
      </div>
      {count > limit && (
        <Stack spacing={2} className={styles.paginationWrap}>
          <Pagination
            count={Math.ceil(count / limit)}
            shape="rounded"
            page={page}
            onChange={(e, data) => handleGetAssetData(e, data)}
          />
        </Stack>
      )}
      {uploadModalShow && (
        <SideBar
          title={
            updateId !== ''
              ? uploadAssetsLabels.updateAsset
              : uploadAssetsLabels.uploadTitle
          }
          closeHandler={() => {
            if (isDirty || formEdited) setShowCloseWarning(true);
            else cancelHandler();
          }}
          renderElement={
            <UploadAssetForm
              accessTypeList={accessTypeList}
              accessDocTypeList={accessDocTypeList}
              statusList={statusList}
              updateTable={setTableData}
              tableData={tableData}
              selected={selected}
              updateId={updateId}
              partnershipId={partnershipId}
              setLoader={() => setLoading(true)}
              clearLoader={() => setLoading(false)}
              showAlert={(value: string, msg: string) =>
                setAlert((prevState: any) => ({
                  ...prevState,
                  showAlert: true,
                  message: msg,
                  severity: value,
                }))
              }
              cancelHandler={() => cancelHandler()}
              showCloseWarning={showCloseWarning}
              setShowCloseWarning={setShowCloseWarning}
              setFormEdited={setFormEdited}
              formEdited={formEdited}
              setIsDirty={setisDirty}
            />
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
          message={uploadAssetRespData.errorMsg}
        />
      )}
      {showCloseWarning && (
        <DialogBoxComponent
          title=""
          secondaryContent="Are you sure you want to discard changes made on this page?"
          primaryContent="Unsaved changes"
          primaryButton="Discard"
          secondaryButton="Cancel"
          handleDialogBoxClose={() => setShowCloseWarning(false)}
          handleAgree={() => cancelHandler()}
          show
        />
      )}
      {loading === true && <Loader />}
      {deleteModal && (
        <div className={deleteModal ? styles.modalActive : styles.modal}>
          <div className={styles.modalcontent}>
            <p className={styles.modalcontenttitle}>
              {uploadAssetsLabels.deleteAsset}
            </p>
            <p className={styles.modalSecContenttitle}>
              {' '}
              {uploadAssetsLabels.confirmDeleteAsset}
            </p>
            <SecondaryButton
              onClick={() => showDeleteModal(false)}
              style={{ minWidth: '160px', marginRight: '10px' }}
            >
              {uploadAssetsLabels.cancel}
            </SecondaryButton>
            <PrimaryButton
              style={{ minWidth: '160px' }}
              onClick={() => handleDeleteAsset(selected)}
            >
              {uploadAssetsLabels.deleteAsset}
            </PrimaryButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadAssets;
