/* eslint-disable no-nested-ternary */
/* eslint-disable indent */
/* eslint-disable linebreak-style */
/* eslint-disable object-curly-newline */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable linebreak-style */
/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */
/* eslint-disable linebreak-style */
import React, { useState, useEffect, useRef } from 'react';
import { Formik, Form, Field, FormikProps } from 'formik';
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
import './PreviewPartnership.css';
import { InputAdornment } from '@material-ui/core';
import IconButton from '@mui/material/IconButton';
import { useDispatch, useSelector } from 'react-redux';
import { deleteRequest, getRequest } from 'src/app/service';
import { useLocation, useHistory } from 'react-router-dom';
import Loader from 'src/app/components/Loader';
import SnackbarAlert from 'src/app/components/Snackbar/Snackbar';
import PrimaryButton from 'src/app/components/Button/PrimaryButton';
import SecondaryButton from 'src/app/components/Button/SecondaryButton';
import ChipInput from 'material-ui-chip-input';
import { Close } from '@material-ui/icons';
import { Partnershipinfo } from 'src/stories/partnercreation.stories';
import PreviewImage from 'src/app/components/PreviewImage/PreviewImage';
import useThumbnailImage from 'src/app/components/PreviewImage/CustomHook/useThumbnailImage';
import CroppedImage from 'src/app/components/CroppedImage/CroppedImage';
import {
  errorMessageLabels,
  PreviewPartnershipLabels,
  MenuBarLabels,
  previewImageLables,
} from '../../../strings';
import { RenderErrorMessage, GenTextField } from '../SalesHubSite/Form';
import UploadLogo from '../../components/Icons/PreviewPartnership/UploadLogoIcon.svg';
import DownArrow from '../../components/Icons/PreviewPartnership/DownArrow.svg';
import DialogBoxComponent from '../../components/DialogBox/DialogBox';
import uploadIcon from 'src/app/assets/upload-logo.svg';
import CloseIcon from '@mui/icons-material/Close';

import {
  selectCreatePartnershipResponse,
  PreviewAndSaveInfoAction,
  setPartnerCompanyName,
  setErrMsg,
} from '../CreatePartnership/CreatePartnerShipSlice';
import { useStyles } from '../SalesHubSite/Styles';
import {
  PreviewPartnershipResponse,
  setIsPreviewPartnershipFormEdited,
  setShowPreviewPartnershipWarningEditor,
} from './PreviewPartnershipSlice';

interface previewPartnershipValues {
  partnershipName: string;
  websiteSubDomain: string;
  whitelistedDomain: string[];
  favIcon: string;
  favIconImg: any;
  companyName: string;
  companyLogo: string;
  companyAddress: string;
  companyWebsite: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  privacyPolicyURL: string;
  siteTermsURL: string;
  cookiePolicy: string;
  partnerCompanyName: string;
  partnerCompanySiteTermsURL: string;
  partnerCompanyLogo: string;
  partnerCompanyCookiePolicy: string;
  partnerCompanyPrivacyPolicyURL: string;
}

