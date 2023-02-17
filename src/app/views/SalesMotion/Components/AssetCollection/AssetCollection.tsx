/* eslint-disable no-nested-ternary */
/* eslint-disable function-paren-newline */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable linebreak-style */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable comma-dangle */
/* eslint-disable operator-linebreak */
/* eslint-disable indent */
import { useState } from 'react';
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
import { IconButton, Checkbox, TableBody } from '@material-ui/core';
import { ManageAssetCollectionLabels } from 'src/strings';
import Table from '@mui/material/Table';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import reOrderIcon from 'src/app/assets/drag_icon.svg';
import PrimaryButton from 'src/app/components/Button/PrimaryButton';
import DownArrow from '../../../../components/Icons/PreviewPartnership/DownArrow.svg';
import styles from '../../SalesMotion.module.css';

const AssetCollection = (props: any) => {
  const {
    selected,
    setSelected,
    assetCollectData,
    offset,
    limit,
    count,
    fetchAllAssetCollectData,
    setAssetCollectData,
    assetCollectionShow,
    setAssetCollectionShow,
    actionType,
    setIsFormEdited,
  } = props;
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

  const [showAssetCollectionList, setshowAssetCollectionList] = useState(false);

  const handleGetAssetCollectData = (e, data) => {
    fetchAllAssetCollectData((data - 1) * limit, '');
  };
  const handleCheckboxClick = (event: any, id: number) => {
    event.stopPropagation();
    setIsFormEdited(true);
    const selectedIndex = selected.indexOf(id);
    console.log(selectedIndex, 'selectedIndex');
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
  const showList =
    actionType.action === 'UPDATE'
      ? actionType.dataLength > 0
        ? true
        : showAssetCollectionList
      : showAssetCollectionList;

  const handleDragEnd = (result: DropResult, provided?: ResponderProvided) => {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }
    const removedObj = assetCollectData[result.source.index];
    assetCollectData.splice(result.source.index, 1);
    assetCollectData.splice(result.destination.index, 0, removedObj);
    const arrangedData = assetCollectData.filter((tempData: any) =>
      selected.includes(tempData.solution_narrative_id)
    );
    const selectedIds = arrangedData.map((data) => data.solution_narrative_id);

    setSelected(selectedIds);
    setAssetCollectData(assetCollectData);
    setIsFormEdited(true);
  };

  return (
    <>
      <div
        className={styles.salesMotionDropDownButton}
        onClickCapture={() => setAssetCollectionShow(!assetCollectionShow)}
      >
        Asset Collections
        <IconButton>
          <img src={DownArrow} alt="" />
        </IconButton>
      </div>

      <div className={styles.generalFromMainDiv}>
        {assetCollectionShow &&
          (showList ? (
            <div className={styles.manage_solution_narrative_mainContent}>
              <div className={styles.manage_solution_narrative_content}>
                <TableContainer component={Paper} className={styles.solTable}>
                  <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell />
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
                    <DragDropContext onDragEnd={handleDragEnd}>
                      <Droppable droppableId="droppable" direction="vertical">
                        {(droppableProvided: DroppableProvided) => (
                          <TableBody
                            ref={droppableProvided.innerRef}
                            {...droppableProvided.droppableProps}
                          >
                            {assetCollectData.length > 0 &&
                              assetCollectData.map((row, index) => (
                                <Draggable
                                  key={row.solution_narrative_id}
                                  draggableId={row.solution_narrative_id.toString()}
                                  index={index}
                                >
                                  {(
                                    draggableProvided: DraggableProvided,
                                    snapshot: DraggableStateSnapshot
                                  ) => (
                                    <StyledTableRow
                                      ref={draggableProvided.innerRef}
                                      {...draggableProvided.draggableProps}
                                      style={{
                                        ...draggableProvided.draggableProps
                                          .style,
                                        background: snapshot.isDragging
                                          ? 'rgba(245,245,245, 0.75)'
                                          : 'none',
                                      }}
                                      key={row.solution_narrative_id}
                                    >
                                      <StyledTableCell align="left">
                                        <div
                                          {...draggableProvided.dragHandleProps}
                                        >
                                          {/* <ReorderIcon /> */}
                                          <img
                                            src={reOrderIcon}
                                            alt=""
                                            style={{ marginLeft: '15px' }}
                                          />
                                        </div>
                                      </StyledTableCell>
                                      <StyledTableCell
                                        component="th"
                                        scope="row"
                                      >
                                        <Checkbox
                                          className={
                                            selected.includes(
                                              row.solution_narrative_id
                                            )
                                              ? styles.customBox
                                              : ''
                                          }
                                          checked={
                                            selected.length > 0
                                              ? selected.includes(
                                                  row.solution_narrative_id
                                                )
                                              : false
                                          }
                                          onClick={(e) =>
                                            handleCheckboxClick(
                                              e,
                                              row.solution_narrative_id
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
                                              borderRadius: '10px',
                                              marginRight: '15px',
                                            }}
                                          />
                                          {row.name}
                                        </div>
                                      </StyledTableCell>
                                      <StyledTableCell
                                        style={{ textAlign: 'center' }}
                                      >
                                        {row.asset_count}
                                      </StyledTableCell>
                                      <StyledTableCell>
                                        {' '}
                                        <div className={styles.chipsWrap}>
                                          {row.tags.map(
                                            (li: string, idx: number) => (
                                              <span
                                                className={styles.tagChip}
                                                key={`${idx + 1}+${li}`}
                                              >
                                                {li}
                                              </span>
                                            )
                                          )}
                                        </div>
                                      </StyledTableCell>
                                    </StyledTableRow>
                                  )}
                                </Draggable>
                              ))}
                            {droppableProvided.placeholder}
                          </TableBody>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </Table>
                </TableContainer>
              </div>
              {count > limit && (
                <Stack spacing={2} className={styles.paginationWrap}>
                  <Pagination
                    count={Math.ceil(count / limit)}
                    shape="rounded"
                    onChange={(e, data) => handleGetAssetCollectData(e, data)}
                  />
                </Stack>
              )}
            </div>
          ) : (
            <div
              className={styles.manage_solution_narratives_nocontent_container}
            >
              <PrimaryButton
                style={{ alignSelf: 'flex-end' }}
                onClick={() => setshowAssetCollectionList((prev) => !prev)}
              >
                Add Asset Collection
              </PrimaryButton>
              <div>No Asset Collections mapped to the Sales Motion</div>
            </div>
          ))}
      </div>
    </>
  );
};

export default AssetCollection;
