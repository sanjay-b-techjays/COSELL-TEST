/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable linebreak-style */
/* eslint-disable camelcase */
/* eslint-disable object-curly-newline */
/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */
/* eslint-disable linebreak-style */
import React, { useState, useEffect, useRef } from 'react';

import { Formik, Form, FormikProps } from 'formik';
import * as Yup from 'yup';
import SnackbarAlert from 'src/app/components/Snackbar/Snackbar';
import SecondaryButton from 'src/app/components/Button/SecondaryButton';
import PrimaryButton from 'src/app/components/Button/PrimaryButton';
import { getRequest, multiPartPutRequest, postRequest } from 'src/app/service';
import Loader from 'src/app/components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import {
  SalesMotionLabels,
  ButtonLabels,
  errorMessageLabels,
  previewImageLables,
} from 'src/strings';
import useThumbnailImage from 'src/app/components/PreviewImage/CustomHook/useThumbnailImage';
import { useMediaQuery } from 'react-responsive';
import GeneralForm from '../GeneralForm/GeneralForm';
import SiteLayout from '../SiteLayout/SiteLayout';
import CallOutSectionOne from '../CallOutSectionOne/CallOutSectionOne';
import CallOutSectionTwo from '../CallOutSectionTwo/CallOutSectionTwo';
import AssetCollection from '../AssetCollection/AssetCollection';
import CTAConfiguration from '../CTAConfiguration/CTAConfiguration';
import styles from '../../SalesMotion.module.css';
import { salesMotionValues, savedValues } from '../../types';
import DialogBoxComponent from '../../../../components/DialogBox/DialogBox';
import {
  saveSalesMotionAction,
  updateSalesMotionAction,
  setSiteLayoutErrMsg,
  setCallOutOneErrMsg,
  setCallOutTwoErrMsg,
  setCtaErrMsg,
  selectSalesMotionResponse,
  setGeneralErrMsg,
  setRefreshTimeStamp,
} from '../../SalesMotionSlice';

interface alert {
  showAlert: boolean;
  severity: string;
  message: string;
}

