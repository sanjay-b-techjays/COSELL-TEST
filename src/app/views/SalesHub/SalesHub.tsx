/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
/* eslint-disable linebreak-style */
/* eslint-disable function-paren-newline */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable linebreak-style */
/* eslint-disable object-curly-newline */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable linebreak-style */
/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */
/* eslint-disable linebreak-style */
import { useState, useRef, useEffect, useCallback } from 'react';
import { Formik, Form, Field, FormikProps } from 'formik';
import * as Yup from 'yup';
import './SalesHub.css';
import { InputAdornment, MenuItem, Select, Slider } from '@material-ui/core';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { useDispatch, useSelector } from 'react-redux';
import Loader from 'src/app/components/Loader';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import SnackbarAlert from 'src/app/components/Snackbar/Snackbar';
import PrimaryButton from 'src/app/components/Button/PrimaryButton';
import SideBar from 'src/app/components/SideBar';
import { getRequest } from 'src/app/service';
import { useHistory, useLocation } from 'react-router';
import PreviewImage from 'src/app/components/PreviewImage/PreviewImage';
import SecondaryButton from 'src/app/components/Button/SecondaryButton/SecondaryButton';
import {
  SalesHubLabels,
  errorMessageLabels,
  previewImageLables,
} from '../../../strings';
import ManageAssetCollections from './Components/ManageAssetCollection';
import { RenderErrorMessage, GenTextField } from '../SalesHubSite/Form';
import UploadLogo from '../../components/Icons/PreviewPartnership/UploadLogoIcon.svg';
import DownArrow from '../../components/Icons/PreviewPartnership/DownArrow.svg';
import useThumbnailImage from '../../components/PreviewImage/CustomHook/useThumbnailImage';

// import TestImg from './Components/AssetCollectionCard/test_img.svg';
import styles from './SalesHub.module.css';
import {
  saveSalesHubAction,
  // deleteAssetCollectionAction,
  salesHubResponse,
  // setSalesHubAssetCollectionInfo,
  setSalesHubInfo,
  setIsSalesHubFormEdited,
  setShowSalesHubWarningEditor,
} from './SalesHubSlice';
import { SalesHubInfo, assetCollectionData } from './types';
import AssetCollectionCard from '../AssetCollection/Components/AssetCollectionCard/AssetCollectionCard';
import { useStyles } from '../SalesHubSite/Styles';
import DialogBoxComponent from '../../components/DialogBox/DialogBox';
import CroppedImage from 'src/app/components/CroppedImage/CroppedImage';

interface salesHubValues {
  headerText: string;
  subHeaderText: string;
  headerImg: string | File;
  headerImgFile?: string;
  fontColor: string;
  fontFamily: string;
}

// color: #77889987;
// font-family: inter;
// font-weight: 400;
interface alert {
  showAlert: boolean;
  severity: string;
  message: string;
}
interface listObjectType {
  key: string;
  id: number;
  value: string;
}

