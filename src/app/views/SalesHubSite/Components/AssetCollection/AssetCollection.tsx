/* eslint-disable linebreak-style */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable linebreak-style */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable comma-dangle */
/* eslint-disable operator-linebreak */
/* eslint-disable indent */
import React from 'react';

import { IconButton, TableBody } from '@material-ui/core';
import { ManageAssetCollectionLabels } from 'src/strings';
import Table from '@mui/material/Table';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import styles from '../CreateAccount/CreateAccount.module.css';
import DownArrow from '../../../../components/Icons/PreviewPartnership/DownArrow.svg';

const AssetCollection = (props: any) => {
  const {
    formikValues,
    assetCollectData,
    assetCollectionShow,
    setAssetCollectionShow,
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
  const queryparams = new URLSearchParams(window.location.search);
  const salesHubAccountId: string =
    queryparams.get('sales_hub_account_id') || '0';

  return (
    <>
      <div
        className={`${styles.salesHubAccDropDown} ${
          !assetCollectionShow ? styles.salesHubAccDropDownGap : ''
        }`}
        onClickCapture={() => setAssetCollectionShow(!assetCollectionShow)}
      >
        Asset Collections
        <IconButton>
          <img
            className={styles.salesHubAccDownArrowImg}
            src={DownArrow}
            alt=""
          />
        </IconButton>
      </div>

      <div className={styles.generalFromMainDiv}>
        {assetCollectionShow ? (
          <div className={styles.manage_solution_narrative_mainContent}>
            <div className={styles.assetCollectTableWrap}>
              {formikValues.salesMotion !== '' ? (
                <>
                  {assetCollectData.length > 0 ? (
                    salesHubAccountId !== '0' ? (
                      <div className={styles.cardWrap}>
                        {assetCollectData.map((card) => (
                          <div
                            className={styles.bannerCard}
                            key={card.solution_narrative_id}
                          >
                            <img
                              src={
                                card?.image
                                  ? `${card?.image}?time=${Date.now()}`
                                  : card?.image
                              }
                              alt="Avatar"
                            />
                            <div className={styles.cardContainer}>
                            <h4>{card.name?.length > 25
                              ? `${card.name.slice(0, 25)}...`
                              : `${card.name.slice(0, 25)}`}
                           </h4>
                           <p>{card.description?.length > 150
                              ? `${card.description.slice(0, 150)}...`
                              : `${card.description.slice(0, 150)}`}
                           </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <TableContainer
                        component={Paper}
                        className={styles.solTable}
                      >
                        <Table
                          sx={{ minWidth: 700 }}
                          aria-label="customized table"
                        >
                          <TableHead>
                            <TableRow>
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
                            {assetCollectData.map((row) => (
                              <StyledTableRow key={row.solution_narrative_id}>
                                <StyledTableCell>
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <img
                                      src={
                                        row?.image
                                          ? `${row?.image}?time=${Date.now()}`
                                          : row?.image
                                      }
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
                                <StyledTableCell>
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
                    )
                  ) : (
                    <p className={styles.chooseTxt}>
                      {ManageAssetCollectionLabels.noSalesMotionMapped}
                    </p>
                  )}
                </>
              ) : (
                <p className={styles.chooseTxt}>
                  {ManageAssetCollectionLabels.viewAssetCollections}
                </p>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default AssetCollection;
