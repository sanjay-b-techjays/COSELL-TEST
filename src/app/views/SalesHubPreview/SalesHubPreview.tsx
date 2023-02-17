/* eslint-disable linebreak-style */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable linebreak-style */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable comma-dangle */
/* eslint-disable operator-linebreak */
import React, { useRef, useState, useEffect } from 'react';

import { useDispatch } from 'react-redux';

import Loader from 'src/app/components/Loader';
import { useHistory } from 'react-router-dom';
import { salesHubSiteTitle } from 'src/strings';

import { getRequest } from 'src/app/service';
import styles from './SalesHubPreview.module.css';
import Header from '../SalesHubSite/Components/Header';
import Footer from '../SalesHubSite/Components/Footer';

interface SalesHub {
  headerText: string;
  subHeaderText: string;
  headerImage: string;
  companyLogo: string;
  partnerLogo: string;
  solutinNarrative: [SolutinNarrative];
  address: object;
}

interface SolutinNarrative {
  name: string;
  description: string;
  image: string;
}

const SalesHubPreview = () => {
  const [fontFamily, setfontFamily] = useState('');
  const [fontColor, setfontColor] = useState('');

  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [main, setMain] = useState<SalesHub>();
  const [accName, setAccName] = useState('');
  const [salesMotionMenu, setSalesMotionMenu] = useState(false);
  const [salesMotionSelected, setSalesMotionSelected] = useState('');
  const [statusMenu, setStatusMenu] = useState(false);
  const [statusSelected, setStatusSelected] = useState('');
  const [salesMotionList, setSalesMotionList] = useState([]);
  const [statusList, setStatusList] = useState([]);

  const history = useHistory();
  const queryparams = new URLSearchParams(window.location.search);
  const partnershipId: string = queryparams.get('partner_id') || '0';
  const subDomain: string = queryparams.get('subdomain') || '0';
  const dispatch = useDispatch();
  const refSalesMotionMenu: any = useRef();
  const refStatusMenu: any = useRef();

  const HanldeSalesRepAccountEngagementsCloseDropdown = (event) => {
    if (
      refSalesMotionMenu.current &&
      !refSalesMotionMenu.current.contains(event.target)
    ) {
      setSalesMotionMenu(false);
    }
    if (
      refStatusMenu.current &&
      !refStatusMenu.current.contains(event.target)
    ) {
      setStatusMenu(false);
    }
  };
  useEffect(() => {
    document.addEventListener(
      'mousedown',
      HanldeSalesRepAccountEngagementsCloseDropdown
    );
    console.log('window', document.referrer);
    // if (
    //   document.referrer === 'https://portal.dev.cosell.partners/' ||
    //   'https://portal.stg.cosell.partners/'
    // ) {
    //   const domain = window.location.href.split('.')[0].split('//');
    //   console.log('window', domain);
    //   const queryparams = new URLSearchParams(window.location.search);
    //   const token: string = queryparams.get('token');
    //   const userId: string = queryparams.get('user_id');
    //   localStorage.setItem('token', token);
    //   localStorage.setItem('userId', userId);
    //   localStorage.setItem('subDomainName', domain[0]);
    // }
    return () =>
      document.removeEventListener(
        'mousedown',
        HanldeSalesRepAccountEngagementsCloseDropdown
      );
  }, []);

  const getSalesHubSite = () => {
    const token = localStorage.getItem('token');
    const headerData = {
      Authorization: `Token ${token}`,
    };
    setLoading(true);

    getRequest(
      `partnership/sales-hub/site/is-available/?subdomain=${subDomain}`
    ).then((resp: any) => {
      if (resp.result === true) {
      } else {
        history.push(`/not-found`);
      }
    });

    if (subDomain) {
      getRequest(
        `partnership/sales-hub/site/?subdomain=${subDomain}`,
        headerData
      )
        .then((resp: any) => {
          if (resp) {
            const resData = resp.data;
            setMain({
              headerText: resData.sales_hub.header_text,
              subHeaderText: resData.sales_hub.sub_header_text,
              headerImage: resData.sales_hub.header_image,
              solutinNarrative: resData.solution_narratives,
              companyLogo: resData.company_information.logo,
              partnerLogo: resData.partner_company_information.logo,
              address: resData.company_information,
            });
            setfontFamily(resData.sales_hub.font_family.name);
            setfontColor(resData.sales_hub.font_color.name);
          }
          setLoading(false);
        })
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    getSalesHubSite();
  }, []);

  const handleAssetCollectionCardClick = (assetCollection) => {
    history.push(
      `/viewAssets?partner_id=${partnershipId}&solution_narrative_id=${assetCollection.solution_narrative_id}`
    );
  };

  return (
    <div
      style={{ fontFamily }}
      className={styles.main}
      data-theme={darkMode ? 'dark' : 'light'}
    >
      <div>
        {main && (
          <>
            <div className={styles.headerDiv}>
              <Header
                companyLogo={main?.companyLogo}
                partnerLogo={main?.partnerLogo}
              />
            </div>
            <div className={styles.headBg}>
              <img
                src={
                  main?.headerImage
                    ? `${main?.headerImage}?time=${Date.now()}`
                    : main?.headerImage
                }
                alt=""
              />
              <div
                className={styles.bannerTxtWrap}
                data-theme={fontColor === 'Dark' ? 'dark-text' : 'light-text'}
              >
                <h1>{main?.headerText}</h1>
                <p>{main?.subHeaderText}</p>
              </div>
            </div>
            <div className={styles.recommendHeadTxt}>
              {salesHubSiteTitle.cardTile}
            </div>
            <div className={styles.cardWrap}>
              {main && main.solutinNarrative.length > 0 ? (
                main.solutinNarrative.map((card) => (
                  <div className={styles.bannerCard}>
                    <img
                      src={
                        card?.image
                          ? `${card?.image}?time=${Date.now()}`
                          : card?.image
                      }
                      alt=""
                    />
                    <div className={styles.cardContainer}>
                      <h4>{card.name}</h4>
                      <p>{card.description}</p>
                    </div>
                    {/* <div className={styles.loadLink}>{`Learn More ${`>`}`}</div> */}
                  </div>
                ))
              ) : (
                <div className={styles.noAssetCollectionMsg}>
                  {salesHubSiteTitle.noAssetCollection}
                </div>
              )}
            </div>
          </>
        )}
        {main && (
          <Footer
            address={main?.address}
            darkMode={darkMode}
            isPreview
            companyLogo={main?.companyLogo}
          />
        )}

        {loading === true && <Loader />}
      </div>
    </div>
  );
};

export default SalesHubPreview;
