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
import { getRequest } from 'src/app/service';
import SnackbarAlert from 'src/app/components/Snackbar/Snackbar';
import { Alert } from '../../types';
import ContentEngagement from './Components/ContentEngagement';
import EngagementByAsset from './Components/EngagementByAsset';
import SalesOpportunities from './Components/SalesOpportunities';
import SiteVisitors from './Components/SiteVisitors';

const AccountAnalytics = (props: any) => {
  const {
    showAddSalesOpportunity,
    setShowAddSalesOpportunity,
    setLoading,
    clearLoading,
    fetchSalesOpportunityList,
    salesOpportunityList,
    setIsDataAvail,
  } = props;
  const [assetEngagement, setAssetEngagement] = useState([]);
  const [contentEngagement, setContentEngagement] = useState({});
  const [siteVisitors, setSiteVisitors] = useState([]);
  const [companyName, setCompanyName] = useState('');
  const [alert, setAlert] = useState({
    showAlert: false,
    severity: '',
    message: '',
  });
  const queryparams = new URLSearchParams(window.location.search);
  const partnershipId: string = queryparams.get('partner_id') || '0';
  const salesHubAccountId: string =
    queryparams.get('sales_hub_account_id') || '0';
  const fetchSalesHubAccountDetailById = () => {
    setLoading();
    const token = localStorage.getItem('token');
    getRequest(
      `partnership/sales-hub-account/?partnership_id=${partnershipId}&sales_hub_account_id=${salesHubAccountId}`,
      {
        Authorization: `Token ${token}`,
      }
    )
      .then((response: any) => {
        if (response.result === true) {
          setCompanyName(response.data.company_name);
        }
      })
      .finally(() => clearLoading());
  };
  const fetchAnalyticsData = () => {
    const token = localStorage.getItem('token');
    getRequest(
      `partnership/sales-hub-account/analytics/?sales_hub_account_id=${salesHubAccountId}`,
      {
        Authorization: `Token ${token}`,
      }
    ).then((resp: any) => {
      if (resp.result === true) {
        const resData = resp.data;
        if (resp.data) {
          setAssetEngagement(resp.data.asset_engagement);
          const contentEngData = {
            siteSessions: resp.data.content_engagement.site_sessions,
            uniqueVisitors: resp.data.content_engagement.unique_visitors,
            totalSiteTime: resp.data.content_engagement.total_site_time,
            averageSessionTime:
              resp.data.content_engagement.average_session_time,
            ctaPageViews: resp.data.content_engagement.cta_page_views,
            ctaCompletion: resp.data.content_engagement.cta_completion,
            totalAssetsViewed: resp.data.content_engagement.total_assets_viewed,
            knownContacts: resp.data.content_engagement.known_contacts,
          };
          setContentEngagement(contentEngData);
          setSiteVisitors(resp.data.site_visitors);
          if (
            resp.data.asset_engagement?.length > 0 ||
            resp.data.site_visitors?.length > 0 ||
            salesOpportunityList?.length > 0
          ) {
            setIsDataAvail(true);
          } else {
            setIsDataAvail(false);
          }
        }
      }
    });
  };
  useEffect(() => {
    if (salesHubAccountId !== '0') {
      fetchAnalyticsData();
      fetchSalesHubAccountDetailById();
    }
  }, []);

  useEffect(() => {
    fetchAnalyticsData();
  }, [salesOpportunityList]);

  return (
    <>
      <div>
        <SalesOpportunities
          salesOpportunityList={salesOpportunityList}
          fetchSalesOpportunityList={fetchSalesOpportunityList}
          setShowAddSalesOpportunity={setShowAddSalesOpportunity}
          showAddSalesOpportunity={showAddSalesOpportunity}
          setLoader={setLoading}
          clearLoader={clearLoading}
          companyName={companyName}
          setAlert={(msg: string, status: string) =>
            setAlert((prevState: Alert) => ({
              ...prevState,
              showAlert: true,
              message: msg,
              severity: status,
            }))
          }
        />
        <ContentEngagement contentEngagement={contentEngagement} />
        <EngagementByAsset assetEngagement={assetEngagement} />
        <SiteVisitors
          siteVisitors={siteVisitors}
          salesHubAccountId={salesHubAccountId}
        />
      </div>
      {alert.showAlert && (
        <SnackbarAlert
          severity={alert.severity}
          handler={() => {
            setAlert((prevState: any) => ({
              ...prevState,
              showAlert: false,
            }));
          }}
          showalert={alert.showAlert}
          message={alert.message}
        />
      )}
    </>
  );
};
export default AccountAnalytics;
