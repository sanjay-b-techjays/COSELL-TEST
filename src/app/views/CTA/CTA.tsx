/* eslint-disable no-confusing-arrow */
/* eslint-disable linebreak-style */
import { useEffect, useState, useRef } from 'react';
import parse from 'html-react-parser';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { campaignHubCtaLabels, ButtonLabels } from 'src/strings';
import Loader from 'src/app/components/Loader';
import Header from './Components/Header/Header';
import { getCampaignHubDetails } from '../CampaignHub/CampaignHubSlice';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { Button } from '@material-ui/core';
import PrimaryButton from 'src/app/components/Button/PrimaryButton';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import styles from './CTA.module.css';
import Footer from '../CampaignHub/Components/FooterComponent/Footer';
import { useMediaQuery } from 'react-responsive';
import SnackbarAlert from 'src/app/components/Snackbar/Snackbar';
import Shimmer from 'src/app/components/Shimmer/Shimmer';
import { getRequest, postRequest } from 'src/app/service';
import ReactGA from 'react-ga4';
import { useCookies } from 'react-cookie';

const CTA = (props) => {
  const [partnerShipDetail, setPartnerShipDetail] = useState(null);
  const [salesHubDetail, setSalesHubDetail] = useState(null);
  const [iframeSource, setiframeSource] = useState('');
  const [loading, setloading] = useState(false);
  const [fontFamily, setfontFamily] = useState('');
  const [lastClicked, setLastClicked] = useState(new Date().getTime());
  const [ipAddress, setIpAddress] = useState('');
  const [ipDetails, setIpDetails] = useState(null);
  const iframeRef = useRef(null);
  const dispatch = useDispatch();
  const history = useHistory();
  const isMobile = useMediaQuery({ query: '(max-width: 750px)' });
  const subDomainName = localStorage.getItem('subDomainName');
  const accountName = window.location.pathname.split('/')[1];
  const [isCtaImageLoaded, setIsCtaImageLoaded] = useState(false);
  const [showStaticForm, setShowStaticForm] = useState(false);
  const [displayNamesList, setDisplayNamesList] = useState([]);
  const [formData, setFormData] = useState({});
  const [leadsIdList, setLeadsIdList] = useState([]);
  const [ctaFormHeader, setCtaFormHeader] = useState('');
  const [field1, setfield1] = useState(null);
  const [field2, setfield2] = useState(null);
  const [field3, setfield3] = useState(null);
  const [field4, setfield4] = useState(null);
  const [staticLeadData, setLeadFormData] = useState(null);
  const staticFormValue = Object.entries(formData).filter(([_, v]) => v !== '');
  const [showErrMsg, setShowErrMsg] = useState(false);
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);
  const [cookies, setCookie] = useCookies(['path_name']);
  const [allowCookie, setAllowCookie] = useState(true);


  useEffect(() => {
    setShowStaticForm(salesHubDetail?.cta?.is_static_form);
    setCtaFormHeader(salesHubDetail?.cta?.form_header);
    setDisplayNamesList(
      salesHubDetail?.cta?.lead_display?.map((data) => ({ ...data }))
    );
    displayNamesList?.forEach((element, index, array) => {
      formData[element.display_name] = '';
    });
  }, [salesHubDetail]);

  useEffect(() => {
    displayNamesList?.forEach((element, index, array) => {
      leadsIdList[element.display_name] = element.lead_master_id;
    });
    const leadData = displayNamesList?.map((data, index) => ({
      ...data,
      value: `${formData[Object.keys(formData)[index]]}`,
    }));
    setLeadFormData(leadData);
    setFieldValues();
  }, [formData]);

  const handleFormChange = (event) => {
    const fieldName = event.target.getAttribute('name');
    const fieldValue = event.target.value;
    const newFormData = { ...formData };
    newFormData[fieldName] = fieldValue;
    setFormData(newFormData);
  };

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
    console.log(cookies.path_name,'cookies....')
    cookies?.path_name?.includes(accountName)? setAllowCookie(false) : null;
  }, []);

  window.onpopstate = () => {
    onCTAView();
  };

  window.onbeforeunload = () => {
    onCTAView();
  };

  const onCTAView = () => {
    const timeNow = new Date().getTime();
    if (timeNow > lastClicked) {
      const duration = timeNow - lastClicked;
      const seconds = Math.floor(duration / 1000);
      const data = {
        page_viewing_time: seconds,
        ip: ipAddress,
        account_name: accountName,
        sub_domain_name: subDomainName,
        partnership_name: partnerShipDetail.partnership_name,
        partnership_id: partnerShipDetail.partnership_id,
        sales_hub_account_id: salesHubDetail.sales_hub_account_id,
        city: ipDetails.city,
        country: ipDetails.country,
        latitude: ipDetails.latitude,
        longitude: ipDetails.longitude,
        organization: ipDetails.organization,
        postal_code: ipDetails.postal_code,
        region: ipDetails.region,
        cta_name: salesHubDetail.cta.name,
        is_static_form: showStaticForm ? 'Yes' : 'No' ,
      };
      console.log('campaign_CTA_page', data);
      ReactGA.event('campaign_CTA_page', data);
    }
  };

 const setFieldValues = () => {
    displayNamesList?.forEach((element, index, array) => {
      const keys = Object.keys(leadsIdList);
      const values = Object.keys(formData);
      if (keys[index] === values[index]) {
        if (`${leadsIdList[values[index]]}` === '1') {
          setfield1(`${formData[values[index]]}`);
        } else if (`${leadsIdList[values[index]]}` === '2') {
          setfield2(`${formData[values[index]]}`);
        } else if (`${leadsIdList[values[index]]}` === '3') {
          setfield3(`${formData[values[index]]}`);
        } else if (`${leadsIdList[values[index]]}` === '4') {
          setfield4(`${formData[values[index]]}`);
        }
      }
    });
  }
  
  const onCTAFormSubmit = () => {
    const timeNow = new Date().getTime();
    if (timeNow > lastClicked) {
      const duration = timeNow - lastClicked;
      const seconds = Math.floor(duration / 1000);
      const data = {
        page_viewing_time: seconds,
        ip: ipAddress,
        account_name: accountName,
        sub_domain_name: subDomainName,
        partnership_name: partnerShipDetail.partnership_name,
        partnership_id: partnerShipDetail.partnership_id,
        sales_hub_account_id: salesHubDetail.sales_hub_account_id,
        city: ipDetails.city,
        country: ipDetails.country,
        latitude: ipDetails.latitude,
        longitude: ipDetails.longitude,
        organization: ipDetails.organization,
        postal_code: ipDetails.postal_code,
        region: ipDetails.region,
        cta_name: salesHubDetail.cta.name,
        field_1: field1,
        field_2: field2,
        field_3: field3,
        field_4: field4,
      };
      displayNamesList.length !== staticFormValue.length
        ? setShowErrMsg(true)
        : staticFormValue.length === 0
        ? setShowErrMsg(true)
        : (handleSaveFormLeads(),
          ReactGA.event('campaign_CTA_formSubmit', data),
          console.log('campaign_CTA_formSubmit', data));
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

  const handleSaveFormLeads = () => {
    postRequest(`partnership/sales-hub-account/site/leads/`, {
      sales_hub_account_id: salesHubDetail?.sales_hub_account_id,
      lead_display: staticLeadData,
    }).then((response: any) => {
      if (response.result === true) {
        setShowSuccessMsg(true), setFormData({});
        setShowErrMsg(false);
        console.log(response.data, 'response');
      }
    });
  };

  useEffect(() => {
    setloading(true);
    dispatch(
      getCampaignHubDetails(
        subDomainName,
        accountName,
        setloading,
        setPartnerShipDetail,
        setSalesHubDetail,
        setfontFamily
      )
    );
  }, []);
  const loadHandler = () => {
    if (!iframeSource && iframeRef && iframeRef.current) {
      iframeRef.current.height =
        document.getElementsByTagName(
          'iframe'
        )[0]?.contentDocument?.body?.scrollHeight;
    } else if (iframeSource && iframeRef && iframeRef.current) {
      iframeRef.current.height = '500px';
    }
  };

  useEffect(() => {
    if (salesHubDetail) {
      const embedCode: any = [parse(salesHubDetail.cta.embedded_code)].flat(1);

      if (embedCode.length && embedCode.find((x) => x.type === 'iframe')) {
        setiframeSource(embedCode.find((x) => x.type === 'iframe')?.props?.src);
      }
    }
  }, [salesHubDetail]);

  const cbImg3 = () => {
    setIsCtaImageLoaded(true);
  };

  const cbImg2 = () => {
    window.requestAnimationFrame(cbImg3);
  };
  const cbImg1 = () => {
    window.requestAnimationFrame(cbImg2);
  };

  return (
    <>
      {partnerShipDetail && salesHubDetail ? (
        <>
          <div className={styles.headerContainer}>
            {/* <div className={styles.headerBackButton}>
              <Button
                style={{
                  padding: '5px',
                }}
                onClick={() => {
                  history.push(props.location.state);
                }}
              >
                {isMobile ? (
                  <img
                    src={HomeIcon}
                    style={{
                      color: 'rgb(0, 0, 0)',
                      marginLeft: '5px',
                      height: '20px',
                      width: '17px',
                      alignContent: 'center',
                    }}
                  />
                ) : (
                  <KeyboardBackspaceIcon
                    style={{
                      color: 'rgb(0, 0, 0)',
                      border: '1px solid rgb(205 205 205)',
                      borderRadius: '50%',
                      marginLeft: '5px',
                      height: '30px',
                      width: '30px',
                    }}
                  />
                )}
              </Button>
            </div> */}
            <Header
              LogoList={[
                partnerShipDetail.company_information.logo,
                partnerShipDetail.partner_company_information.logo,
                salesHubDetail.service_provider_logo,
              ]}
              isServiceLogoPresent={salesHubDetail.service_provider_logo}
            />
          </div>
          <div className={`${styles.Breadcrumbs} Breadcrumbs`}>
            <Breadcrumbs
              separator={<KeyboardDoubleArrowRightIcon fontSize="small" />}
              aria-label="breadcrumb"
            >
              <Button
                className={styles.BreadcrumbsText}
                onClick={() => {
                  onCTAView(),
                    history.push(`/${window.location.pathname.split('/')[1]}`);
                }}
              >
                Home
              </Button>
              {console.log(props.location.state, 'props.location.state')}
              {props.location.state === `/${accountName}/viewAssets` && (
                <Button
                  className={styles.BreadcrumbsText}
                  onClick={() => {
                    onCTAView(),
                      history.push(
                        `/${window.location.pathname.split('/')[1]}/viewAssets`
                      );
                  }}
                >
                  View Content
                </Button>
              )}
              <span className={styles.typoText}>Recommended for you</span>
            </Breadcrumbs>
          </div>
          <div className={styles.responsiveContainer}>
            {/* <img
              className={styles.responsiveBackLink}
              onClickCapture={() =>
                props.location.state
                  ? window.history.back()
                  : history.push(`/${localStorage.getItem('accountName')}`)
              }
              src={BackIcon}
              alt="Back to the Previous page"
            /> */}
            <div style={{ fontFamily }} className={styles.responsiveCtaHeader}>
              {salesHubDetail.cta.header_text}
            </div>
            <div
              style={{ fontFamily }}
              className={styles.responsiveCtaSubHeader}
            >
              {salesHubDetail.cta.sub_header_text}
            </div>
          </div>
          <main style={{ fontFamily }} className={styles.mainContainer}>
            <div className={styles.ctaContainer}>
              <div className={styles.ctaContent}>
                <div className={styles.ctaHeader}>
                  {salesHubDetail.cta.header_text}
                </div>
                <div className={styles.ctaSubHeader}>
                  {salesHubDetail.cta.sub_header_text}
                </div>
                <div className={styles.ImgContainer} id="ImgContainer">
                  <Shimmer
                    show={isCtaImageLoaded}
                    classes={styles.shimmerImgContainer}
                    shimmerclass={styles.shimmer}
                  />
                  <img
                    src={
                      salesHubDetail.cta.image
                        ? `${
                            salesHubDetail.cta.image
                          }?t=${new Date().getTime()}`
                        : salesHubDetail.cta.image
                    }
                    alt=""
                    className={`${styles.ctaImg} ${
                      isCtaImageLoaded ? '' : styles.hidden
                    }`}
                    onLoad={() => cbImg1()}
                  />
                </div>
                <div className={styles.ctaDescription}>
                  {salesHubDetail.cta.description}
                </div>
              </div>
              <div className={styles.iframeContainer}>
                <div className={styles.iframeContainerBox}>
                  {showStaticForm ? (
                    <div className={styles.formContainer}>
                      <div className={styles.formHeaderContainer}>
                        <span>{ctaFormHeader}</span>
                      </div>
                      <div className={styles.formBodyContainer}>
                        {displayNamesList &&
                          displayNamesList.map((displaylist, index) => (
                            <>
                              <div className={styles.formInputLabel}>
                                {displaylist.display_name}
                              </div>
                              <input
                                type="text"
                                name={displaylist.display_name}
                                placeholder={`Enter ${displaylist.display_name.toLowerCase()}`}
                                className={styles.formInputField}
                                onChange={handleFormChange}
                                value={
                                  `${
                                    formData[Object.keys(formData)[index]]
                                  }` === 'undefined'
                                    ? ''
                                    : `${
                                        formData[Object.keys(formData)[index]]
                                      }`
                                }
                              />
                              {showErrMsg &&
                              (`${formData[Object.keys(formData)[index]]}` ===
                                '' ||
                                `${formData[Object.keys(formData)[index]]}` ===
                                  'undefined') ? (
                                <div className={styles.errorMsgText}>
                                  {displaylist.display_name} is required
                                </div>
                              ) : null}
                            </>
                          ))}
                        <PrimaryButton
                          type="submit"
                          style={{ minWidth: '160px', marginTop: '60px' }}
                          onClick={onCTAFormSubmit}
                        >
                          {ButtonLabels.submit}
                        </PrimaryButton>
                      </div>
                    </div>
                  ) : (
                    <iframe
                      style={{ fontFamily }}
                      className={styles.iframe}
                      scrolling={iframeSource ? '' : 'no'}
                      title="embedded code"
                      src={iframeSource}
                      srcDoc={
                        !iframeSource
                          ? salesHubDetail.cta.embedded_code
                          : undefined
                      }
                      frameBorder="0"
                      marginHeight={0}
                      marginWidth={0}
                      height="100%"
                      onLoad={loadHandler}
                      ref={iframeRef}
                    >
                      <p>Loading...</p>
                    </iframe>
                  )}
                </div>
                <div className={styles.ctaPolicy}>
                  {campaignHubCtaLabels.ctaTermPolicy}
                  <a
                    className={styles.policy_url}
                    target="_blank"
                    href={
                      partnerShipDetail.company_information?.privacy_policy_url.includes(
                        'https://'
                      ) ||
                      partnerShipDetail.company_information?.privacy_policy_url.includes(
                        'http://'
                      )
                        ? partnerShipDetail.company_information
                            ?.privacy_policy_url
                        : `https://${partnerShipDetail.company_information?.privacy_policy_url}`
                    }
                    rel="noreferrer"
                  >
                    {partnerShipDetail.company_information.company_name}
                  </a>
                  {` and `}
                  <a
                    className={styles.policy_url}
                    target="_blank"
                    rel="noreferrer"
                    href={
                      partnerShipDetail.partner_company_information?.privacy_policy_url.includes(
                        'https://'
                      ) ||
                      partnerShipDetail.partner_company_information?.privacy_policy_url.includes(
                        'http://'
                      )
                        ? partnerShipDetail.partner_company_information
                            ?.privacy_policy_url
                        : `https://${partnerShipDetail.partner_company_information?.privacy_policy_url}`
                    }
                  >
                    {partnerShipDetail.partner_company_information.company_name}
                  </a>
                </div>
              </div>
            </div>
          </main>
          <Footer partnerShipDetail={partnerShipDetail} />
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
        </>
      ) : (
        loading && <Loader />
      )}
      {showSuccessMsg && (
        <SnackbarAlert
          severity="success"
          handler={() => setShowSuccessMsg(false)}
          showalert={showSuccessMsg}
          message="Form submitted successfully!"
        />
      )}
    </>
  );
};

export default CTA;
