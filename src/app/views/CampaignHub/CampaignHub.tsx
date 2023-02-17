/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable operator-linebreak */
/* eslint-disable indent */
/* eslint-disable comma-dangle */
/* eslint-disable linebreak-style */
import { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import { Button, Fab } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { campaignHubLabels } from 'src/strings';
import Loader from 'src/app/components/Loader';
import SnackbarAlert from 'src/app/components/Snackbar/Snackbar';
import FabIcon from './FloatingActionButtonImg.svg';
import FabCloseIcon from './FloatingCloseButtonImg.svg';
import './CampaignHub.css';
import styles from './CampaignHub.module.css';
import CampaignHubCard from './Components/CampaignHubCard/CampaignHubCard';
import Footer from './Components/FooterComponent/Footer';
import {
  getCampaignHubDetails,
  getCampaignHubAssetCollectDetails,
} from './CampaignHubSlice';
import CtaPopup from './Components/CtaPopup/CtaPopup';
import { getRequest } from 'src/app/service';
import ReactGA from 'react-ga4';
import SiteLayout from '../SalesHubSite/Components/SiteLayout';
import { useMediaQuery } from 'react-responsive';
import { useCookies } from 'react-cookie';

const CampaignHub = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [AccountName, setAccountName] = useState('');
  const [assetCollectionList, setAssetCollectionList] = useState(null);
  const [partnerShipDetail, setPartnerShipDetail] = useState(null);
  const [salesHubDetail, setSalesHubDetail] = useState(null);
  const [assetCollectionDetail, setAssetCollectionDetail] = useState(null);
  const [ctaPreviewSelected, setCtaPreviewSelected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fontFamily, setfontFamily] = useState('');
  const [fontColor, setfontColor] = useState('');
  const [calloutOneFontColor, setCalloutOneFontColor] = useState('');
  const [calloutTwoFontColor, setCalloutTwoFontColor] = useState('');
  const ctaPreviewRef: any = useRef();
  const [lastClicked, setLastClicked] = useState(new Date().getTime());
  const [ipAddress, setIpAddress] = useState('');
  const [ipDetails, setIpDetails] = useState(null);
  const [cookies, setCookie] = useCookies();
  const [allowCookie, setAllowCookie] = useState(true);

  const subDomainName = localStorage.getItem('subDomainName');
  const accountName = window.location.pathname.split('/')[1];
 

  const handleCookie = () =>{
    const cookieArr = []
  if(cookies.path_name !== "null" && cookies.path_name) {
   if(cookies.path_name.includes(accountName)) {
    setCookie('path_name', cookies.path_name)
   } else {
      cookies.path_name.map((val)=> (
        cookieArr.push(val)
      ))
    cookieArr.push(accountName)
    setCookie('path_name', cookieArr)
   }
  } else {
    cookieArr.push(accountName)
    setCookie('path_name', cookieArr)
  }  
    setAllowCookie(false)
  }

  useEffect(() => {
    ReactGA.initialize([
      {
        trackingId: import.meta.env.VITE_TRACKING_ID,
        gaOptions: {
          debug_mode: true,
        },
      },
    ]);
    getIpAddress();
    console.log(cookies,'cookies in useEffect..........')
    cookies?.path_name?.includes(accountName)? setAllowCookie(false) : null;
  }, []);

  window.onpopstate = () => {
    onHomeView();
  };
  window.onbeforeunload = () => {
    onHomeView();
  };

  const onHomeView = () => {
    const timeNow = new Date().getTime();
    if (timeNow > lastClicked) {
      const duration = timeNow - lastClicked;
      const seconds = Math.floor(duration / 1000);
      const data = {
        page_viewing_time: seconds,
        ip: ipAddress,
        account_name: accountName,
        sub_domain_name: subDomainName,
        partnership_name: partnerShipDetail?.partnership_name,
        partnership_id: partnerShipDetail?.partnership_id,
        sales_hub_account_id: salesHubDetail.sales_hub_account_id,
        city: ipDetails.city,
        country: ipDetails.country,
        latitude: ipDetails.latitude,
        longitude: ipDetails.longitude,
        organization: ipDetails.organization,
        postal_code: ipDetails.postal_code,
        region: ipDetails.region,
      };
      console.log('campaign_landing_page', data);
      ReactGA.event('campaign_landing_page', data);
    }
  };

  const getIpAddress = () => {
    getRequest(
      `partnership/sales-hub-account/site/is-available/?subdomain=${subDomainName}&campaign_hub_domain=${
        window.location.pathname.split('/')[1]
      }`,
      {}
    ).then((response: any) => {
      if (response.result === true) {
        if (response.data) {
          setIpAddress(response.data.ip_address);
          setIpDetails(response.data.ip_details);
        }
        console.log(response, 'getIpAddress response');
      }
    });
  };

  const handleClosePopup = (event: any) => {
    if (
      ctaPreviewRef &&
      ctaPreviewRef.current &&
      !ctaPreviewRef.current.contains(event.target)
    ) {
      setCtaPreviewSelected(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    dispatch(
      getCampaignHubAssetCollectDetails(
        subDomainName,
        accountName,
        setAssetCollectionList,
        setAccountName
      )
    );
    dispatch(
      getCampaignHubDetails(
        subDomainName,
        accountName,
        setLoading,
        setPartnerShipDetail,
        setSalesHubDetail,
        setfontFamily,
        setAssetCollectionDetail,
        setfontColor,
        setCalloutOneFontColor,
        setCalloutTwoFontColor
      )
    );
    document.addEventListener('mousedown', (e) => handleClosePopup(e));
  }, []);

  const [isHeaderImageRendered, setIsHeaderImageRendered] = useState(false);

  const cbImg3 = (setStateFn) => {
    setStateFn();
  };
  const cbImg2 = (setStateFn) => {
    window.requestAnimationFrame(() => cbImg3(setStateFn));
  };
  const cbImg1 = (setStateFn) => {
    window.requestAnimationFrame(() => cbImg2(setStateFn));
  };

  useEffect(() => {
    if (!isHeaderImageRendered) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
  }, [isHeaderImageRendered]);

  const isMobile = useMediaQuery({ query: '(max-width: 600px)' });
  const siteLayoutImage = isMobile
    ? salesHubDetail?.site_layout?.mobile_header_image
    : salesHubDetail?.site_layout?.header_image;

  return (
    <>
      {partnerShipDetail !== null &&
      salesHubDetail !== null &&
      assetCollectionDetail !== null ? (
        <>
          <div
            style={{ fontFamily }}
            className={`${!isHeaderImageRendered ? styles.ZeroOpacity : ''}`}
          >
            <div className="campaignHubMainDiv">
              <div
                className={
                  salesHubDetail?.service_provider_logo
                    ? 'campaignHubPartnersDiv'
                    : 'campaignHubPartnersDiv2'
                }
              >
                {partnerShipDetail !== null &&
                  partnerShipDetail.company_information?.logo && (
                    <div className="campaignHubPartnersImg leftImg">
                      {isHeaderImageRendered && (
                        <img
                          src={`${
                            partnerShipDetail?.company_information?.logo
                              ? `${
                                  partnerShipDetail?.company_information?.logo
                                }?t=${new Date().getTime()}`
                              : partnerShipDetail?.company_information?.logo
                          }`}
                          alt=""
                        />
                      )}
                    </div>
                  )}
                {partnerShipDetail !== null &&
                  partnerShipDetail.partner_company_information?.logo && (
                    <div className="campaignHubPartnersImg centerImg">
                      {isHeaderImageRendered && (
                        <img
                          src={`${
                            partnerShipDetail?.partner_company_information?.logo
                              ? `${
                                  partnerShipDetail?.partner_company_information
                                    ?.logo
                                }?t=${new Date().getTime()}`
                              : partnerShipDetail?.partner_company_information
                                  ?.logo
                          }`}
                          alt=""
                        />
                      )}
                    </div>
                  )}
                {salesHubDetail !== null &&
                  salesHubDetail?.service_provider_logo && (
                    <>
                      <div className="campaignHubPartnersImg rightImg">
                        {isHeaderImageRendered && (
                          <img
                            src={`${
                              salesHubDetail?.service_provider_logo
                                ? `${
                                    salesHubDetail?.service_provider_logo
                                  }?t=${new Date().getTime()}`
                                : salesHubDetail?.service_provider_logo
                            }`}
                            alt=""
                          />
                        )}
                      </div>
                    </>
                  )}
              </div>
              <div className={styles.headBg}>
                <img
                  id="headerBg"
                  className={`${styles.headBgImg} ${
                    isHeaderImageRendered ? '' : styles.FadeIn
                  }`}
                  src={
                    siteLayoutImage
                      ? `${siteLayoutImage}?time=${new Date().getTime()}`
                      : siteLayoutImage
                  }
                  alt="Mountain"
                  onLoad={() => cbImg1(() => setIsHeaderImageRendered(true))}
                />
                <div
                  className={styles.bannerTxtWrap}
                  data-theme={fontColor === 'Dark' ? 'dark-text' : 'light-text'}
                >
                  <div className={styles.bannerWrap}>
                    <div className={styles.headerTextWrap}>
                      <div className={styles.headerTextContainer}>
                        <div className={styles.srHeaderText}>
                          {salesHubDetail.site_layout.header_text}
                        </div>
                        <div className={styles.srSubHeaderText}>
                          {salesHubDetail.site_layout.sub_header_text}
                        </div>
                      </div>

                      <div className={styles.headerCompanyLogoWrap}>
                        {salesHubDetail?.company_logo &&
                        isHeaderImageRendered ? (
                          <img
                            src={
                              salesHubDetail?.company_logo
                                ? `${
                                    salesHubDetail?.company_logo
                                  }?time=${Date.now()}`
                                : salesHubDetail?.company_logo
                            }
                            alt=""
                          />
                        ) : (
                          <div className={styles.companyLogo} />
                        )}
                      </div>
                    </div>

                    <div className="viewContentButtonDiv">
                      <Button
                        onClick={() => {
                          onHomeView(),
                            history.push(
                              `/${
                                window.location.pathname.split('/')[1]
                              }/viewAssets`
                            );
                        }}
                        style={{ fontFamily }}
                        className={`viewContentButton ${
                          fontColor === 'Dark' ? '' : 'viewContentButtonLight'
                        }`}
                      >
                        {campaignHubLabels.viewContentLabel}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="campaignHubCard">
                <div className="campaignHubCardText">
                  {campaignHubLabels.contentForYou}
                </div>
                <div className="campaignHubCardsContainer">
                  <div className="campaignHubCardsDiv">
                    {assetCollectionDetail.length > 0 ? (
                      assetCollectionDetail.map((data: any) => (
                        <div className="campaignHubCardDiv">
                          <CampaignHubCard
                            img={data.image}
                            title={data.name}
                            content={data.description}
                            assetCollectionData={data}
                            isHeaderImageRendered={isHeaderImageRendered}
                            onPageView={onHomeView}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="noAssetCollectionMsg">
                        {campaignHubLabels.noAssetCollection}
                      </div>
                    )}
                  </div>
                </div>
                <div className="campaignHubCOSDiv">
                  {salesHubDetail.call_out_section_one && (
                    <div className="campaignHubCOS1ContentContainer">
                      <div
                        className="campaignHubCOSContentsDiv"
                        data-theme={
                          calloutOneFontColor === 'Dark'
                            ? 'dark-text'
                            : 'light-text'
                        }
                      >
                        <div className="campaignHubCOS1Header">
                          {salesHubDetail.call_out_section_one.header_text}
                        </div>
                        <div className="campaignHubCOS1SubHeader">
                          {salesHubDetail.call_out_section_one.sub_header_text}
                        </div>
                      </div>
                      <div className="campaignHubCOS1ImageDiv">
                        {isHeaderImageRendered && (
                          <img
                            className="campaignHubCOS2Img"
                            src={
                              salesHubDetail?.call_out_section_one.header_image
                                ? `${
                                    salesHubDetail?.call_out_section_one
                                      .header_image
                                  }?t=${new Date().getTime()}`
                                : salesHubDetail?.call_out_section_one
                                    .header_image
                            }
                            alt=""
                          />
                        )}
                      </div>
                    </div>
                  )}
                  {salesHubDetail.call_out_section_two && (
                    <div className="campaignHubCOS2ContentContainer">
                      <div className="campaignHubCOS2ImageDiv">
                        {isHeaderImageRendered && (
                          <img
                            className="campaignHubCOS2Img"
                            src={
                              salesHubDetail?.call_out_section_two.header_image
                                ? `${
                                    salesHubDetail?.call_out_section_two
                                      .header_image
                                  }?t=${new Date().getTime()}`
                                : salesHubDetail?.call_out_section_two
                                    .header_image
                            }
                            alt=""
                          />
                        )}
                      </div>
                      <div
                        className="campaignHubCOS2ContentsDiv"
                        data-theme={
                          calloutTwoFontColor === 'Dark'
                            ? 'dark-text'
                            : 'light-text'
                        }
                      >
                        <div className="campaignHubCOS2Header">
                          {salesHubDetail.call_out_section_two.header_text}
                        </div>
                        <div className="campaignHubCOS2SubHeader">
                          {salesHubDetail.call_out_section_two.sub_header_text}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <Footer partnerShipDetail={partnerShipDetail} />
                {salesHubDetail?.cta && (
                  <div className="fabCOSDiv" ref={ctaPreviewRef}>
                    <Fab
                      className={ctaPreviewSelected ? 'fabCOSClose' : 'fabCOS'}
                      onClick={() => setCtaPreviewSelected(!ctaPreviewSelected)}
                    >
                      <img
                        src={ctaPreviewSelected ? FabCloseIcon : FabIcon}
                        alt=""
                      />
                    </Fab>
                    <CtaPopup
                      ctaData={salesHubDetail?.cta}
                      show={ctaPreviewSelected}
                      fontFamily={fontFamily}
                      onPageView={onHomeView}
                    />
                  </div>
                )}
              </div>
            </div>
            <SnackbarAlert
                showalert={allowCookie}
                message={`We use cookies to improve user experience and analyze site traffic. By clicking “Accept“ or continuing, you agree to the use of cookies as described in our `}
                btnName="Accept"
                privacyLink={
                  partnerShipDetail?.company_information.cookie_policy.includes(
                    'https://'
                  ) ||
                  partnerShipDetail?.company_information.cookie_policy.includes(
                    'http://'
                  )
                    ? partnerShipDetail?.company_information.cookie_policy
                    : `https://${partnerShipDetail?.company_information.cookie_policy}`
                }
                Btnhandler={() => {
                  handleCookie()
                }}
              />
          </div>
          {!isHeaderImageRendered && <Loader />} 
        </>
      ) : null}
    </>
  );
};

export default CampaignHub;
