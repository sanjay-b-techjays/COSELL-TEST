/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable linebreak-style */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router-dom';
import { getRequest } from 'src/app/service';
import Loader from 'src/app/components/Loader';
import addPartnership from '../../assets/carbon_add-alt.svg';
import cloudUpload from '../../assets/bi_cloud-upload.svg';
import createIcon from '../../assets/gridicons_create.svg';
import settingsIcon from '../../assets/settings.svg';
import campaignsIcon from '../../assets/Campaigns.svg';
import targetIcon from '../../assets/target.svg';
import tickIcon from '../../assets/green_tick.svg';
import { AccountSetupLabels } from '../../../strings';
import './accountSetup.css';
import PrimaryButton from '../../components/Button/PrimaryButton';

const AccountSetup = () => {
  const history = useHistory();

  const [activeStep, setActiveStep] = useState(
    AccountSetupLabels.addPartnershipButtonLabel
  );
  const [loading, setLoading] = useState(false);
  const [accountContents, setAccountContents] = useState([]);
  const location = useLocation();

  const getPartnerships = () => {
    const token = localStorage.getItem('token');
    const headerData = {
      Authorization: `Token ${token}`,
    };
    getRequest('partnership/?', headerData).then((resp: any) => {
      if (resp) {
        const resData = resp.data;
        const lastCreatedPartnershipId = resData[0].partnership_id;
        history.push(`/accountSetup?partner_id=${lastCreatedPartnershipId}`);
      }
    });
  };

  useEffect(() => {
    const queryparams = new URLSearchParams(window.location.search);
    const partnershipID: string = queryparams.get('partner_id') || '0';
    if (partnershipID === '0') {
      getPartnerships();
    } else {
      getPartnershipInfo(partnershipID);
    }
  }, []);

  useEffect(() => {
    const queryparams = new URLSearchParams(window.location.search);
    const partnershipID: string = queryparams.get('partner_id') || '0';
    getPartnershipInfo(partnershipID);
  }, [location]);

  const getPartnershipInfo = (partnershipId: string) => {
    var accountSetupContents = [
      {
        icon: addPartnership,
        title: AccountSetupLabels.addPartnership,
        description: AccountSetupLabels.addPartnershipDescription,
        buttonLabel: AccountSetupLabels.addPartnershipButtonLabel,
        isCompleted: false,
        disabled: true,
      },
      {
        icon: cloudUpload,
        title: AccountSetupLabels.uploadAssets,
        description: AccountSetupLabels.uploadAssetsDescription,
        buttonLabel: AccountSetupLabels.uploadAssetsButtonLabel,
        isCompleted: false,
        disabled: true,
      },
      {
        icon: createIcon,
        title: AccountSetupLabels.createAssetCollection,
        description: AccountSetupLabels.createAssetCollectionDescription,
        buttonLabel: AccountSetupLabels.createAssetCollectionButtonLabel,
        isCompleted: false,
        disabled: true,
      },
      {
        icon: settingsIcon,
        title: AccountSetupLabels.configureSalesHub,
        description: AccountSetupLabels.configureSalesHubDescription,
        buttonLabel: AccountSetupLabels.configureSalesHubButtonLabel,
        isCompleted: false,
        disabled: true,
      },
      {
        icon: campaignsIcon,
        title: AccountSetupLabels.createSalesMotion,
        description: AccountSetupLabels.createABMCampaignDescription,
        buttonLabel: AccountSetupLabels.createSalesMotionButtonLabel,
        isCompleted: false,
        disabled: true,
      },
      {
        icon: targetIcon,
        title: AccountSetupLabels.accountEngagement,
        description: AccountSetupLabels.accountTargetDescription,
        buttonLabel: AccountSetupLabels.accountEngagementButtonLabel,
        isCompleted: false,
        disabled: true,
      },
    ];
    setLoading(true);
    const token = localStorage.getItem('token');
    getRequest(`partnership/?partnership_id=${partnershipId}`, {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    }).then((resp: any) => {
      if (resp.result === true) {
        if (resp.data.is_sales_hub_account_available === true) {
          accountSetupContents[5].isCompleted = true;
        }
        if (resp.data.is_sales_motion_available === true) {
          accountSetupContents[4].isCompleted = true;
        }
        if (resp.data.is_sales_hub_available === true) {
          accountSetupContents[3].isCompleted = true;
        }
        if (resp.data.is_solution_narrative_available === true) {
          accountSetupContents[2].isCompleted = true;
        }
        if (resp.data.is_asset_available === true) {
          accountSetupContents[1].isCompleted = true;
        }
        if (
          resp.data.partner_company_information !== null &&
          resp.data.company_information !== null
        ) {
          accountSetupContents[0].isCompleted = true;
        }
      }
      showActiveButton(accountSetupContents);
      setLoading(false);
    });
  };

  const showActiveButton = (accountSetupContents) => {
    let btnEnabledIndex = null;
    accountSetupContents.forEach((item, i) => {
      if (item.isCompleted === false && btnEnabledIndex === null) {
        btnEnabledIndex = i;
      }
    });
    if (btnEnabledIndex === null) {
      btnEnabledIndex = 0;
    }
    console.log(btnEnabledIndex, 'btnEnabledIndex');
    accountSetupContents[btnEnabledIndex].disabled = false;
    setAccountContents(accountSetupContents);
  };

  const handleSetUpAccount = (stepName: string) => {
    const queryparams = new URLSearchParams(window.location.search);
    const partnershipId: string = queryparams.get('partner_id') || '0';
    switch (stepName) {
      case AccountSetupLabels.addPartnershipButtonLabel:
        if (partnershipId !== '0') {
          history.push(
            `/createPartnership?form=PartnerShipInfo&type=update&partner_id=${partnershipId}`
          );
        } else {
          history.push('/createPartnership');
        }
        break;
      case AccountSetupLabels.uploadAssetsButtonLabel:
        history.push(
          `/uploadAsset?partner_id=${partnershipId}&assetModal=${true}`
        );
        break;
      case AccountSetupLabels.createAssetCollectionButtonLabel:
        history.push(
          `/assetCollection?partner_id=${partnershipId}&assetCollectionModal=${true}`
        );
        break;
      case AccountSetupLabels.configureSalesHubButtonLabel:
        history.push(`/salesHub?partner_id=${partnershipId}`);
        break;
      case AccountSetupLabels.createSalesMotionButtonLabel:
        history.push(
          `/salesMotion?partner_id=${partnershipId}&createModal=${true}`
        );
        break;
      case AccountSetupLabels.accountEngagementButtonLabel:
        history.push(
          `/accountsEngagements?partner_id=${partnershipId}&accountModal=${true}`
        );
        break;
      default:
        return '';
    }
    return '';
  };

  return (
    <div className="account-setup-container">
      <div className="account-setup-header">
        {AccountSetupLabels.accountSetupHeader}
      </div>
      <div className="account-setup-subheader">
        {AccountSetupLabels.accountSetupSubHeader}
      </div>
      {accountContents.map((accountSetupContent, index) => (
        <div
          className="account-setup-main-container"
          key={accountSetupContent.title}
        >
          <div className="account-setup-content-container">
            <div className="account-setup-content-info">
              <div className="account-setup-icon-container">
                <img
                  className="account-setup-icon"
                  src={accountSetupContent.icon}
                  alt=""
                />
              </div>
              <div>
                <div className="account-setup-content-title">
                  {accountSetupContent.title}
                </div>
                <div className="account-setup-content-description">
                  {accountSetupContent.description}
                </div>
              </div>
            </div>
            <div className="acccount-setup-content-button">
              {accountSetupContent.isCompleted === true ? (
                <div className="completedSetup">
                  <img src={tickIcon} alt="" />
                </div>
              ) : (
                <PrimaryButton
                  style={{ minWidth: '180px' }}
                  disabled={accountSetupContent.disabled === true}
                  onClick={() =>
                    handleSetUpAccount(accountSetupContent.buttonLabel)
                  }
                >
                  {' '}
                  {accountSetupContent.buttonLabel}
                </PrimaryButton>
              )}
            </div>
          </div>
        </div>
      ))}
      {loading && <Loader />}
    </div>
  );
};
AccountSetup.propTypes = {
  user: PropTypes.shape({}),
};

AccountSetup.defaultProps = {
  user: null,
};

export default AccountSetup;
