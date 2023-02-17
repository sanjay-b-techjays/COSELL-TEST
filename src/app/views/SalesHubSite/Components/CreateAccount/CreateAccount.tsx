/* eslint-disable no-confusing-arrow */
/* eslint-disable linebreak-style */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable linebreak-style */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable linebreak-style */
/* eslint-disable object-curly-newline */
/* eslint-disable camelcase */
/* eslint-disable comma-dangle */
/* eslint-disable operator-linebreak */
/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
/* eslint-disable linebreak-style */
import React, { useRef, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik, Form, FormikProps } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import {
  AccountsEngagementsLabels,
  ButtonLabels,
  createAccount,
  previewImageLables,
} from 'src/strings';
import { setShowSalesHubWarningEditor } from 'src/app/views/SalesHub/SalesHubSlice';
import {
  accountEngagementsResponse,
  setIsAccountEngagementFormEdited,
  setShowAccountEngagementWarningEditor,
} from 'src/app/views/AccountsEngagements/AccountEngagementsSlice';
import DialogBoxComponent from '../../../../components/DialogBox/DialogBox';
import useThumbnailImage from '../../../../components/PreviewImage/CustomHook/useThumbnailImage';
import SecondaryButton from '../../../../components/Button/SecondaryButton';
import PrimaryButton from '../../../../components/Button/PrimaryButton';
import '../../SalesHubSite.css';
import { getRequest } from '../../../../service';
import {
  saveSalesHubAccountAction,
  salesHubAccountResponse,
  setCtaErrMsg,
  setGeneralErrMsg,
  setaccountTeamErrMsg,
} from '../../SalesHubSiteSlice';
import AssetCollection from '../AssetCollection';
import GeneralForm from '../GeneralForm/GeneralForm';
import SiteLayout from '../SiteLayout/SiteLayout';
import CallOutSecOne from '../CallOutSecOne/CallOutSecOne';
import CallOutSecTwo from '../CallOutSecTwo/CallOutSecTwo';
import CtaLayout from '../CtaLayout/CtaLayout';
import { salesHubValues, Alert, IdSetValues } from '../../types';

import styles from './CreateAccount.module.css';
import './CreateAccount.css';
import AccountTeam from '../AccountTeam';
import SalesOpportunities from '../AccountAnalytics/Components/SalesOpportunities';

