/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable linebreak-style */
/* eslint-disable function-paren-newline */
/* eslint-disable comma-dangle */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable linebreak-style */
/* eslint-disable operator-linebreak */
/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
import React, { useEffect, useState } from 'react';
import { accountContactsLabel, salesContactsLabel } from 'src/strings';
import { getRequest } from 'src/app/service';
import * as FileSaver from 'file-saver';

import { TableBody, styled, TableCell } from '@material-ui/core';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Table from '@mui/material/Table';
import Avatar from '@mui/material/Avatar';
import { imageListClasses, tableCellClasses } from '@mui/material';
import PrimaryButton from 'src/app/components/Button/PrimaryButton';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Loader from 'src/app/components/Loader';
import styles from './SalesContacts.module.css';
import './SalesContacts.css';

const SalesContacts = (props: any) => {
  const queryparams = new URLSearchParams(window.location.search);
  const partnershipId: string = queryparams.get('partner_id') || '0';
  const [loading, setLoading] = useState(true);
  const [csvData, setCsvData] = useState();
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [partnershipName, setPartnershipName] = useState('');
  const [salesContactsList, setSalesContactsList] = useState([]);

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
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));
  const getPartnerships = () => {
    const token = localStorage.getItem('token');
    getRequest(`partnership/?partnership_id=${partnershipId}`, {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    }).then((resp: any) => {
      if (resp) {
        const resData = resp.data;
        setPartnershipName(resData.partnership_name);
      }
    });
  };
  const fetchSalesContactsList = () => {
    const token = localStorage.getItem('token');
    const headerData = {
      Authorization: `Token ${token}`,
    };
    getRequest(
      `partnership/account-team/sales-contacts/?offset=${offset}&limit=${limit}&partnership_id=${partnershipId}`,
      headerData
    ).then((resp: any) => {
      if (resp.result === true) {
        setSalesContactsList(resp.data);
        setLoading(false);
        if (resp.count) {
          setCount(resp.count);
        }
      }
    });
  };
  const GetExportData = () => {
    const token = localStorage.getItem('token');
    const headerData = {
      Authorization: `Token ${token}`,
    };
    getRequest(
      `partnership/account-team/sales-contacts/export/?partnership_id=${partnershipId}`,
      headerData
    ).then((response: any) => {
      setCsvData(response);
    });
  };

  useEffect(() => {
    fetchSalesContactsList();
    GetExportData();
    getPartnerships();
  }, [offset]);

  function getFormattedTime() {
    const newDate = new Date();
    const date = newDate.toLocaleDateString('en-US', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
    });
    return `${partnershipName}_Sales Contacts_${date}`;
  }

  const handleExport = () => {
    GetExportData();
    const binaryData = [];
    binaryData.push(csvData);
    const Data = new Blob(binaryData, { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(Data, getFormattedTime());
  };

  const handlePageChange = (e: any, data: any) => {
    setOffset((data - 1) * limit);
    setPage(data);
  };

  return (
    <>
      <div className={styles.salesContactsMainDiv}>
        <div className={styles.salesContactsMainCard}>
          <div className={styles.salesContactsTitleDiv}>
            {salesContactsLabel.SalesContacts}
            <div>
              {salesContactsList.length > 0 && (
                <PrimaryButton onClick={() => handleExport()}>
                  {accountContactsLabel.export}
                </PrimaryButton>
              )}
            </div>
          </div>
          <div className={styles.accContactsTableWrap}>
            <TableContainer className={styles.accContactsTable}>
              <Table
                aria-label="customized table"
                className={styles.contactsTable}
              >
                <TableHead>
                  <TableRow>
                    <StyledTableCell>
                      {salesContactsLabel.firstName}
                    </StyledTableCell>
                    <StyledTableCell>
                      {salesContactsLabel.lastName}
                    </StyledTableCell>
                    <StyledTableCell>{salesContactsLabel.role}</StyledTableCell>
                    <StyledTableCell>
                      {salesContactsLabel.company}
                    </StyledTableCell>
                    <StyledTableCell>
                      {salesContactsLabel.email}
                    </StyledTableCell>
                    <StyledTableCell>
                      {salesContactsLabel.inviteStatus}
                    </StyledTableCell>
                    <StyledTableCell>
                      {salesContactsLabel.lastLogin}
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {salesContactsList.length > 0
                    ? salesContactsList.map((values: any) => (
                        <StyledTableRow>
                          <StyledTableCell>{values.first_name}</StyledTableCell>
                          <StyledTableCell>{values.last_name}</StyledTableCell>
                          <StyledTableCell>{values.role}</StyledTableCell>
                          <StyledTableCell>
                            {values.company_name}
                          </StyledTableCell>
                          <StyledTableCell>
                            <div className={styles.avatarCell}>
                              {values.image && (
                                <img
                                  className={`${styles.profileImg}`}
                                  src={`${
                                    values.image
                                  }?time=${new Date().getTime()}`}
                                  alt="Profile"
                                />
                              )}
                              {!values.image && (
                                <Avatar className={styles.emailavatar}>
                                  {values.email.charAt(0).toUpperCase()}
                                </Avatar>
                              )}
                              <div>{values.email}</div>
                            </div>
                          </StyledTableCell>
                          <StyledTableCell>
                            {values.invite_status.charAt(0).toUpperCase() +
                              values.invite_status.slice(1)}
                          </StyledTableCell>
                          <StyledTableCell>{values.last_login}</StyledTableCell>
                        </StyledTableRow>
                      ))
                    : !loading && (
                        <StyledTableCell
                          colSpan={7}
                          className={styles.noResults}
                        >
                          {salesContactsLabel.noRecordsFound}
                        </StyledTableCell>
                      )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
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
      </div>
      {loading && <Loader />}
    </>
  );
};
export default SalesContacts;
