/* eslint-disable react/jsx-curly-newline */
/* eslint-disable function-paren-newline */
/* eslint-disable indent */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */
/* eslint-disable linebreak-style */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import SnackbarAlert from 'src/app/components/Snackbar/Snackbar';
import PrimaryButton from 'src/app/components/Button/PrimaryButton';
import Table from '@mui/material/Table';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Checkbox, TableBody } from '@material-ui/core';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { getRequest } from 'src/app/service';
import { ManageAssetCollectionLabels } from '../../../../../strings';
import SecondaryButton from '../../../../components/Button/SecondaryButton';
import styles from './ManageAssetCollection.module.css';
import {
  setSalesHubAssetCollectionInfo,
  salesHubResponse,
} from '../../SalesHubSlice';
import { assetCollectionData } from '../../types';
import DialogBoxComponent from 'src/app/components/DialogBox/DialogBox';

// interface Values {}
interface assetCollectValues {
  name: '';
  tags: '';
  id: '';
  image: '';
  noOfAssets: any;
}
const ManageAssetCollections = (props: any) => {
  const {
    closeHandler,
    cancelHandler,
    salesHubId,
    selectedAssetCollections,
    setSelectedAssetCollections,
    setSelectedAssetCollectionIds,
    setIsFromEdited,
    isFromEdited,
  } = props;
  const dispatch = useDispatch();
  const [successMsg, setSuccessMsg] = React.useState(false);
  const [fieldError, setFieldError] = React.useState('');
  const [assetCollectData, setAssetCollectData] = React.useState([]);
  React.useState(false);
  const [initialValues, setInitialValues] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showAlert, setShowAlert] = useState(false);
  const [offset, setOffset] = useState(0);
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [selected, setSelected] = useState([]);
  const [initialSelected, setInitialSelected] = useState([]);
  const [addLabel, setAddLabel] = useState('add');
  const [selectedAssetCollect, setSelectedAssetCollect] = useState([]);
  const [selectedAssetCollection, setSelectedAssetCollection] = useState<
    assetCollectionData[]
  >([]);
  const token = localStorage.getItem('token');
  const queryparams = new URLSearchParams(window.location.search);
  const partnershipID: string = queryparams.get('partner_id') || '0';
  const salesHubResp = useSelector(salesHubResponse);
  const [showCloseWarning, setShowCloseWarning] = useState(false);

  const fetchAllAssetCollectData = (currOffset, isInit) => {
    setOffset(currOffset);
    getRequest(
      `partnership/sales-hub/solution-narratives/?partnership_id=${partnershipID}&sales_hub_id=${salesHubId}&offset=${currOffset}&limit=${limit}`,
      {
        Authorization: `Token ${token}`,
      }
    ).then((response: any) => {
      if (response.result === true) {
        if (response.data.length > 0) {
          setAssetCollectData(response.data);
          if (isInit === 'init') {
            getRequest(
              `partnership/sales-hub/solution-narratives/?partnership_id=${partnershipID}&sales_hub_id=${salesHubId}`,
              {
                Authorization: `Token ${token}`,
              }
            ).then((resp: any) => {
              const selectedId = resp.data.filter(
                (d: any) => d.is_selected === true
              );
              const selectedIdArr = selectedId.map((d: any) =>
                d.solution_narrative_id.toString()
              );
              if (initialSelected.length === 0) {
                setInitialSelected(selectedIdArr);
              }
              setSelected(selectedIdArr);
              setSelectedAssetCollect(selectedId);
            });
          }
        } else {
          const selectedId = selectedAssetCollect.map((d: any) =>
            d.solution_narrative_id.toString()
          );
          setSelected(selectedId);
          setSelectedAssetCollect(selectedAssetCollect);
        }
      }

      if (response.count) {
        setCount(response.count);
      }
    });
  };

  useEffect(() => {
    const equals =
      JSON.stringify(initialSelected.sort((a, b) => a - b)) ===
      JSON.stringify(selected.sort((a, b) => a - b));
    if (!equals) setIsFromEdited(true);
    else setIsFromEdited(false);
  }, [selected]);

  const handleSaveAssetCollect = (assetCollectObj) => {
    // setSelectedAssetCollections(selectedAssetCollect);
    // const selectedIds =
    //   selectedAssetCollect &&
    //   selectedAssetCollect.map((d) => d.solution_narrative_id);
    // setSelectedAssetCollectionIds(selectedIds);
    closeHandler(selectedAssetCollect, selected);
  };

  const handleCheckboxClick = (
    event: any,
    id: string,
    row: assetCollectionData
  ) => {
    event.stopPropagation();
    const selectedIndex = selected.indexOf(id);
    let newSelected: any[] = [];
    let newSelectedAssetCollect: any[] = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
      newSelectedAssetCollect = newSelectedAssetCollect.concat(
        selectedAssetCollect,
        row
      );
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
      newSelectedAssetCollect = newSelectedAssetCollect.concat(
        selectedAssetCollect.slice(1)
      );
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
      newSelectedAssetCollect = newSelectedAssetCollect.concat(
        selectedAssetCollect.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
      newSelectedAssetCollect = newSelectedAssetCollect.concat(
        selectedAssetCollect.slice(0, selectedIndex),
        selectedAssetCollect.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
    setSelectedAssetCollect(newSelectedAssetCollect);
  };

  const handleGetAssetData = (e: any, data: any) => {
    fetchAllAssetCollectData((data - 1) * limit, '');
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#FAFAFA',
      color: '#707683',
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));
  useEffect(() => {
    fetchAllAssetCollectData(0, 'init');
  }, []);
  return (
    <div>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        // validationSchema={}
        onSubmit={(values) => {
          //   setAccountDetail(values);
        }}
      >
        {(formik) => {
          const { handleSubmit } = formik;
          return (
            <Form
              className={styles.manage_solution_narrative_form}
              onSubmit={handleSubmit}
            >
              <div className={styles.manage_solution_narrative_titleName}>
                {ManageAssetCollectionLabels.manageAssetCollection}
              </div>

              <div className={styles.manage_solution_narrative_mainContent}>
                <div className={styles.manage_solution_narrative_content}>
                  <TableContainer component={Paper} className={styles.solTable}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell />
                          <StyledTableCell>
                            {ManageAssetCollectionLabels.tableName}
                          </StyledTableCell>
                          <StyledTableCell>
                            {ManageAssetCollectionLabels.tableNoOfAssets}
                          </StyledTableCell>
                          <StyledTableCell>
                            {ManageAssetCollectionLabels.tableTags}
                          </StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {assetCollectData.length > 0 &&
                          assetCollectData.map((row) => (
                            <StyledTableRow key={row.solution_narrative_id}>
                              <StyledTableCell component="th" scope="row">
                                <Checkbox
                                  className={
                                    selected.includes(
                                      row.solution_narrative_id.toString()
                                    )
                                      ? styles.customBox
                                      : ''
                                  }
                                  checked={
                                    selected.length > 0
                                      ? selected.includes(
                                          row.solution_narrative_id.toString()
                                        )
                                      : false
                                  }
                                  onClick={(e) =>
                                    handleCheckboxClick(
                                      e,
                                      row.solution_narrative_id.toString(),
                                      row
                                    )
                                  }
                                />
                              </StyledTableCell>
                              <StyledTableCell>
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                  }}
                                >
                                  <img
                                    src={row.image}
                                    alt=""
                                    style={{
                                      width: '60px',
                                      height: '30px',
                                      borderRadius: '4px',
                                      marginRight: '15px',
                                    }}
                                  />
                                  {row.name}
                                </div>
                              </StyledTableCell>
                              <StyledTableCell style={{ textAlign: 'center' }}>
                                {row.asset_count}
                              </StyledTableCell>
                              <StyledTableCell>
                                {' '}
                                <div className={styles.chipsWrap}>
                                  {row.tags.map((li: string, idx: number) => (
                                    <span
                                      className={styles.tagChip}
                                      key={`${idx + 1}+${li}`}
                                    >
                                      {li}
                                    </span>
                                  ))}
                                </div>
                              </StyledTableCell>
                            </StyledTableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {count > limit && (
                    <Stack spacing={2} className={styles.paginationWrap}>
                      <Pagination
                        count={Math.ceil(count / limit)}
                        shape="rounded"
                        onChange={(e, data) => handleGetAssetData(e, data)}
                      />
                    </Stack>
                  )}
                </div>
                <div
                  className={styles.manage_solution_narrative_button_container}
                >
                  <SecondaryButton
                    onClick={() => {
                      if (isFromEdited) setShowCloseWarning(true);
                      else cancelHandler();
                    }}
                    style={{ minWidth: '160px', marginRight: '30px' }}
                  >
                    {ManageAssetCollectionLabels.cancel}
                  </SecondaryButton>
                  <PrimaryButton
                    type="submit"
                    onClick={() => handleSaveAssetCollect(selectedAssetCollect)}
                    style={{ minWidth: '160px' }}
                  >
                    {ManageAssetCollectionLabels.save}
                  </PrimaryButton>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>

      {showCloseWarning && (
        <DialogBoxComponent
          title=""
          secondaryContent="Are you sure you want to discard changes made on this page?"
          primaryContent="Unsaved changes"
          primaryButton="Discard"
          secondaryButton="Cancel"
          handleDialogBoxClose={() => setShowCloseWarning(false)}
          handleAgree={() => {
            setShowCloseWarning(false);
            cancelHandler();
            setIsFromEdited(false);
          }}
          show
        />
      )}
      {showAlert && (
        <SnackbarAlert
          severity="success"
          handler={() => setShowAlert(false)}
          showalert={showAlert}
          //   message={ManageAssetCollectionsLabels.successMsg}
        />
      )}
    </div>
  );
};
export default ManageAssetCollections;
