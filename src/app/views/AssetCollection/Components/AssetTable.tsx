/* eslint-disable space-in-parens */
/* eslint-disable no-mixed-operators */
/* eslint-disable function-paren-newline */
/* eslint-disable indent */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable comma-dangle */
/* eslint-disable linebreak-style */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable object-curly-newline */
/* eslint-disable operator-linebreak */
/* eslint-disable react/jsx-no-undef */
import React, { useEffect, useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  ResponderProvided,
  DraggableProvided,
  DroppableProvided,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';
import ReorderIcon from '@material-ui/icons/Reorder';
import { TableBody, Checkbox, styled, TableCell } from '@material-ui/core';

import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Table from '@mui/material/Table';

import Paper from '@mui/material/Paper';
import { tableCellClasses } from '@mui/material';
import { uploadAssetsLabels } from 'src/strings';
import { useDispatch, useSelector } from 'react-redux';
import reOrderIcon from '../../../assets/drag_icon.svg';
import styles from './AssetTable.module.css';
import {
  selectAssetCollectionResponse,
  setAssetInfo,
  setSelectedAssets,
  setSelectedAssetsIds,
} from '../AssetCollectionSlice';
import { AssetCollectionAssetInfo } from '../types';

import pdfIcon from '../../../assets/pdf_mini.svg';
import pptIcon from '../../../assets/ppt_mini.svg';
import imageIcon from '../../../assets/img_mini.svg';
import videoIcon from '../../../assets/video_mini.svg';
import wordIcon from '../../../assets/word_mini.svg';
import excelIcon from '../../../assets/excel_mini.svg';
import othersIcon from '../../../assets/others_preview.svg';

const AssetTable = (props: any) => {
  const { assetData } = props;

  const dispatch = useDispatch();
  const [partnershipId, setPartnershipId] = useState('');

  const assetCollectionStoreData = useSelector(selectAssetCollectionResponse);
  // assetCollectionStoreData.selectedAssetsIds
  assetCollectionStoreData.selectedAssets;

  const handleCheckboxClick = (
    event: any,
    id: number,
    row: any // type create
  ) => {
    event.stopPropagation();
    const selectedIndex =
      assetCollectionStoreData.selectedAssetsIds.indexOf(id);
    const selectedAssetIndex =
      assetCollectionStoreData.selectedAssets.findIndex(
        (x) => x.asset_id === id
      );
    let newSelected: any[] = [];
    let newSelectedAssetCollect: any[] = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(
        assetCollectionStoreData.selectedAssetsIds,
        id
      );
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(
        assetCollectionStoreData.selectedAssetsIds.slice(1)
      );
    } else if (
      selectedIndex ===
      assetCollectionStoreData.selectedAssetsIds.length - 1
    ) {
      newSelected = newSelected.concat(
        assetCollectionStoreData.selectedAssetsIds.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        assetCollectionStoreData.selectedAssetsIds.slice(0, selectedIndex),
        assetCollectionStoreData.selectedAssetsIds.slice(selectedIndex + 1)
      );
    }

    if (selectedAssetIndex === -1) {
      newSelectedAssetCollect = newSelectedAssetCollect.concat(
        assetCollectionStoreData.selectedAssets,
        row
      );
    } else if (selectedAssetIndex === 0) {
      newSelectedAssetCollect = newSelectedAssetCollect.concat(
        assetCollectionStoreData.selectedAssets.slice(1)
      );
    } else if (
      selectedAssetIndex ===
      assetCollectionStoreData.selectedAssetsIds.length - 1
    ) {
      newSelectedAssetCollect = newSelectedAssetCollect.concat(
        assetCollectionStoreData.selectedAssets.slice(0, -1)
      );
    } else if (selectedAssetIndex > 0) {
      newSelectedAssetCollect = newSelectedAssetCollect.concat(
        assetCollectionStoreData.selectedAssets.slice(0, selectedAssetIndex),
        assetCollectionStoreData.selectedAssets.slice(selectedAssetIndex + 1)
      );
    }
    dispatch(
      setSelectedAssets({
        selectedAssets: newSelectedAssetCollect,
      })
    );
    dispatch(
      setSelectedAssetsIds({
        selectedAssetsIds: newSelected,
      })
    );
  };

  const handleSelectAllClick = (event: any) => {
    if (event.target.checked) {
      const selectedData = assetData.map((data: any) => data.asset_id);
      dispatch(
        setSelectedAssetsIds({
          selectedAssetsIds: Array.from(
            new Set([
              ...assetCollectionStoreData.selectedAssetsIds,
              ...selectedData,
            ])
          ),
        })
      );
      dispatch(
        setSelectedAssets({
          selectedAssets: Array.from(
            new Set([...assetCollectionStoreData.selectedAssets, ...assetData])
          ),
        })
      );

      return;
    }
    const deselectAll = assetCollectionStoreData.selectedAssets.filter(
      (data: any) =>
        assetData.filter((d: any) => data.asset_id === d.asset_id).length === 0
    );
    const updatedSNId = deselectAll.map((d: any) => d.asset_id);
    dispatch(
      setSelectedAssetsIds({
        selectedAssetsIds: updatedSNId,
      })
    );
    dispatch(
      setSelectedAssets({
        selectedAssets: deselectAll,
      })
    );
  };

  useEffect(() => {
    const queryparams = new URLSearchParams(window.location.search);
    const partnershipID: string = queryparams.get('partner_id') || '0';
    setPartnershipId(partnershipID);
  }, []);
  const getDocIcon = (docType: string) => {
    let src = '';
    switch (docType) {
      case 'pdf':
      case 'Pdf':
        src = pdfIcon;
        break;
      case 'ppt':
      case 'pptx':
      case 'Powerpoint':
        src = pptIcon;
        break;
      case 'Video':
      case 'mp4':
      case 'mkv':
      case 'MP4':
      case 'webm':
      case 'MOV':
      case 'mov':
      case 'avi':
        src = videoIcon;
        break;
      case 'PNG':
      case 'png':
      case 'jpg':
      case 'gif':
      case 'Image':
      case 'jpeg':
      case 'webp':
      case 'jfif':
      case 'svg':
        src = imageIcon;
        break;
      case 'Word':
      case 'word':
      case 'docx':
      case 'doc':
        src = wordIcon;
        break;
      case 'Excel':
      case 'xlsx':
      case 'xls':
      case 'csv':
        src = excelIcon;
        break;
      default:
        src = othersIcon;
    }
    return src;
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
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));
  return (
    <TableContainer component={Paper}>
      <Table
        sx={{ minWidth: 350 }}
        aria-label="customized table"
        className={styles.assetTable}
      >
        <TableHead>
          <TableRow>
            <StyledTableCell>
              <Checkbox
                // className={
                //   assetCollectionStoreData.assetInfo.length ===
                //   assetCollectionStoreData.assetInfo.filter(
                //     (s) => s.is_selected === true
                //   ).length
                //     ? styles.assetCheckBox
                //     : ''
                // }
                checked={
                  assetData.length > 0 &&
                  assetData.length ===
                    assetData.filter((d: any) =>
                      assetCollectionStoreData.selectedAssetsIds.includes(
                        d.asset_id
                      )
                    ).length
                }
                className={
                  assetData.length > 0 &&
                  assetData.length ===
                    assetData.filter((d: any) =>
                      assetCollectionStoreData.selectedAssetsIds.includes(
                        d.asset_id
                      )
                    ).length
                    ? styles.assetCheckBox
                    : ''
                }
                onChange={(e) => handleSelectAllClick(e)}
              />
            </StyledTableCell>
            <StyledTableCell />
            {/* {console.log(
              assetData.length,
              assetData.filter((d: any) =>
                selectedAssetCollectId.includes(d.asset_id)
              ).length,
              selectedAssetCollectId,
              'xfdsf'
            )} */}
            <StyledTableCell>{uploadAssetsLabels.name}</StyledTableCell>
            {/* <StyledTableCell>{uploadAssetsLabels.docType}</StyledTableCell> */}
            <StyledTableCell>{uploadAssetsLabels.accessType}</StyledTableCell>
            <StyledTableCell>{uploadAssetsLabels.tags}</StyledTableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {assetData.length > 0 ? (
            assetData.map((row: AssetCollectionAssetInfo, index: number) => (
              <StyledTableRow key={row.asset_id}>
                <StyledTableCell component="td" className={styles.checkBoxTd}>
                  <Checkbox
                    className={
                      assetCollectionStoreData.selectedAssetsIds.length > 0 &&
                      assetCollectionStoreData.selectedAssetsIds.includes(
                        row.asset_id
                      )
                        ? styles.assetCheckBox
                        : ''
                    }
                    checked={
                      assetCollectionStoreData.selectedAssetsIds.length > 0
                        ? assetCollectionStoreData.selectedAssetsIds.includes(
                            row.asset_id
                          )
                        : false
                    }
                    onClick={(e) => handleCheckboxClick(e, row.asset_id, row)}
                  />
                </StyledTableCell>
                <StyledTableCell align="center">
                  <div>
                    <img src={getDocIcon(row.file.split('.').pop())} alt="" />
                  </div>
                </StyledTableCell>
                <StyledTableCell>{row.asset_name}</StyledTableCell>
                {/* <StyledTableCell>
                              <div className={styles.docTypeCell}>
                                <img src={getDocIcon(row.file_type)} alt="" />
                                <span>{row.file_type}</span>
                              </div>
                            </StyledTableCell> */}
                <StyledTableCell>{row.access_type}</StyledTableCell>
                <StyledTableCell>
                  <div className={styles.chipsWrap}>
                    {row.tags.map((li: string, idx: number) => (
                      <span className={styles.tagChip} key={`${idx + 1}+${li}`}>
                        {li}
                      </span>
                    ))}
                  </div>
                </StyledTableCell>
              </StyledTableRow>
            ))
          ) : (
            <StyledTableCell colSpan={6} className={styles.noResults}>
              No records found
            </StyledTableCell>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default AssetTable;
