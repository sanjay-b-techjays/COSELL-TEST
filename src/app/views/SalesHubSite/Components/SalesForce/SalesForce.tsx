/* eslint-disable linebreak-style */
/* eslint-disable implicit-arrow-linebreak */
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  Checkbox,
  TableBody,
  styled,
  TableCell,
} from '@material-ui/core';
import { tableCellClasses } from '@mui/material';
import { useEffect, useState } from 'react';
import DialogBox from 'src/app/components/DialogBox';
import { AccountsEngagementsLabels, createAccount } from 'src/strings';

import PrimaryButton from 'src/app/components/Button/PrimaryButton';
// import closeIcon from '../../assets/closeIcon.svg';
import closeIcon from 'src/app/assets/closeIcon.svg';
import { getRequest, postRequest } from 'src/app/service';
import styles from './SalesForce.module.css';
import { format } from 'date-fns';
import Loader from 'src/app/components/Loader';
import { useHistory } from 'react-router-dom';

const queryparams = new URLSearchParams(window.location.search);
const salesHubAccountId: string =
  queryparams.get('sales_hub_account_id') || '0';
const partnershipID: string = queryparams.get('partner_id') || '0';

const SalesForce = (props: any) => {
  const {
    selectedSalesForceIds = [],
    setSelectedSalesForceIds,
    isOpen,
    loading,
    setAlert,
    fetchSalesOpportunityList,
    companyName,
  } = props;
  console.log(selectedSalesForceIds, 'selectedSalesForceIds');
  const [salesForceList, setSalesForceList] = useState([]);
  const [salesForceModalShow, setSalesForceModalShow] = useState(isOpen);
  const [importSaleForce, setImportSaleForce] = useState([]);
  const [checkAmount, setCheckAmount] = useState(false);
  const [searchName, setSearchName] = useState('');
  const handleCancel = () => {
    setSalesForceModalShow(false);
    const domainName = window.location.hostname.split('.');
    let path;
    if (domainName[0] === 'portal') {
      path = 'accountsEngagements';
    } else {
      path = 'home';
    }
    history.push(
      `/${path}?partner_id=${partnershipID}&sales_hub_account_id=${salesHubAccountId}`
    );
  };
  const history = useHistory();
  const handleImport = () => {
    const opportunitiesMapped =
      importSaleForce.length > 0 &&
      importSaleForce.map((data: any) => {
        const assetObj = {} as any;
        assetObj.opportunity_name = data.Name;
        assetObj.sales_stage = data.StageName;
        assetObj.estimated_close_date = format(
          new Date(data.CloseDate),
          'MM/dd/yyyy'
        );
        assetObj.estimate_deal_amount = data.Amount;
        return assetObj;
      });
    const payload = {
      is_store_estimated_deal_amount: checkAmount,
      sales_hub_accout_id: salesHubAccountId,
      opportunities: opportunitiesMapped || [],
    };
    console.log('importSaleForce', payload);
    const token = localStorage.getItem('token');
    postRequest(
      `partnership/sales-hub-account/sales-opportunity/salesforce/opportunities/`,
      payload,
      {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      }
    ).then((resp: any) => {
      console.log(resp);
      if (resp.result === true) {
        setSalesForceModalShow(false);
        fetchSalesOpportunityList();
        const domainName = window.location.hostname.split('.');
        let path;
        if (domainName[0] === 'portal') {
          path = 'accountsEngagements';
        } else {
          path = 'home';
        }
        history.push(
          `/${path}?partner_id=${partnershipID}&sales_hub_account_id=${salesHubAccountId}`
        );
        setAlert('Sales Opportunities Imported Sucessfully!', 'success');
      } else {
        setAlert(resp.data.msg, 'error');
      }
    });
  };

  useEffect(() => {
    setSearchName(companyName);
    // console.log("companyName", companyName)
    getsfData(companyName);
  }, [companyName]);

  console.log('companyName', companyName, searchName);

  const getsfData = (accountName) => {
    const token = localStorage.getItem('token');
    const sftoken = localStorage.getItem('sftoken');
    const sfurl = localStorage.getItem('sfurl');
    if (accountName !== '') {
      getRequest(
        `/partnership/sales-hub-account/sales-opportunity/salesforce/opportunities/?access_token=${sftoken}&instance_url=${sfurl}&account_name=${accountName}`,
        { Authorization: `Token ${token}` }
      ).then((resp: any) => {
        console.log('salsesForce', resp.data);
        if (resp.data.done === true) {
          setSalesForceList(resp.data.records);
        }
      });
    }
  };

  const handleSelectAllClick = (event: any) => {
    if (event.target.checked) {
      const selectedData = salesForceList.map((data: any) => data.Id);
      setSelectedSalesForceIds(
        Array.from(new Set([...selectedSalesForceIds, ...selectedData]))
      );
      const salesForceMapped = salesForceList.map((data: any) => data);
      const salesForceFilter = salesForceMapped.filter((data: any) =>
        selectedData.includes(data.Id)
      );
      console.log('salesForceFilter', salesForceFilter);
      setImportSaleForce(salesForceFilter);
      return;
    }

    const selectedData = salesForceList.map((data: any) => data.Id);
    const value = selectedSalesForceIds.filter(
      (s: any) => !selectedData.includes(s)
    );
    setSelectedSalesForceIds(value);

    setImportSaleForce([]);
    console.log('salesForceFilter', value);
  };
  const handleCheckboxClick = (event: any, id: string) => {
    event.stopPropagation();
    const selectedIndex = selectedSalesForceIds.indexOf(id);
    let newSelected: any[] = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedSalesForceIds, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedSalesForceIds.slice(1));
    } else if (selectedIndex === selectedSalesForceIds.length - 1) {
      newSelected = newSelected.concat(selectedSalesForceIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedSalesForceIds.slice(0, selectedIndex),
        selectedSalesForceIds.slice(selectedIndex + 1)
      );
    }
    setSelectedSalesForceIds(newSelected);
    const salesForceMapped = salesForceList.map((data: any) => data);
    const salesForceFilter = salesForceMapped.filter((data: any) =>
      newSelected.includes(data.Id)
    );
    setImportSaleForce(salesForceFilter);
    console.log('salesForceFilter', salesForceFilter);
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

  const closeHandler = () => {
    setSalesForceModalShow(false);
  };

  const handleSearch = () => {
    getsfData(searchName);
  };

  const close = (
    <>
      <div className={styles.closeWrap}>
        <img
          className={styles.closeIcon}
          onClickCapture={handleCancel}
          src={closeIcon}
          alt="close"
        />
      </div>
    </>
  );

  const search = (
    <>
      {close}
      <div className={styles.inputWrap}>
        <form>
          <input
            type="text"
            name="name"
            placeholder="Search"
            className={`${styles.searchbar} search`}
            onChange={(e) => setSearchName(e.target.value)}
            value={searchName}
          />
        </form>
        <PrimaryButton
          style={{ marginRight: '25%' }}
          onClick={(e) => handleSearch()}
        >
          Search
        </PrimaryButton>
      </div>
    </>
  );

  const table = (
    <>
      <TableContainer className={styles.accTeamTable}>
        <Table aria-label="customized table" className={styles.accountTable}>
          <TableHead>
            <TableRow>
              <StyledTableCell>
                <Checkbox
                  className={
                    salesForceList.length > 0 &&
                    salesForceList.filter((s: any) =>
                      selectedSalesForceIds.includes(s.Id)
                    ).length === salesForceList.length
                      ? styles.accountCheckBox
                      : ''
                  }
                  checked={
                    salesForceList.length > 0 &&
                    salesForceList.length ===
                      salesForceList.filter((s: any) =>
                        selectedSalesForceIds.includes(s.Id)
                      ).length
                  }
                  onChange={(e) => handleSelectAllClick(e)}
                />
              </StyledTableCell>
              <StyledTableCell>{createAccount.opportunityName}</StyledTableCell>
              <StyledTableCell>{createAccount.salesStage}</StyledTableCell>
              <StyledTableCell>{createAccount.createdDate}</StyledTableCell>
              <StyledTableCell>
                {createAccount.estimatedCloseDate}
              </StyledTableCell>
              <StyledTableCell className={styles.dealAmtCheckBox}>
                <Checkbox
                  checked={checkAmount}
                  className={checkAmount ? styles.accountCheckBox : ''}
                  onChange={(e) => setCheckAmount(!checkAmount)}
                />
                {createAccount.estimatedDealAmount}
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {salesForceList.length > 0 ? (
              salesForceList.map((data: any) => (
                <StyledTableRow key={data.Id}>
                  <StyledTableCell component="td">
                    <Checkbox
                      checked={
                        selectedSalesForceIds.length > 0
                          ? selectedSalesForceIds.includes(data.Id)
                          : false
                      }
                      className={
                        selectedSalesForceIds.length > 0 &&
                        selectedSalesForceIds.includes(data.Id)
                          ? styles.accountCheckBox
                          : ''
                      }
                      onClick={(e) => handleCheckboxClick(e, data.Id)}
                    />
                  </StyledTableCell>
                  <StyledTableCell>{data.Name}</StyledTableCell>
                  <StyledTableCell>{data.StageName}</StyledTableCell>
                  <StyledTableCell>-</StyledTableCell>
                  <StyledTableCell>
                    {format(new Date(data.CloseDate), 'MM/dd/yyyy')}
                  </StyledTableCell>
                  <StyledTableCell>{`$${data.Amount}`}</StyledTableCell>
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
      {loading === true && <Loader />}
    </>
  );

  return (
    <>
      <DialogBox
        title="Import Sales Opportunity"
        primaryContent={search}
        secondaryContent={table}
        secondaryButton="Cancel"
        primaryButton="import"
        show={salesForceModalShow}
        handleDialogBoxClose={handleCancel}
        handleAgree={() => handleImport()}
        fullScreen
        btnAlign
      />
    </>
  );
};

export default SalesForce;