interface alert {
  showAlert: boolean;
  severity: string;
  message: string;
}
const PreviewPartnership = (props) => {
  const classes = useStyles();
  const queryparams = new URLSearchParams(window.location.search);
  const partnershipId: string = queryparams.get('partner_id') || '0';
  const isCreated: string = queryparams.get('isCreated') || '0';
  const [showPartnership, setShowPartnership] = useState(true);
  const [showCompany, setShowCompany] = useState(true);
  const [showCompanyPartner, setShowCompanyPartner] = useState(true);
  const [showPartnershipTeam, setShowPartnershipTeam] = useState(true);
  const token = localStorage.getItem('token');
  const history = useHistory();
  const dispatch = useDispatch();
  const partnershipResponseData = useSelector(selectCreatePartnershipResponse);
  const PreviewPartnershipData = useSelector(PreviewPartnershipResponse);
  const location = useLocation();
  const companyFileInput = useRef<HTMLInputElement>(null);
  const companyPartnerFileInput = useRef<HTMLInputElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const formikForm = useRef<FormikProps<previewPartnershipValues>>(null);
  const [initialValues, setInitialValues] =
    useState<previewPartnershipValues>();
  const [companyId, setCompanyId] = useState('');
  const [partnerCompanyInfoId, setPartnerCompanyInfoId] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [alert, setAlert] = useState({
    showAlert: false,
    severity: '',
    message: '',
  });
  const [whiteListErr, setWhiteListErr] = useState('');
  const [whitelistedDomainsTouched, setWhitelistedDomainsTouched] =
    useState(false);
  const [formEdited, setFormEdited] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showCloseWarning, setShowCloseWarning] = useState(false);
  const [showSave, setShowSave] = useState(true);
  const [selectedFile, setSelectedFile] = React.useState();
  const [previewImage, setPreviewImage, setPreviewFileData] = useThumbnailImage(
    [
      { key: previewImageLables.companyLogo, aspectRatio: 3 / 1 },
      { key: previewImageLables.partnerCompanyLogo, aspectRatio: 3 / 1 },
    ]
  );

  const [showPreview, setShowPreview] = useState(true);

  const [showCropImage, setShowCropImage] = useState({
    companyLogo: false,
    partnershipLogo: false,
  });

  const onImageCancel = (field: any, setFieldValue: any) => {
    setFormEdited(true);
    if (field === previewImageLables.companyLogo) {
      // setInitialValues({
      //   ...formikForm.current.values,
      //   companyLogo: '',
      // });
      setFieldValue('companyLogo', '');
      companyFileInput.current.value = '';
      setPreviewImage({
        type: 'SET_IMAGEFILE_CANCEL',
        payload: { key: previewImageLables.companyLogo },
      });
    } else if (field === previewImageLables.partnerCompanyLogo) {
      // setInitialValues({
      //   ...formikForm.current.values,
      //   partnerCompanyLogo: '',
      // });
      setFieldValue('partnerCompanyLogo', '');
      companyPartnerFileInput.current.value = '';
      setPreviewImage({
        type: 'SET_IMAGEFILE_CANCEL',
        payload: {
          key: previewImageLables.partnerCompanyLogo,
        },
      });
    }
  };

  const deletePartnerShip = () => {
    setLoading(true);
    const headerData = {
      Authorization: `Token ${token}`,
    };
    deleteRequest(`partnership/${partnershipId}`, headerData).then(
      (resp: any) => {
        if (resp) {
          if (resp.result === true) {
            setModalActive(false);
            setAlert((prevState: alert) => ({
              ...prevState,
              showAlert: true,
              message: PreviewPartnershipLabels.snackbarDeleteMsg,
              severity: 'success',
            }));
            setTimeout(() => {
              history.push('/accountSetup');
            }, 3000);
          }
        }
      }
    );
  };

  useEffect(() => {
    dispatch(
      setIsPreviewPartnershipFormEdited({
        isPreviewPartnershipFormEdited: formEdited || isDirty,
      })
    );
  }, [formEdited, isDirty]);

  useEffect(() => {
    if (PreviewPartnershipData.previewPartnershipWarningEditor.show)
      setShowCloseWarning(true);
  }, [PreviewPartnershipData.previewPartnershipWarningEditor]);

  useEffect(() => {
    if (
      (previewImage[previewImageLables.companyLogo]?.cropped ||
        previewImage[previewImageLables.partnerCompanyLogo]?.cropped) &&
      !formEdited
    ) {
      setFormEdited(true);
    }
    if (
      formikForm &&
      formikForm?.current &&
      previewImage[previewImageLables.companyLogo].cropped
    ) {
      formikForm?.current?.setFieldError('companyLogo', '');
    }
    if (
      formikForm &&
      formikForm?.current &&
      previewImage[previewImageLables.partnerCompanyLogo].cropped
    ) {
      formikForm?.current?.setFieldError('partnerCompanyLogo', '');
    }
  }, [previewImage]);

  useEffect(() => {
    return () => {
      dispatch(
        setIsPreviewPartnershipFormEdited({
          isPreviewPartnershipFormEdited: false,
        })
      );
    };
  }, []);

  useEffect(() => {
    if (isCreated === '1') {
      setFormEdited(true);
    }
  }, [isCreated]);

  useEffect(() => {
    const timer = setTimeout(() => setWhiteListErr(''), 10000);
    setWhiteListErr(partnershipResponseData.errorMsg);
    return () => clearTimeout(timer);
  }, [partnershipResponseData]);

  useEffect(() => {
    setLoading(true);
    setWhiteListErr('');
    dispatch(
      setErrMsg({
        errorMsg: '',
        validationErrField: '',
        timeStamp: 0,
      })
    );
    getRequest(`partnership/?partnership_id=${partnershipId}`, {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    }).then((resp: any) => {
      const companyInfo = resp.data.company_information;
      const partnerCompanyInfo = resp.data.partner_company_information;
      if (resp.result === true) {
        let companyInfoId;
        let partnerCompanyInfoID;
        if (!companyInfo && !partnerCompanyInfo) {
          setCompanyId('');
          setPartnerCompanyInfoId('');
          if (resp.data.favicon == null || undefined) {
            setShowPreview(false);
          }
          setInitialValues({
            partnershipName: resp.data.partnership_name,
            websiteSubDomain: resp.data.content_hub_subdomain_name,
            whitelistedDomain: resp.data.whitelisted_domains,
            favIcon: resp.data.favicon_name,
            favIconImg: `${resp.data.favicon}?time=${new Date().getTime()}`,
            companyName: '',
            companyAddress: '',
            companyWebsite: '',
            city: '',
            country: '',
            privacyPolicyURL: '',
            siteTermsURL: '',
            cookiePolicy: '',
            companyLogo: '',
            state: '',
            zipCode: '',
            partnerCompanyName: '',
            partnerCompanyLogo: '',
            partnerCompanyPrivacyPolicyURL: '',
            partnerCompanySiteTermsURL: '',
            partnerCompanyCookiePolicy: '',
          });
        } else if (companyInfo && !partnerCompanyInfo) {
          companyInfoId = resp.data.company_information.company_information_id;
          setCompanyId(companyInfoId);
          setPartnerCompanyInfoId('');
          if (resp.data.favicon == null || undefined) {
            setShowPreview(false);
          }
          setInitialValues({
            partnershipName: resp.data.partnership_name,
            websiteSubDomain: resp.data.content_hub_subdomain_name,
            whitelistedDomain: resp.data.whitelisted_domains,
            favIcon: resp.data.favicon_name,
            favIconImg: `${resp.data.favicon}?time=${new Date().getTime()}`,
            companyName: resp.data.company_information.company_name,
            companyAddress: resp.data.company_information.company_address,
            companyWebsite: resp.data.company_information.company_website,
            city: resp.data.company_information.city,
            country: resp.data.company_information.country,
            privacyPolicyURL: resp.data.company_information.privacy_policy_url,
            siteTermsURL: resp.data.company_information.site_terms_url,
            cookiePolicy: resp.data.company_information.cookie_policy,
            companyLogo: resp.data.company_information.logo_name,
            state: resp.data.company_information.state,
            zipCode: resp.data.company_information.zipcode,
            partnerCompanyName: '',
            partnerCompanyLogo: '',
            partnerCompanyPrivacyPolicyURL: '',
            partnerCompanySiteTermsURL: '',
            partnerCompanyCookiePolicy: '',
          });
          setPreviewImage({
            type: 'SET_API_IMAGE_DETAILS',
            payload: {
              key: previewImageLables.companyLogo,
              name: resp.data.company_information.logo,
              source: resp.data.company_information.thumbnail_logo,
            },
          });
        } else if (companyInfo && partnerCompanyInfo) {
          companyInfoId = resp.data.company_information.company_information_id;
          partnerCompanyInfoID =
            resp.data.partner_company_information
              .partner_company_information_id;
          setCompanyId(companyInfoId);
          setPreviewImage({
            type: 'SET_API_IMAGE_DETAILS',
            payload: {
              key: previewImageLables.companyLogo,
              name: resp.data.company_information.logo,
              source: resp.data.company_information.thumbnail_logo,
            },
          });
          setPreviewImage({
            type: 'SET_API_IMAGE_DETAILS',
            payload: {
              key: previewImageLables.partnerCompanyLogo,
              name: resp.data.partner_company_information.logo,
              source: resp.data.partner_company_information.thumbnail_logo,
            },
          });
          setPartnerCompanyInfoId(partnerCompanyInfoID);
          if (resp.data.favicon == null || undefined) {
            setShowPreview(false);
          }
          setInitialValues({
            partnershipName: resp.data.partnership_name,
            websiteSubDomain: resp.data.content_hub_subdomain_name,
            whitelistedDomain: resp.data.whitelisted_domains,
            favIcon: resp.data.favicon_name,
            favIconImg: `${resp.data.favicon}?time=${new Date().getTime()}`,
            companyName: resp.data.company_information.company_name,
            companyAddress: resp.data.company_information.company_address,
            companyWebsite: resp.data.company_information.company_website,
            city: resp.data.company_information.city,
            country: resp.data.company_information.country,
            privacyPolicyURL: resp.data.company_information.privacy_policy_url,
            siteTermsURL: resp.data.company_information.site_terms_url,
            cookiePolicy: resp.data.company_information.cookie_policy,
            companyLogo: resp.data.company_information.logo_name,
            state: resp.data.company_information.state,
            zipCode: resp.data.company_information.zipcode,
            partnerCompanyName:
              resp.data.partner_company_information.company_name,
            partnerCompanyLogo: resp.data.partner_company_information.logo_name,
            partnerCompanyPrivacyPolicyURL:
              resp.data.partner_company_information.privacy_policy_url,
            partnerCompanySiteTermsURL:
              resp.data.partner_company_information.site_terms_url,
            partnerCompanyCookiePolicy:
              resp.data.partner_company_information.cookie_policy,
          });
        }
      }
      setLoading(false);
    });
  }, [location]);

  const onFileSelected = (event: any) => {
    const file = event.target.files[0];
    fileInput.current.value = '';
    if (
      file &&
      file.name &&
      formikForm &&
      formikForm.current &&
      file.type.includes('image/')
    ) {
      setSelectedFile(file);
      setShowPreview(true);
      const fileName = file.name as string;
      formikForm?.current?.setFieldValue('favIcon', fileName);
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = function (e) {
        formikForm?.current?.setFieldValue(
          'favIconImg',
          e.target.result.toString()
        );
      };
    }
  };

  const onCompanyPartnerFileSelected = (event: any, setFieldValue: any) => {
    const file = event.target.files[0];
    if (
      file &&
      file.name &&
      formikForm &&
      formikForm.current &&
      file.type.includes('image/')
    ) {
      const fileName = file.name as string;
      setPreviewFileData(previewImageLables.partnerCompanyLogo, file);
      // setInitialValues({
      //   ...formikForm.current.values,
      //   partnerCompanyLogo: fileName,
      // });
      setFieldValue('partnerCompanyLogo', fileName);
    } else {
      setAlert((prevState: alert) => ({
        ...prevState,
        showAlert: true,
        message: PreviewPartnershipLabels.fileErrorMessage,
        severity: 'error',
      }));
    }
  };

  const onCompanyFileSelected = (event: any, setFieldValue: any) => {
    const file1 = event.target.files[0];
    if (
      file1 &&
      file1.name &&
      formikForm &&
      formikForm.current &&
      file1.type.includes('image/')
    ) {
      setPreviewFileData(previewImageLables.companyLogo, file1);
      const fileName = file1.name as string;
      // setInitialValues({
      //   ...formikForm.current.values,
      //   companyLogo: fileName,
      // });
      setFieldValue('companyLogo', fileName);
    } else {
      setAlert((prevState: alert) => ({
        ...prevState,
        showAlert: true,
        message: PreviewPartnershipLabels.fileErrorMessage,
        severity: 'error',
      }));
    }
  };

  const OnFavIconCancel = () => {
    formikForm.current.setFieldValue('favIcon', '');
    setShowPreview(false);
    setFormEdited(true);
  };

  const validationSchema = Yup.object().shape({
    partnershipName: Yup.string()
      .trim()
      .min(3, 'Minimum 3 characters is required')
      .required(errorMessageLabels.partnershipName),
    websiteSubDomain: Yup.string()
      .trim()
      .matches(
        /^[a-zA-Z]+[a-zA-Z\d\-]+[a-zA-Z\d]$/,
        'Enter a valid subdomain name'
      )
      .required(errorMessageLabels.websiteSubDomain),
    favIcon: Yup.string().required('Favicon required'),
    companyName: Yup.string()
      .trim()
      .min(3, 'Minimum 3 characters is required')
      .required(errorMessageLabels.companyName),
    // companyLogo: Yup.string().required('CompanyLogo required'),
    companyAddress: Yup.string()
      .trim()
      .min(3, 'Minimum 3 characters is required')
      .required(errorMessageLabels.companyAddress),
    companyWebsite: Yup.string()
      .trim()
      .required(errorMessageLabels.companyWebsite)
      .matches(
        /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi,
        errorMessageLabels.invalidURL
      ),
    city: Yup.string()
      .trim()
      .min(3, 'Minimum 3 characters is required')
      .required(errorMessageLabels.city),
    state: Yup.string()
      .trim()
      .min(2, 'Minimum 2 characters is required')
      .required(errorMessageLabels.state),
    country: Yup.string()
      .trim()
      .min(3, 'Minimum 3 characters is required')
      .required(errorMessageLabels.country),
    zipCode: Yup.string()
      .trim()
      .required(errorMessageLabels.zipCode)
      .matches(/^(?=.*\d)[\d ]+$/, errorMessageLabels.invalidZipCode),

    privacyPolicyURL: Yup.string()
      .trim()
      .required(errorMessageLabels.privacyPolicy)
      .matches(
        /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi,
        errorMessageLabels.invalidURL
      ),
    siteTermsURL: Yup.string()
      .trim()
      .required(errorMessageLabels.siteTermsURL)
      .matches(
        /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi,
        errorMessageLabels.invalidURL
      ),
    cookiePolicy: Yup.string()
      .trim()
      .required(errorMessageLabels.cookiePolicy)
      .matches(
        /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi,
        errorMessageLabels.invalidURL
      ),
    partnerCompanyName: Yup.string()
      .trim()
      .min(3, 'Minimum 3 characters is required')
      .required(errorMessageLabels.partnerCompanyName),
    partnerCompanySiteTermsURL: Yup.string()
      .trim()
      .required(errorMessageLabels.partnerCompanySiteTermsURL)
      .matches(
        /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi,
        errorMessageLabels.invalidURL
      ),
    // partnerCompanyLogo: Yup.string().required('partnerCompanyLogo required'),
    partnerCompanyCookiePolicy: Yup.string()
      .trim()
      .required(errorMessageLabels.partnerCompanyCookiePolicy)
      .matches(
        /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi,
        errorMessageLabels.invalidURL
      ),
    partnerCompanyPrivacyPolicyURL: Yup.string()
      .trim()
      .required(errorMessageLabels.partnerCompanyPrivacyPolicyURL)
      .matches(
        /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi,
        errorMessageLabels.invalidURL
      ),
  });

  const handleAddChip = (chip, setFieldValue, values) => {
    // setInitialValues({
    //   ...formikForm.current.values,
    //   whitelistedDomain: [...initialValues.whitelistedDomain, chip],
    // });
    setFieldValue('whitelistedDomain', [...values.whitelistedDomain, chip]);
  };
  const handleDeleteChip = (chip, setFieldValue, values) => {
    setFormEdited(true);
    const newWhitelistedDomains = values.whitelistedDomain.filter(
      (item) => item !== chip
    );
    setFieldValue('whitelistedDomain', newWhitelistedDomains);
    if (newWhitelistedDomains.length === 0) {
      setWhitelistedDomainsTouched(true);
    }
  };

  const modalClick = () => {
    setModalActive(false);
  };

  return (
    <div className="main_div">
      <div className={modalActive ? 'modalActive' : 'modal'}>
        <div className="modalcontent">
          <p className="modalcontenttitle">{MenuBarLabels.deletePartnership}</p>
          <p className="modalSecContenttitle">{MenuBarLabels.confirmDelete}</p>
          <SecondaryButton
            onClick={modalClick}
            style={{ minWidth: '160px', marginRight: '10px' }}
          >
            {MenuBarLabels.cancelButton}
          </SecondaryButton>
          <PrimaryButton
            onClick={deletePartnerShip}
            style={{ minWidth: '160px' }}
          >
            {MenuBarLabels.deleteButton}
          </PrimaryButton>
        </div>
      </div>
      <div className="preview_partnership_main_card">
        {initialValues && (
          <Formik
            innerRef={formikForm}
            enableReinitialize
            initialValues={initialValues}
            validate={() => ({})}
            validationSchema={validationSchema}
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
                    case previewImageLables.partnerCompanyLogo:
                      formikForm?.current?.setFieldError(
                        'partnerCompanyLogo',
                        previewImage[el].error
                      );
                      break;
                    default:
                      break;
                  }
                }
              });
              if (errorImage) return;
              if (values.whitelistedDomain.length === 0) {
                setWhitelistedDomainsTouched(true);
              } else {
                setLoading(true);
                dispatch(
                  setPartnerCompanyName({
                    partnerCompanyName: values.partnerCompanyName,
                  })
                );

                const companyLogoFile = previewImage[
                  previewImageLables.companyLogo
                ]?.cropped
                  ? previewImage[previewImageLables.companyLogo]?.croppedFile
                  : previewImage[previewImageLables.companyLogo]?.file;
                const partnerCompanyLogoFile = previewImage[
                  previewImageLables.partnerCompanyLogo
                ]?.cropped
                  ? previewImage[previewImageLables.partnerCompanyLogo]
                      ?.croppedFile
                  : previewImage[previewImageLables.partnerCompanyLogo]?.file;
                dispatch(
                  PreviewAndSaveInfoAction(
                    {
                      ...values,
                      whitelistedDomain: values.whitelistedDomain,
                    },
                    partnershipId,
                    companyId,
                    partnerCompanyInfoId,
                    companyLogoFile,
                    partnerCompanyLogoFile,
                    selectedFile,
                    () => {
                      setLoading(false);
                      setFormEdited(false);
                    },
                    () => {
                      if (isCreated !== '1') {
                        setAlert((prevState: alert) => ({
                          ...prevState,
                          showAlert: true,
                          message: PreviewPartnershipLabels.snackbarUpdateMsg,
                          severity: 'success',
                        }));
                        setShowSave(false);
                      } else {
                        setAlert((prevState: alert) => ({
                          ...prevState,
                          showAlert: true,
                          message: PreviewPartnershipLabels.snackbarMsg,
                          severity: 'success',
                        }));
                        setShowSave(false);
                      }
                    },
                    () => (errorMsg: string) =>
                      setAlert((prevState: alert) => ({
                        ...prevState,
                        showAlert: true,
                        message: errorMsg,
                        severity: 'error',
                      })),
                    setFormEdited
                  )
                );
              }
            }}
          >
            {(formik) => {
              const {
                values,
                handleChange,
                handleSubmit,
                errors,
                touched,
                dirty,
                handleBlur,
                validateField,
                setFieldValue,
              } = formik;

              setIsDirty(dirty);
              return (
                <Form onSubmit={handleSubmit}>
                  <div
                    className={
                      modalActive
                        ? '.preview_none_floating_wrap'
                        : 'preview_floating_wrap'
                    }
                  >
                    <div className="preview_partnership_title_div">
                      {PreviewPartnershipLabels.titleLabel}
                      {(formEdited || dirty) && showSave && (
                        <div>
                          <SecondaryButton
                            style={{ marginRight: '30px', minWidth: '160px' }}
                            onClick={() => {
                              setShowCloseWarning(true);
                            }}
                          >
                            {PreviewPartnershipLabels.cancelButtonLabel}
                          </SecondaryButton>
                          <PrimaryButton
                            type="submit"
                            style={{ minWidth: '160px' }}
                          >
                            {PreviewPartnershipLabels.saveButtonLabel}
                          </PrimaryButton>
                        </div>
                      )}
                    </div>
                  </div>
                  <div
                    className="preview_partnership_info_title_div"
                    onClickCapture={() => setShowPartnership(!showPartnership)}
                  >
                    {PreviewPartnershipLabels.partnershipInfoLabel}
                    <IconButton>
                      <img src={DownArrow} alt="" />
                    </IconButton>
                  </div>
                  {showPartnership ? (
                    <div>
                      <div className="info_div">
                        <div className="each_info_div">
                          <div className="label_div">
                            {PreviewPartnershipLabels.partnershipNameLabel}
                          </div>
                          <div className="textfield_div">
                            <Field
                              type="text"
                              name="partnershipName"
                              value={values.partnershipName}
                              placeholder={
                                PreviewPartnershipLabels.partnershipNameLabel
                              }
                              onBlur={handleBlur}
                              onChange={handleChange}
                              hasError={
                                errors.partnershipName &&
                                touched.partnershipName
                              }
                              errorMessage={errors.partnershipName}
                              component={GenTextField}
                              classes={classes}
                              style={{ padding: '0px 20% 0px 5%' }}
                            />
                            <RenderErrorMessage name="partnershipName" />
                          </div>
                        </div>
                        <div className="each_info_div">
                          <div className="label_div">
                            {PreviewPartnershipLabels.webSubdomainNameLabel}
                          </div>
                          <div className="domain_textfield_div">
                            <div className="domainWrap">
                              <Field
                                type="text"
                                name="websiteSubDomain"
                                value={values.websiteSubDomain}
                                placeholder={
                                  PreviewPartnershipLabels.webSubDomainNamePlaceholder
                                }
                                onBlur={handleBlur}
                                onChange={handleChange}
                                hasError={
                                  errors.websiteSubDomain &&
                                  touched.websiteSubDomain
                                }
                                errorMessage={errors.websiteSubDomain}
                                style={{
                                  margin: '0px 20% 0px 5%',
                                }}
                                component={GenTextField}
                                classes={classes}
                              />
                              <div className="domainEndPoint">
                                {PreviewPartnershipLabels.domainEndPoint}
                              </div>
                            </div>
                            {whiteListErr !== '' &&
                            partnershipResponseData.validationErrField ===
                              'content_hub_subdomain_name' ? (
                              <div
                                style={{
                                  color: 'red',
                                  fontSize: '12px',
                                  fontWeight: '500',
                                }}
                              >
                                {partnershipResponseData.errorMsg}
                              </div>
                            ) : (
                              <RenderErrorMessage name="websiteSubDomain" />
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="info_div">
                        <div className="each_info_div whitelistDominWrap">
                          <div className="label_div domain_label_div">
                            {PreviewPartnershipLabels.whitelistedDomain}
                          </div>
                          <div className="textfield_div chipInput_div">
                            <ChipInput
                              value={values.whitelistedDomain}
                              onAdd={(chip) => {
                                handleAddChip(chip, setFieldValue, values);
                              }}
                              onDelete={(chip) => {
                                handleDeleteChip(chip, setFieldValue, values);
                              }}
                              variant="outlined"
                              blurBehavior="add"
                              style={{
                                minWidth: '315px',
                                maxWidth: '315px',
                              }}
                              onBlur={() => setWhitelistedDomainsTouched(true)}
                              onChangeCapture={() => {
                                setWhitelistedDomainsTouched(false);
                              }}
                              error={
                                whitelistedDomainsTouched &&
                                values.whitelistedDomain.length === 0
                              }
                              placeholder={
                                values.whitelistedDomain.length === 0
                                  ? PreviewPartnershipLabels.whitelistedDomain
                                  : ''
                              }
                              helperText={
                                whiteListErr === '' &&
                                whitelistedDomainsTouched &&
                                values.whitelistedDomain.length === 0
                                  ? errorMessageLabels.whitelistedDomains
                                  : whiteListErr !== '' &&
                                    partnershipResponseData.validationErrField ===
                                      'whitelisted_domains'
                                  ? ''
                                  : 'Press enter to add domain names'
                              }
                            />
                            {whiteListErr !== '' &&
                              partnershipResponseData.validationErrField ===
                                'whitelisted_domains' && (
                                <div
                                  style={{
                                    color: 'red',
                                    fontSize: '12px',
                                    fontWeight: '500',
                                    padding: '5px 0',
                                  }}
                                >
                                  {whiteListErr}
                                </div>
                              )}
                          </div>
                        </div>
                        <div className="each_info_div whitelistDominWrap">
                          <div className="label_div domain_label_div">
                            {PreviewPartnershipLabels.favicon}
                          </div>
                          <div className="favIcon_textfield_div">
                            <div>
                              <Field
                                className="favIcon_textfield"
                                name="favIcon"
                                component={GenTextField}
                                classes={classes}
                                type="file"
                                value={values.favIcon}
                                // onChange={handleChange}
                                // onBlur={handleBlur}
                                hasError={errors.favIcon && touched.favIcon}
                                errorMessage={errors.favIcon}
                                placeholder={PreviewPartnershipLabels.favicon}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <IconButton
                                        onClick={(e) => {
                                          if (fileInput && fileInput.current) {
                                            fileInput.current.click();
                                          }
                                        }}
                                      >
                                        <input
                                          accept="image/*"
                                          ref={fileInput}
                                          type="file"
                                          style={{ display: 'none' }}
                                          onChange={(e: any) => {
                                            onFileSelected(e);
                                          }}
                                        />
                                        <img src={uploadIcon} alt="" />
                                      </IconButton>
                                    </InputAdornment>
                                  ),
                                  accept: 'image/*',
                                  readOnly: true,
                                }}
                              />
                              {showPreview ? (
                                <div className="favIconImgDiv">
                                  <img
                                    className="favIconImg"
                                    src={values.favIconImg}
                                    alt="favIconImg"
                                  />
                                  <IconButton className="closeicon">
                                    <CloseIcon
                                      onClick={() => {
                                        OnFavIconCancel();
                                      }}
                                      style={{
                                        width: '11px',
                                        height: '11px',
                                        color: 'black',
                                        backgroundColor: 'white',
                                        borderRadius: '50%',
                                        border: '1px solid black',
                                      }}
                                    />
                                  </IconButton>
                                </div>
                              ) : (
                                ''
                              )}
                            </div>
                            <RenderErrorMessage name="favIcon" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <div
                    className="preview_partnership_info_title_div"
                    onClickCapture={() => setShowCompany(!showCompany)}
                  >
                    {PreviewPartnershipLabels.companyInfoLabel}
                    <IconButton>
                      <img src={DownArrow} alt="" />
                    </IconButton>
                  </div>
                  {showCompany ? (
                    <div>
                      <div className="info_div thumbnail_container">
                        <div className="each_info_div">
                          <div className="label_div">
                            {PreviewPartnershipLabels.companyNameLabel}
                          </div>
                          <div className="textfield_div">
                            <Field
                              type="text"
                              name="companyName"
                              value={values.companyName}
                              placeholder={
                                PreviewPartnershipLabels.companyNameLabel
                              }
                              onBlur={handleBlur}
                              onChange={handleChange}
                              hasError={
                                errors.companyName && touched.companyName
                              }
                              errorMessage={errors.companyName}
                              component={GenTextField}
                              classes={classes}
                              style={{ margin: '0px 20% 0px 5%' }}
                            />
                            <RenderErrorMessage name="companyName" />
                          </div>
                        </div>
                        <div className="each_info_div thumbnail_container">
                          <div className="label_div">
                            {PreviewPartnershipLabels.companyLogoLabel}
                          </div>
                          <div className="textfield_div">
                            <Field
                              type="text"
                              name="companyLogo"
                              value={values.companyLogo}
                              placeholder={
                                PreviewPartnershipLabels.companyLogoPlaceholder
                              }
                              // onBlur={handleBlur}
                              // onChange={handleChange}
                              hasError={
                                errors.companyLogo && touched.companyLogo
                              }
                              errorMessage={errors.companyLogo}
                              component={GenTextField}
                              classes={classes}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      onClick={() => {
                                        if (
                                          companyFileInput &&
                                          companyFileInput.current
                                        ) {
                                          companyFileInput.current.click();
                                        }
                                      }}
                                    >
                                      <input
                                        accept="image/x-png,image/gif,image/jpeg"
                                        ref={companyFileInput}
                                        type="file"
                                        style={{ display: 'none' }}
                                        onChange={(e: any) => {
                                          onCompanyFileSelected(
                                            e,
                                            setFieldValue
                                          );
                                          // validateField('companyLogo');
                                        }}
                                      />
                                      <img src={UploadLogo} alt="" />
                                    </IconButton>
                                  </InputAdornment>
                                ),
                                accept: 'image/*',
                                readOnly: true,
                              }}
                              style={{ margin: '0px 20% 0px 5%' }}
                            />
                            <div className="previewImageHelper">
                              Recommended size 150 x 50 px
                            </div>
                            <RenderErrorMessage
                              className="imgErrorMsg"
                              name="companyLogo"
                            />
                            <PreviewImage
                              showCrop
                              classes="thumbnailImg"
                              id={previewImageLables.companyLogo}
                              src={
                                previewImage[previewImageLables.companyLogo]
                                  ?.cropped
                                  ? previewImage[previewImageLables.companyLogo]
                                      ?.croppedSource
                                  : previewImage[previewImageLables.companyLogo]
                                      ?.source
                              }
                              alt={previewImageLables.companyLogo}
                              show={
                                previewImage[previewImageLables.companyLogo]
                                  .name &&
                                previewImage[previewImageLables.companyLogo]
                                  .source
                              }
                              CustomStyles={{
                                ContainerStyle: { marginBottom: '0' },
                              }}
                              CloseHandler={() =>
                                onImageCancel(
                                  previewImageLables.companyLogo,
                                  setFieldValue
                                )
                              }
                              CropHandler={() =>
                                setShowCropImage({
                                  companyLogo: true,
                                  partnershipLogo: false,
                                })
                              }
                              UndoHandler={() =>
                                setPreviewImage({
                                  type: 'CLEAR_CROPPED_IMAGE',
                                  payload: {
                                    key: previewImageLables.companyLogo,
                                  },
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <div className="info_div">
                        <div className="each_info_div">
                          <div className="label_div">
                            {PreviewPartnershipLabels.companyAddressLabel}
                          </div>
                          <div className="textfield_div partnershipTextArea">
                            <Field
                              type="text"
                              name="companyAddress"
                              value={values.companyAddress}
                              placeholder={
                                PreviewPartnershipLabels.companyAddressLabel
                              }
                              onBlur={handleBlur}
                              onChange={handleChange}
                              hasError={
                                errors.companyAddress && touched.companyAddress
                              }
                              errorMessage={errors.companyAddress}
                              component={GenTextField}
                              classes={classes}
                              style={{
                                margin: '0px 20% 0px 5%',
                                minHeight: '85px',
                              }}
                              multiline
                            />
                            <RenderErrorMessage name="companyAddress" />
                          </div>
                        </div>
                        <div className="each_info_div">
                          <div className="label_div">
                            {PreviewPartnershipLabels.stateLabel}
                          </div>
                          <div className="textfield_div">
                            <Field
                              type="text"
                              name="state"
                              value={values.state}
                              placeholder={PreviewPartnershipLabels.stateLabel}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              hasError={errors.state && touched.state}
                              errorMessage={errors.state}
                              component={GenTextField}
                              classes={classes}
                              style={{ margin: '0px 20% 0px 5%' }}
                            />
                            <RenderErrorMessage name="state" />
                          </div>
                        </div>
                      </div>
                      <div className="info_div">
                        <div className="each_info_div">
                          <div className="label_div">
                            {PreviewPartnershipLabels.cityLabel}
                          </div>
                          <div className="textfield_div">
                            <Field
                              type="text"
                              name="city"
                              value={values.city}
                              placeholder={PreviewPartnershipLabels.cityLabel}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              hasError={errors.city && touched.city}
                              errorMessage={errors.city}
                              component={GenTextField}
                              classes={classes}
                              style={{ margin: '0px 20% 0px 5%' }}
                            />
                            <RenderErrorMessage name="city" />
                          </div>
                        </div>
                        <div className="each_info_div">
                          <div className="label_div">
                            {PreviewPartnershipLabels.zipLabel}
                          </div>
                          <div className="textfield_div">
                            <Field
                              type="text"
                              name="zipCode"
                              value={values.zipCode}
                              placeholder={PreviewPartnershipLabels.zipLabel}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              hasError={errors.zipCode && touched.zipCode}
                              errorMessage={errors.zipCode}
                              component={GenTextField}
                              classes={classes}
                              style={{ margin: '0px 20% 0px 5%' }}
                            />
                            <RenderErrorMessage name="zipCode" />
                          </div>
                        </div>
                      </div>
                      <div className="info_div">
                        <div className="each_info_div">
                          <div className="label_div">
                            {PreviewPartnershipLabels.countryLabel}
                          </div>
                          <div className="textfield_div">
                            <Field
                              type="text"
                              name="country"
                              value={values.country}
                              placeholder={
                                PreviewPartnershipLabels.countryLabel
                              }
                              onBlur={handleBlur}
                              onChange={handleChange}
                              hasError={errors.country && touched.country}
                              errorMessage={errors.country}
                              component={GenTextField}
                              classes={classes}
                              style={{ margin: '0px 20% 0px 5%' }}
                            />
                            <RenderErrorMessage name="country" />
                          </div>
                        </div>
                        <div className="each_info_div">
                          <div className="label_div">
                            {PreviewPartnershipLabels.companyWebsiteLabel}
                          </div>
                          <div className="textfield_div">
                            <Field
                              type="text"
                              name="companyWebsite"
                              value={values.companyWebsite}
                              placeholder={
                                PreviewPartnershipLabels.companyWebsiteLabel
                              }
                              onBlur={handleBlur}
                              onChange={handleChange}
                              hasError={
                                errors.companyWebsite && touched.companyWebsite
                              }
                              errorMessage={errors.companyWebsite}
                              component={GenTextField}
                              classes={classes}
                              style={{ margin: '0px 20% 0px 5%' }}
                            />
                            <RenderErrorMessage name="companyWebsite" />
                          </div>
                        </div>
                      </div>
                      <div className="info_div">
                        <div className="each_info_div">
                          <div className="label_div">
                            {PreviewPartnershipLabels.privacyPolicyURLLabel}
                          </div>
                          <div className="textfield_div">
                            <Field
                              type="text"
                              name="privacyPolicyURL"
                              value={values.privacyPolicyURL}
                              placeholder={
                                PreviewPartnershipLabels.privacyPolicyURLLabel
                              }
                              onBlur={handleBlur}
                              onChange={handleChange}
                              hasError={
                                errors.privacyPolicyURL &&
                                touched.privacyPolicyURL
                              }
                              errorMessage={errors.privacyPolicyURL}
                              component={GenTextField}
                              classes={classes}
                              style={{ margin: '0px 20% 0px 5%' }}
                            />
                            <RenderErrorMessage name="privacyPolicyURL" />
                          </div>
                        </div>
                      </div>
                      <div className="info_div">
                        <div className="each_info_div">
                          <div className="label_div">
                            {PreviewPartnershipLabels.siteTermsURLLabel}
                          </div>
                          <div className="textfield_div">
                            <Field
                              type="text"
                              name="siteTermsURL"
                              value={values.siteTermsURL}
                              placeholder={
                                PreviewPartnershipLabels.siteTermsURLLabel
                              }
                              onBlur={handleBlur}
                              onChange={handleChange}
                              hasError={
                                errors.siteTermsURL && touched.siteTermsURL
                              }
                              errorMessage={errors.siteTermsURL}
                              component={GenTextField}
                              classes={classes}
                              style={{ margin: '0px 20% 0px 5%' }}
                            />
                            <RenderErrorMessage name="siteTermsURL" />
                          </div>
                        </div>
                      </div>
                      <div className="info_div">
                        <div className="each_info_div">
                          <div className="label_div">
                            {PreviewPartnershipLabels.cookiePolicyLabel}
                          </div>
                          <div className="textfield_div">
                            <Field
                              type="text"
                              name="cookiePolicy"
                              value={values.cookiePolicy}
                              placeholder={
                                PreviewPartnershipLabels.cookiePolicyLabel
                              }
                              onBlur={handleBlur}
                              onChange={handleChange}
                              hasError={
                                errors.cookiePolicy && touched.cookiePolicy
                              }
                              errorMessage={errors.cookiePolicy}
                              component={GenTextField}
                              classes={classes}
                              style={{ margin: '0px 20% 0px 5%' }}
                            />
                            <RenderErrorMessage name="cookiePolicy" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <div
                    className="preview_partnership_info_title_div"
                    onClickCapture={() =>
                      setShowCompanyPartner(!showCompanyPartner)
                    }
                  >
                    {PreviewPartnershipLabels.partnerCompanyInfoLabel}
                    <IconButton>
                      <img src={DownArrow} alt="" />
                    </IconButton>
                  </div>
                  {showCompanyPartner ? (
                    <div className="info_div">
                      <div className="flex-col full-width">
                        <div className="each_info_div full-width">
                          <div className="label_div">
                            {PreviewPartnershipLabels.partnerCompanyNameLabel}
                          </div>
                          <div className="textfield_div">
                            <Field
                              type="text"
                              name="partnerCompanyName"
                              value={values.partnerCompanyName}
                              placeholder={
                                PreviewPartnershipLabels.partnerCompanyNameLabel
                              }
                              onBlur={handleBlur}
                              onChange={handleChange}
                              hasError={
                                errors.partnerCompanyName &&
                                touched.partnerCompanyName
                              }
                              errorMessage={errors.partnerCompanyName}
                              component={GenTextField}
                              classes={classes}
                              style={{ margin: '0px 20% 0px 5%' }}
                            />
                            <RenderErrorMessage name="partnerCompanyName" />
                          </div>
                        </div>
                        <div className="each_info_div full-width thumbnail_container">
                          <div className="label_div">
                            {PreviewPartnershipLabels.partnerCompanyLogoLabel}
                          </div>
                          <div className="textfield_div">
                            <Field
                              type="file"
                              name="partnerCompanyLogo"
                              value={values.partnerCompanyLogo}
                              placeholder={
                                PreviewPartnershipLabels.companyLogoPlaceholder
                              }
                              // onBlur={handleBlur}
                              // onChange={handleChange}
                              hasError={
                                errors.partnerCompanyLogo &&
                                touched.partnerCompanyLogo
                              }
                              errorMessage={errors.partnerCompanyLogo}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      onClick={() => {
                                        if (
                                          companyPartnerFileInput &&
                                          companyPartnerFileInput.current
                                        ) {
                                          companyPartnerFileInput.current.click();
                                        }
                                      }}
                                    >
                                      <input
                                        accept="image/x-png,image/gif,image/jpeg"
                                        ref={companyPartnerFileInput}
                                        type="file"
                                        style={{ display: 'none' }}
                                        onChange={(e: any) => {
                                          onCompanyPartnerFileSelected(
                                            e,
                                            setFieldValue
                                          );
                                          // validateField('partnerCompanyLogo');
                                        }}
                                      />
                                      <img src={UploadLogo} alt="" />
                                    </IconButton>
                                  </InputAdornment>
                                ),
                                accept: 'image/*',
                                readOnly: true,
                              }}
                              component={GenTextField}
                              classes={classes}
                              style={{ margin: '0px 20% 0px 5%' }}
                            />
                            <div className="previewImageHelper">
                              Recommended size 150 x 50 px
                            </div>
                            <RenderErrorMessage
                              className="imgErrorMsg"
                              name="partnerCompanyLogo"
                            />
                            <PreviewImage
                              showCrop
                              classes="thumbnailImg"
                              id={previewImageLables.partnerCompanyLogo}
                              src={
                                previewImage[
                                  previewImageLables.partnerCompanyLogo
                                ]?.cropped
                                  ? previewImage[
                                      previewImageLables.partnerCompanyLogo
                                    ]?.croppedSource
                                  : previewImage[
                                      previewImageLables.partnerCompanyLogo
                                    ]?.source
                              }
                              show={
                                previewImage[
                                  previewImageLables.partnerCompanyLogo
                                ].name &&
                                previewImage[
                                  previewImageLables.partnerCompanyLogo
                                ].source
                              }
                              CustomStyles={{
                                ContainerStyle: { marginBottom: '0' },
                              }}
                              alt={previewImageLables.partnerCompanyLogo}
                              CloseHandler={() =>
                                onImageCancel(
                                  previewImageLables.partnerCompanyLogo,
                                  setFieldValue
                                )
                              }
                              CropHandler={() =>
                                setShowCropImage({
                                  companyLogo: false,
                                  partnershipLogo: true,
                                })
                              }
                              UndoHandler={() =>
                                setPreviewImage({
                                  type: 'CLEAR_CROPPED_IMAGE',
                                  payload: {
                                    key: previewImageLables.partnerCompanyLogo,
                                  },
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex-col full-width">
                        <div className="each_info_div full-width">
                          {
                            PreviewPartnershipLabels.partnerCompanyPrivacyPolicyURLLabel
                          }
                          <div className="textfield_div">
                            <Field
                              type="text"
                              name="partnerCompanyPrivacyPolicyURL"
                              value={values.partnerCompanyPrivacyPolicyURL}
                              placeholder={
                                PreviewPartnershipLabels.privacyPolicyURLLabel
                              }
                              onBlur={handleBlur}
                              onChange={handleChange}
                              hasError={
                                errors.partnerCompanyPrivacyPolicyURL &&
                                touched.partnerCompanyPrivacyPolicyURL
                              }
                              errorMessage={
                                errors.partnerCompanyPrivacyPolicyURL
                              }
                              component={GenTextField}
                              classes={classes}
                              style={{ margin: '0px 20% 0px 5%' }}
                            />
                            <RenderErrorMessage name="partnerCompanyPrivacyPolicyURL" />
                          </div>
                        </div>
                        <div className="each_info_div full-width">
                          {
                            PreviewPartnershipLabels.partnerCompanySiteTermsURLLabel
                          }
                          <div className="textfield_div">
                            <Field
                              type="text"
                              name="partnerCompanySiteTermsURL"
                              value={values.partnerCompanySiteTermsURL}
                              placeholder={
                                PreviewPartnershipLabels.siteTermsURLLabel
                              }
                              onBlur={handleBlur}
                              onChange={handleChange}
                              hasError={
                                errors.partnerCompanySiteTermsURL &&
                                touched.partnerCompanySiteTermsURL
                              }
                              errorMessage={errors.partnerCompanySiteTermsURL}
                              component={GenTextField}
                              classes={classes}
                              style={{ margin: '0px 20% 0px 5%' }}
                            />
                            <RenderErrorMessage name="partnerCompanySiteTermsURL" />
                          </div>
                        </div>
                        <div className="each_info_div full-width">
                          {
                            PreviewPartnershipLabels.partnerCompanyCookiePolicyLabel
                          }
                          <div className="textfield_div">
                            <Field
                              type="text"
                              name="partnerCompanyCookiePolicy"
                              value={values.partnerCompanyCookiePolicy}
                              placeholder={
                                PreviewPartnershipLabels.cookiePolicyLabel
                              }
                              onBlur={handleBlur}
                              onChange={handleChange}
                              hasError={
                                errors.partnerCompanyCookiePolicy &&
                                touched.partnerCompanyCookiePolicy
                              }
                              errorMessage={errors.partnerCompanyCookiePolicy}
                              component={GenTextField}
                              classes={classes}
                              style={{ margin: '0px 20% 0px 5%' }}
                            />
                            <RenderErrorMessage name="partnerCompanyCookiePolicy" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                  <div style={{ display: 'flex', flexFlow: 'row-reverse' }}>
                    <SecondaryButton
                      onClick={() => setModalActive(true)}
                      style={{
                        minWidth: '160px',
                        marginRight: '10px',
                      }}
                    >
                      {MenuBarLabels.deletePartnership}
                    </SecondaryButton>
                  </div>
                  {/* <div
                    className="preview_partnership_info_title_div"
                    onClick={() => setShowPartnershipTeam(!showPartnershipTeam)}
                  >
                    {PreviewPartnershipLabels.partnershipTeamLabel}
                    <IconButton>
                      <img src={DownArrow} alt="" />
                    </IconButton>
                  </div>
                  {showPartnershipTeam ? (
                    <div className="info_div">
                      <div className="addCollaborator_button_div">
                        <Button
                          className="save_button"
                          variant="contained"
                          size="small"
                          color="primary"
                        >
                          {PreviewPartnershipLabels.addCollaboratorButtonLabel}
                        </Button>
                      </div>
                    </div>
                  ) : null} */}
                </Form>
              );
            }}
          </Formik>
        )}
      </div>

      {showCloseWarning && (
        <DialogBoxComponent
          title=""
          secondaryContent="Are you sure you want to discard changes made on this page?"
          primaryContent="Unsaved changes"
          secondaryButton="Cancel"
          primaryButton="Discard"
          handleDialogBoxClose={() => {
            if (PreviewPartnershipData.previewPartnershipWarningEditor.show) {
              dispatch(
                setShowPreviewPartnershipWarningEditor({
                  show: false,
                  navigateAction: null,
                })
              );
            }
            setShowCloseWarning(false);
          }}
          handleAgree={() => {
            setShowCloseWarning(false);
            dispatch(
              setShowPreviewPartnershipWarningEditor({
                show: false,
                navigateAction: null,
              })
            );
            dispatch(
              setIsPreviewPartnershipFormEdited({
                isPreviewPartnershipFormEdited: false,
              })
            );
            if (PreviewPartnershipData.previewPartnershipWarningEditor.show) {
              history.push(`/previewPartnership?partner_id=${partnershipId}`);
              PreviewPartnershipData.previewPartnershipWarningEditor.navigateAction();
              return;
            }
            history.push(`/accountSetup?partner_id=${partnershipId}`);
          }}
          show
        />
      )}
      {showAlert && (
        <SnackbarAlert
          severity="success"
          handler={() => setShowAlert(false)}
          showalert={showAlert}
          message={MenuBarLabels.snackbarMsg}
        />
      )}
      {loading && <Loader />}
      {alert.showAlert && (
        <SnackbarAlert
          severity={alert.severity}
          handler={() => {
            setAlert((prevState: alert) => ({
              ...prevState,
              showAlert: false,
            }));
            if (alert.severity !== 'error') {
              history.push(
                `/accountSetup?partner_id=${partnershipId}&uploadAsset=true`
              );
            }
          }}
          showalert={alert.showAlert}
          message={alert.message}
        />
      )}
      {showCropImage.companyLogo && (
        <CroppedImage
          previewImage={previewImage[previewImageLables.companyLogo]}
          previewImageLable={previewImageLables.companyLogo}
          setLoader={() => setLoading(true)}
          clearLoader={() => setLoading(false)}
          setPreviewImage={setPreviewImage}
          setShowCropImage={() =>
            setShowCropImage({ companyLogo: false, partnershipLogo: false })
          }
        />
      )}
      {showCropImage.partnershipLogo && (
        <CroppedImage
          previewImage={previewImage[previewImageLables.partnerCompanyLogo]}
          previewImageLable={previewImageLables.partnerCompanyLogo}
          setLoader={() => setLoading(true)}
          clearLoader={() => setLoading(false)}
          setPreviewImage={setPreviewImage}
          setShowCropImage={() =>
            setShowCropImage({ companyLogo: false, partnershipLogo: false })
          }
        />
      )}
    </div>
  );
};

export default PreviewPartnership;
