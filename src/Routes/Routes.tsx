/* eslint-disable linebreak-style */
import { Switch, Redirect } from 'react-router-dom';

import AssetCollection from 'src/app/views/AssetCollection';
import SalesContacts from 'src/app/views/SalesContacts';
import SalesHubPreview from '../app/views/SalesHubPreview';
import RouteWithLayout from './RouteWithLayout';
import {
  Main as MainLayout,
  Minimal as MinimalLayout,
  Blank as BlankLayout,
} from '../app/layouts';
import AccountSetup from '../app/views/AccountSetup';
import CreatePartnership from '../app/views/CreatePartnership';
import Dashboard from '../app/views/Dashboard';
import SignIn from '../app/views/SignIn';
import ForgotPassword from '../app/views/ForgotPassword';
import ResetPassword from '../app/views/ResetPassword';
import VerifyEmail from '../app/views/VerifyEmail';
import SignUp from '../app/views/SignUp';
import Profile from '../app/views/Profile/Profile';
import PreviewPartnership from '../app/views/PreviewPartnership';
import SalesHub from '../app/views/SalesHub';
import SalesMotion from '../app/views/SalesMotion';
import PageNotFound from '../app/views/PageNotFound';
import UploadAssets from '../app/views/UploadAssets';
import MailVerification from '../app/views/MailVerification';
import SalesHubSite from '../app/views/SalesHubSite';
import AccountsEngagements from '../app/views/AccountsEngagements';
import Terms from '../app/views/TermsAndConditions';
import AcceptInvite from '../app/views/AcceptInvite';
import ProtectionWithLayout from './ProtectionWithLayout';

const Routes = () => (
  <Switch>
    <RouteWithLayout component={SignIn} exact layout={MinimalLayout} path="/" />
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
      component={SignUp}
      exact
      layout={MinimalLayout}
      path="/signUp"
    />
    <RouteWithLayout
      component={AcceptInvite}
      exact
      layout={MinimalLayout}
      path="/teamInviteVerification"
    />
    <ProtectionWithLayout
      component={Dashboard}
      exact
      layout={MainLayout}
      path="/dashboard"
    />
    <ProtectionWithLayout
      component={Profile}
      exact
      layout={MainLayout}
      path="/profile"
    />
    <ProtectionWithLayout
      component={PreviewPartnership}
      exact
      layout={MainLayout}
      path="/previewPartnership"
    />
    <ProtectionWithLayout
      component={AccountSetup}
      exact
      layout={MainLayout}
      path="/accountSetup"
    />
    <ProtectionWithLayout
      component={SalesHub}
      exact
      layout={MainLayout}
      path="/salesHub"
    />
    <ProtectionWithLayout
      component={SalesMotion}
      exact
      layout={MainLayout}
      path="/salesMotion"
    />
    <ProtectionWithLayout
      component={CreatePartnership}
      exact
      layout={MainLayout}
      path="/createPartnership"
    />
    <ProtectionWithLayout
      component={AssetCollection}
      exact
      layout={MainLayout}
      path="/assetCollection"
    />
    <ProtectionWithLayout
      component={UploadAssets}
      exact
      layout={MainLayout}
      path="/uploadAsset"
    />

    <ProtectionWithLayout
      component={SalesHubSite}
      exact
      layout={BlankLayout}
      path="/saleHubSite"
    />
    <ProtectionWithLayout
      component={SalesContacts}
      exact
      layout={MainLayout}
      path="/salesContacts"
    />
    <RouteWithLayout
      component={AccountsEngagements}
      exact
      layout={MainLayout}
      path="/accountsEngagements"
    />
    <ProtectionWithLayout
      component={SalesHubPreview}
      exact
      layout={BlankLayout}
      path="/salesHubPreview"
    />
    <RouteWithLayout
      component={Terms}
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
    {/* For CampaignHub */}
    <Redirect to="/not-found" />
  </Switch>
);

export default Routes;
