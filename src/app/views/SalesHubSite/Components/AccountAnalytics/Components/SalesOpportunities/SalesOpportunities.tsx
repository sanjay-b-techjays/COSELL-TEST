/* eslint-disable react/jsx-curly-newline */
/* eslint-disable function-paren-newline */
/* eslint-disable indent */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable linebreak-style */
/* eslint-disable react/jsx-indent */
/* eslint-disable comma-dangle */
/* eslint-disable linebreak-style */
/* eslint-disable operator-linebreak */
import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  createAccountDropdown,
  createAccount,
  AccountsEngagementsLabels,
} from 'src/strings';
import {
  IconButton,
  TableBody,
  Checkbox,
  styled,
  TableCell,
  MenuItem,
} from '@material-ui/core';
import Divider from '@mui/material/Divider';

import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Table from '@mui/material/Table';
import { tableCellClasses } from '@mui/material';
import DownArrow from 'src/app/components/Icons/PreviewPartnership/DownArrow.svg';
import SecondaryButton from 'src/app/components/Button/SecondaryButton';
import PrimaryButton from 'src/app/components/Button/PrimaryButton';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

import DialogBox from 'src/app/components/DialogBox';
import { deleteRequest, getRequest, postRequest } from 'src/app/service';
import { useStyles } from '../../../../Styles';

import styles from '../../../CreateAccount/CreateAccount.module.css';
import SalesForce from '../../../SalesForce';
import '../../../CreateAccount/CreateAccount.css';

