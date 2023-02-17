/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
/* eslint-disable no-nested-ternary */
/* eslint-disable linebreak-style */
/* eslint-disable operator-linebreak */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable linebreak-style */
import React, { useEffect, useState } from 'react';
import { createAccount } from 'src/strings';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  styled,
} from '@material-ui/core';
import * as FileSaver from 'file-saver';
import PrimaryButton from 'src/app/components/Button/PrimaryButton';
import { tableCellClasses } from '@mui/material';
import { getRequest } from 'src/app/service';
import styles from '../../../CreateAccount/CreateAccount.module.css';
import '../../../CreateAccount/CreateAccount.css';
import wordIcon from '../../../../../../assets/word_mini_icon.svg';
import pdfIcon from '../../../../../../assets/pdf_mini_icon.svg';
import pptIcon from '../../../../../../assets/ppt_mini_icon.svg';
import excelIcon from '../../../../../../assets/excel_mini_icon.svg';
import videoIcon from '../../../../../../assets/video_mini_icon.svg';
import imageIcon from '../../../../../../assets/img_mini_icon.svg';
import othersIcon from '../../../../../../assets/others_mini_icon.svg';

const SiteVisitors = (props) => {
  const { siteVisitors = [] } = props;
  const [csvData, setCsvData] = useState();

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

  const getFileIcon = (docType: string) => {
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
      case 'xlsx':
      case 'xls':
      case 'csv':
      case 'Excel':
        icon = excelIcon;
        break;
      default:
        icon = othersIcon;
    }
    return icon;
  };
  const queryparams = new URLSearchParams(window.location.search);
  const salesHubAccountId: string =
    queryparams.get('sales_hub_account_id') || '0';

  function getFormattedTime() {
    const newDate = new Date();
    const date = newDate.toLocaleDateString('en-US', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
    });
    return `${localStorage.getItem('accName')}_Site visitors_(${date})`;
  }
  const GetExportData = () => {
    const token = localStorage.getItem('token');
    const headerData = {
      Authorization: `Token ${token}`,
    };
    getRequest(
      `partnership/sales-hub-account/analytics/export-site-visitors/?sales_hub_account_id=${salesHubAccountId}`,
      headerData
    ).then((response: any) => {
      setCsvData(response);
      const binaryData = [];
      binaryData.push(response);
      const Data = new Blob(binaryData, { type: 'text/csv;charset=utf-8;' });
      FileSaver.saveAs(Data, getFormattedTime());
    });
  };
  const getRowSpan = (assetDetail, ctaDetail) => {
    const assetLength = assetDetail !== null ? assetDetail?.length : 0;
    const ctaLength = ctaDetail !== null ? ctaDetail?.length : 0;
    return assetLength > ctaLength ? assetLength + 1 : ctaLength + 1;
  };

  return (
    <div className={styles.contentEngagementWrap}>
      <div className={styles.manageAccountWrap}>
        <div className={styles.manageAccLabel}>
          {createAccount.siteVisitors}
        </div>
        <div>
          {siteVisitors.length > 0 && (
            <PrimaryButton onClick={() => GetExportData()}>
              {createAccount.export}
            </PrimaryButton>
          )}
        </div>
      </div>
      <div className={styles.accTeamTableWrap}>
        <TableContainer className="analyticsTable">
          <Table
            aria-label="customized table"
            className={styles.analyticsTable}
          >
            <TableHead>
              <TableRow>
                <StyledTableCell component="td">
                  {createAccount.visitor}
                </StyledTableCell>
                <StyledTableCell component="td">
                  {createAccount.location}
                </StyledTableCell>
                <StyledTableCell component="td">
                  {createAccount.lastVisit}
                </StyledTableCell>
                <StyledTableCell component="td">
                  {createAccount.visits}
                </StyledTableCell>
                <StyledTableCell component="td">
                  {createAccount.timeOnSite}
                </StyledTableCell>
                <StyledTableCell component="td">
                  {createAccount.ctaPageViews}
                </StyledTableCell>
                <StyledTableCell component="td">
                  {createAccount.ctaCompleted}
                </StyledTableCell>
                <StyledTableCell component="td">
                  {createAccount.assetsViewed}
                </StyledTableCell>
                <StyledTableCell component="td">
                  {createAccount.timeOnAsset}
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {siteVisitors.length > 0 ? (
                siteVisitors.map((data: any, idx) => (
                  <>
                    {console.log(data.assets, data.cta, 'cta asset', idx)}
                    <StyledTableRow
                      style={
                        data.assets === null && data.cta === null
                          ? { borderBottom: '0.75px solid #334d6e33' }
                          : {}
                      }
                    >
                      <StyledTableCell
                        rowSpan={getRowSpan(data.assets, data.cta)}
                        className={styles.alignTop}
                        style={
                          idx + 1 === siteVisitors?.length
                            ? {}
                            : { borderBottom: '0.75px solid #334d6e33' }
                        }
                      >
                        <div>
                          <div>{data.name || 'Unknown'}</div>
                          <div style={{ fontSize: '10px' }}>{data.email}</div>
                          <div>{data.designation}</div>
                          <div style={{ fontSize: '10px' }}>
                            {data.name === null ? data.ip : null}
                          </div>
                        </div>
                      </StyledTableCell>
                      <StyledTableCell
                        rowSpan={getRowSpan(data.assets, data.cta)}
                        style={
                          idx + 1 === siteVisitors?.length
                            ? {}
                            : { borderBottom: '0.75px solid #334d6e33' }
                        }
                        className={styles.alignTop}
                      >
                        {data.location}
                      </StyledTableCell>
                      <StyledTableCell
                        rowSpan={getRowSpan(data.assets, data.cta)}
                        style={
                          idx + 1 === siteVisitors?.length
                            ? {}
                            : { borderBottom: '0.75px solid #334d6e33' }
                        }
                        className={styles.alignTop}
                      >
                        {data.last_visit}
                      </StyledTableCell>
                      <StyledTableCell
                        rowSpan={getRowSpan(data.assets, data.cta)}
                        style={
                          idx + 1 === siteVisitors?.length
                            ? {}
                            : { borderBottom: '0.75px solid #334d6e33' }
                        }
                        className={styles.alignTop}
                      >
                        {data.visits}
                      </StyledTableCell>
                      <StyledTableCell
                        rowSpan={getRowSpan(data.assets, data.cta)}
                        className={styles.alignTop}
                        style={
                          idx + 1 === siteVisitors?.length
                            ? {}
                            : { borderBottom: '0.75px solid #334d6e33' }
                        }
                      >
                        {data.time_on_site}
                      </StyledTableCell>
                    </StyledTableRow>

                    {data.assets?.length > data.cta?.length || data.cta === null
                      ? data.assets?.map((rec, index) => (
                          <StyledTableRow
                            style={
                              index + 1 === data.assets?.length &&
                              idx + 1 !== siteVisitors?.length
                                ? { borderBottom: '0.75px solid #334d6e33' }
                                : {}
                            }
                          >
                            <StyledTableCell>
                              {(data.cta && data?.cta[index]?.name) || ''}
                            </StyledTableCell>
                            <StyledTableCell>
                              {(data.cta && data?.cta[index]?.is_completed) ||
                                ''}
                            </StyledTableCell>
                            <StyledTableCell>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                <img src={getFileIcon(rec?.type)} alt="mini" />
                                <span>{rec.name}</span>
                              </div>
                            </StyledTableCell>
                            <StyledTableCell>{rec.time}</StyledTableCell>
                          </StyledTableRow>
                        ))
                      : data.cta?.map((rec, index) => (
                          <StyledTableRow
                            style={
                              index + 1 === data.cta?.length &&
                              idx + 1 !== siteVisitors?.length
                                ? { borderBottom: '0.75px solid #334d6e33' }
                                : {}
                            }
                          >
                            <StyledTableCell>{rec?.name}</StyledTableCell>
                            <StyledTableCell>
                              {rec?.is_completed}
                            </StyledTableCell>
                            <StyledTableCell>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                {data?.assets && data.assets[index]?.name && (
                                  <img
                                    src={getFileIcon(rec?.type)}
                                    alt="mini"
                                  />
                                )}
                                <span>
                                  {(data?.assets && data.assets[index]?.name) ||
                                    ''}
                                </span>
                              </div>
                            </StyledTableCell>
                            <StyledTableCell>
                              {(data.assets && data?.assets[index]?.time) || ''}
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                  </>
                ))
              ) : (
                <StyledTableCell colSpan={9} className={styles.noResults}>
                  <div className={styles.noResults}>No records found</div>
                </StyledTableCell>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
export default SiteVisitors;
