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
import { accountContactsLabel } from 'src/strings';
import DownArrow from 'src/app/components/Icons/PreviewPartnership/DownArrow.svg';
import { getRequest } from 'src/app/service';
import FileSaver from 'file-saver';

import {
  IconButton,
  TableBody,
  Checkbox,
  styled,
  TableCell,
} from '@material-ui/core';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Table from '@mui/material/Table';
import Avatar from '@mui/material/Avatar';
import { tableCellClasses } from '@mui/material';
import { Field } from 'formik';
import PrimaryButton from 'src/app/components/Button/PrimaryButton';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Loader from 'src/app/components/Loader';
import pdfIcon from '../../../../assets/assetfiletype/Pdf.svg';
import pptIcon from '../../../../assets/assetfiletype/PPT.svg';
import imageIcon from '../../../../assets/assetfiletype/Image.svg';
import videoIcon from '../../../../assets/assetfiletype/Video.svg';
import othersIcon from '../../../../assets/assetfiletype/Document.svg';
import wordIcon from '../../../../assets/assetfiletype/Word.svg';
import xlsIcon from '../../../../assets/assetfiletype/Excel.svg';
import styles from './AccountContacts.module.css';

const AccountContacts = (props: any) => {
  const {
    formikValues,
    errors,
    touched,
    handleBlur,
    handleChange,
    setShowAccountTeam,
    showAccountTeam,
    setActiveAddUserMenu = '',
    setAlert,
    accContactsList,
    contactsCount,
    contactsLimit,
    contactsOffset,
    contactsPage,
    setContactsCount,
    setContactsLimit,
    setContactsPage,
    setContactsOffset,
    handleContactsPageChange,
    salesHubAccountId,
    contactsLoading,
    CsvData,
    accountTitle,
  } = props;

  const getDocIcon = (docType: string) => {
    let icon = '';
    switch (docType) {
      case 'Pdf':
      case 'pdf':
        icon = pdfIcon;
        break;
      case 'Image':
      case 'jpeg':
      case 'webp':
      case 'gif':
      case 'jfif':
      case 'jpg':
      case 'png':
      case 'svg':
        icon = imageIcon;
        break;
      case 'Video':
      case 'mp4':
      case 'mkv':
      case 'MP4':
      case 'webm':
      case 'MOV':
      case 'mov':
        icon = videoIcon;
        break;
      case 'Powerpoint':
      case 'pptx':
      case 'ppt':
        icon = pptIcon;
        break;
      case 'Word':
      case 'word':
      case 'docx':
      case 'doc':
        icon = wordIcon;
        break;
      case 'Excel':
      case 'xlsx':
      case 'xls':
      case 'csv':
        icon = xlsIcon;
        break;
      case 'Others':
        icon = othersIcon;
        break;
      default:
        icon = othersIcon;
    }
    return icon;
  };

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

  function getFormattedTime() {
    var newDate = new Date();
    var date = newDate.toLocaleDateString('en-US', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
    });
    return accountTitle + '_date(' + date + ')';
  }

  const handleExport = () => {
    const binaryData = [];
    binaryData.push(CsvData);
    const Data = new Blob(binaryData, { type: 'text/csv;charset=utf-8;' });
    const d = new Date();
    const dformat = `${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}`;
    FileSaver.saveAs(Data, getFormattedTime());
  };

  return (
    <>
      {accContactsList.length > 0 && (
        <div className={styles.btnAlign}>
          <PrimaryButton
            style={{
              minWidth: '160px',
              marginRight: '10px',
              marginTop: '20px',
            }}
            onClick={() => handleExport()}
          >
            {accountContactsLabel.export}
          </PrimaryButton>
        </div>
      )}
      <div
        className={styles.salesHubAccDropDown}
        onClickCapture={() => setShowAccountTeam(!showAccountTeam)}
      >
        {accountContactsLabel.contacts}
        <IconButton>
          <img src={DownArrow} alt="" />
        </IconButton>
      </div>
      {showAccountTeam ? (
        <div className={styles.accContactsTableWrap}>
          <TableContainer className={styles.accContactsTable}>
            <Table
              aria-label="customized table"
              className={styles.accountTable}
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell>{accountContactsLabel.ip}</StyledTableCell>
                  <StyledTableCell>
                    {accountContactsLabel.organization}
                  </StyledTableCell>
                  <StyledTableCell>
                    {accountContactsLabel.TotalEngagedTime}
                  </StyledTableCell>
                  <StyledTableCell>
                    {accountContactsLabel.SiteSessions}
                  </StyledTableCell>
                  <StyledTableCell>
                    {accountContactsLabel.TopAssetEngagement}
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {accContactsList.length > 0 ? (
                  accContactsList.map((data: any) => (
                    <StyledTableRow>
                      <StyledTableCell>{data.ip}</StyledTableCell>
                      <StyledTableCell>Unknown</StyledTableCell>
                      <StyledTableCell>
                        {data.total_engaged_time}
                      </StyledTableCell>
                      <StyledTableCell>{data.site_sessions}</StyledTableCell>
                      <StyledTableCell>
                        <div className={styles.assetAlign}>
                          <img
                            src={getDocIcon(data.asset_type)}
                            className={styles.fileIcon}
                            alt="icon"
                          />
                          <span className={styles.assetTextAlign}>
                            {data.top_asset_engagement}
                          </span>
                        </div>
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
      ) : null}
      {contactsCount > contactsLimit && (
        <Stack spacing={2} className={styles.paginationWrap}>
          <Pagination
            count={Math.ceil(contactsCount / contactsLimit)}
            shape="rounded"
            page={contactsPage}
            onChange={handleContactsPageChange}
          />
        </Stack>
      )}
      {contactsLoading && <Loader />}
    </>
  );
};
export default AccountContacts;