const SalesOpportunities = (props: any) => {
  const {
    setShowAddSalesOpportunity,
    salesOpportunityList = [{}],
    clearLoader,
    setLoader,
    setAlert,
    fetchSalesOpportunityList,
    companyName,
  } = props;
  const classes = useStyles();
  const env_url = import.meta.env.VITE_SALESFORCE_REDIRECT;
  const [showSalesOpportunites, setShowSalesOpportunites] = useState(true);
  const [companyname, setCompanyname] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
  const [consumerKey, setConsumerKey] = useState('');
  const [selectedSalesForceIds, setSelectedSalesForceIds] = useState([]);
  const dispatch = useDispatch();
  const queryparams = new URLSearchParams(window.location.search);
  const salesHubAccountId: string =
    queryparams.get('sales_hub_account_id') || '0';
  const partner_id: string = queryparams.get('partner_id') || '0';
  const showModal: boolean = !!queryparams.get('code') || false;
  const [salesOpportunitiesSelected, setSalesOpportunitiesSelected] = useState(
    []
  );
  const [salesOpportunitiesMenu, setSalesOpportunitiesMenu] = useState(false);
  const [loading, setLoading] = useState(true);
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
    '&:last-child td, &:last-child th, &:last-child tr': {
      border: 0,
    },
  }));
  const handleSelectAllClick = (event: any) => {
    if (event.target.checked) {
      const selectedData = salesOpportunityList?.map(
        (data: any) => data.sales_opportunity_id
      );
      setSalesOpportunitiesSelected(
        Array.from(new Set([...salesOpportunitiesSelected, ...selectedData]))
      );
      return;
    }

    const selectedData = salesOpportunityList?.map(
      (data: any) => data.sales_opportunity_id
    );
    const value = salesOpportunitiesSelected.filter(
      (s: any) => !selectedData.includes(s)
    );
    setSalesOpportunitiesSelected(value);
  };
  const handleCheckboxClick = (event: any, id: number) => {
    event.stopPropagation();
    const selectedIndex = salesOpportunitiesSelected.indexOf(id);
    let newSelected: any[] = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(salesOpportunitiesSelected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(salesOpportunitiesSelected.slice(1));
    } else if (selectedIndex === salesOpportunitiesSelected.length - 1) {
      newSelected = newSelected.concat(salesOpportunitiesSelected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        salesOpportunitiesSelected.slice(0, selectedIndex),
        salesOpportunitiesSelected.slice(selectedIndex + 1)
      );
    }
    setSalesOpportunitiesSelected(newSelected);
  };

  const getConsumerKey = () => {
    const token = localStorage.getItem('token');
    getRequest(
      `/partnership/sales-hub-account/sales-opportunity/salesforce/get-consumer-key/`,
      { Authorization: `Token ${token}` }
    ).then((resp: any) => {
      console.log('consumerKey', resp.data.consumer_key),
        setConsumerKey(resp.data.consumer_key);
    });
  };

  const apiCalls = () => {
    if (showModal === true) {
      const code = queryparams.get('code');
      console.log('code', code);
      const encoded = encodeURI(code);
      console.log('code', encoded);
      const token = localStorage.getItem('token');
      postRequest(
        `partnership/sales-hub-account/sales-opportunity/salesforce/authorization/`,
        {
          oauth_token: encoded,
          callback_url: `${env_url}accountsEngagements/`,
        },
        {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        }
      )
        .then((resp: any) => {
          if (resp.result === true) {
            localStorage.setItem('sftoken', resp.data.access_token);
            localStorage.setItem('sfurl', resp.data.instance_url);
          }
          setLoading(false);
        })
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    fetchSalesOpportunityList();
    getConsumerKey();
    apiCalls();
    console.log('env_url', env_url);
  }, []);

  useEffect(() => {
    setCompanyname(companyName);
  }, [companyName]);

  const handleDeleteSalesOpportunity = () => {
    setDeleteModal(false);
    setLoader();
    const token = localStorage.getItem('token');
    deleteRequest(
      `partnership/sales-hub-account/sales-opportunity/`,
      {
        Authorization: `Token ${token}`,
      },
      {
        sales_opportunity_ids: salesOpportunitiesSelected,
        sales_hub_account_id: salesHubAccountId,
      }
    ).then((response: any) => {
      if (response.result === true) {
        clearLoader();
        setAlert(
          AccountsEngagementsLabels.deleteSalesOpportunitySuccessMsg,
          'success'
        );
        setSalesOpportunitiesSelected([]);
        fetchSalesOpportunityList();
      } else {
        clearLoader();
      }
    });
  };

  return (
    <>
      <div className={styles.manageAccountWrap}>
        <div className={styles.manageAccLabel}>
          {createAccount.salesOpportunities}
        </div>
        <div>
          {salesOpportunitiesSelected.length > 0 ? (
            <PrimaryButton
              style={{ minWidth: '210px' }}
              onClick={() => setDeleteModal(true)}
            >
              {createAccount.removeOpportunity}
            </PrimaryButton>
          ) : (
            <div className={styles.salesMenuWrap}>
              <PrimaryButton
                style={{ minWidth: '210px' }}
                onClick={() =>
                  setSalesOpportunitiesMenu(!salesOpportunitiesMenu)
                }
              >
                {createAccount.addSalesOpportunity}
              </PrimaryButton>
              {salesOpportunitiesMenu && (
                <div className={styles.salesMenu}>
                  <MenuItem
                    onClick={() => {
                      setSalesOpportunitiesMenu(!salesOpportunitiesMenu);
                      setShowAddSalesOpportunity('0');
                    }}
                  >
                    Add new Opportunity
                  </MenuItem>
                  <Divider />
                  <MenuItem
                    onClick={() => {
                      setSalesOpportunitiesMenu(!salesOpportunitiesMenu);
                      window.open(
                        `https://login.salesforce.com/services/oauth2/authorize?response_type=code&client_id=${consumerKey}&state=${window.location.hostname}/${partner_id}/${salesHubAccountId}&redirect_uri=${env_url}accountsEngagements/&prompt=login%20consent`,
                        '_self'
                      );
                    }}
                  >
                    Salesforce sync
                  </MenuItem>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className={styles.accTeamTableWrap}>
        <TableContainer className="analyticsTable">
          <Table
            aria-label="customized table"
            className={styles.analyticsAssetTable}
          >
            <TableHead>
              <TableRow>
                <StyledTableCell component="td">
                  <Checkbox
                    className={
                      salesOpportunityList.length > 0 &&
                      salesOpportunityList.filter((s: any) =>
                        salesOpportunitiesSelected.includes(
                          s.sales_opportunity_id
                        )
                      ).length === salesOpportunityList.length
                        ? styles.accountCheckBox
                        : ''
                    }
                    checked={
                      salesOpportunityList.length > 0 &&
                      salesOpportunityList.length ===
                        salesOpportunityList.filter((s: any) =>
                          salesOpportunitiesSelected.includes(
                            s.sales_opportunity_id
                          )
                        ).length
                    }
                    onChange={(e) => handleSelectAllClick(e)}
                  />
                </StyledTableCell>
                <StyledTableCell component="td">
                  {createAccount.opportunityName}
                </StyledTableCell>
                <StyledTableCell component="td">
                  {createAccount.salesStage}
                </StyledTableCell>
                <StyledTableCell component="td">
                  {createAccount.createdDate}
                </StyledTableCell>
                <StyledTableCell component="td">
                  {createAccount.estimatedCloseDate}
                </StyledTableCell>
                <StyledTableCell component="td">
                  {createAccount.estimatedDealAmount}
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {salesOpportunityList?.length > 0 ? (
                salesOpportunityList?.map((data: any, index) => (
                  <StyledTableRow
                    onClick={() =>
                      setShowAddSalesOpportunity(data.sales_opportunity_id)
                    }
                  >
                    <StyledTableCell
                      component="td"
                      style={
                        index + 1 === salesOpportunityList.length
                          ? {}
                          : { borderBottom: '0.75px solid #334d6e33' }
                      }
                    >
                      <Checkbox
                        className={
                          salesOpportunitiesSelected.includes(
                            data.sales_opportunity_id
                          )
                            ? styles.accountCheckBox
                            : ''
                        }
                        checked={
                          salesOpportunitiesSelected.length > 0
                            ? salesOpportunitiesSelected.includes(
                                data.sales_opportunity_id
                              )
                            : false
                        }
                        onClick={(e) =>
                          handleCheckboxClick(e, data.sales_opportunity_id)
                        }
                      />
                    </StyledTableCell>
                    <StyledTableCell
                      component="td"
                      style={
                        index + 1 === salesOpportunityList.length
                          ? {}
                          : { borderBottom: '0.75px solid #334d6e33' }
                      }
                    >
                      {data.opportunity_name}
                    </StyledTableCell>
                    <StyledTableCell
                      component="td"
                      style={
                        index + 1 === salesOpportunityList.length
                          ? {}
                          : { borderBottom: '0.75px solid #334d6e33' }
                      }
                    >
                      {data.sales_stage}
                    </StyledTableCell>
                    <StyledTableCell
                      component="td"
                      style={
                        index + 1 === salesOpportunityList.length
                          ? {}
                          : { borderBottom: '0.75px solid #334d6e33' }
                      }
                    >
                      {data.created_date}
                    </StyledTableCell>
                    <StyledTableCell
                      component="td"
                      style={
                        index + 1 === salesOpportunityList.length
                          ? {}
                          : { borderBottom: '0.75px solid #334d6e33' }
                      }
                    >
                      {data.estimated_close_date}
                    </StyledTableCell>
                    <StyledTableCell
                      component="td"
                      style={
                        index + 1 === salesOpportunityList.length
                          ? {}
                          : { borderBottom: '0.75px solid #334d6e33' }
                      }
                    >
                      {data.estimate_deal_amount
                        ? `$${(
                            Math.round(data.estimate_deal_amount * 100) / 100
                          ).toLocaleString()}`
                        : ''}
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <StyledTableCell colSpan={7} className={styles.noResults}>
                  <div className={styles.noResults}>No records found</div>
                </StyledTableCell>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <DialogBox
        title=""
        primaryContent={AccountsEngagementsLabels.deleteSalesOpportunity}
        secondaryContent={
          AccountsEngagementsLabels.confirmDeleteSalesOpportunity
        }
        secondaryButton={AccountsEngagementsLabels.cancel}
        primaryButton={AccountsEngagementsLabels.deleteSalesOpportunity}
        show={deleteModal}
        handleDialogBoxClose={() => setDeleteModal(false)}
        handleAgree={() => handleDeleteSalesOpportunity()}
      />

      {/* <SalesForce isOpen={showModal} /> */}
      <SalesForce
        isOpen={showModal}
        apicall={apiCalls}
        setSelectedSalesForceIds={setSelectedSalesForceIds}
        selectedSalesForceIds={selectedSalesForceIds}
        loading={loading}
        setAlert={setAlert}
        fetchSalesOpportunityList={fetchSalesOpportunityList}
        companyName={companyname}
      />
    </>
  );
};
export default SalesOpportunities;