const CreateSalesMotion = (props: any) => {
  const {
    selectedSalesMotion,
    closeHandler,
    setAlert,
    setError,
    error,
    showCloseWarning,
    setShowCloseWarning,
    setIsDirty,
    isFormEdited,
    setIsFormEdited,
  } = props;
  const dispatch = useDispatch();
  const salesMotionRespData = useSelector(selectSalesMotionResponse);
  const isMobile = useMediaQuery({ query: '(max-width: 750px)' });
  const formikForm = useRef<FormikProps<salesMotionValues>>(null);
  const [fontColorList, setFontColorList] = useState([]);
  const [fontStyleList, setFontStyleList] = useState([]);
  const [selected, setSelected] = useState([]);
  const [salesMotionId, setSalesMotionId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(0);
  const [assetCollectData, setAssetCollectData] = useState([]);
  const [general, setGeneral] = useState(true);
  const [siteLayout, setSiteLayout] = useState(true);
  const [callOutSectionOneShow, setCallOutSectionOneShow] = useState(true);
  const [callOutSectionTwoShow, setCallOutSectionTwoShow] = useState(true);
  const [assetCollectionShow, setAssetCollectionShow] = useState(true);
  const [ctaShow, setCtaShow] = useState(true);
  const [keyNamesList, setKeyNamesList] = useState(null);
  const [staticFormData, setStaticFormData] = useState({});
  const [staticLeadData, setStaticLeadData] = useState(null);
  const [ctaLeadDisplayList, setCtaLeadDisplayList] = useState(null);
  const [leadselected, setLeadSelected] = useState([]);
  const [showFieldError, setShowFieldError] = useState(false);
  const [noStaticFormError, setNoStaticFormError] = useState(false);

  const [salesMotionIdSet, setSalesMotionIdSet] = useState({
    siteLayoutId: '',
    callOutSecOneId: '',
    callOutSecTwoId: '',
    ctaId: '',
  });

  const [actionType, setactionType] = useState({
    action: null,
    dataLength: 0,
  });

  const [initialValues, setInitialValues] = useState<salesMotionValues>({
    name: '',
    description: '',
    targetBuyerTitles: [],
    layoutHeaderText: '',
    staticFormShow: false,
    layoutSubHeaderText: '',
    layoutHeaderImageWeb: '',
    layoutHeaderImageMobile: '',
    layoutFontColor: '',
    layoutFontStyle: '',
    callOutOneheaderText: '',
    callOutOneSubHeaderText: '',
    callOutOneHeaderImage: '',
    callOutOneFontColor: '',
    callOutTwoHeaderText: '',
    callOutTwoSubHeaderText: '',
    callOutTwoHeaderImage: '',
    callOutTwoFontColor: '',
    ctaName: '',
    ctaHeaderText: '',
    ctaSubHeaderText: '',
    ctaDescription: '',
    ctaImage: '',
    ctaFormHeader: '',
    ctaEmbeddedCode: '',
  });

  const salesMotionCreationSchema = Yup.object().shape({
    name: Yup.string().trim().required('Name is required'),
    description: Yup.string().trim().required('Description is required'),
    targetBuyerTitles: Yup.array().min(
      1,
      'Minimum 1 Target buyer title is required'
    ),
    // domainName: Yup.string()
    //   .trim()
    //   .required('Domain name is required')
    //   .matches(/^[a-z][a-z0-9-_]{1,62}$/, 'Enter a valid domain name'),
    layoutHeaderText: Yup.string()
      .trim()
      .max(100, 'Maximum of  100 characters are allowed')
      .required('Header text is required'),
    layoutSubHeaderText: Yup.string()
      .trim()
      .max(200, 'Maximum of  200 characters are allowed')
      .required('Sub header text is required'),
    layoutHeaderImageWeb: Yup.string()
      .trim()
      .required('Header image is required'),
    layoutHeaderImageMobile: Yup.string()
      .trim()
      .required('Header image is required'),
    layoutFontColor: Yup.string().trim().required('Font color is required'),
    layoutFontStyle: Yup.string().trim().required('Font style is required'),
    callOutOneheaderText: Yup.string()
      .trim()
      .required('Header text is required'),
    callOutOneSubHeaderText: Yup.string()
      .trim()
      .required('Sub header text is required'),
    callOutOneHeaderImage: Yup.string()
      .trim()
      .required('Header image is required'),
    callOutOneFontColor: Yup.string().trim().required('Font color is required'),
    callOutTwoHeaderText: Yup.string()
      .trim()
      .required('Header text is required'),
    callOutTwoSubHeaderText: Yup.string()
      .trim()
      .required('Sub header text is required'),
    callOutTwoHeaderImage: Yup.string()
      .trim()
      .required('Header image is required'),
    callOutTwoFontColor: Yup.string().trim().required('Font color is required'),
    ctaName: Yup.string().trim().required('CTA name is required'),
    ctaHeaderText: Yup.string().trim().required('Header text is required'),
    ctaSubHeaderText: Yup.string()
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
  const {
    siteLayoutImageWeb,
    siteLayoutImageMobile,
    calloutOneImage,
    calloutTwoImage,
    ctaImage,
  } = previewImageLables;
  const [previewImage, setPreviewImage, setPreviewImageFileData] =
    useThumbnailImage([
      { key: siteLayoutImageWeb, aspectRatio: 2 / 1 },
      { key: siteLayoutImageMobile, aspectRatio: 5 / 8 },
      { key: calloutOneImage, aspectRatio: 19 / 2 },
      { key: calloutTwoImage, aspectRatio: 7 / 5 },
      { key: ctaImage, aspectRatio: 8 / 5 },
    ]);
  const OnImageCancel = (field: string) => {
    setIsFormEdited(true);
    formikForm?.current?.setFieldValue(field, '');

    if (field === 'layoutHeaderImageWeb') {
      setPreviewImage({
        type: 'SET_IMAGEFILE_CANCEL',
        payload: { key: siteLayoutImageWeb },
      });
    } else if (field === 'layoutHeaderImageMobile') {
      setPreviewImage({
        type: 'SET_IMAGEFILE_CANCEL',
        payload: { key: siteLayoutImageMobile },
      });
    } else if (field === 'callOutOneHeaderImage') {
      setPreviewImage({
        type: 'SET_IMAGEFILE_CANCEL',
        payload: { key: calloutOneImage },
      });
    } else if (field === 'callOutTwoHeaderImage') {
      setPreviewImage({
        type: 'SET_IMAGEFILE_CANCEL',
        payload: { key: calloutTwoImage },
      });
    } else if (field === 'ctaImage') {
      setPreviewImage({
        type: 'SET_IMAGEFILE_CANCEL',
        payload: { key: ctaImage },
      });
    }
  };
  const onFileSelected = (event: any, field: string, values: any) => {
    const file = event.target.files[0];
    if (
      file &&
      file.name &&
      formikForm &&
      formikForm.current &&
      file.type.includes('image/')
    ) {
      setIsFormEdited(true);
      if (field === 'layoutHeaderImageWeb') {
        console.log('inside layoutHeaderImageWeb', file, field);
        setPreviewImageFileData(siteLayoutImageWeb, file);
        values.layoutHeaderImageWeb = file.name as string;
      } else if (field === 'layoutHeaderImageMobile') {
        console.log('inside layoutHeaderImageMobile', file, field);
        setPreviewImageFileData(siteLayoutImageMobile, file);
        values.layoutHeaderImageMobile = file.name as string;
      } else if (field === 'callOutOneHeaderImage') {
        setPreviewImageFileData(calloutOneImage, file);
        values.callOutOneHeaderImage = file.name as string;
      } else if (field === 'callOutTwoHeaderImage') {
        setPreviewImageFileData(calloutTwoImage, file);
        values.callOutTwoHeaderImage = file.name as string;
      } else if (field === 'ctaImage') {
        setPreviewImageFileData(ctaImage, file);
        values.ctaImage = file.name as string;
      }
    } else {
      setAlert((prevState: alert) => ({
        ...prevState,
        showAlert: true,
        message: errorMessageLabels.fileErrorMessage,
        severity: 'error',
      }));
    }
  };

  const handleFormChange = (event) => {
    const fieldName = event.target.getAttribute('name');
    const fieldValue = event.target.value;
    const newFormData = { ...staticFormData };
    newFormData[fieldName] = fieldValue;
    setStaticFormData(newFormData);
    setIsFormEdited(true);
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
    setIsFormEdited(true);
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
    setIsFormEdited(true);
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
  }, [ctaLeadDisplayList,keyNamesList]);

  useEffect(() => {
    setNoStaticFormError(false)
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

    if (leadMasterDefaultData?.length !== leadselected.length)
      setShowFieldError(true);
    else {
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

  const handleSaveCTA = (
    formValues: salesMotionValues,
    currSalesMotionId: number
  ) => {
    const previewImageValue = previewImage[previewImageLables.ctaImage];
    const ctaFile = formValues.ctaImage
      ? previewImageValue?.cropped
        ? previewImageValue.croppedFile
        : previewImageValue.file
      : formValues.ctaImage;

    const token = localStorage.getItem('token');
    const queryparams = new URLSearchParams(window.location.search);
    const partnershipID: string = queryparams.get('partner_id') || '0';
    const formData = new FormData();
    formData.append('partnership_id', partnershipID);
    formData.append('sales_motion_id', currSalesMotionId.toString());
    formData.append('name', formValues.ctaName);
    formData.append('description', formValues.ctaDescription);
    formData.append('header_text', formValues.ctaHeaderText);
    formData.append('sub_header_text', formValues.ctaSubHeaderText);
    formData.append('image', ctaFile);
    formData.append(
      'embedded_code',
      !formValues.staticFormShow ? formValues.ctaEmbeddedCode : ''
    );
    formData.append(
      'form_header',
      formValues.staticFormShow ? formValues.ctaFormHeader : ''
    );
    formData.append(
      'display_names',
      formValues.staticFormShow
        ? JSON.stringify(staticLeadData)
        : JSON.stringify([])
    );
    formData.append(
      'is_static_form',
      JSON.stringify(formValues.staticFormShow)
    );
    postRequest(`partnership/sales-motion/cta/`, formData, {
      Authorization: `Token ${token}`,
    }).then((response: any) => {
      if (response.result === true) {
        const ctaValues = response.data.cta;
        setLoading(false);
        console.log(salesMotionRespData, 'salesMotionRespData');
        if (
          salesMotionRespData.siteLayoutErrMsg === '' &&
          salesMotionRespData.callOutOneErrMsg === '' &&
          salesMotionRespData.callOutTwoErrMsg === '' &&
          salesMotionRespData.ctaErrMsg === ''
        ) {
          dispatch(
            setRefreshTimeStamp({
              refreshTimeStamp: Date.now(),
            })
          );
          setAlert((prevState: alert) => ({
            ...prevState,
            showAlert: true,
            message: SalesMotionLabels.salesMotionSuccessMsg,
            severity: 'success',
          }));
          closeHandler();
        }
      } else {
        setLoading(false);
        dispatch(
          setCtaErrMsg({
            ctaErrMsg: response.data.msg,
            ctaValidationField: response.data.validation_error_field,
          })
        );
      }
    });
  };

  const handleSaveCallOutSecTwo = (
    formValues: salesMotionValues,
    currSalesMotionId: number
  ) => {
    const previewImageValue = previewImage[previewImageLables.calloutTwoImage];
    const headerFile = formValues.callOutTwoHeaderImage
      ? previewImageValue?.cropped
        ? previewImageValue.croppedFile
        : previewImageValue.file
      : formValues.callOutTwoHeaderImage;

    const token = localStorage.getItem('token');
    const queryparams = new URLSearchParams(window.location.search);
    const partnershipID: string = queryparams.get('partner_id') || '0';
    const formData = new FormData();
    formData.append('partnership_id', partnershipID);
    formData.append('sales_motion_id', currSalesMotionId.toString());
    formData.append('header_text', formValues.callOutTwoHeaderText);
    formData.append('sub_header_text', formValues.callOutTwoSubHeaderText);
    formData.append('header_image', headerFile);
    formData.append('font_color_id', formValues.callOutTwoFontColor);
    formData.append('data_type', 'call_out_section_2');
    postRequest(`partnership/sales-motion/site-layout/`, formData, {
      Authorization: `Token ${token}`,
    }).then((response: any) => {
      if (response.result === true) {
        const callOutSecTwoValues = response.data.call_out_section_two;
        if (callOutSecTwoValues !== null) {
          setInitialValues({
            ...formikForm.current.values,
            callOutTwoHeaderText: callOutSecTwoValues.header_text,
            callOutTwoSubHeaderText: callOutSecTwoValues.sub_header_text,
            callOutTwoHeaderImage: callOutSecTwoValues.header_image_name,
            callOutTwoFontColor: callOutSecTwoValues.font_color.font_color_id,
          });
          setPreviewImage({
            type: 'SET_API_IMAGE_DETAILS',
            payload: {
              key: calloutTwoImage,
              name: callOutSecTwoValues.header_image_name,
              source: callOutSecTwoValues.header_image,
            },
          });
        }
      } else {
        dispatch(
          setCallOutTwoErrMsg({
            callOutTwoErrMsg: response.data.msg,
            callOutTwoValidationField: response.data.validation_error_field,
          })
        );
      }
      handleSaveCTA(formValues, currSalesMotionId);
    });
  };

  const handleSaveCallOutSecOne = (
    formValues: salesMotionValues,
    currSalesMotionId: number
  ) => {
    const previewImageValue = previewImage[previewImageLables.calloutOneImage];
    const headerFile = formValues.callOutOneHeaderImage
      ? previewImageValue?.cropped
        ? previewImageValue.croppedFile
        : previewImageValue.file
      : formValues.callOutOneHeaderImage;

    const token = localStorage.getItem('token');
    const queryparams = new URLSearchParams(window.location.search);
    const partnershipID: string = queryparams.get('partner_id') || '0';
    const formData = new FormData();
    formData.append('partnership_id', partnershipID);
    formData.append('sales_motion_id', currSalesMotionId.toString());
    formData.append('header_text', formValues.callOutOneheaderText);
    formData.append('sub_header_text', formValues.callOutOneSubHeaderText);
    formData.append('header_image', headerFile);
    formData.append('font_color_id', formValues.callOutOneFontColor);
    formData.append('data_type', 'call_out_section_1');
    postRequest(`partnership/sales-motion/site-layout/`, formData, {
      Authorization: `Token ${token}`,
    }).then((response: any) => {
      if (response.result === true) {
        const callOutSecOneValues = response.data.call_out_section_one;
        if (callOutSecOneValues !== null) {
          setInitialValues({
            ...formikForm?.current?.values,
            callOutOneheaderText: callOutSecOneValues.header_text,
            callOutOneSubHeaderText: callOutSecOneValues.sub_header_text,
            callOutOneHeaderImage: callOutSecOneValues.header_image_name,
            callOutOneFontColor: callOutSecOneValues.font_color.font_color_id,
          });
          setPreviewImage({
            type: 'SET_API_IMAGE_DETAILS',
            payload: {
              key: calloutOneImage,
              name: callOutSecOneValues.header_image_name,
              source: callOutSecOneValues.header_image,
            },
          });
        }
        handleSaveCallOutSecTwo(formValues, currSalesMotionId);
      } else {
        dispatch(
          setCallOutOneErrMsg({
            callOutOneErrMsg: response.data.msg,
            callOutOneValidationField: response.data.validation_error_field,
          })
        );
      }
    });
  };

  const handleSaveSiteLayout = (
    formValues: salesMotionValues,
    currSalesMotionId: number
  ) => {
    const previewImageValueWeb =
      previewImage[previewImageLables.siteLayoutImageWeb];
    const previewImageValueMobile =
      previewImage[previewImageLables.siteLayoutImageMobile];

    const headerFileWeb = formValues.layoutHeaderImageWeb
      ? previewImageValueWeb?.cropped
        ? previewImageValueWeb.croppedFile
        : previewImageValueWeb.file
      : formValues.layoutHeaderImageWeb;

    const headerFileMobile = formValues.layoutHeaderImageMobile
      ? previewImageValueMobile?.cropped
        ? previewImageValueMobile.croppedFile
        : previewImageValueMobile.file
      : formValues.layoutHeaderImageMobile;

    const token = localStorage.getItem('token');
    const queryparams = new URLSearchParams(window.location.search);
    const partnershipID: string = queryparams.get('partner_id') || '0';
    const formData = new FormData();
    formData.append('partnership_id', partnershipID);
    formData.append('sales_motion_id', currSalesMotionId.toString());
    formData.append('header_text', formValues.layoutHeaderText);
    formData.append('sub_header_text', formValues.layoutSubHeaderText);
    formData.append('header_image', headerFileWeb);
    formData.append('mobile_header_image', headerFileMobile);
    formData.append('font_color_id', formValues.layoutFontColor);
    formData.append('data_type', 'site_layout');
    formData.append('font_style_id', formValues.layoutFontStyle);

    setSalesMotionId(currSalesMotionId);
    postRequest(`partnership/sales-motion/site-layout/`, formData, {
      Authorization: `Token ${token}`,
    }).then((response: any) => {
      if (response.result === true) {
        const siteLayoutValues = response.data.site_layout;
        if (siteLayoutValues !== null) {
          setInitialValues({
            ...formikForm?.current?.values,
            layoutHeaderText: siteLayoutValues.header_text,
            layoutSubHeaderText: siteLayoutValues.sub_header_text,
            layoutHeaderImageWeb: siteLayoutValues.header_image_name,
            layoutHeaderImageMobile: siteLayoutValues.mobile_header_image_name,
            layoutFontColor: siteLayoutValues.font_color.font_color_id,
            layoutFontStyle: siteLayoutValues.font_style.font_family_id,
          });
          setPreviewImage(
            {
              type: 'SET_API_IMAGE_DETAILS',
              payload: {
                key: siteLayoutImageWeb,
                name: siteLayoutValues.header_image_name,
                source: siteLayoutValues.header_image,
              },
            },
            {
              type: 'SET_API_IMAGE_DETAILS',
              payload: {
                key: siteLayoutImageMobile,
                name: siteLayoutValues.mobile_header_image_name,
                source: siteLayoutValues.mobile_header_image,
              },
            }
          );
          dispatch(
            setSiteLayoutErrMsg({
              siteLayoutErrMsg: '',
              siteLayoutValidationField: '',
            })
          );
        }
        handleSaveCallOutSecOne(formValues, currSalesMotionId);
      } else {
        dispatch(
          setSiteLayoutErrMsg({
            siteLayoutErrMsg: response.data.msg,
            siteLayoutValidationField: response.data.validation_error_field,
          })
        );
      }
    });
  };

  const handleUpdateSiteLayout = (
    formValues: salesMotionValues,
    currSalesMotionId: number
  ) => {
    const previewImageValueWeb =
      previewImage[previewImageLables.siteLayoutImageWeb];
    const previewImageValueMobile =
      previewImage[previewImageLables.siteLayoutImageMobile];

    const headerFileWeb = formValues.layoutHeaderImageWeb
      ? previewImageValueWeb?.cropped
        ? previewImageValueWeb.croppedFile
        : previewImageValueWeb.file
      : formValues.layoutHeaderImageWeb;

    const headerFileMobile = formValues.layoutHeaderImageMobile
      ? previewImageValueMobile?.cropped
        ? previewImageValueMobile.croppedFile
        : previewImageValueMobile.file
      : formValues.layoutHeaderImageMobile;

    const token = localStorage.getItem('token');
    const queryparams = new URLSearchParams(window.location.search);
    const partnershipID: string = queryparams.get('partner_id') || '0';
    const formData = new FormData();
    formData.append('partnership_id', partnershipID);
    formData.append('sales_motion_id', currSalesMotionId.toString());
    formData.append('site_layout_id', salesMotionIdSet.siteLayoutId);
    formData.append('header_text', formValues.layoutHeaderText);
    formData.append('sub_header_text', formValues.layoutSubHeaderText);
    formData.append('header_image', headerFileWeb);
    formData.append('mobile_header_image', headerFileMobile);
    formData.append('font_color_id', formValues.layoutFontColor);
    formData.append('data_type', 'site_layout');
    formData.append('font_style_id', formValues.layoutFontStyle);

    setSalesMotionId(currSalesMotionId);
    multiPartPutRequest(`partnership/sales-motion/site-layout/`, formData, {
      Accept: 'application/json',
      Authorization: `Token ${token}`,
    }).then((response: any) => {
      if (response.result === true) {
        const siteLayoutValues = response.data.site_layout;
        if (siteLayoutValues !== null) {
          setInitialValues({
            ...formikForm?.current?.values,
            layoutHeaderText: siteLayoutValues.header_text,
            layoutSubHeaderText: siteLayoutValues.sub_header_text,
            layoutHeaderImageWeb: siteLayoutValues.header_image_name,
            layoutHeaderImageMobile: siteLayoutValues.mobile_header_image_name,
            layoutFontColor: siteLayoutValues.font_color.font_color_id,
            layoutFontStyle: siteLayoutValues.font_style.font_family_id,
          });
          setPreviewImage(
            {
              type: 'SET_API_IMAGE_DETAILS',
              payload: {
                key: siteLayoutImageWeb,
                name: siteLayoutValues.header_image_name,
                source: siteLayoutValues.header_image,
              },
            },
            {
              type: 'SET_API_IMAGE_DETAILS',
              payload: {
                key: siteLayoutImageMobile,
                name: siteLayoutValues.mobile_header_image_name,
                source: siteLayoutValues.mobile_header_image,
              },
            }
          );
        }
      }
    });
  };

  const handleUpdateCallOutSecOne = (
    formValues: salesMotionValues,
    currSalesMotionId: number
  ) => {
    const previewImageValue = previewImage[previewImageLables.calloutOneImage];
    const headerFile = formValues.callOutOneHeaderImage
      ? previewImageValue?.cropped
        ? previewImageValue.croppedFile
        : previewImageValue.file
      : formValues.callOutOneHeaderImage;

    const token = localStorage.getItem('token');
    const queryparams = new URLSearchParams(window.location.search);
    const partnershipID: string = queryparams.get('partner_id') || '0';
    const formData = new FormData();
    formData.append('partnership_id', partnershipID);
    formData.append('sales_motion_id', currSalesMotionId.toString());
    formData.append(
      'call_out_section_one_id',
      salesMotionIdSet.callOutSecOneId
    );
    formData.append('header_text', formValues.callOutOneheaderText);
    formData.append('sub_header_text', formValues.callOutOneSubHeaderText);
    formData.append('header_image', headerFile);
    formData.append('font_color_id', formValues.callOutOneFontColor);
    formData.append('data_type', 'call_out_section_1');
    multiPartPutRequest(`partnership/sales-motion/site-layout/`, formData, {
      Accept: 'application/json',
      Authorization: `Token ${token}`,
    }).then((response: any) => {
      if (response.result === true) {
        const callOutSecOneValues = response.data.call_out_section_one;
        if (callOutSecOneValues !== null) {
          setInitialValues({
            ...formikForm?.current?.values,
            callOutOneheaderText: callOutSecOneValues.header_text,
            callOutOneSubHeaderText: callOutSecOneValues.sub_header_text,
            callOutOneHeaderImage: callOutSecOneValues.header_image_name,
            callOutOneFontColor: callOutSecOneValues.font_color.font_color_id,
          });

          setPreviewImage({
            type: 'SET_API_IMAGE_DETAILS',
            payload: {
              key: calloutOneImage,
              name: callOutSecOneValues.header_image_name,
              source: callOutSecOneValues.header_image,
            },
          });
        }
      }
    });
  };

  const handleUpdateCallOutSecTwo = (
    formValues: salesMotionValues,
    currSalesMotionId: number
  ) => {
    const previewImageValue = previewImage[previewImageLables.calloutTwoImage];
    const headerFile = formValues.callOutTwoHeaderImage
      ? previewImageValue?.cropped
        ? previewImageValue.croppedFile
        : previewImageValue.file
      : formValues.callOutTwoHeaderImage;
    const token = localStorage.getItem('token');
    const queryparams = new URLSearchParams(window.location.search);
    const partnershipID: string = queryparams.get('partner_id') || '0';
    const formData = new FormData();
    formData.append('partnership_id', partnershipID);
    formData.append('sales_motion_id', currSalesMotionId.toString());
    formData.append(
      'call_out_section_two_id',
      salesMotionIdSet.callOutSecTwoId
    );

    formData.append('header_text', formValues.callOutTwoHeaderText);
    formData.append('sub_header_text', formValues.callOutTwoSubHeaderText);
    formData.append('header_image', headerFile);
    formData.append('font_color_id', formValues.callOutTwoFontColor);
    formData.append('data_type', 'call_out_section_2');
    multiPartPutRequest(`partnership/sales-motion/site-layout/`, formData, {
      Accept: 'application/json',
      Authorization: `Token ${token}`,
    }).then((response: any) => {
      if (response.result === true) {
        const callOutSecTwoValues = response.data.call_out_section_two;
        if (callOutSecTwoValues !== null) {
          setInitialValues({
            ...formikForm?.current?.values,
            callOutTwoHeaderText: callOutSecTwoValues.header_text,
            callOutTwoSubHeaderText: callOutSecTwoValues.sub_header_text,
            callOutTwoHeaderImage: callOutSecTwoValues.header_image_name,
            callOutTwoFontColor: callOutSecTwoValues.font_color.font_color_id,
          });

          setPreviewImage({
            type: 'SET_API_IMAGE_DETAILS',
            payload: {
              key: calloutTwoImage,
              name: callOutSecTwoValues.header_image_name,
              source: callOutSecTwoValues.header_image,
            },
          });
        }
      }
    });
  };

  const handleUpdateCTA = (
    formValues: salesMotionValues,
    currSalesMotionId: number
  ) => {
    const previewImageValue = previewImage[previewImageLables.ctaImage];
    const ctaFile = formValues.ctaImage
      ? previewImageValue?.cropped
        ? previewImageValue.croppedFile
        : previewImageValue.file
      : formValues.ctaImage;
    const token = localStorage.getItem('token');
    const queryparams = new URLSearchParams(window.location.search);
    const partnershipID: string = queryparams.get('partner_id') || '0';
    const formData = new FormData();
    formData.append('partnership_id', partnershipID);
    formData.append('sales_motion_id', currSalesMotionId.toString());
    formData.append('cta_id', salesMotionIdSet.ctaId);
    formData.append('name', formValues.ctaName);
    formData.append('description', formValues.ctaDescription);
    formData.append('header_text', formValues.ctaHeaderText);
    formData.append('sub_header_text', formValues.ctaSubHeaderText);
    formData.append('image', ctaFile);
    formData.append(
      'embedded_code',
      !formValues.staticFormShow ? formValues.ctaEmbeddedCode : ''
    );
    formData.append(
      'form_header',
      formValues.staticFormShow ? formValues.ctaFormHeader : ''
    );
    formData.append(
      'display_names',
      formValues.staticFormShow
        ? JSON.stringify(staticLeadData)
        : JSON.stringify([])
    );
    formData.append(
      'is_static_form',
      JSON.stringify(formValues.staticFormShow)
    );
    multiPartPutRequest(`partnership/sales-motion/cta/`, formData, {
      Accept: 'application/json',
      Authorization: `Token ${token}`,
    }).then((response: any) => {
      if (response.result === true) {
        const ctaValues = response.data.cta;

        // if (ctaValues !== null) {
        //   setInitialValues({
        //     ...formikForm.current.values,
        //     ctaName: ctaValues.name,
        //     ctaHeaderText: ctaValues.header_text,
        //     ctaSubHeaderText: ctaValues.sub_header_text,
        //     ctaImage: ctaValues.header_image_name,
        //     ctaEmbeddedCode: ctaValues.embedded_code,
        //   });
        //   setPreviewImage({
        //     type: 'SET_API_IMAGE_DETAILS',
        //     payload: {
        //       key: ctaImage,
        //       name: ctaValues.header_image_name,
        //       source: ctaValues.header_image,
        //     },
        //   });
        // }
        setLoading(false);
        if (
          salesMotionRespData.generalErrMsg === '' &&
          salesMotionRespData.siteLayoutErrMsg === '' &&
          salesMotionRespData.callOutOneErrMsg === '' &&
          salesMotionRespData.callOutTwoErrMsg === '' &&
          salesMotionRespData.ctaErrMsg === ''
        ) {
          setAlert((prevState: alert) => ({
            ...prevState,
            showAlert: true,
            message: SalesMotionLabels.salesMotionUpdateSuccessMsg,
            severity: 'success',
          }));
          closeHandler();
        }
      } else {
        setLoading(false);
        dispatch(
          setCtaErrMsg({
            ctaErrMsg: response.data.msg,
            ctaValidationField: response.data.validation_error_field,
          })
        );
      }
    });
  };
  const handleSaveAssetCollectionForSalesMotion = (
    currSalesMotionId: number
  ) => {
    const token = localStorage.getItem('token');
    const queryparams = new URLSearchParams(window.location.search);
    const partnershipID: string = queryparams.get('partner_id') || '0';
    postRequest(
      `partnership/sales-motion/solution-narrative-mapping/`,
      {
        partnership_id: partnershipID,
        sales_motion_id: currSalesMotionId,
        solution_narrative_ids: selected,
      },
      {
        Authorization: `Token ${token}`,
      }
    ).then((response: any) => {
      if (response.result === true) {
        console.log('');
      }
    });
  };

  const handleSaveSalesMotion = async (formValues: salesMotionValues) => {
      if (formValues.staticFormShow && staticLeadData === null) { 
        setNoStaticFormError(true)
      }
      else if (!showFieldError) {
      setLoading(true);
      const queryparams = new URLSearchParams(window.location.search);
      const partnershipID: string = queryparams.get('partner_id') || '0';
      const salesMotionID: string = queryparams.get('sales_motion_id') || '0';
      if (salesMotionID !== '0') {
        const updateAction = await dispatch(
          updateSalesMotionAction(
            formValues,
            handleUpdateSiteLayout,
            handleUpdateCallOutSecOne,
            handleUpdateCallOutSecTwo,
            handleSaveAssetCollectionForSalesMotion,
            handleUpdateCTA,
            partnershipID,
            setInitialValues,
            formikForm,
            salesMotionID,
            () => setLoading(false)
          )
        );
      } else {
        const saveAction = await dispatch(
          saveSalesMotionAction(
            formValues,
            handleSaveSiteLayout,
            handleSaveCallOutSecOne,
            handleSaveCallOutSecTwo,
            handleSaveAssetCollectionForSalesMotion,
            handleSaveCTA,
            partnershipID,
            setInitialValues,
            formikForm,
            () => setLoading(false)
          )
        );
      }
    }
  };

  const fetchSalesMotionDetailById = (salesMotion: string) => {
    const token = localStorage.getItem('token');
    const queryparams = new URLSearchParams(window.location.search);
    const partnershipID: string = queryparams.get('partner_id') || '0';
    getRequest(
      `partnership/sales-motion/?partnership_id=${partnershipID}&sales_motion_id=${salesMotion}`,
      {
        Authorization: `Token ${token}`,
      }
    ).then((response: any) => {
      if (response.result === true) {
        const siteLayoutValues = response.data.site_layout && {
          layoutHeaderText: response.data.site_layout.header_text,
          layoutSubHeaderText: response.data.site_layout.sub_header_text,
          layoutHeaderImageWeb: response.data.site_layout.header_image_name,
          layoutHeaderImageMobile:
            response.data.site_layout.mobile_header_image_name,
          layoutFontColor: response.data.site_layout.font_color.font_color_id,
          layoutFontStyle: response.data.site_layout.font_style.font_family_id,
        };
        const callOutOneValues = response.data.call_out_section_one && {
          callOutOneheaderText: response.data.call_out_section_one.header_text,
          callOutOneSubHeaderText:
            response.data.call_out_section_one.sub_header_text,
          callOutOneHeaderImage:
            response.data.call_out_section_one.header_image_name,
          callOutOneFontColor:
            response.data.call_out_section_one.font_color.font_color_id,
        };
        const callOutTwoValues = response.data.call_out_section_two && {
          callOutTwoHeaderText: response.data.call_out_section_two.header_text,
          callOutTwoSubHeaderText:
            response.data.call_out_section_two.sub_header_text,
          callOutTwoHeaderImage:
            response.data.call_out_section_two.header_image_name,
          callOutTwoFontColor:
            response.data.call_out_section_two.font_color.font_color_id,
        };
        const ctaValues = response.data.cta && {
          ctaName: response.data.cta.name,
          ctaHeaderText: response.data.cta.header_text,
          ctaSubHeaderText: response.data.cta.sub_header_text,
          ctaDescription: response.data.cta.description,
          ctaImage: response.data.cta.image_name,
          ctaEmbeddedCode: response.data.cta.embedded_code,
          ctaFormHeader: response.data.cta.form_header,
          staticFormShow: response?.data?.cta?.is_static_form,
        };
        const prevFormValues = {
          ...formikForm?.current?.values,
          name: response.data.name,
          description: response.data.description,
          targetBuyerTitles: response.data.target_buyer_titles,
          ...siteLayoutValues,
          ...callOutOneValues,
          ...callOutTwoValues,
          ...ctaValues,
        };
        setCtaLeadDisplayList(response?.data?.cta?.lead_display);
        setInitialValues({ ...prevFormValues });
        setSalesMotionIdSet({
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
      }
    });
  };

  const fetchAssetCollectDataById = (currSalesMotionId: string) => {
    const token = localStorage.getItem('token');
    const queryparams = new URLSearchParams(window.location.search);
    const partnershipID: string = queryparams.get('partner_id') || '0';
    getRequest(
      `partnership/sales-motion/solution-narrative-mapping/?partnership_id=${partnershipID}&sales_motion_id=${currSalesMotionId}&is_selected=true&is_inactive=true`,
      {
        Authorization: `Token ${token}`,
      }
    ).then((response: any) => {
      if (response.result === true) {
        const prevSelected =
          response.data &&
          response.data.map((data: any) => data.solution_narrative_id);
        setSelected(prevSelected);
        if (response.data && response.data.length > 0) {
          setactionType({
            action: 'UPDATE',
            dataLength: response.data.length,
          });
        } else {
          setactionType({ action: 'UPDATE', dataLength: 0 });
        }
      }
    });
  };

  const fetchAllAssetCollectData = (currOffset, smId) => {
    setOffset(currOffset);
    const token = localStorage.getItem('token');
    const queryparams = new URLSearchParams(window.location.search);
    const partnershipID: string = queryparams.get('partner_id') || '0';
    if (smId !== 'init') {
      getRequest(
        `partnership/sales-motion/solution-narrative-mapping/?partnership_id=${partnershipID}&offset=${currOffset}&limit=${limit}&sales_motion_id=${smId}`,
        {
          Authorization: `Token ${token}`,
        }
      ).then((response: any) => {
        if (response.result === true) {
          if (response.data.length > 0) {
            setAssetCollectData(response.data);
          }
        }

        if (response.count) {
          setCount(response.count);
        }
      });
    } else {
      getRequest(
        `partnership/sales-motion/solution-narrative-mapping/?partnership_id=${partnershipID}&offset=${currOffset}&limit=${limit}`,
        {
          Authorization: `Token ${token}`,
        }
      ).then((response: any) => {
        if (response.result === true) {
          if (response.data.length > 0) {
            setAssetCollectData(response.data);
          }
        }

        if (response.count) {
          setCount(response.count);
        }
      });
    }
  };
  useEffect(() => {
    Object.keys(previewImage).forEach((el) => {
      if (previewImage[el]?.cropped && !isFormEdited) {
        setIsFormEdited(true);
      }

      if (
        previewImage[el].error &&
        previewImage[el].cropped &&
        formikForm &&
        formikForm?.current
      ) {
        switch (el) {
          case previewImageLables.siteLayoutImageWeb:
            formikForm?.current?.setFieldError('layoutHeaderImageWeb', '');
            break;
          case previewImageLables.siteLayoutImageMobile:
            formikForm?.current?.setFieldError('layoutHeaderImageMobile', '');
            break;
          case previewImageLables.calloutOneImage:
            formikForm?.current?.setFieldError('callOutOneHeaderImage', '');
            break;
          case previewImageLables.calloutTwoImage:
            formikForm?.current?.setFieldError('callOutTwoHeaderImage', '');
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

  useEffect(() => {
    const queryparams = new URLSearchParams(window.location.search);
    const salesMotionID: string = queryparams.get('sales_motion_id') || '0';

    if (salesMotionID !== '0') {
      fetchAssetCollectDataById(salesMotionID);
      fetchAllAssetCollectData(0, salesMotionID);
      fetchSalesMotionDetailById(salesMotionID);
    } else {
      fetchAllAssetCollectData(0, 'init');
      setactionType({ ...actionType, action: 'CREATE' });
    }

    fetchFontColorList();
    fetchFontStyleList();
    getStaticKeyNames();
    dispatch(
      setGeneralErrMsg({
        generalErrMsg: '',
        generalValidationField: '',
      })
    );
    dispatch(
      setSiteLayoutErrMsg({
        siteLayoutErrMsg: '',
        siteLayoutValidationField: '',
      })
    );
    dispatch(
      setCallOutOneErrMsg({
        callOutOneErrMsg: '',
        callOutOneValidationField: '',
      })
    );
    dispatch(
      setCallOutTwoErrMsg({
        callOutTwoErrMsg: '',
        callOutTwoValidationField: '',
      })
    );
    dispatch(
      setCtaErrMsg({
        ctaErrMsg: '',
        ctaValidationField: '',
      })
    );
  }, []);
  return (
    <div className={` salesMotionFormWrap`}>
      <Formik
        innerRef={formikForm}
        enableReinitialize
        initialValues={initialValues}
        validate={() => ({})}
        validationSchema={salesMotionCreationSchema}
        onSubmit={(values) => {
          let errorImage = false;
          Object.keys(previewImage).forEach((el) => {
            if (previewImage[el].error && !previewImage[el].cropped) {
              errorImage = true;
              switch (el) {
                case previewImageLables.siteLayoutImageWeb:
                  formikForm?.current?.setFieldError(
                    'layoutHeaderImageWeb',
                    previewImage[el].error
                  );
                  break;
                case previewImageLables.siteLayoutImageMobile:
                  formikForm?.current?.setFieldError(
                    'layoutHeaderImageMobile',
                    previewImage[el].error
                  );
                  break;
                case previewImageLables.calloutOneImage:
                  formikForm?.current?.setFieldError(
                    'callOutOneHeaderImage',
                    previewImage[el].error
                  );
                  break;
                case previewImageLables.calloutTwoImage:
                  formikForm?.current?.setFieldError(
                    'callOutTwoHeaderImage',
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
          handleSaveSalesMotion(values);
        }}
      >
        {(formik) => {
          const {
            handleChange,
            handleSubmit,
            errors,
            touched,
            handleBlur,
            values,
            setFieldValue,
            dirty,
            validateField,
          } = formik;
          setIsDirty(dirty);
          return (
            <Form
              className={styles.salesMotionForm}
              onSubmit={(e) => {
                e.preventDefault();
                setGeneral(true);
                setSiteLayout(true);
                setCallOutSectionOneShow(true);
                setCallOutSectionTwoShow(true);
                setAssetCollectionShow(true);
                setCtaShow(true);
                handleSubmit(e);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                }
              }}
            >
              <GeneralForm
                sectionValues={formik.values}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
                touched={touched}
                general={general}
                setGeneral={setGeneral}
                setFieldValue={setFieldValue}
              />
              <SiteLayout
                sectionValues={formik.values}
                onChange={handleChange}
                onBlur={handleBlur}
                onFileSelected={onFileSelected}
                validateField={validateField}
                fontColorList={fontColorList}
                fontStyleList={fontStyleList}
                errors={errors}
                touched={touched}
                siteLayoutThumbnailImageWeb={previewImage[siteLayoutImageWeb]}
                siteLayoutThumbnailImageMobile={
                  previewImage[siteLayoutImageMobile]
                }
                OnImageCancel={OnImageCancel}
                siteLayout={siteLayout}
                setSiteLayout={setSiteLayout}
                setLoading={setLoading}
                setPreviewImage={setPreviewImage}
              />
              <CallOutSectionOne
                sectionValues={formik.values}
                onChange={handleChange}
                onBlur={handleBlur}
                onFileSelected={onFileSelected}
                validateField={validateField}
                fontColorList={fontColorList}
                errors={errors}
                touched={touched}
                callOutOneThumbnailImage={previewImage[calloutOneImage]}
                OnImageCancel={OnImageCancel}
                callOutSectionOneShow={callOutSectionOneShow}
                setCallOutSectionOneShow={setCallOutSectionOneShow}
                setLoading={setLoading}
                setPreviewImage={setPreviewImage}
              />
              <CallOutSectionTwo
                sectionValues={formik.values}
                onChange={handleChange}
                onBlur={handleBlur}
                onFileSelected={onFileSelected}
                validateField={validateField}
                fontColorList={fontColorList}
                errors={errors}
                touched={touched}
                callOutTwoThumbnailImage={previewImage[calloutTwoImage]}
                OnImageCancel={OnImageCancel}
                callOutSectionTwoShow={callOutSectionTwoShow}
                setCallOutSectionTwoShow={setCallOutSectionTwoShow}
                setLoading={setLoading}
                setPreviewImage={setPreviewImage}
              />
              <AssetCollection
                setSelected={setSelected}
                selected={selected}
                salesMotionId={salesMotionId}
                assetCollectData={assetCollectData}
                offset={offset}
                limit={limit}
                count={count}
                fetchAllAssetCollectData={fetchAllAssetCollectData}
                setAssetCollectData={setAssetCollectData}
                assetCollectionShow={assetCollectionShow}
                setAssetCollectionShow={setAssetCollectionShow}
                actionType={actionType}
                setIsFormEdited={setIsFormEdited}
              />
              <CTAConfiguration
                sectionValues={formik.values}
                onChange={handleChange}
                onBlur={handleBlur}
                onFileSelected={onFileSelected}
                validateField={validateField}
                errors={errors}
                touched={touched}
                ctaThumbnailImage={previewImage[ctaImage]}
                OnImageCancel={OnImageCancel}
                ctaShow={ctaShow}
                setCtaShow={setCtaShow}
                setLoading={setLoading}
                setPreviewImage={setPreviewImage}
                keyNamesList={keyNamesList}
                staticFormData={staticFormData}
                handleFormChange={handleFormChange}
                handleAllCheckBoxSelect={handleAllCheckBoxSelect}
                handleCheckboxClick={handleCheckboxClick}
                leadselected={leadselected}
                showFieldError={showFieldError}
                noStaticFormError={noStaticFormError}
              />
              <div
                className={`${styles.salesMotionCreationBtnWrap} ${styles.bottomLayer}`}
              >
                <SecondaryButton
                  onClick={() => {
                    if (dirty || isFormEdited) setShowCloseWarning(true);
                    else closeHandler();
                  }}
                  style={{ minWidth: '160px', marginRight: '30px' }}
                >
                  {ButtonLabels.cancel}
                </SecondaryButton>
                <PrimaryButton type="submit" style={{ minWidth: '160px' }}>
                  {ButtonLabels.save}
                </PrimaryButton>
              </div>
            </Form>
          );
        }}
      </Formik>
      {showCloseWarning && (
        <DialogBoxComponent
          title=""
          secondaryContent="Are you sure you want to discard changes made on this page?"
          primaryContent="Unsaved changes"
          primaryButton="Discard"
          secondaryButton="Cancel"
          handleDialogBoxClose={() => setShowCloseWarning(false)}
          handleAgree={closeHandler}
          show
        />
      )}
      {loading && <Loader />}
    </div>
  );
};

export default CreateSalesMotion;
