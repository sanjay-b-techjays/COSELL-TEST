/* eslint-disable linebreak-style */
import { Switch, Redirect } from 'react-router-dom';

import { useEffect, useState } from 'react';
import { getRequest } from 'src/app/service';
import Loader from 'src/app/components/Loader';
import RouteWithLayout from './RouteWithLayout';
import {
  Main as MainLayout,
  Minimal as MinimalLayout,
  Blank as BlankLayout,
} from '../app/layouts';
import CampaignHub from '../app/views/CampaignHub/CampaignHub';
import ViewAssetsCampaignHub from '../app/views/CampaignHubViewAssets/ViewAssetsCampaign';
import CTA from '../app/views/CTA';
import PageNotFound from '../app/views/PageNotFound';
import fav from '../FaviconSymbio.svg';

const CampaignRoutes = () => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [loading, setLoading] = useState(false);
  let subDomainName;
  let accName;
  if (window.location.hostname === 'localhost') {
    subDomainName = 'sshcl';
    accName = 'dell';
  } else {
    subDomainName = window.location.hostname.split('.')[0];
    accName = window.location.pathname.split('/')[1];
  }
  localStorage.setItem('subDomainName', subDomainName);
  localStorage.setItem('accountName', accName);

  const getValidUrl = (url = '') => {
    let newUrl = window.decodeURIComponent(url);
    newUrl = newUrl.trim().replace(/\s/g, '');

    if (/^(:\/\/)/.test(newUrl)) {
      return `http${newUrl}`;
    }
    if (!/^(f|ht)tps?:\/\//i.test(newUrl)) {
      return `http://${newUrl}`;
    }
    return newUrl;
  };

  useEffect(() => {
    console.log('inside campaignhub route useEffect');
    setLoading(true);
    getRequest(
      `partnership/sales-hub-account/site/is-available/?subdomain=${subDomainName}&campaign_hub_domain=${
        window.location.pathname.split('/')[1]
      }`,
      {}
    ).then((response: any) => {
      if (response.result === true) {
        localStorage.setItem(
          'favIcon',
          `${response.data.favicon}?time=${Date.now()}`
        );
        localStorage.setItem(
          'title',
          response.data.sales_hub_account_company_name
        );
        const favIcon: any = document.getElementById('favicon');
        const favTitle = document.getElementById('favtitle');
        favIcon.href = response.data.favicon;
        favTitle.innerHTML = response.data.sales_hub_account_company_name;
        setLoading(false);
        setIsAvailable(true);
      } else {
        const favIcon: any = document.getElementById('favicon');
        favIcon.href = fav;
        const favTitle = document.getElementById('favtitle');
        favTitle.innerHTML = 'Symbio';
        if (response.data?.data?.company_website) {
          console.log('inside if');
          const companyWebsiteUrl = getValidUrl(
            `${response.data.data.company_website}`
          );
          window.location.href = companyWebsiteUrl;
        } else {
          setIsAvailable(false);
          setLoading(false);
        }
      }
    });
  }, []);
  return (
    <>
      {loading === true && <Loader />}
      <Switch>
        {isAvailable ? (
          <Switch>
            <RouteWithLayout
              component={CTA}
              exact
              layout={BlankLayout}
              path={`/${accName}/cta`}
            />
            <RouteWithLayout
              component={ViewAssetsCampaignHub}
              exact
              layout={BlankLayout}
              path={`/${accName}/viewAssets`}
            />
            <RouteWithLayout
              component={CampaignHub}
              exact
              layout={BlankLayout}
              path="*"
            />
            <Redirect to="/not-found" />
          </Switch>
        ) : (
          <RouteWithLayout
            component={PageNotFound}
            exact
            layout={BlankLayout}
            path="*"
          />
        )}
      </Switch>
    </>
  );
};

export default CampaignRoutes;
