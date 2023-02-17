/* eslint-disable linebreak-style */
import { useState, useEffect } from 'react';
import { Switch, Redirect } from 'react-router-dom';
import Loader from 'src/app/components/Loader';
import { getRequest } from 'src/app/service';
import { useLocation } from 'react-router';
import RouteWithLayout from './RouteWithLayout';
import { Minimal as MinimalLayout, Blank as BlankLayout } from '../app/layouts';

import VerifyEmail from '../app/views/VerifyEmail';
import SignUp from '../app/views/SignUp';
import PageNotFound from '../app/views/PageNotFound';
import SignIn from '../app/views/SignIn';
import SalesHubSite from '../app/views/SalesHubSite';
import ForgotPassword from '../app/views/ForgotPassword';
import ResetPassword from '../app/views/ResetPassword';
import MailVerification from '../app/views/MailVerification';
import ViewAssets from '../app/views/ViewAssets/ViewAssets';
import TermsAndConditions from '../app/views/TermsAndConditions';
import ProtectionWithLayout from './ProtectionWithLayout';
import fav from '../FaviconSymbio.svg';

const SalesHubRoutes = () => {
  const location = useLocation();
  const [isAvailable, setIsAvailable] = useState(true);
  const [loading, setLoading] = useState(false);
  const subDomainCheck = () => {
    setLoading(true);
    let subDomain;
    if (window.location.hostname.split('.')[0] === 'localhost') {
      subDomain = 'testing';
    } else {
      subDomain = window.location.hostname.split('.')[0];
    }
    localStorage.setItem('subDomainName', subDomain);
    getRequest(
      `partnership/sales-hub/site/is-available/?subdomain=${subDomain}`
    ).then((resp: any) => {
      if (resp.result === true) {
        localStorage.setItem(
          'favIcon',
          `${resp.data.favicon}?time=${Date.now()}`
        );
        localStorage.setItem('title', resp.data.partnership_name);
        const favIcon: any = document.getElementById('favicon');
        favIcon.href = resp.data.favicon;
        const favTitle = document.getElementById('favtitle');
        favTitle.innerHTML = resp.data.partnership_name;
        setLoading(false);
        setIsAvailable(true);
      } else {
        setLoading(false);
        setIsAvailable(false);
        const favIcon: any = document.getElementById('favicon');
        favIcon.href = fav;
        const favTitle = document.getElementById('favtitle');
        favTitle.innerHTML = 'Symbio';
      }
    });
  };
  useEffect(() => {
    subDomainCheck();
  }, []);
  useEffect(() => {
    console.log('inside location use effect');
    subDomainCheck();
  }, [location]);
  return (
    <>
      {loading === true && <Loader />}
      <Switch>
        {isAvailable ? (
          <Switch>
            <RouteWithLayout
              component={VerifyEmail}
              exact
              layout={MinimalLayout}
              path="/verifyMail"
            />
            <RouteWithLayout
              component={MailVerification}
              exact
              layout={MinimalLayout}
              path="/emailVerification"
            />
            <RouteWithLayout
              component={ForgotPassword}
              exact
              layout={MinimalLayout}
              path="/forgotPassword"
            />
            <RouteWithLayout
              component={ResetPassword}
              exact
              layout={MinimalLayout}
              path="/resetPassword"
            />
            <RouteWithLayout
              component={SignUp}
              exact
              layout={MinimalLayout}
              path="/signUp"
            />
            <RouteWithLayout
              component={SignIn}
              exact
              layout={MinimalLayout}
              path="/"
            />
            <ProtectionWithLayout
              component={SalesHubSite}
              exact
              layout={BlankLayout}
              path="/home"
            />
            <ProtectionWithLayout
              component={ViewAssets}
              exact
              layout={BlankLayout}
              path="/viewAssets"
            />
            <RouteWithLayout
              component={TermsAndConditions}
              exact
              layout={BlankLayout}
              path="/terms"
            />
            <RouteWithLayout
              component={PageNotFound}
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

export default SalesHubRoutes;
