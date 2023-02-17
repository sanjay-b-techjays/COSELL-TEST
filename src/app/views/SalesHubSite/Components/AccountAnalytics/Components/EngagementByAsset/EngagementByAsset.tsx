/* eslint-disable no-nested-ternary */
/* eslint-disable linebreak-style */
/* eslint-disable operator-linebreak */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable linebreak-style */
import React, { useEffect } from 'react';
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
import { tableCellClasses } from '@mui/material';
import styles from '../../../CreateAccount/CreateAccount.module.css';
import '../../../CreateAccount/CreateAccount.css';
import wordIcon from '../../../../../../assets/word_mini_icon.svg';
import pdfIcon from '../../../../../../assets/pdf_mini_icon.svg';
import pptIcon from '../../../../../../assets/ppt_mini_icon.svg';
import excelIcon from '../../../../../../assets/excel_mini_icon.svg';
import videoIcon from '../../../../../../assets/video_mini_icon.svg';
import imageIcon from '../../../../../../assets/img_mini_icon.svg';
import othersIcon from '../../../../../../assets/others_mini_icon.svg';

const EngagementByAsset = (props) => {
  const { assetEngagement = [] } = props;
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
  return (
    <div className={styles.contentEngagementWrap}>
      <div className={styles.manageAccountWrap}>
        <div className={styles.manageAccLabel}>
          {createAccount.engagementByAsset}
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
                  {createAccount.assetName}
                </StyledTableCell>
                <StyledTableCell component="td">
                  {createAccount.timeOnAsset}
                </StyledTableCell>
                <StyledTableCell component="td">
                  {createAccount.uniqueViews}
                </StyledTableCell>
                <StyledTableCell component="td">
                  {createAccount.views}
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assetEngagement?.length > 0 ? (
                assetEngagement?.map((data: any) => (
                  <StyledTableRow key={data.asset_id}>
                    <StyledTableCell>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img
                          src={getFileIcon(data.asset_type)}
                          alt="mini"
                          style={{ marginRight: '10px' }}
                        />
                        <span>{data.assets_viewed}</span>
                      </div>
                    </StyledTableCell>
                    <StyledTableCell>{data.time_on_asset}</StyledTableCell>
                    <StyledTableCell>{data.unique_viewers}</StyledTableCell>
                    <StyledTableCell>{data.views}</StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <StyledTableCell colSpan={4} className={styles.noResults}>
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
export default EngagementByAsset;
