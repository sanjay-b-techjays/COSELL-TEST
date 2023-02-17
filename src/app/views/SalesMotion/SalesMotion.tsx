/* eslint-disable linebreak-style */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable no-nested-ternary */
/* eslint-disable comma-dangle */
/* eslint-disable operator-linebreak */
/* eslint-disable linebreak-style */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import PrimaryButton from 'src/app/components/Button/PrimaryButton';
import SideBar from 'src/app/components/SideBar';
import { getRequest } from 'src/app/service';
import Loader from 'src/app/components/Loader';
import { useDispatch } from 'react-redux';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Checkbox from '@material-ui/core/Checkbox/Checkbox';
import SnackbarAlert from 'src/app/components/Snackbar/Snackbar';
import DialogBox from 'src/app/components/DialogBox';
import { SalesMotionLabels, DialogBoxLabels } from '../../../strings';
import './SalesMotion.css';
import CreateSalesMotion from './Components/CreateSalesMotion';
import SalesMotionCard from './Components/SalesMotionCard';
import CreateIcon from '../../assets/create_icon.svg';

import { deleteSalesMotionAction } from './SalesMotionSlice';
import { Alert } from './types';
import styles from './SalesMotion.module.css';

interface alert {
  showAlert: boolean;
  severity: string;
  message: string;
}