const SalesHub = (props: any) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const ref = useRef(null);

  const history = useHistory();
  const location = useLocation();
  const salesHub = useSelector(salesHubResponse);
  const [salesLayout, setSalesLayout] = useState(true);
  const [showCloseWarning, setShowCloseWarning] = useState(false);
  const [assetCollection, setAssetCollection] = useState(true);
  const [fontColorChosen, setFontColorChosen] = useState('');
  const [fontColorMenu, setFontColorMenu] = useState(false);
  const [fontFamilyChosen, setFontFamilyChosen] = useState('');
  const [fontFamilyMenu, setFontFamilyMenu] = useState(false);
  const salesHubFileInput = useRef<HTMLInputElement>(null);
  const salesHubSubmitButton = useRef<HTMLButtonElement>(null);
  const salesHubForm = useRef<HTMLFormElement>(null);
  const formikForm = useRef<FormikProps<salesHubValues>>(null);
  const [formValue, setFormValue] = useState<salesHubValues>();

  // const [selected, setSelected] = useState([]);
  // const [selectedAssetCollectionInfo, setSelectedAssetCollectionInfo] =
  //   useState({});
  const [partnershipId, setPartnershipID] = useState('');
  const [assetCollectoffset, setAssetCollectOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [assetCollectcount, setAssetCollectCount] = useState(0);
  const [page, setPage] = useState(1);
  const [salesHubOffset, setSalesHubOffset] = useState(0);
  const [salesHublimit, setSalesHublimit] = useState(10);
  const [salesHubCount, setSalesHubCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState([]);
  const [salesHubId, setSalesHubId] = useState('');
  const [showActiveMenu, setShowActiveMenu] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const [isFromEdited, setIsFromEdited] = useState(false);
  const [subDoamin, setSubDoamin] = useState('');
  const [previewImage, setPreviewImage, setFileData] = useThumbnailImage([
    { key: previewImageLables.salesHubImage, aspectRatio: 2 / 1 },
  ]);
  const [showCropImage, setShowCropImage] = useState(false);
  const [alert, setAlert] = useState({
    showAlert: false,
    severity: '',
    message: '',
  });
  const [initialValues, setInitialValues] = useState<salesHubValues>({
    headerText: '',
    subHeaderText: '',
    headerImg: '',
    headerImgFile: '',
    fontColor: '',
    fontFamily: '',
  });

  const [fontFamily, setFontFamily] = useState();
  const [fontColor, setFontColor] = useState();
  const [fontFamilyList, setFontFamilyList] = useState([]);
  const [fontColorList, setFontColorList] = useState([]);
  const [selectedAssetCollections, setSelectedAssetCollections] = useState<
    assetCollectionData[]
  >([]);
  const [selectedAssetCollectionIds, setSelectedAssetCollectionIds] = useState(
    []
  );

  const fetchAssetCollectDetailById = (
    shId: string,
    partnershipID: any,
    currOffset: any
  ) => {
    console.log(shId, 'shId');
    setAssetCollectOffset(currOffset);
    if (currOffset === 0) {
      setPage(1);
    }
    const token = localStorage.getItem('token');
    getRequest(
      `partnership/sales-hub/solution-narratives/?partnership_id=${partnershipID}&sales_hub_id=${shId}&offset=${currOffset}&limit=${salesHublimit}&is_selected=true`,
      {
        Authorization: `Token ${token}`,
      }
    ).then((resp1: any) => {
      if (resp1.result === true) {
        const selectedSol = resp1.data;
        if (resp1.count) {
          setAssetCollectCount(resp1.count);
        }
        setSelectedAssetCollections(selectedSol);
        let selectedAssetCollectionIds: any[] = [];
        if (resp1.data.length > 0) {
          selectedAssetCollectionIds = resp1.data.map((s: any) =>
            s.solution_narrative_id.toString()
          );
          setSelectedAssetCollectionIds(selectedAssetCollectionIds);
        }
      }
      setIsLoading(false);
    });
  };
  const fetchSalesHubData = () => {
    setIsLoading(true);
    const queryparams = new URLSearchParams(window.location.search);
    const partnershipID: string = queryparams.get('partner_id') || '0';
    setPartnershipID(partnershipID);
    const token = localStorage.getItem('token');
    // get all salesHubData
    getRequest(
      `partnership/sales-hub/?partnership_id=${partnershipID}&offset=${salesHubOffset}&limit=${salesHublimit}`,
      {
        Authorization: `Token ${token}`,
      }
    ).then((response: any) => {
      if (response.result === true) {
        if (response.data.length > 0) {
          const salesHubIdNew = response.data[0].sales_hub_id;
          console.log(
            salesHubIdNew,
            'salesHubIdNew',
            response.data.sales_hub_id
          );
          if (salesHubIdNew) {
            history.push(
              `/salesHub?partner_id=${partnershipID}&sales_hub_id=${salesHubIdNew}`
            );
            setSalesHubId(salesHubIdNew);
          }
          // salesHub by Id data
          getRequest(
            `partnership/sales-hub/?partnership_id=${partnershipID}&sales_hub_id=${salesHubIdNew}`,
            {
              Authorization: `Token ${token}`,
            }
          ).then((resp: any) => {
            if (resp.result === true) {
              setFontColor(resp.data.font_color.font_color_id.toString());
              setFontFamily(resp.data.font_family.font_family_id.toString());
              setFontColorChosen(resp.data.font_color.name);
              setFontFamilyChosen(resp.data.font_family.name);
              setInitialValues({
                ...initialValues,
                headerText: resp.data.header_text,
                subHeaderText: resp.data.sub_header_text,
                headerImg: resp.data.header_image_name,
                headerImgFile:
                  resp.data.header_image &&
                  `${resp.data.header_image}?time=${Date.now()}`,
                fontColor: resp.data.font_color.font_color_id,
                fontFamily: resp.data.font_family.font_family_id,
              });
              setPreviewImage({
                type: 'SET_API_IMAGE_DETAILS',
                payload: {
                  key: previewImageLables.salesHubImage,
                  name: resp.data.header_image_name,
                  source: resp.data.header_image,
                },
              });

              if (salesHubIdNew) {
                fetchAssetCollectDetailById(salesHubIdNew, partnershipID, 0);
              }
            }
          });
        } else {
          setIsLoading(false);
          setInitialValues({
            headerText: '',
            subHeaderText: '',
            headerImg: '',
            headerImgFile: '',
            fontColor: '',
            fontFamily: '',
          });
        }
        dispatch(
          setSalesHubInfo({
            salesHubInfo: response.data,
          })
        );

        if (response.count) {
          setSalesHubCount(response.count);
        }
      }
      // setIsLoading(false);
    });
  };

  const onFileSelected = (event: any) => {
    const file = event.target.files[0];
    salesHubFileInput.current.value = '';
    if (
      file &&
      file.name &&
      formikForm &&
      formikForm.current &&
      file.type.includes('image/')
    ) {
      const fileName = file.name as string;
      formikForm?.current?.setFieldValue('headerImgFile', file);
      formikForm?.current?.setFieldValue('headerImg', fileName);
      setFileData(previewImageLables.salesHubImage, file);
      setShowPreview(false);
    } else {
      setAlert((prevState: alert) => ({
        ...prevState,
        showAlert: true,
        message: errorMessageLabels.fileErrorMessage,
        severity: 'error',
      }));
    }
  };

  const OnImageCancel = () => {
    formikForm.current?.setFieldValue('headerImgFile', '');
    formikForm.current?.setFieldValue('headerImg', '');

    salesHubFileInput.current.value = '';
    setPreviewImage({
      type: 'SET_IMAGEFILE_CANCEL',
      payload: { key: previewImageLables.salesHubImage },
    });
    setShowPreview(false);
  };

  const handleChangeFont = (key: string, value: string) => {
    if (key === 'FontFamily') {
      setFontFamilyChosen(value);
    } else if (key === 'FontColor') {
      setFontColorChosen(value);
    }
  };

  const handleAssetCollectionButtonClick = () => {
    setShowActiveMenu(true);
  };
  const validationSchema = Yup.object().shape({
    headerText: Yup.string()
      .trim()
      .required('Header text is required')
      .max(100, 'Maximum of  100 characters are allowed'),
    subHeaderText: Yup.string()
      .trim()
      .max(200, 'Maximum of  200 characters are allowed')
      .required('Sub header text is required'),
    headerImg: Yup.string().required('Header image is required'),
    fontColor: Yup.string().required('Font color is required'),
    fontFamily: Yup.string().required('Font family is required'),
  });

  const fetchFontColorList = () => {
    const token = localStorage.getItem('token');

    getRequest(`partnership/sales-hub/font-colors/`, {
      Authorization: `Token ${token}`,
    }).then((response: any) => {
      if (response.result === true) {
        const colorList = response.data.map((li: any) => ({
          key: li.name,
          id: li.font_color_id,
          value: li.name,
        }));
        // setFontColorChosen(colorList[0].value);
        setFontColorList(colorList);
      }
    });
  };

  const fetchFontFamilyList = () => {
    const token = localStorage.getItem('token');

    getRequest(`partnership/sales-hub/font-family/`, {
      Authorization: `Token ${token}`,
    }).then((response: any) => {
      if (response.result === true) {
        const familyList = response.data.map((li: any) => ({
          key: li.name,
          id: li.font_family_id,
          value: li.description,
        }));
        setFontFamilyList(familyList);
      }
    });
  };
  const handlePageChange = (data, value) => {
    setPage(value);
    fetchAssetCollectDetailById(
      salesHubId,
      partnershipId,
      (value - 1) * (limit - 1)
    );
  };
  const cancelHandler = (e) => {
    e.preventDefault();
    salesHubFileInput.current.value = '';
    setPreviewImage({
      type: 'SET_IMAGEFILE_CANCEL',
      payload: { key: previewImageLables.salesHubImage },
    });
    formikForm.current.resetForm();
    setShowPreview(true);
    fetchSalesHubData();
    fetchFontColorList();
    fetchFontFamilyList();
    setShowCloseWarning(false);
  };
  useEffect(() => {
    fetchSalesHubData();
    fetchFontColorList();
    fetchFontFamilyList();

    return () => {
      dispatch(
        setIsSalesHubFormEdited({
          isSalesHubFormEdited: false,
        })
      );
    };
  }, []);

  useEffect(() => {
    dispatch(
      setIsSalesHubFormEdited({ isSalesHubFormEdited: isFromEdited || isDirty })
    );
  }, [isFromEdited, isDirty]);

  useEffect(() => {
    if (salesHub.showSalesHubWarningEditor.show) setShowCloseWarning(true);
  }, [salesHub.showSalesHubWarningEditor]);

  useEffect(() => {
    if (previewImage[previewImageLables.salesHubImage]?.cropped) {
      formikForm?.current?.setFieldError('headerImg', '');
      if (!isFromEdited) {
        setIsFromEdited(true);
        setShowPreview(false);
      }
    } else if (
      previewImage[previewImageLables.salesHubImage]?.name &&
      previewImage[previewImageLables.salesHubImage]?.source &&
      !previewImage[previewImageLables.salesHubImage]?.file
    ) {
      setIsFromEdited(false);
      setShowPreview(true);
    }
  }, [previewImage[previewImageLables.salesHubImage]]);

  return (
    <div className="salesHub_main_div">
      <div className="salesHub_main_card">
        <Formik
          innerRef={formikForm}
          enableReinitialize
          initialValues={initialValues}
          validate={() => ({})}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            setIsLoading(true);
            if (
              previewImage[previewImageLables.salesHubImage].error &&
              !previewImage[previewImageLables.salesHubImage].cropped
            ) {
              formikForm?.current?.setFieldError(
                'headerImg',
                previewImage[previewImageLables.salesHubImage].error
              );
              setIsLoading(false);
              return;
            }

            const queryparams = new URLSearchParams(window.location.search);
            const sales_hub_id: string = queryparams.get('sales_hub_id') || '0';
            const previewImageValue =
              previewImage[previewImageLables.salesHubImage];
            const headerFile = values.headerImgFile
              ? previewImageValue?.cropped
                ? previewImageValue.croppedFile
                : previewImageValue.file
              : values.headerImg;
            dispatch(
              saveSalesHubAction(
                {
                  headerText: values.headerText,
                  subHeaderText: values.subHeaderText,
                  headerImg: headerFile,
                  fontColor: values.fontColor,
                  fontFamily: values.fontFamily,
                  assetCollectionId: selectedAssetCollectionIds,
                },
                partnershipId,
                sales_hub_id === '0' ? salesHubId : sales_hub_id,
                () => setIsLoading(false),
                history,
                (mesage) =>
                  setAlert((prevState: alert) => ({
                    ...prevState,
                    showAlert: true,
                    message: mesage,
                    severity: 'success',
                  })),
                fetchSalesHubData,
                setShowPreview,
                setIsFromEdited
              )
            );
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
            } = formik;
            setIsDirty(dirty);
            return (
              <Form
                onSubmit={handleSubmit}
                ref={salesHubForm}
                id="salesHubForm"
                onKeyDown={(e: any) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                  }
                }}
              >
                <div className={styles.salesHub_floating_wrap}>
                  <div className="salesHub_title_div">
                    {SalesHubLabels.titleLabel}
                    <div>
                      {!showPreview || isDirty ? (
                        <>
                          <SecondaryButton
                            style={{ marginRight: '20px' }}
                            onClick={() => setShowCloseWarning(true)}
                          >
                            {SalesHubLabels.cancel}
                          </SecondaryButton>
                          <PrimaryButton
                            type="submit"
                            style={{ minWidth: '160px' }}
                            id="salesHubSubmit"
                            ref={salesHubSubmitButton}
                          >
                            {SalesHubLabels.saveButton}
                          </PrimaryButton>
                        </>
                      ) : null}

                      {showPreview && !isDirty ? (
                        <PrimaryButton
                          style={{ minWidth: '160px' }}
                          onClick={(e) => {
                            e.preventDefault();
                            window.open(
                              `/salesHubPreview?subdomain=${localStorage.getItem(
                                'subDomainName'
                              )}`,
                              '_blank'
                            );
                          }}
                        >
                          {SalesHubLabels.previewButton}
                        </PrimaryButton>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div
                  className="salesHub_info_title_div"
                  onClickCapture={() => setSalesLayout(!salesLayout)}
                >
                  {SalesHubLabels.salesHubLayout}
                  <IconButton>
                    <img src={DownArrow} alt="" />
                  </IconButton>
                </div>
                {salesLayout ? (
                  <div style={{ color: '#C4C4C4' }}>
                    <div className="salesHub_info_div">
                      <div className="salesHub_each_info_div">
                        <div className="salesHub_field_label">
                          {SalesHubLabels.headerText}
                        </div>
                        <div className="salesHub_textfield_div sales_hub_textArea">
                          <Field
                            type="text"
                            name="headerText"
                            value={values.headerText}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            hasError={errors.headerText && touched.headerText}
                            errorMessage={errors.headerText}
                            component={GenTextField}
                            classes={classes}
                            multiline
                            placeholder={SalesHubLabels.headerText}
                          />
                          <RenderErrorMessage name="headerText" />
                        </div>
                      </div>
                      <div className="salesHub_each_info_div">
                        <div className="salesHub_field_label">
                          {SalesHubLabels.subHeaderText}
                        </div>
                        <div className="salesHub_textfield_div sales_hub_textArea">
                          <Field
                            type="text"
                            name="subHeaderText"
                            value={values.subHeaderText}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            hasError={
                              errors.subHeaderText && touched.subHeaderText
                            }
                            errorMessage={errors.subHeaderText}
                            component={GenTextField}
                            classes={classes}
                            multiline
                            placeholder={SalesHubLabels.subHeaderText}
                          />
                          <RenderErrorMessage name="subHeaderText" />
                        </div>
                      </div>
                    </div>
                    <div className="salesHub_info_div">
                      <div className="salesHub_each_info_div">
                        <div className="salesHub_field_label">
                          {SalesHubLabels.headerImg}
                        </div>
                        <div className="salesHub_textfield_div disabledFile">
                          <Field
                            type="file"
                            name="headerImg"
                            value={values.headerImg}
                            disabled
                            placeholder={SalesHubLabels.headerImgField}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() => {
                                      if (
                                        salesHubFileInput &&
                                        salesHubFileInput.current
                                      ) {
                                        salesHubFileInput.current.click();
                                      }
                                    }}
                                  >
                                    <input
                                      accept="image/*"
                                      ref={salesHubFileInput}
                                      type="file"
                                      style={{ display: 'none' }}
                                      onChange={(e) => onFileSelected(e)}
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
                          <div className={styles.previewImageHelper}>
                            Recommended size 1400 x 700 px
                          </div>
                          <RenderErrorMessage
                            className={styles.ImageErrorMsg}
                            name="headerImg"
                          />
                        </div>
                      </div>
                      <div
                        className={`${styles.marginZero} salesHub_each_info_div`}
                      >
                        <PreviewImage
                          id="headerImg"
                          showCrop
                          show={
                            previewImage[previewImageLables.salesHubImage]
                              ?.name &&
                            previewImage[previewImageLables.salesHubImage]
                              ?.source
                          }
                          CustomStyles={{
                            ContainerStyle: { margin: '0' },
                          }}
                          src={
                            previewImage[previewImageLables.salesHubImage]
                              ?.cropped
                              ? previewImage[previewImageLables.salesHubImage]
                                  ?.croppedSource
                              : previewImage[previewImageLables.salesHubImage]
                                  ?.source
                          }
                          alt=""
                          CloseHandler={OnImageCancel}
                          CropHandler={() => setShowCropImage(true)}
                          UndoHandler={() =>
                            setPreviewImage({
                              type: 'CLEAR_CROPPED_IMAGE',
                              payload: {
                                key: previewImageLables.salesHubImage,
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="salesHub_info_div">
                      <div className="salesHub_each_info_div">
                        <div className="salesHub_field_label">
                          {SalesHubLabels.fontColor}
                        </div>
                        <div className="salesHub_textfield_div sales_hub_select">
                          <Select
                            name="fontColor"
                            value={values.fontColor}
                            className={styles.uploadAssetSelect}
                            displayEmpty
                            fullWidth
                            renderValue={
                              values.fontColor !== ''
                                ? undefined
                                : () => (
                                    <span className={styles.placeholderTxt}>
                                      {' '}
                                      {SalesHubLabels.selectFontColor}
                                    </span>
                                  )
                            }
                            onChange={(e) => {
                              handleChange(e);
                            }}
                            onBlur={handleBlur}
                            inputProps={{ 'aria-label': 'Without label' }}
                          >
                            {fontColorList &&
                              fontColorList.map((list: any) => (
                                <MenuItem value={list.id} key={list.id}>
                                  {list.value}
                                </MenuItem>
                              ))}
                          </Select>
                          <RenderErrorMessage name="fontColor" />
                        </div>
                      </div>
                      <div className="salesHub_each_info_div">
                        <div className="salesHub_field_label">
                          {SalesHubLabels.fontFamily}
                        </div>
                        <div className="salesHub_textfield_div sales_hub_select">
                          <Select
                            name="fontFamily"
                            value={values.fontFamily}
                            className={styles.uploadAssetSelect}
                            displayEmpty
                            fullWidth
                            renderValue={
                              values.fontFamily !== ''
                                ? undefined
                                : () => (
                                    <span className={styles.placeholderTxt}>
                                      {' '}
                                      {SalesHubLabels.selectFontFamily}
                                    </span>
                                  )
                            }
                            onChange={(e) => {
                              handleChange(e);
                            }}
                            onBlur={handleBlur}
                            inputProps={{ 'aria-label': 'Without label' }}
                          >
                            {fontFamilyList &&
                              fontFamilyList.map((list: any) => (
                                <MenuItem value={list.id} key={list.id}>
                                  {list.value}
                                </MenuItem>
                              ))}
                          </Select>
                          <RenderErrorMessage name="fontFamily" />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
                <div
                  className="salesHub_info_title_div"
                  onClickCapture={() => setAssetCollection(!assetCollection)}
                >
                  {SalesHubLabels.assetCollection}
                  <IconButton>
                    <img src={DownArrow} alt="" />
                  </IconButton>
                </div>
                {assetCollection ? (
                  <div>
                    <div className="salesHub_assetCollection_div">
                      <div />
                      <div className="salesHub_assetCollection_button_div">
                        <PrimaryButton
                          style={{ minWidth: '222px' }}
                          onClick={() => handleAssetCollectionButtonClick()}
                        >
                          {SalesHubLabels.manageAssetCollectButtonLabel}
                        </PrimaryButton>
                      </div>
                    </div>
                    {selectedAssetCollections.length > 0 ? (
                      <>
                        <div className="salesHub_assetCollection_card_div">
                          {selectedAssetCollections &&
                            selectedAssetCollections.map(
                              (selectedAssetCollection, index) => {
                                if (index !== salesHublimit - 1) {
                                  return (
                                    <div style={{ width: '30%' }}>
                                      <AssetCollectionCard
                                        img={selectedAssetCollection.image}
                                        title={selectedAssetCollection.name}
                                        content={
                                          selectedAssetCollection.description
                                        }
                                      />
                                    </div>
                                  );
                                }
                                return '';
                              }
                            )}
                        </div>
                        <div className={styles.pagination}>
                          {assetCollectcount > limit - 1 && (
                            <Stack
                              spacing={2}
                              className={styles.paginationWrap}
                            >
                              <Pagination
                                count={Math.ceil(
                                  assetCollectcount / (limit - 1)
                                )}
                                shape="rounded"
                                page={page}
                                onChange={handlePageChange}
                              />
                            </Stack>
                          )}
                        </div>
                      </>
                    ) : (
                      <div style={{ textAlign: 'center' }}>
                        {' '}
                        {SalesHubLabels.noAssetMsg}
                      </div>
                    )}
                  </div>
                ) : null}
              </Form>
            );
          }}
        </Formik>
      </div>
      {showActiveMenu && (
        <SideBar
          title="Sales Hub Asset Collections"
          closeHandler={() => {
            if (isFromEdited) setShowCloseWarning(true);
            else {
              setShowCloseWarning(false);
              setIsFromEdited(false);
              setShowActiveMenu(false);
            }
          }}
          renderElement={
            <ManageAssetCollections
              salesHubId={salesHubId}
              partnershipId={partnershipId}
              selectedAssetCollections={selectedAssetCollections}
              setSelectedAssetCollections={setSelectedAssetCollections}
              setSelectedAssetCollectionIds={setSelectedAssetCollectionIds}
              closeHandler={(selected: any, selectedIds: any) => {
                setShowActiveMenu(false);
                setIsFromEdited(false);
                setShowCloseWarning(false);
                setSelectedAssetCollections(selected);
                setSelectedAssetCollectionIds(selectedIds);
                setAssetCollectCount(selectedIds.length);
                setTimeout(() => formikForm.current.submitForm(), 100);
              }}
              cancelHandler={() => {
                setShowActiveMenu(false);
              }}
              isFromEdited={isFromEdited}
              setIsFromEdited={setIsFromEdited}
            />
          }
        />
      )}
      {showCloseWarning && (
        <DialogBoxComponent
          title=""
          secondaryContent="Are you sure you want to discard changes made on this page?"
          primaryContent="Unsaved changes"
          primaryButton="Discard"
          secondaryButton="Cancel"
          handleDialogBoxClose={() => {
            setShowCloseWarning(false);
            if (salesHub.showSalesHubWarningEditor.show) {
              dispatch(
                setShowSalesHubWarningEditor({
                  show: false,
                  navigateAction: null,
                })
              );
            }
          }}
          handleAgree={(e) => {
            dispatch(
              setShowSalesHubWarningEditor({
                show: false,
                navigateAction: null,
              })
            );
            dispatch(
              setIsSalesHubFormEdited({
                isSalesHubFormEdited: false,
              })
            );
            if (salesHub.showSalesHubWarningEditor.show) {
              setIsFromEdited(false);
              setShowCloseWarning(false);
              salesHub.showSalesHubWarningEditor.navigateAction();
              return;
            }
            if (showActiveMenu) {
              setShowActiveMenu(false);
              setIsFromEdited(false);
              setShowCloseWarning(false);
            } else {
              cancelHandler(e);
            }
          }}
          show
        />
      )}

      {isLoading && <Loader />}
      {alert.showAlert && (
        <SnackbarAlert
          severity={alert.severity}
          handler={() => {
            setAlert((prevState: alert) => ({
              ...prevState,
              showAlert: false,
            }));
          }}
          showalert={alert.showAlert}
          message={alert.message}
        />
      )}
      {showCropImage && (
        <CroppedImage
          previewImage={previewImage[previewImageLables.salesHubImage]}
          previewImageLable={previewImageLables.salesHubImage}
          setLoader={() => setIsLoading(true)}
          clearLoader={() => setIsLoading(false)}
          setPreviewImage={setPreviewImage}
          setShowCropImage={() => setShowCropImage(false)}
        />
      )}
    </div>
  );
};

export default SalesHub;
