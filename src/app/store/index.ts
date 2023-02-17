/* eslint-disable linebreak-style */
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { reducer as formReducer } from 'redux-form';

import signInReduer from '../views/SignIn/SignInSlice';
import signUpReducer from '../views/SignUp/SignUpSlice';
import createPartnershipReducer from '../views/CreatePartnership/CreatePartnerShipSlice';
import uploadAssetReducer from '../views/UploadAssets/UploadAssetSlice';
import assetCollectionReducer from '../views/AssetCollection/AssetCollectionSlice';
import salesHubReducer from '../views/SalesHub/SalesHubSlice';
import salesMotionReducer from '../views/SalesMotion/SalesMotionSlice';
import salesHubAccountReducer from '../views/SalesHubSite/SalesHubSiteSlice';
import campaignHubReducer from '../views/CampaignHub/CampaignHubSlice';
import accountEngagementsReducer from '../views/AccountsEngagements/AccountEngagementsSlice';
import previewPartnershipReducer from '../views/PreviewPartnership/PreviewPartnershipSlice';

const rootReducer = combineReducers({
  signInSlice: signInReduer,
  signUpSlice: signUpReducer,
  createPartnershipSlice: createPartnershipReducer,
  uploadAssetSlice: uploadAssetReducer,
  assetCollectionSlice: assetCollectionReducer,
  salesHubSlice: salesHubReducer,
  salesMotionSlice: salesMotionReducer,
  salesHubAccountSlice: salesHubAccountReducer,
  campaignHubSlice: campaignHubReducer,
  accountEngagementsSlice: accountEngagementsReducer,
  previewPartnershipSlice: previewPartnershipReducer,
  form: formReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export default store;