const SalesMotion = () => {
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [showCloseWarning, setShowCloseWarning] = useState(false);
  const [selected, setSelected] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [salesMotionData, setSalesMotionData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [isFormEdited, setIsFormEdited] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const [alert, setAlert] = useState({
    showAlert: false,
    severity: '',
    message: '',
  });
  const [error, setError] = useState({
    field: '',
    errMsg: '',
  });
  const [logo, setLogo] = useState({
    companyLogo: '',
    partnerCompanyLogo: '',
  });
  const queryparams = new URLSearchParams(window.location.search);
  const partnershipId: string = queryparams.get('partner_id') || '0';
  const salesMotionID: string = queryparams.get('sales_motion_id') || '0';
  const fetchAllSalesMotionData = (currOffset: number) => {
    setSalesMotionData([]);
    const token = localStorage.getItem('token');
    setOffset(currOffset);
    getRequest(
      `partnership/sales-motion/?partnership_id=${partnershipId}&offset=${currOffset}&limit=${limit}`,
      {
        Authorization: `Token ${token}`,
      }
    ).then((response: any) => {
      if (response.result === true) {
        setSalesMotionData(response.data);
        if (response.count) {
          setCount(response.count);
        }
      }
    });
  };
  const getPartnershipById = (partnershipID: string) => {
    const token = localStorage.getItem('token');
    getRequest(`partnership/?partnership_id=${partnershipID}`, {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    }).then((resp: any) => {
      if (resp.result === true) {
        setLogo({
          companyLogo: resp.data.company_information.logo
            ? `${
                resp.data.company_information.logo
              }?time=${new Date().getTime()}`
            : '',
          partnerCompanyLogo: resp.data.partner_company_information.logo
            ? `${
                resp.data.partner_company_information.logo
              }?time=${new Date().getTime()}`
            : '',
        });
      }
    });
  };

  useEffect(() => {
    const modalShow: boolean = !!queryparams.get('createModal') || false;
    fetchAllSalesMotionData(0);
    getPartnershipById(partnershipId);
    setShowForm(modalShow);
  }, []);

  const deleteSalesMotion = () => {
    setLoading(true);

    dispatch(
      deleteSalesMotionAction(
        partnershipId,
        selected,
        () => setLoading(false),
        (value: string) =>
          setAlert((prevState: Alert) => ({
            ...prevState,
            showAlert: true,
            message: DialogBoxLabels.deleteSalesMotionMsg,
            severity: value,
          })),
        () => fetchAllSalesMotionData(0),
        () => setShowDialog(false)
      )
    );
    setPage(1);
    setSelected([]);
  };

  const handleCreateAndDeleteSalesMotionButtonClick = () => {
    if (selected.length > 0) {
      setShowDialog(true);
    } else {
      setShowForm(true);
    }
  };

  const handleDeleteSalesMotionDialogClose = () => {
    setSelected([]);
    setShowDialog(false);
  };

  const handleSalesMotionCheckboxClick = (event: any, id: number) => {
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
  const history = useHistory();

  const handleGetAssetCollectData = (e, data) => {
    setPage(data);
    fetchAllSalesMotionData((data - 1) * limit);
  };

  return (
    <div className="salesMotion_main_div">
      <div className="salesMotion_main_card">
        <div className="salesMotion_title_div">
          {SalesMotionLabels.title}
          <div>
            <PrimaryButton
              style={{ minWidth: '225px' }}
              onClick={() => handleCreateAndDeleteSalesMotionButtonClick()}
            >
              {selected.length > 0 ? (
                ''
              ) : (
                <img style={{ marginRight: '10px' }} src={CreateIcon} alt="" />
              )}
              {count === 0
                ? SalesMotionLabels.createSalesMotion
                : selected.length > 0
                ? SalesMotionLabels.deleteSalesMotion
                : SalesMotionLabels.createNew}
            </PrimaryButton>
          </div>
        </div>
        <div className="salesMotion_content_div">
          <div className="salesMotionCards">
            {salesMotionData.length > 0 &&
              salesMotionData.map((data: any) => (
                <div className="salesMotionEachCard" key={data.sales_motion_id}>
                  <Checkbox
                    onChange={(e) => {
                      handleSalesMotionCheckboxClick(
                        e.target.checked,
                        data.sales_motion_id
                      );
                    }}
                    checked={selected.includes(data.sales_motion_id)}
                    className="salesMotionEachCardCheckbox"
                  />
                  <div
                    onClickCapture={() => {
                      setShowForm(true);
                      history.push(
                        `/salesMotion?partner_id=${partnershipId}&sales_motion_id=${data.sales_motion_id}`
                      );
                    }}
                  >
                    <SalesMotionCard
                      img={
                        data?.site_layout && data.site_layout.header_image
                          ? `${
                              data.site_layout.header_image
                            }?time=${new Date().getTime()}`
                          : ''
                      }
                      title={data?.name}
                      header={data?.site_layout?.header_text}
                      subHeader={data?.site_layout?.sub_header_text}
                      logo={logo}
                    />
                  </div>
                </div>
              ))}
          </div>
          <DialogBox
            title=""
            primaryContent={
              DialogBoxLabels.deleteDialogSalesMotionPrimaryContent
            }
            secondaryContent={
              DialogBoxLabels.deleteDialogSalesMotionSecondaryContent
            }
            secondaryButton={DialogBoxLabels.deleteDialogSecondaryButton}
            tertiaryContent=""
            primaryButton={DialogBoxLabels.deleteDialogPrimaryButton}
            show={showDialog}
            handleDialogBoxClose={() => handleDeleteSalesMotionDialogClose()}
            handleAgree={() => deleteSalesMotion()}
          />
          {salesMotionData.length > 0 && (
            <div>
              {count > limit && (
                <Stack spacing={2} className={styles.paginationWrap}>
                  <Pagination
                    count={Math.ceil(count / limit)}
                    shape="rounded"
                    page={page}
                    onChange={(e, data) => handleGetAssetCollectData(e, data)}
                  />
                </Stack>
              )}
            </div>
          )}
        </div>
        {showForm && (
          <SideBar
            title={
              salesMotionID !== '0'
                ? 'Update Sales Motion'
                : 'Create Sales Motion'
            }
            closeHandler={() => {
              if (isDirty || isFormEdited) setShowCloseWarning(true);
              else {
                history.push(`/salesMotion?partner_id=${partnershipId}`);
                fetchAllSalesMotionData(0);
                setPage(1);
                setShowForm(false);
                setShowCloseWarning(false);
                setIsFormEdited(false);
                setIsDirty(false);
              }
            }}
            renderElement={
              <CreateSalesMotion
                closeHandler={() => {
                  setShowCloseWarning(false);
                  setIsFormEdited(false);
                  setIsDirty(false);
                  history.push(`/salesMotion?partner_id=${partnershipId}`);
                  setPage(1);
                  setShowForm(false);
                  fetchAllSalesMotionData(0);
                }}
                setError={(field: string, errMessage: string) =>
                  setError({
                    field,
                    errMsg: errMessage,
                  })
                }
                error={error}
                setAlert={setAlert}
                setShowCloseWarning={setShowCloseWarning}
                showCloseWarning={showCloseWarning}
                isFormEdited={isFormEdited}
                setIsFormEdited={setIsFormEdited}
                setIsDirty={setIsDirty}
              />
            }
          />
        )}
      </div>
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

export default SalesMotion;