const CreateAccount = (props: any) => {
  const dispatch = useDispatch();
  const {
    cancelHandler,
    setAlert,
    setLoader,
    clearLoader,
    setAccountTitle,
    fetchSalesHubAccountsList,
    statusShow,
    statusList,
    setActiveAddUserMenu = null,
    accountTeamList = null,
    setAccountTeamList = null,
    fetchAccountTeamList = '',
    accountTeamCount,
    accountTeamLimit,
    showCloseWarning,
    setShowCloseWarning,
    setFormEdited,
    formEdited,
    setIsDirty,
    setShowAddSalesOpportunity,
    showAddSalesOpportunity,
    fetchSalesOpportunityList,
    setSalesOpportunityList,
    salesOpportunityList,
    getAccContactsDetails,
    GetExportData,
  } = props;
  const formikForm = useRef<FormikProps<salesHubValues>>(null);
  const {
    companyLogo,
    servicePartnerCompanyLogo,
    siteLayoutImageWeb,
    siteLayoutImageMobile,
    calloutOneImage,
    calloutTwoImage,
    ctaImage,
  } = previewImageLables;
  const [assetCollectData, setAssetCollectData] = useState([]);
  const [previewImage, setPreviewImage, setPreviewImageFileData] =
    useThumbnailImage([
      { key: companyLogo, aspectRatio: 3 / 2 },
      { key: servicePartnerCompanyLogo, aspectRatio: 3 / 1 },
      { key: siteLayoutImageWeb, aspectRatio: 2 / 1 },
      { key: siteLayoutImageMobile, aspectRatio: 5 / 8 },
      { key: calloutOneImage, aspectRatio: 19 / 2 },
      { key: calloutTwoImage, aspectRatio: 7 / 5 },
      { key: ctaImage, aspectRatio: 8 / 5 },
    ]);
  const [offset, setOffset] = useState(0);
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [showGeneral, setShowGeneral] = useState(true);
  const [showSiteLayout, setShowSiteLayout] = useState(true);
  const [showSection1, setShowSection1] = useState(true);
  const [showSection2, setShowSection2] = useState(true);
  const [assetCollectionShow, setAssetCollectionShow] = useState(true);
  const [showCta, setShowCta] = useState(true);
  const [showAccountTeam, setShowAccountTeam] = useState(true);
  const [statusChosen, setStatusChosen] = useState('1');
  const [prevDomainName, setPrevDomain] = useState('');
  const [salesMotionList, setSalesMotionList] = useState([]);
  const [salesHubAccIdSet, setSalesHubAccIdSet] = useState({
    siteLayoutId: '',
    callOutSecOneId: '',
    callOutSecTwoId: '',
    ctaId: '',
  });
  const [accountTypeList, setAccountTypeList] = useState([]);
  const [candenceList, setCandenceList] = useState([]);
  const [fontColorList, setFontColorList] = useState([]);
  const [fontStyleList, setFontStyleList] = useState([]);
  const [initialValues, setInitialValues] = useState({
    companyName: '',
    companyLogo: '',
    domainName: '',
    staticFormShow: false,
    companyWebsite: '',
    accountType: '',
    industry: '',
    targetBuyerTitles: [],
    cadenceShow: false,
    candenceValue: '',
    candenceFrequency: '',
    servicePartnerShow: false,
    servicePartnerName: '',
    servicePartnerLogo: '',
    salesMotion: '',
    layOutHeaderText: '',
    layOutSubHeaderTxt: '',
    layOutHeaderImgWeb: '',
    layOutHeaderImgMobile: '',
    layOutFontColor: '',
    layOutFontStyle: '',
    callOutOneHeaderText: '',
    callOutOneSubHeaderTxt: '',
    callOutOneHeaderImg: '',
    callOutOneFontColor: '',
    callOutTwoHeaderText: '',
    callOutTwoSubHeaderTxt: '',
    callOutTwoHeaderImg: '',
    callOutTwoFontColor: '',
    ctaName: '',
    ctaHeaderTxt: '',
    ctaSubHeaderTxt: '',
    ctaDescription: '',
    ctaImage: '',
    ctaEmbeddedCode: '',
    accountTeamEmailList: '',
    ctaFormHeader: '',
  });
  const [salesMotionId, setSalesMotionId] = useState(null);
  const [keyNamesList, setKeyNamesList] = useState(null);
  const [staticFormData, setStaticFormData] = useState({});
  const [staticLeadData, setStaticLeadData] = useState(null);
  const [ctaLeadDisplayList, setCtaLeadDisplayList] = useState(null);
  const [leadselected, setLeadSelected] = useState([]);
  const [showFieldError, setShowFieldError] = useState(false);
  const [noStaticFormError, setNoStaticFormError] = useState(false);

  const salesHubAccCreationSchema = Yup.object().shape({
    companyName: Yup.string().trim().required('Company name is required'),
    servicePartnerShow: Yup.boolean(),
    servicePartnerLogo: Yup.string().when('servicePartnerShow', {
      is: true,
      then: Yup.string()
        .required('Service provider logo is required')
        .nullable(),
      otherwise: Yup.string().nullable(),
    }),
    servicePartnerName: Yup.string().when('servicePartnerShow', {
      is: true,
      then: Yup.string().required('Service provider name is required'),
      otherwise: Yup.string(),
    }),
    companyWebsite: Yup.string()
      .trim()
      .matches(
        /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi,
        'Enter a valid company website name'
      ),
    domainName: Yup.string()
      .trim()
      .required('Domain name is required')
      .matches(/^[a-zA-z0-9-_]{1,62}$/, 'Enter a valid domain name'),
    accountType: Yup.string().trim().required('Account type is required'),
    industry: Yup.string().trim().required('Industry is required'),
    cadenceShow: Yup.boolean(),
    candenceValue: Yup.string().when('cadenceShow', {
      is: true,
      then: Yup.string()
        .required('Cadence is required')
        .matches(/^(?!0)\d+$/, 'Enter a valid cadence(number)')
        .max(2, 'Must be less than 3 Digits')
        .nullable(),
      otherwise: Yup.string().nullable(),
    }),
    candenceFrequency: Yup.string()
      .trim()
      .when('cadenceShow', {
        is: true,
        then: Yup.string().required('Cadence frequency is required').nullable(),
        otherwise: Yup.string().nullable(),
      }),
    salesMotion: Yup.string().trim().required('Sales motion is required'),
    layOutHeaderText: Yup.string()
      .trim()
      .max(100, 'Maximum of  100 characters are allowed')
      .required('Header text is required'),
    layOutSubHeaderTxt: Yup.string()
      .trim()
      .max(200, 'Maximum of  200 characters are allowed')
      .required('Sub header text is required'),
    layOutHeaderImgWeb: Yup.string()
      .trim()
      .required('Header image is required'),
    layOutHeaderImgMobile: Yup.string()
      .trim()
      .required('Header image is required'),
    layOutFontColor: Yup.string().trim().required('Font color is required'),
    layOutFontStyle: Yup.string().trim().required('Font style is required'),
    callOutOneHeaderText: Yup.string()
      .trim()
      .required('Header text is required'),
    callOutOneSubHeaderTxt: Yup.string()
      .trim()
      .required('Sub header text is required'),
    callOutOneHeaderImg: Yup.string()
      .trim()
      .required('Header image is required'),
    callOutOneFontColor: Yup.string().trim().required('Font color is required'),
    callOutTwoHeaderText: Yup.string()
      .trim()
      .required('Header text is required'),
    callOutTwoSubHeaderTxt: Yup.string()
      .trim()
      .required('Sub header text is required'),
    callOutTwoHeaderImg: Yup.string()
      .trim()
      .required('Header image is required'),
    callOutTwoFontColor: Yup.string().trim().required('Font color is required'),
    ctaName: Yup.string().trim().required('CTA name is required'),
    ctaHeaderTxt: Yup.string().trim().required('Header text is required'),
    ctaSubHeaderTxt: Yup.string()
      .trim()
      .required('Sub header text is required'),
    ctaImage: Yup.string().trim().required('CTA image is required'),
    staticFormShow: Yup.boolean(),
    ctaFormHeader: Yup.string().when('staticFormShow', {
      is: true,
      then: Yup.string().trim().required('Form header is required').nullable(),
      otherwise: Yup.string().nullable(),
    }),
    ctaEmbeddedCode: Yup.string().when('staticFormShow', {
      is: false,
      then: Yup.string()
        .trim()
        .required('Embedded code is required')
        .nullable(),
      otherwise: Yup.string().nullable(),
    }),
  });

  const salesHubSiteRespData = useSelector(salesHubAccountResponse);
  const accountEngagements = useSelector(accountEngagementsResponse);

  const queryparams = new URLSearchParams(window.location.search);
  const partnershipID: string = queryparams.get('partner_id') || '0';
  const salesHubAccountId: string =
    queryparams.get('sales_hub_account_id') || '0';

  const handleFormChange = (event) => {
    const fieldName = event.target.getAttribute('name');
    const fieldValue = event.target.value;
    const newFormData = { ...staticFormData };
    newFormData[fieldName] = fieldValue;
    setStaticFormData(newFormData);
    setFormEdited(true);
  };

  const handleAllCheckBoxSelect = (event: any) => {
    if (event.target.checked) {
      const selectedData = keyNamesList.map((data: any) => data.lead_master_id);
      setLeadSelected(Array.from(new Set([...leadselected, ...selectedData])));
      return;
    }
    const selectedData = keyNamesList.map((data: any) => data.lead_master_id);
    const value = leadselected.filter((s: any) => !selectedData.includes(s));
    setLeadSelected(value);
    setFormEdited(true);
  };

  const handleCheckboxClick = (e: any, id: string) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    const selectedIndex = leadselected.indexOf(id);
    let newSelected: any[] = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(leadselected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(leadselected.slice(1));
    } else if (selectedIndex === leadselected.length - 1) {
      newSelected = newSelected.concat(leadselected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        leadselected.slice(0, selectedIndex),
        leadselected.slice(selectedIndex + 1)
      );
    }
    setLeadSelected(newSelected);
    setFormEdited(true);
  };

  const saveSalesHubAccount = (formValues: salesHubValues) => {
    if (formValues.staticFormShow && staticLeadData === null) {
      setNoStaticFormError(true);
    } else if (!showFieldError) {
      setLoader();
      dispatch(
        saveSalesHubAccountAction(
          formValues,
          staticLeadData,
          statusChosen,
          previewImage[companyLogo],
          previewImage[servicePartnerCompanyLogo],
          previewImage[siteLayoutImageWeb],
          previewImage[siteLayoutImageMobile],
          previewImage[calloutTwoImage],
          previewImage[calloutOneImage],
          previewImage[ctaImage],
          salesHubAccountId,
          salesHubAccIdSet,
          (name: string, value: number) =>
            setSalesHubAccIdSet((prevState: IdSetValues) => ({
              ...prevState,
              [name]: value,
            })),
          clearLoader,
          () =>
            setAlert((prevState: Alert) => ({
              ...prevState,
              showAlert: true,
              message:
                salesHubAccountId !== '0'
                  ? createAccount.salesHubSiteSuccessMsg
                  : createAccount.salesHubSiteCreateSuccessMsg,
              severity: 'success',
            })),
          () => {
            cancelHandler();
            fetchSalesHubAccountsList(0);
          },
          salesHubSiteRespData.currentSalesHubAccountId
        )
      );
    }
  };

  const getTypes = () => {
    const token = localStorage.getItem('token');

    getRequest('partnership/sales-hub-account/get-types/', {
      Authorization: `Token ${token}`,
    }).then((resp: any) => {
      if (resp.result === true) {
        const resData = resp.data;
        setAccountTypeList(resData);
      }
    });
  };

  const getCandence = () => {
    const token = localStorage.getItem('token');
    getRequest('partnership/sales-hub-account/get-team-checkin-frequency/', {
      Authorization: `Token ${token}`,
    }).then((resp: any) => {
      if (resp) {
        const resData = resp.data;
        setCandenceList(resData);
      }
    });
  };
  const fetchFontColorList = () => {
    const token = localStorage.getItem('token');

    getRequest(`partnership/sales-hub/font-colors/`, {
      Authorization: `Token ${token}`,
    }).then((response: any) => {
      if (response.result === true) {
        const colorList = response.data.map(
          (li: {
            name: string;
            font_color_id: number;
            description: string;
          }) => ({
            key: li.name,
            id: li.font_color_id,
            value: li.name,
          })
        );
        setFontColorList(colorList);
      }
    });
  };

  const fetchFontStyleList = () => {
    const token = localStorage.getItem('token');

    getRequest(`partnership/sales-hub/font-family/`, {
      Authorization: `Token ${token}`,
    }).then((response: any) => {
      if (response.result === true) {
        const styleList = response.data.map(
          (li: {
            name: string;
            font_family_id: number;
            description: string;
          }) => ({
            key: li.name,
            id: li.font_family_id,
            value: li.description,
          })
        );
        setFontStyleList(styleList);
      }
    });
  };

  const fetchAllAssetCollectData = (currOffset, salesMotionId) => {
    setOffset(currOffset);
    const token = localStorage.getItem('token');
    getRequest(
      `partnership/sales-motion/solution-narrative-mapping/?partnership_id=${partnershipID}&sales_motion_id=${salesMotionId}&is_selected=true&is_inactive=true`,
      {
        Authorization: `Token ${token}`,
      }
    ).then((response: any) => {
      if (response.result === true) {
        // if (response.data.length > 0) {
        setAssetCollectData(response.data);
        // } else {}
        if (response.count) {
          setCount(response.count);
        }
      }
    });
  };

  const fetchDeletedSalesMotion = (currSMId: any, isUpdateAcc) => {
    const token = localStorage.getItem('token');
    const SMId = currSMId || salesMotionId;
    getRequest(
      `partnership/sales-motion/?partnership_id=${partnershipID}&sales_motion_id=${SMId}&is_deleted=true`,
      {
        Authorization: `Token ${token}`,
      }
    ).then((response: any) => {
      if (response.result === true) {
        if (response.data) {
          const deletedSalesMotion = [
            {
              key: response.data.sales_motion_id,
              id: response.data.sales_motion_id,
              value:
                response.data?.name.length > 15
                  ? `${response.data.name.slice(0, 10)}...(deleted)`
                  : `${response.data.name} (deleted)`,
            },
          ];
          const newSMList = [
            ...new Map(
              [...salesMotionList, ...deletedSalesMotion].map((item) => [
                item.id,
                item,
              ])
            ).values(),
          ];
          console.log(salesMotionList, 'salesMotionList', newSMList);

          setSalesMotionList(newSMList);
          if (isUpdateAcc) {
            const siteLayoutValues = response.data.site_layout && {
              salesMotion: response.data.sales_motion_id,
              layOutHeaderText: response.data.site_layout.header_text,
              layOutSubHeaderTxt: response.data.site_layout.sub_header_text,
              layOutHeaderImgWeb: response.data.site_layout.header_image_name,
              layOutHeaderImgMobile:
                response.data.site_layout.mobile_header_image_name,
              layOutFontColor:
                response.data.site_layout.font_color.font_color_id,
              layOutFontStyle:
                response.data.site_layout.font_style.font_family_id,
            };
            const callOutOneValues = response.data.call_out_section_one && {
              callOutOneHeaderText:
                response.data.call_out_section_one.header_text,
              callOutOneSubHeaderTxt:
                response.data.call_out_section_one.sub_header_text,
              callOutOneHeaderImg:
                response.data.call_out_section_one.header_image_name,
              callOutOneFontColor:
                response.data.call_out_section_one.font_color.font_color_id,
            };
            const callOutTwoValues = response.data.call_out_section_two && {
              callOutTwoHeaderText:
                response.data.call_out_section_two.header_text,
              callOutTwoSubHeaderTxt:
                response.data.call_out_section_two.sub_header_text,
              callOutTwoHeaderImg:
                response.data.call_out_section_two.header_image_name,
              callOutTwoFontColor:
                response.data.call_out_section_two.font_color.font_color_id,
            };
            const ctaValues = response.data.cta && {
              ctaName: response.data.cta.name,
              ctaHeaderTxt: response.data.cta.header_text,
              description: response.data.cta.description,
              ctaSubHeaderTxt: response.data.cta.sub_header_text,
              ctaImage: response.data.cta.image_name,
              ctaEmbeddedCode: response.data.cta.embedded_code,
              ctaFormHeader: response.data.cta.form_header,
              staticFormShow: response.data?.cta?.is_static_form,
            };
            setCtaLeadDisplayList(response.data.cta?.lead_display);
            const prevFormValues = {
              ...formikForm?.current?.values,
              ...siteLayoutValues,
              ...callOutOneValues,
              ...callOutTwoValues,
              ...ctaValues,
            };

            if (response.data.site_layout) {
              setPreviewImage({
                type: 'SET_API_IMAGE_DETAILS',
                payload: {
                  key: siteLayoutImageWeb,
                  name: response.data.site_layout.header_image_name,
                  source: response.data.site_layout.header_image,
                },
              });
              setPreviewImage({
                type: 'SET_API_IMAGE_DETAILS',
                payload: {
                  key: siteLayoutImageMobile,
                  name: response.data.site_layout.mobile_header_image_name,
                  source: response.data.site_layout.mobile_header_image,
                },
              });
            }
            if (response.data.call_out_section_one) {
              setPreviewImage({
                type: 'SET_API_IMAGE_DETAILS',
                payload: {
                  key: calloutOneImage,
                  name: response.data.call_out_section_one.header_image_name,
                  source: response.data.call_out_section_one.header_image,
                },
              });
            }
            if (response.data.call_out_section_two) {
              setPreviewImage({
                type: 'SET_API_IMAGE_DETAILS',
                payload: {
                  key: calloutTwoImage,
                  name: response.data.call_out_section_two.header_image_name,
                  source: response.data.call_out_section_two.header_image,
                },
              });
            }
            if (response.data.cta) {
              setPreviewImage({
                type: 'SET_API_IMAGE_DETAILS',
                payload: {
                  key: ctaImage,
                  name: response.data.cta.image_name,
                  source: response.data.cta.image,
                },
              });
            }
            if (response.data.sales_motion_id) {
              fetchAllAssetCollectData(0, response.data.sales_motion_id);
            }
            setInitialValues({ ...prevFormValues });
          }
        }
      }
    });
  };

  const fetchSalesMotionDataById = (salesMotionId) => {
    const token = localStorage.getItem('token');
    getRequest(
      `partnership/sales-motion/?partnership_id=${partnershipID}&sales_motion_id=${salesMotionId}`,
      {
        Authorization: `Token ${token}`,
      }
    ).then((response: any) => {
      if (response.result === true) {
        if (response.data) {
          const siteLayoutValues = response.data.site_layout && {
            salesMotion: response.data.sales_motion_id,
            layOutHeaderText: response.data.site_layout.header_text,
            layOutSubHeaderTxt: response.data.site_layout.sub_header_text,
            layOutHeaderImgWeb: response.data.site_layout.header_image_name,
            layOutHeaderImgMobile:
              response.data.site_layout.mobile_header_image_name,
            layOutFontColor: response.data.site_layout.font_color.font_color_id,
            layOutFontStyle:
              response.data.site_layout.font_style.font_family_id,
          };
          if (response.data.sales_motion_id) {
            fetchAllAssetCollectData(0, response.data.sales_motion_id);
          }
          const callOutOneValues = response.data.call_out_section_one && {
            callOutOneHeaderText:
              response.data.call_out_section_one.header_text,
            callOutOneSubHeaderTxt:
              response.data.call_out_section_one.sub_header_text,
            callOutOneHeaderImg:
              response.data.call_out_section_one.header_image_name,
            callOutOneFontColor:
              response.data.call_out_section_one.font_color.font_color_id,
          };
          const callOutTwoValues = response.data.call_out_section_two && {
            callOutTwoHeaderText:
              response.data.call_out_section_two.header_text,
            callOutTwoSubHeaderTxt:
              response.data.call_out_section_two.sub_header_text,
            callOutTwoHeaderImg:
              response.data.call_out_section_two.header_image_name,
            callOutTwoFontColor:
              response.data.call_out_section_two.font_color.font_color_id,
          };
          const ctaValues = response.data.cta && {
            ctaName: response.data.cta.name,
            ctaHeaderTxt: response.data.cta.header_text,
            ctaSubHeaderTxt: response.data.cta.sub_header_text,
            ctaDescription: response.data.cta.description,
            ctaImage: response.data.cta.image_name,
            ctaEmbeddedCode: response.data.cta.embedded_code,
            ctaFormHeader: response.data.cta.form_header,
            staticFormShow: response.data?.cta?.is_static_form,
          };
          setCtaLeadDisplayList(response.data.cta?.lead_display);
          const prevFormValues = {
            ...formikForm?.current?.values,
            ...siteLayoutValues,
            ...callOutOneValues,
            ...callOutTwoValues,
            ...ctaValues,
          };

          if (response.data.site_layout) {
            setPreviewImage({
              type: 'SET_API_IMAGE_DETAILS',
              payload: {
                key: siteLayoutImageWeb,
                name: response.data.site_layout.header_image_name,
                source: response.data.site_layout.header_image,
              },
            });
            setPreviewImage({
              type: 'SET_API_IMAGE_DETAILS',
              payload: {
                key: siteLayoutImageMobile,
                name: response.data.site_layout.mobile_header_image_name,
                source: response.data.site_layout.mobile_header_image,
              },
            });
          }
          if (response.data.call_out_section_one) {
            setPreviewImage({
              type: 'SET_API_IMAGE_DETAILS',
              payload: {
                key: calloutOneImage,
                name: response.data.call_out_section_one.header_image_name,
                source: response.data.call_out_section_one.header_image,
              },
            });
          }
          if (response.data.call_out_section_two) {
            setPreviewImage({
              type: 'SET_API_IMAGE_DETAILS',
              payload: {
                key: calloutTwoImage,
                name: response.data.call_out_section_two.header_image_name,
                source: response.data.call_out_section_two.header_image,
              },
            });
          }
          if (response.data.cta) {
            setPreviewImage({
              type: 'SET_API_IMAGE_DETAILS',
              payload: {
                key: ctaImage,
                name: response.data.cta.image_name,
                source: response.data.cta.image,
              },
            });
          }
          setInitialValues({ ...prevFormValues });
        }
      }
    });
  };

  const fetchSalesHubAccountDetailById = () => {
    setLoader();
    const token = localStorage.getItem('token');
    getRequest(
      `partnership/sales-hub-account/?partnership_id=${partnershipID}&sales_hub_account_id=${salesHubAccountId}`,
      {
        Authorization: `Token ${token}`,
      }
    ).then((response: any) => {
      if (response.result === true) {
        const siteLayoutValues = response.data.site_layout && {
          salesMotion: response.data.site_layout.sales_motion.sales_motion_id,
          layOutHeaderText: response.data.site_layout.header_text,
          layOutSubHeaderTxt: response.data.site_layout.sub_header_text,
          layOutHeaderImgWeb: response.data.site_layout.header_image_name,
          layOutHeaderImgMobile:
            response.data.site_layout.mobile_header_image_name,
          layOutFontColor: response.data.site_layout.font_color.font_color_id,
          layOutFontStyle: response.data.site_layout.font_style.font_family_id,
        };
        if (response.data.site_layout.sales_motion.sales_motion_id) {
          fetchAllAssetCollectData(
            0,
            response.data.site_layout.sales_motion.sales_motion_id
          );
          setSalesMotionId(
            response?.data?.site_layout?.sales_motion?.sales_motion_id
          );
        }
        const callOutOneValues = response.data.call_out_section_one && {
          callOutOneHeaderText: response.data.call_out_section_one.header_text,
          callOutOneSubHeaderTxt:
            response.data.call_out_section_one.sub_header_text,
          callOutOneHeaderImg:
            response.data.call_out_section_one.header_image_name,
          callOutOneFontColor:
            response.data.call_out_section_one.font_color.font_color_id,
        };
        const callOutTwoValues = response.data.call_out_section_two && {
          callOutTwoHeaderText: response.data.call_out_section_two.header_text,
          callOutTwoSubHeaderTxt:
            response.data.call_out_section_two.sub_header_text,
          callOutTwoHeaderImg:
            response.data.call_out_section_two.header_image_name,
          callOutTwoFontColor:
            response.data.call_out_section_two.font_color.font_color_id,
        };
        const ctaValues = response.data.cta && {
          ctaName: response.data.cta.name,
          ctaHeaderTxt: response.data.cta.header_text,
          ctaSubHeaderTxt: response.data.cta.sub_header_text,
          ctaDescription: response.data.cta.description,
          ctaImage: response.data.cta.image_name,
          ctaEmbeddedCode: response.data.cta.embedded_code,
          ctaFormHeader: response.data.cta.form_header,
          staticFormShow: response?.data?.cta?.is_static_form,
        };
        setCtaLeadDisplayList(response.data.cta?.lead_display);
        const prevFormValues = {
          ...formikForm?.current?.values,
          companyName: response.data.company_name,
          companyLogo: response.data.company_logo_name,
          domainName: response.data.domain_name,
          accountType: response.data.account_type_id,
          industry: response.data.industry,
          targetBuyerTitles: response.data.target_buyer_titles,
          candenceValue: response.data.team_checkin_cadence_day,
          candenceFrequency: response.data.team_checkin_cadence_frequency,
          servicePartnerName: response.data.service_provider_name,
          servicePartnerLogo: response.data.service_provider_logo_name,
          companyWebsite: response.data.company_website,
          cadenceShow: response.data.is_team_checkin_cadence || false,
          servicePartnerShow:
            response.data.is_service_partner_involved || false,
          ...siteLayoutValues,
          ...callOutOneValues,
          ...callOutTwoValues,
          ...ctaValues,
        };
        localStorage.setItem('accName', response.data.company_name);

        setInitialValues({ ...prevFormValues });
        setStatusChosen(response.data.status_id);
        setAccountTitle(response.data.company_name);
        setPrevDomain(response.data?.partnership?.content_hub_subdomain_name);
        setPreviewImage({
          type: 'SET_API_IMAGE_DETAILS',
          payload: {
            key: companyLogo,
            name: response.data.company_logo_name,
            source: response.data.company_logo,
          },
        });

        setPreviewImage({
          type: 'SET_API_IMAGE_DETAILS',
          payload: {
            key: servicePartnerCompanyLogo,
            name: response.data.service_provider_name,
            source: response.data.service_provider_logo,
          },
        });
        if (response.data.site_layout) {
          setPreviewImage({
            type: 'SET_API_IMAGE_DETAILS',
            payload: {
              key: siteLayoutImageWeb,
              name: response.data.site_layout.header_image_name,
              source: response.data.site_layout.header_image,
            },
          });
          setPreviewImage({
            type: 'SET_API_IMAGE_DETAILS',
            payload: {
              key: siteLayoutImageMobile,
              name: response.data.site_layout.mobile_header_image_name,
              source: response.data.site_layout.mobile_header_image,
            },
          });
        }
        if (response.data.call_out_section_one) {
          setPreviewImage({
            type: 'SET_API_IMAGE_DETAILS',
            payload: {
              key: calloutOneImage,
              name: response.data.call_out_section_one.header_image_name,
              source: response.data.call_out_section_one.header_image,
            },
          });
        }
        if (response.data.call_out_section_two) {
          setPreviewImage({
            type: 'SET_API_IMAGE_DETAILS',
            payload: {
              key: calloutTwoImage,
              name: response.data.call_out_section_two.header_image_name,
              source: response.data.call_out_section_two.header_image,
            },
          });
        }
        if (response.data.cta) {
          setPreviewImage({
            type: 'SET_API_IMAGE_DETAILS',
            payload: {
              key: ctaImage,
              name: response.data.cta.image_name,
              source: response.data.cta.image,
            },
          });
        }

        setSalesHubAccIdSet({
          siteLayoutId:
            response.data.site_layout &&
            response.data.site_layout.site_layout_id,
          callOutSecOneId:
            response.data.call_out_section_one &&
            response.data.call_out_section_one.call_out_section_one_id,
          callOutSecTwoId:
            response.data.call_out_section_two &&
            response.data.call_out_section_two.call_out_section_two_id,
          ctaId: response.data.cta && response.data.cta.cta_id,
        });
        clearLoader();
      } else {
        clearLoader();
      }
    });
  };

  const fetchSalesMotionList = () => {
    const token = localStorage.getItem('token');
    getRequest(
      `partnership/sales-motion/?partnership_id=${partnershipID}&offset=${0}&limit=${50}`,
      {
        Authorization: `Token ${token}`,
      }
    ).then((response: any) => {
      if (response.result === true) {
        const salesMotionData =
          response.data &&
          response.data.map((data: any) => ({
            key: data.name,
            id: data.sales_motion_id,
            value: data.name,
          }));
        const updatedSM = [
          ...new Map(
            [...salesMotionList, ...salesMotionData].map((item) => [
              item.id,
              item,
            ])
          ).values(),
        ];
        console.log(salesMotionData, 'salesMotionData', updatedSM);
        setSalesMotionList(updatedSM);
      }
    });
  };

  const getStaticKeyNames = () => {
    const token = localStorage.getItem('token');
    const headerData = {
      Authorization: `Token ${token}`,
    };
    getRequest(`partnership/lead-master/`, headerData).then((resp: any) => {
      if (resp.result === true) {
        setKeyNamesList(resp.data);
      }
    });
  };

  useEffect(() => {
    const leadIds = [];
    keyNamesList?.forEach((element, index, array) => {
      staticFormData[element.key_name] = element.key_name;
    });
    keyNamesList?.forEach((element, index, array) => {
      ctaLeadDisplayList?.forEach((ele, index, array) => {
        if (element.lead_master_id === ele.lead_master_id) {
          staticFormData[element.key_name] = ele?.display_name;
          leadIds.push(ele?.lead_master_id);
        }
      });
    });
    setLeadSelected(leadIds);
  }, [ctaLeadDisplayList, keyNamesList]);

  useEffect(() => {
    setNoStaticFormError(false);
    const leadDefaultData = keyNamesList?.map((data, index) =>
      `${staticFormData[Object.keys(staticFormData)[index]]}` !== '' &&
      `${staticFormData[Object.keys(staticFormData)[index]]}` !== 'undefined' &&
      leadselected.includes(data.lead_master_id)
        ? {
            ...data,
            value: `${staticFormData[Object.keys(staticFormData)[index]]}`,
          }
        : ''
    );
    const leadMasterDefaultData = leadDefaultData
      ? Object.values(
          Object.fromEntries(
            Object.entries(leadDefaultData).filter(
              ([_, v]) => v !== '' && v !== 'undefined'
            )
          )
        )
      : '';
    setStaticLeadData(
      leadMasterDefaultData?.length === 0 ? null : leadMasterDefaultData
    );

    if (leadMasterDefaultData?.length !== leadselected.length) {
      setShowFieldError(true);
    } else {
      setShowFieldError(false);
    }
  }, [leadselected]);

  useEffect(() => {
    const leadData = keyNamesList?.map((data, index) =>
      `${staticFormData[Object.keys(staticFormData)[index]]}` !== '' &&
      `${staticFormData[Object.keys(staticFormData)[index]]}` !== 'undefined' &&
      leadselected.includes(data.lead_master_id)
        ? {
            ...data,
            value: `${staticFormData[Object.keys(staticFormData)[index]]}`,
          }
        : ''
    );
    const leadMasterData = leadData
      ? Object.values(
          Object.fromEntries(
            Object.entries(leadData).filter(
              ([_, v]) => v !== '' && v !== 'undefined'
            )
          )
        )
      : staticLeadData;
    setStaticLeadData(leadMasterData?.length === 0 ? null : leadMasterData);
    if (leadMasterData?.length !== leadselected.length) {
      setShowFieldError(true);
    } else {
      setShowFieldError(false);
    }
  }, [staticFormData]);

  useEffect(() => {
    getTypes();
    getCandence();
    fetchFontStyleList();
    fetchFontColorList();
    fetchSalesMotionList();
    getStaticKeyNames();
    if (salesHubAccountId !== '0') {
      // fetchSalesOpportunityList();
      fetchSalesHubAccountDetailById();
      getAccContactsDetails(0);
      GetExportData();
    }
    dispatch(
      setGeneralErrMsg({
        generalErrMsg: '',
        generalValidationField: '',
      })
    );
    setCtaErrMsg({
      ctaErrMsg: '',
      ctaValidationField: '',
    });
    setaccountTeamErrMsg({
      accountTeamErrMsg: '',
      accountTeamValidationField: '',
    });
  }, []);

  useEffect(() => {
    fetchDeletedSalesMotion(null, false);
  }, [salesMotionId]);

  useEffect(() => {
    Object.keys(previewImage).forEach((el) => {
      if (previewImage[el]?.cropped && !formEdited) {
        setFormEdited(true);
      }
      if (
        previewImage[el]?.error &&
        previewImage[el]?.cropped &&
        formikForm &&
        formikForm?.current
      ) {
        switch (el) {
          case previewImageLables.companyLogo:
            formikForm?.current?.setFieldError('companyLogo', '');
            break;
          case previewImageLables.servicePartnerCompanyLogo:
            formikForm?.current?.setFieldError('servicePartnerLogo', '');
            break;
          case previewImageLables.siteLayoutImageWeb:
            formikForm?.current?.setFieldError('layOutHeaderImgWeb', '');
            break;
          case previewImageLables.siteLayoutImageMobile:
            formikForm?.current?.setFieldError('layOutHeaderImgMobile', '');
            break;
          case previewImageLables.calloutOneImage:
            formikForm?.current?.setFieldError('callOutOneHeaderImg', '');
            break;
          case previewImageLables.calloutTwoImage:
            formikForm?.current?.setFieldError('callOutTwoHeaderImg', '');
            break;
          case previewImageLables.ctaImage:
            formikForm?.current?.setFieldError('ctaImage', '');
            break;
          default:
            break;
        }
      }
    });
  }, [previewImage]);

  const onFileSelected = (event: any, fieldName: string) => {
    const file = event.target.files[0];

    if (
      file &&
      file.name &&
      formikForm &&
      formikForm.current &&
      file.type.includes('image/')
    ) {
      const fileName = file.name as string;

      formikForm?.current?.setFieldValue(fieldName, fileName);

      if (fieldName === 'companyLogo') {
        setPreviewImageFileData(companyLogo, file);
      } else if (fieldName === 'servicePartnerLogo') {
        setPreviewImageFileData(servicePartnerCompanyLogo, file);
      } else if (fieldName === 'layOutHeaderImgWeb') {
        setPreviewImageFileData(siteLayoutImageWeb, file);
      } else if (fieldName === 'layOutHeaderImgMobile') {
        setPreviewImageFileData(siteLayoutImageMobile, file);
      } else if (fieldName === 'callOutOneHeaderImg') {
        setPreviewImageFileData(calloutOneImage, file);
      } else if (fieldName === 'callOutTwoHeaderImg') {
        setPreviewImageFileData(calloutTwoImage, file);
      } else if (fieldName === 'ctaImage') {
        setPreviewImageFileData(ctaImage, file);
      }
    } else {
      setAlert((prevState: Alert) => ({
        ...prevState,
        showAlert: true,
        message: 'Invalid file format. Please use jpg, png, or svg.',
        severity: 'error',
      }));
    }
  };
  const OnImageCancel = (fieldName: any) => {
    setFormEdited(true);
    if (fieldName === 'companyLogo') {
      setPreviewImage({
        type: 'SET_IMAGEFILE_CANCEL',
        payload: { key: companyLogo },
      });
    } else if (fieldName === 'servicePartnerLogo') {
      setPreviewImage({
        type: 'SET_IMAGEFILE_CANCEL',
        payload: { key: servicePartnerCompanyLogo },
      });
    } else if (fieldName === 'layOutHeaderImgWeb') {
      setPreviewImage({
        type: 'SET_IMAGEFILE_CANCEL',
        payload: { key: siteLayoutImageWeb },
      });
    } else if (fieldName === 'layOutHeaderImgMobile') {
      setPreviewImage({
        type: 'SET_IMAGEFILE_CANCEL',
        payload: { key: siteLayoutImageMobile },
      });
    } else if (fieldName === 'callOutOneHeaderImg') {
      setPreviewImage({
        type: 'SET_IMAGEFILE_CANCEL',
        payload: { key: calloutOneImage },
      });
    } else if (fieldName === 'callOutTwoHeaderImg') {
      setPreviewImage({
        type: 'SET_IMAGEFILE_CANCEL',
        payload: { key: calloutTwoImage },
      });
    } else if (fieldName === 'ctaImage') {
      setPreviewImage({
        type: 'SET_IMAGEFILE_CANCEL',
        payload: { key: ctaImage },
      });
    }
    formikForm?.current?.setFieldValue(fieldName, '');
  };
  return (
    <div
      className={`${styles.salesHubAccFormWrap} ${styles.salesHubAccFormMarginBottom}`}
    >
      <Formik
        innerRef={formikForm}
        enableReinitialize
        initialValues={initialValues}
        validationSchema={salesHubAccCreationSchema}
        onSubmit={(values) => {
          let errorImage = false;
          Object.keys(previewImage).forEach((el) => {
            if (previewImage[el].error && !previewImage[el].cropped) {
              errorImage = true;
              switch (el) {
                case previewImageLables.companyLogo:
                  formikForm?.current?.setFieldError(
                    'companyLogo',
                    previewImage[el].error
                  );
                  break;
                case previewImageLables.servicePartnerCompanyLogo:
                  formikForm?.current?.setFieldError(
                    'servicePartnerLogo',
                    previewImage[el].error
                  );
                  break;
                case previewImageLables.siteLayoutImageWeb:
                  formikForm?.current?.setFieldError(
                    'layOutHeaderImgWeb',
                    previewImage[el].error
                  );
                  break;
                case previewImageLables.siteLayoutImageMobile:
                  formikForm?.current?.setFieldError(
                    'layOutHeaderImgMobile',
                    previewImage[el].error
                  );
                  break;
                case previewImageLables.calloutOneImage:
                  formikForm?.current?.setFieldError(
                    'callOutOneHeaderImg',
                    previewImage[el].error
                  );
                  break;
                case previewImageLables.calloutTwoImage:
                  formikForm?.current?.setFieldError(
                    'callOutTwoHeaderImg',
                    previewImage[el].error
                  );
                  break;
                case previewImageLables.ctaImage:
                  formikForm?.current?.setFieldError(
                    'ctaImage',
                    previewImage[el].error
                  );
                  break;
                default:
                  break;
              }
            }
          });
          if (errorImage) return;
          console.log(values, 'values');
          saveSalesHubAccount(values);
        }}
      >
        {(formik) => {
          const {
            handleChange,
            handleSubmit,
            handleBlur,
            validateField,
            setFieldValue,
            values,
            errors,
            dirty,
          } = formik;

          setIsDirty(dirty);

          return (
            <>
              <Form
                style={{
                  width: '100%',
                }}
                id="createAccount"
                onSubmit={(e) => {
                  e.preventDefault();
                  console.log('called in submitin');

                  setShowGeneral(true);
                  setShowSiteLayout(true);
                  setShowSection1(true);
                  setShowSection2(true);
                  setAssetCollectionShow(true);
                  setShowCta(true);
                  handleSubmit(e);
                }}
                className={`${
                  salesHubAccountId !== '0'
                    ? styles.salesHubEditAccForm
                    : `${styles.salesHubSectionFormWrap} ${styles.salesHubAccForm}`
                }`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                  }
                }}
              >
                {salesHubAccountId !== '0' && (dirty || formEdited) && (
                  <div
                    className={`${styles.accInfoBtnWrap} ${
                      salesHubAccountId !== '0'
                        ? styles.bottomLayerAccount
                        : styles.bottomLayer
                    }`}
                  >
                    <SecondaryButton
                      onClick={() => {
                        if (dirty || formEdited) setShowCloseWarning(true);
                        else cancelHandler();
                      }}
                      style={{ minWidth: '160px', marginRight: '30px' }}
                    >
                      {ButtonLabels.cancel}
                    </SecondaryButton>
                    <PrimaryButton type="submit" style={{ minWidth: '160px' }}>
                      {ButtonLabels.save}
                    </PrimaryButton>
                  </div>
                )}
                <GeneralForm
                  formikValues={formik.values}
                  errors={formik.errors}
                  touched={formik.touched}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  accountTypeList={accountTypeList}
                  candenceList={candenceList}
                  onFileSelected={onFileSelected}
                  validateField={validateField}
                  companyLogo={previewImage[companyLogo]}
                  servicePartnerLogo={previewImage[servicePartnerCompanyLogo]}
                  OnImageCancel={OnImageCancel}
                  showGeneral={showGeneral}
                  setShowGeneral={setShowGeneral}
                  statusShow={statusShow}
                  setStatusChosen={setStatusChosen}
                  statusChosen={statusChosen}
                  statusList={statusList}
                  prevDomainName={prevDomainName}
                  setFormEdited={setFormEdited}
                  setFieldValue={setFieldValue}
                  setPreviewImage={setPreviewImage}
                  setLoader={setLoader}
                  clearLoader={clearLoader}
                />
                <SiteLayout
                  formikValues={formik.values}
                  errors={formik.errors}
                  touched={formik.touched}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  styles={styles}
                  fontColorList={fontColorList}
                  fontStyleList={fontStyleList}
                  salesMotionList={salesMotionList}
                  onFileSelected={onFileSelected}
                  layOutHeaderImageWeb={previewImage[siteLayoutImageWeb]}
                  layOutHeaderImageMobile={previewImage[siteLayoutImageMobile]}
                  fetchSalesMotionDataById={fetchSalesMotionDataById}
                  OnImageCancel={OnImageCancel}
                  fetchAllAssetCollectData={fetchAllAssetCollectData}
                  showSiteLayout={showSiteLayout}
                  setShowSiteLayout={setShowSiteLayout}
                  setFormEdited={setFormEdited}
                  fetchDeletedSalesMotion={fetchDeletedSalesMotion}
                  fetchSalesHubAccountDetailById={
                    fetchSalesHubAccountDetailById
                  }
                  setPreviewImage={setPreviewImage}
                  setLoader={setLoader}
                  clearLoader={clearLoader}
                />
                <CallOutSecOne
                  formikValues={formik.values}
                  errors={formik.errors}
                  touched={formik.touched}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  styles={styles}
                  fontColorList={fontColorList}
                  fontStyleList={fontStyleList}
                  callOutOneHeaderImage={previewImage[calloutOneImage]}
                  OnImageCancel={OnImageCancel}
                  onFileSelected={onFileSelected}
                  showSection1={showSection1}
                  setShowSection1={setShowSection1}
                  setPreviewImage={setPreviewImage}
                  setLoader={setLoader}
                  clearLoader={clearLoader}
                />
                <CallOutSecTwo
                  formikValues={formik.values}
                  errors={formik.errors}
                  touched={formik.touched}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  styles={styles}
                  fontColorList={fontColorList}
                  fontStyleList={fontStyleList}
                  callOutTwoHeaderImage={previewImage[calloutTwoImage]}
                  OnImageCancel={OnImageCancel}
                  onFileSelected={onFileSelected}
                  showSection2={showSection2}
                  setShowSection2={setShowSection2}
                  setPreviewImage={setPreviewImage}
                  setLoader={setLoader}
                  clearLoader={clearLoader}
                />

                <AssetCollection
                  formikValues={formik.values}
                  offset={offset}
                  limit={limit}
                  count={count}
                  assetCollectData={assetCollectData}
                  assetCollectionShow={assetCollectionShow}
                  setAssetCollectionShow={setAssetCollectionShow}
                />
                <CtaLayout
                  formikValues={formik.values}
                  errors={formik.errors}
                  touched={formik.touched}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  ctaImage={previewImage[ctaImage]}
                  OnImageCancel={OnImageCancel}
                  onFileSelected={onFileSelected}
                  showCta={showCta}
                  setShowCta={setShowCta}
                  setPreviewImage={setPreviewImage}
                  setLoader={setLoader}
                  clearLoader={clearLoader}
                  keyNamesList={keyNamesList}
                  staticFormData={staticFormData}
                  handleFormChange={handleFormChange}
                  leadselected={leadselected}
                  handleAllCheckBoxSelect={handleAllCheckBoxSelect}
                  handleCheckboxClick={handleCheckboxClick}
                  showFieldError={showFieldError}
                  noStaticFormError={noStaticFormError}
                />
                <AccountTeam
                  formikValues={formik.values}
                  errors={formik.errors}
                  touched={formik.touched}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  setShowAccountTeam={setShowAccountTeam}
                  showAccountTeam={showAccountTeam}
                  setActiveAddUserMenu={setActiveAddUserMenu}
                  accountTeamList={accountTeamList}
                  setAccountTeamList={setAccountTeamList}
                  fetchAccountTeamList={fetchAccountTeamList}
                  accountTeamCount={accountTeamCount}
                  accountTeamLimit={accountTeamLimit}
                  setLoader={setLoader}
                  clearLoader={clearLoader}
                  setAlert={(msg: string) =>
                    setAlert((prevState: Alert) => ({
                      ...prevState,
                      showAlert: true,
                      message: msg,
                      severity: 'success',
                    }))
                  }
                />

                <div className={styles.lastCard} />

                {salesHubAccountId === '0' && (
                  <div
                    className={`${styles.accInfoBtnWrap} ${
                      salesHubAccountId !== '0'
                        ? styles.bottomLayerAccount
                        : styles.bottomLayer
                    }`}
                  >
                    <SecondaryButton
                      onClick={() => {
                        if (dirty || formEdited) setShowCloseWarning(true);
                        else cancelHandler();
                      }}
                      style={{ minWidth: '160px', marginRight: '30px' }}
                    >
                      {ButtonLabels.cancel}
                    </SecondaryButton>
                    <PrimaryButton type="submit" style={{ minWidth: '160px' }}>
                      {ButtonLabels.save}
                    </PrimaryButton>
                  </div>
                )}
              </Form>
            </>
          );
        }}
      </Formik>
      {showCloseWarning && (
        <DialogBoxComponent
          title=""
          secondaryContent="Are you sure you want to discard changes made on this page?"
          primaryContent="Unsaved Changes"
          primaryButton="Discard"
          secondaryButton="Cancel"
          handleDialogBoxClose={() => {
            if (accountEngagements.AccountEngagementWarningEditor.show) {
              dispatch(
                setShowAccountEngagementWarningEditor({
                  show: false,
                  navigateAction: null,
                })
              );
            }
            setShowCloseWarning(false);
          }}
          handleAgree={() => {
            dispatch(
              setShowAccountEngagementWarningEditor({
                show: false,
                navigateAction: null,
              })
            );
            dispatch(
              setIsAccountEngagementFormEdited({
                isAccountEngagementFormEdited: false,
              })
            );
            if (accountEngagements.AccountEngagementWarningEditor.show) {
              setShowCloseWarning(false);
              setFormEdited(false);
              setIsDirty(false);
              cancelHandler();
              accountEngagements.AccountEngagementWarningEditor.navigateAction();
              return;
            }
            setShowCloseWarning(false);
            cancelHandler();
            setFormEdited(false);
            setIsDirty(false);
          }}
          show
        />
      )}
    </div>
  );
};
export default CreateAccount;
