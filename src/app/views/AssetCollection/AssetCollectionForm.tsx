/* eslint-disable linebreak-style */
/* eslint-disable function-paren-newline */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable operator-linebreak */
/* eslint-disable object-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable comma-dangle */
/* eslint-disable linebreak-style */
import React, { useEffect, useRef, useState } from 'react';
import { Formik, Form, Field, FormikProps } from 'formik';
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { useDispatch, useSelector } from 'react-redux';
import Loader from 'src/app/components/Loader';
import SnackbarAlert from 'src/app/components/Snackbar/Snackbar';
import PrimaryButton from 'src/app/components/Button/PrimaryButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import SecondaryButton from 'src/app/components/Button/SecondaryButton';
import SearchIcon from '@material-ui/icons/Search';
import { InputAdornment, MenuItem } from '@material-ui/core';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { getRequest } from 'src/app/service';
import TagsInput from 'src/app/components/TagsInput';
import AssetTable from './Components/AssetTable';
import uploadIcon from '../../assets/upload-logo.svg';
import searchIcon from '../../assets/search.png';
import DownArrow from '../../components/Icons/PreviewPartnership/DownArrow.svg';
import {
  AssetCollectionLabels,
  ButtonLabels,
  uploadAssetsLabels,
  errorMessageLabels,
  previewImageLables,
} from '../../../strings';
import styles from './AssetCollection.module.css';
import './AssetCollection.css';
import { RenderErrorMessage, GenTextField } from '../SalesHubSite/Form';
import {
  saveAssetCollectionAction,
  selectAssetCollectionResponse,
  setAssetInfo,
  setSelectedAssets,
  setSelectedAssetsIds,
  setThumbnailUploadedTime,
} from './AssetCollectionSlice';
import DialogBoxComponent from '../../components/DialogBox/DialogBox';
import { useStyles } from '../SalesHubSite/Styles';
import PreviewImage from 'src/app/components/PreviewImage/PreviewImage';
import useThumbnailImage from 'src/app/components/PreviewImage/CustomHook/useThumbnailImage';
import CroppedImage from 'src/app/components/CroppedImage/CroppedImage';

interface AssetCollectionValues {
  name: string;
  description: string;
  thumbnailImage: string | File;
  thumbnailImageFile?: File;
  tags: string[];
}

interface assetValues {
  name: string;
  tags: string[];
  docType: string;
  id: number;
  file: string;
  accessDocType: string;
}

interface alert {
  showAlert: boolean;
  severity: string;
  message: string;
}

export const AssetCollectionInitialValue: AssetCollectionValues = {
  name: '',
  description: '',
  thumbnailImage: '',
  tags: [],
};

const AssetCollectionForm = (props: any) => {
  const classes = useStyles();
  const {
    assetCollectionId,
    cancelHandler,
    // fetchAssetCollectionData,
    selectedAssetCollectId,
    setSelectedAssetCollectId,
    initialSelectedAssetCollectId,
    setInitialSelectedAssetCollectId,
    selectedAssetCollectativeObj,
    setSelectedAssetCollectativeObj,
    refreshAssetCollectionInformation,
    selectedAssetIdsFromPreview,
    sendFormValues,
    showAlert,
    showCloseWarning,
    setShowCloseWarning,
    isFormEdited,
    setIsFormEdited,
    setIsDirty,
  } = props;

  const accessTypeList = [
    { key: 'Internal', id: 1, value: 'Internal' },
    { key: 'External', id: 2, value: 'External' },
  ];

  const dispatch = useDispatch();
  const fileInput = useRef<HTMLInputElement>(null);
  const formikForm = useRef<FormikProps<AssetCollectionValues>>(null);
  const [initialValues, setInitialValues] = useState<AssetCollectionValues>();
  const [showAssetsTable, setShowAssetsTable] = useState(false);
  const [formValues, setFormValues] = useState<AssetCollectionValues>();
  const [assetData, setAssetData] = useState([]);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(0);
  const [accessTypeMenu, setaccessTypeMenu] = useState(false);
  const [accessDocTypeMenu, setaccessDocTypeMenu] = useState(false);
  const [assetName, setAssetName] = useState('');
  const [accessType, setAccessType] = useState('');
  const [accessDocType, setAccessDocType] = useState('');
  const [showGeneral, setShowGeneral] = useState(true);
  const [showAssets, setShowAssets] = useState(true);
  const [partnershipId, setPartnershipId] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  // const [assetSelected, setAssetSelected] = useState(false);
  // const [selectedFile, setSelectedFile] = React.useState('');
  // const [selectedAssetIds, setSelectedAssetIds] = useState(['']);
  const [mappedAssetCollectionAssets, setMappedAssetCollectionAssets] =
    useState([]);
  const [alert, setAlert] = useState({
    showAlert: false,
    severity: '',
    message: '',
  });
  const [accessDocTypeList, setDocTypeList] = useState([]);
  const assetCollectionStoreData = useSelector(selectAssetCollectionResponse);
  const refAccessDocTypeMenu: any = React.useRef();
  const refAccessTypeMenu: any = React.useRef();
  const [previewImage, setPreviewImage, setFileData] = useThumbnailImage([
    { key: previewImageLables.AssetCollectionImage, aspectRatio: 3 / 2 },
  ]);
  const [showCropImage, setShowCropImage] = useState(false);
  const fetchFileTypeList = () => {
    const token = localStorage.getItem('token');

    getRequest(`partnership/asset/get-file-type-list/`, {
      Authorization: `Token ${token}`,
    }).then((response: any) => {
      if (response.result === true) {
        const typeList = response.data.map((li: any) => ({
          key: li.name,
          id: li.file_type_id,
          value: li.name,
        }));
        setDocTypeList(typeList);
      }
    });
  };

  useEffect(() => {
    const equals =
      JSON.stringify(
        [...initialSelectedAssetCollectId].sort((a, b) => a - b)
      ) ===
      JSON.stringify(
        [...assetCollectionStoreData?.selectedAssetsIds]?.sort((a, b) => a - b)
      );
    const orderEquals =
      JSON.stringify([...initialSelectedAssetCollectId]) ===
      JSON.stringify([...assetCollectionStoreData?.selectedAssetsIds]);

    if (!equals || !orderEquals) setIsFormEdited(true);
    else if (isFormEdited && !initialValues.thumbnailImageFile) {
      setIsFormEdited(false);
    }
  }, [assetCollectionStoreData]);

  useEffect(() => {
    // if (isCreateMode()) {
    //   const allValues = {
    //     ...formValues,
    //     thumbnailImage: selectedFile,
    //   };
    //   props.sendFormValues(allValues);
    // } else {
    sendFormValues(formValues);
    // }
  }, [formValues]);

  useEffect(() => {
    if (previewImage[previewImageLables.AssetCollectionImage]?.cropped) {
      formikForm.current?.setFieldValue(
        'thumbnailImageFile',
        previewImage[previewImageLables.AssetCollectionImage]?.croppedFile
      );
    } else if (previewImage[previewImageLables.AssetCollectionImage]) {
      formikForm.current?.setFieldValue(
        'thumbnailImageFile',
        previewImage[previewImageLables.AssetCollectionImage]?.file
      );
    }
  }, [previewImage[previewImageLables.AssetCollectionImage]?.cropped]);

  const handleGetAssetData = (e: any, data: any) => {
    setPage(data);
    setOffset((data - 1) * limit);
  };

  const isCreateMode = () =>
    assetCollectionId === undefined ||
    assetCollectionId === null ||
    assetCollectionId === '';

  const fetchAssetData = () => {
    const token = localStorage.getItem('token');
    const queryparams = new URLSearchParams(window.location.search);
    const partnershipID: string = queryparams.get('partner_id') || '0';
    setLoading(true);
    getRequest(
      `partnership/asset/?partnership_id=${partnershipID}&offset=${offset}&limit=${limit}`,
      {
        Authorization: `Token ${token}`,
      }
    ).then((response: any) => {
      if (response.result === true) {
        // dispatch(
        //   setAssetInfo({
        //     assetInfo: response.data,
        //   })
        // );
        setAssetData(response.data);
        if (response.count) {
          setCount(response.count);
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  };

  const getAssetCollectionInfo = (assetCollectionaId: any) => {
    const token = localStorage.getItem('token');
    getRequest(
      `partnership/solution-narrative/?solution_narrative_id=${assetCollectionaId}`,
      {
        Accept: 'application/json',
        Authorization: `Token ${token}`,
      }
    ).then((response: any) => {
      if (response.result === true) {
        setInitialValues({
          name: response.data.name,
          description: response.data.description,
          thumbnailImage:
            response.data.image &&
            `${response.data.image}?time=${new Date().getTime()}`,
          tags: response.data.tags,
        });
        setPreviewImage({
          type: 'SET_API_IMAGE_DETAILS',
          payload: {
            key: previewImageLables.AssetCollectionImage,
            name: response.data.image_name,
            source: response.data.image,
          },
        });
      }
    });
  };

  const getAssetCollectionAssetInfo = (
    partnershipID,
    assetCollectionId,
    isInit
  ) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (isInit) {
      getRequest(
        `partnership/solution-narrative/get-assets/?partnership_id=${partnershipID}&solution_narrative_id=${assetCollectionId}&is_selected=true`,
        {
          Accept: 'application/json',
          Authorization: `Token ${token}`,
        }
      ).then((response: any) => {
        if (response.result === true) {
          const selectedAssetCollectObj = response.data.filter(
            (d: any) => d.asset_id
          );

          dispatch(
            setSelectedAssets({
              selectedAssets: selectedAssetCollectObj,
            })
          );

          const idArr = selectedAssetCollectObj.map((d: any) => d.asset_id);
          setInitialSelectedAssetCollectId(idArr);
          dispatch(
            setSelectedAssetsIds({
              selectedAssetsIds: idArr,
            })
          );
        }
      });
      setLoading(false);
    }
    getRequest(
      `partnership/solution-narrative/get-assets/?partnership_id=${partnershipID}&solution_narrative_id=${assetCollectionId}&offset=${offset}&limit=${limit}`,
      {
        Accept: 'application/json',
        Authorization: `Token ${token}`,
      }
    ).then((response: any) => {
      if (response.result === true) {
        setAssetData(response.data);
        if (response.count) {
          setCount(response.count);
        }
        setShowAssetsTable(true);
      }
    });
    setLoading(false);
  };
  useEffect(() => {
    const queryparams = new URLSearchParams(window.location.search);
    const partnershipID: string = queryparams.get('partner_id') || '0';
    setPartnershipId(partnershipID);
    if (isCreateMode()) {
      setInitialValues({
        ...initialValues,
        ...AssetCollectionInitialValue,
      });
    } else {
      getAssetCollectionInfo(assetCollectionId);
      getAssetCollectionAssetInfo(partnershipID, assetCollectionId, 'init');
    }
    fetchFileTypeList();
    fetchAssetData();
  }, []);

  useEffect(() => {
    if (isCreateMode()) {
      fetchAssetData();
    }
  }, [initialValues]);

  console.log(previewImage, 'assetcollectionPreview Image');
  const OnImageCancel = () => {
    formikForm.current?.setFieldValue('thumbnailImageFile', '');
    formikForm.current?.setFieldValue('thumbnailImage', '');

    fileInput.current.value = '';
    setPreviewImage({
      type: 'SET_IMAGEFILE_CANCEL',
      payload: { key: previewImageLables.AssetCollectionImage },
    });
    setIsFormEdited(true);
  };

  const onFileSelected = (event: any) => {
    const file = event.target.files[0];
    if (
      file &&
      file.name &&
      formikForm &&
      formikForm.current &&
      file.type.includes('image/')
    ) {
      const fileName = file.name as string;
      formikForm?.current?.setFieldValue('thumbnailImageFile', file);
      formikForm?.current?.setFieldValue('thumbnailImage', fileName);
      setFileData(previewImageLables.AssetCollectionImage, file);
      setIsFormEdited(true);
      dispatch(
        setThumbnailUploadedTime({
          thumbnailUploadedTime: Date.now(),
        })
      );
    } else {
      setAlert((prevState: alert) => ({
        ...prevState,
        showAlert: true,
        message: errorMessageLabels.fileErrorMessage,
        severity: 'error',
      }));
    }
  };

  const handleFilter = (name: string, value: string) => {
    if (name === 'accDocType') {
      setAccessDocType(value);
    } else if (name === 'accType') {
      setAccessType(value);
    }
  };

  const handleSearch = () => {
    const accessTypeId =
      accessType !== '' && accessType !== 'All'
        ? accessTypeList.filter((li) => li.value === accessType)[0].id
        : '';
    const accessDocTypeId =
      accessDocType !== '' && accessDocType !== 'All'
        ? accessDocTypeList.length > 0 &&
          accessDocTypeList.filter((li) => li.value === accessDocType)[0].id
        : '';
    const nameSearch = assetName !== '' ? `&name=${assetName}` : '';
    const accessTypeSearch =
      accessType !== '' && accessTypeId !== ''
        ? `&access_type_id=${accessTypeId}`
        : '';
    const accessDocTypeSearch =
      accessDocType !== '' && accessDocTypeId !== ''
        ? `&file_type_id=${accessDocTypeId}`
        : '';
    const assetCollectId =
      assetCollectionId === undefined ||
      assetCollectionId === null ||
      assetCollectionId === ''
        ? ''
        : `&solution_narrative_id=${assetCollectionId}`;
    const token = localStorage.getItem('token');
    if (isCreateMode()) {
      getRequest(
        `partnership/asset/?partnership_id=${partnershipId}${nameSearch}${accessTypeSearch}${accessDocTypeSearch}&offset=${offset}&limit=${limit}`,
        {
          Authorization: `Token ${token}`,
        }
      ).then((response: any) => {
        if (response.result === true) {
          setAssetData(response.data);
          if (response.count) {
            setCount(response.count);
          }
        }
      });
    } else {
      getRequest(
        `partnership/solution-narrative/get-assets/?partnership_id=${partnershipId}${assetCollectId}${nameSearch}${accessTypeSearch}${accessDocTypeSearch}&offset=${offset}&limit=${limit}`,
        {
          Authorization: `Token ${token}`,
        }
      ).then((response: any) => {
        if (response.result === true) {
          setAssetData(response.data);
          if (response.count) {
            setCount(response.count);
          }
        }
      });
    }
  };

  const HanldeSolNarCloseDropdown = (event) => {
    if (
      refAccessDocTypeMenu.current &&
      !refAccessDocTypeMenu.current.contains(event.target)
    ) {
      setaccessDocTypeMenu(false);
    }
    if (
      refAccessTypeMenu.current &&
      !refAccessTypeMenu.current.contains(event.target)
    ) {
      setaccessTypeMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', HanldeSolNarCloseDropdown);

    return () =>
      document.removeEventListener('mousedown', HanldeSolNarCloseDropdown);
  }, []);
  useEffect(() => {
    const queryparams = new URLSearchParams(window.location.search);
    const partnershipID: string = queryparams.get('partner_id') || '0';
    if (
      (accessType === '' || accessType === 'All') &&
      (accessDocType === '' || accessDocType === 'All') &&
      assetName === ''
    ) {
      if (assetCollectionId) {
        getAssetCollectionAssetInfo(partnershipID, assetCollectionId, '');
      } else {
        fetchAssetData();
      }
    } else {
      handleSearch();
    }
  }, [offset]);

  const handleAddAssetButtonClick = () => {
    setShowAssetsTable(true);
  };
  const assetCollectativeSchema = Yup.object().shape({
    name: Yup.string().trim().required('Name is required'),
    // description: Yup.string().trim().required('Description is required'),
    thumbnailImage: Yup.string().required('Thumbnail image is required'),
  });
  return (
    <div>
      {initialValues && (
        <Formik
          innerRef={formikForm}
          enableReinitialize
          initialValues={initialValues}
          validate={() => ({})}
          validationSchema={assetCollectativeSchema}
          onSubmit={(values, { setFieldError }) => {
            setLoading(true);
            if (
              previewImage[previewImageLables.AssetCollectionImage].error &&
              !previewImage[previewImageLables.AssetCollectionImage].cropped
            ) {
              formikForm?.current?.setFieldError(
                'thumbnailImage',
                previewImage[previewImageLables.AssetCollectionImage].error
              );
              setLoading(false);
              return;
            }
            const assetCollectionImageFile = previewImage[
              previewImageLables.AssetCollectionImage
            ]?.cropped
              ? previewImage[previewImageLables.AssetCollectionImage]
                  ?.croppedFile
              : previewImage[previewImageLables.AssetCollectionImage]?.file;
            setOffset(0);
            setPage(1);
            dispatch(
              saveAssetCollectionAction(
                {
                  name: values.name,
                  description: values.description,
                  thumbnailImage: assetCollectionImageFile
                    ? assetCollectionImageFile
                    : values.thumbnailImage,
                  tags: values.tags,
                  assetIds: assetCollectionStoreData.selectedAssetsIds,
                },
                assetCollectionId,
                partnershipId,
                () => setLoading(false),
                showAlert,
                cancelHandler,
                () => refreshAssetCollectionInformation()
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
              handleBlur,
              setFieldValue,
              dirty,
            } = formik;
            setFormValues(values);
            setIsDirty(dirty);
            return (
              <Form
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onSubmit={(e) => {
                  e.preventDefault();
                  setShowGeneral(true);
                  setShowAssets(true);
                  handleSubmit(e);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                  }
                }}
              >
                <div className={styles.assetCollectionInfoForm}>
                  <div
                    role="button"
                    className={styles.generalInfoDiv}
                    onClickCapture={() => setShowGeneral(!showGeneral)}
                  >
                    <div className={styles.generalInfoContentDiv}>
                      {AssetCollectionLabels.general}
                      <IconButton>
                        <img src={DownArrow} alt="" />
                      </IconButton>
                    </div>
                  </div>
                  {showGeneral ? (
                    <div className={styles.assetCollectionInfoFormContainer}>
                      <div
                        className={
                          styles.assetCollectionInfoFormContentContainer
                        }
                      >
                        <div className={styles.assetCollectionFormField}>
                          <div
                            className={`${styles.semiDiv} ${styles.labelField}`}
                          >
                            {AssetCollectionLabels.name}
                          </div>
                          <div
                            className={`${styles.semiDiv} ${styles.txtField}`}
                          >
                            <Field
                              type="text"
                              name="name"
                              style={{ width: '100%' }}
                              value={values.name}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder={AssetCollectionLabels.name}
                              hasError={errors.name && touched.name}
                              errorMessage={errors.name}
                              component={GenTextField}
                              classes={classes}
                            />
                            <RenderErrorMessage name="name" />
                          </div>
                        </div>
                      </div>
                      <div
                        className={
                          styles.assetCollectionInfoFormContentContainer
                        }
                      >
                        <div className={styles.assetCollectionFormField}>
                          <div
                            className={`${styles.semiDiv} ${styles.labelField}`}
                          >
                            {AssetCollectionLabels.description}
                          </div>
                          <div
                            className={`${styles.semiDiv} ${styles.txtField}  ${styles.textArea}`}
                          >
                            <Field
                              type="text"
                              name="description"
                              style={{ width: '100%' }}
                              value={values.description}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder={AssetCollectionLabels.description}
                              hasError={
                                errors.description && touched.description
                              }
                              errorMessage={errors.description}
                              component={GenTextField}
                              classes={classes}
                              multiline
                            />
                            <RenderErrorMessage name="description" />
                          </div>
                        </div>
                      </div>
                      <div
                        className={
                          styles.assetCollectionInfoFormContentContainer
                        }
                      >
                        <div className={styles.assetCollectionFormField}>
                          <div
                            className={`${styles.semiDiv} ${styles.labelField}`}
                          >
                            {AssetCollectionLabels.thumbnailImage}
                          </div>
                          <div className={`${styles.semiDiv} disabledFile`}>
                            <Field
                              type="file"
                              name="thumbnailImage"
                              value={values.thumbnailImage}
                              // onChange={handleChange}
                              // onBlur={handleBlur}
                              disabled
                              placeholder={AssetCollectionLabels.thumbnailImage}
                              // hasError={
                              //   errors.thumbnailImage && touched.thumbnailImage
                              // }
                              // errorMessage={errors.thumbnailImage}
                              component={GenTextField}
                              classes={classes}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment
                                    position="end"
                                    style={{ width: 'auto' }}
                                  >
                                    <IconButton
                                      onClick={(e: any) => {
                                        if (fileInput && fileInput.current) {
                                          fileInput.current.click();
                                        }
                                      }}
                                    >
                                      <input
                                        accept="*"
                                        ref={fileInput}
                                        type="file"
                                        style={{ display: 'none' }}
                                        onChange={(e) => onFileSelected(e)}
                                      />
                                      <img src={uploadIcon} alt="" />
                                    </IconButton>
                                  </InputAdornment>
                                ),
                                accept: '*',
                                readOnly: true,
                              }}
                            />
                            <div className={styles.previewImageHelper}>
                              Recommended size 400 x 250 px
                            </div>
                            <RenderErrorMessage name="thumbnailImage" />
                          </div>
                        </div>
                      </div>
                      {previewImage[previewImageLables.AssetCollectionImage]
                        ?.name &&
                        previewImage[previewImageLables.AssetCollectionImage]
                          ?.source && (
                          <div
                            className={
                              styles.assetCollectionInfoFormContentContainer
                            }
                          >
                            <div className={styles.assetCollectionFormField}>
                              <div className={styles.semiDiv} />
                              <div className={styles.semiDiv}>
                                <PreviewImage
                                  id="AssetCollectionImg"
                                  showCrop
                                  show={
                                    previewImage[
                                      previewImageLables.AssetCollectionImage
                                    ]?.name &&
                                    previewImage[
                                      previewImageLables.AssetCollectionImage
                                    ]?.source
                                  }
                                  CustomStyles={{}}
                                  src={
                                    previewImage[
                                      previewImageLables.AssetCollectionImage
                                    ]?.cropped
                                      ? previewImage[
                                          previewImageLables
                                            .AssetCollectionImage
                                        ]?.croppedSource
                                      : previewImage[
                                          previewImageLables
                                            .AssetCollectionImage
                                        ]?.source
                                  }
                                  alt=""
                                  CloseHandler={OnImageCancel}
                                  CropHandler={() => setShowCropImage(true)}
                                  UndoHandler={() =>
                                    setPreviewImage({
                                      type: 'CLEAR_CROPPED_IMAGE',
                                      payload: {
                                        key: previewImageLables.AssetCollectionImage,
                                      },
                                    })
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      <div
                        className={
                          styles.assetCollectionInfoFormContentContainer
                        }
                      >
                        <div className={styles.assetCollectionFormField}>
                          <div
                            className={`${styles.semiDiv} ${styles.tagField}`}
                          >
                            {AssetCollectionLabels.tags}
                          </div>
                          <div className={styles.semiDiv}>
                            <TagsInput
                              selectedTags={(tags: string) => console.log(tags)}
                              fullWidth
                              selectedChip={values.tags}
                              className={`${styles.tagInput} tagsField`}
                              variant="outlined"
                              id="tags"
                              name="tags"
                              placeholder="Add tags"
                              hasError
                              errorMessage={errors.tags && touched.tags}
                              setFieldValue={setFieldValue}
                            />
                            <RenderErrorMessage name="tags" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                  <div
                    className={styles.generalInfoDiv}
                    onClickCapture={() => setShowAssets(!showAssets)}
                  >
                    <div className={styles.generalInfoContentDiv}>
                      {AssetCollectionLabels.assets}
                      <IconButton>
                        <img src={DownArrow} alt="" />
                      </IconButton>
                    </div>
                  </div>
                  {showAssets ? (
                    <div className={styles.manageAssetsContainer}>
                      <div className={styles.manageAssetsContentContainer}>
                        <div className={styles.manageAssetsTitle}>
                          {AssetCollectionLabels.addAssets}
                        </div>
                        {!showAssetsTable && (
                          <div className={styles.manageAssetsTitleBtn}>
                            <PrimaryButton
                              onClick={() => handleAddAssetButtonClick()}
                              style={{ minWidth: '160px' }}
                            >
                              {/* {assetSelected
                                ? ButtonLabels.add
                                :  */}
                              {ButtonLabels.addAsset}
                              {/* } */}
                            </PrimaryButton>
                          </div>
                        )}
                      </div>
                      {showAssetsTable && (
                        <div style={{ width: '100%' }}>
                          <div className={styles.filterWrap}>
                            <div
                              className={styles.inputWrap}
                              style={{ width: '100%' }}
                            >
                              <form>
                                <input
                                  type="text"
                                  name="name"
                                  onChange={(e: any) =>
                                    setAssetName(e.target.value)
                                  }
                                  placeholder="Search Assets"
                                  className={`${styles.searchbar} search`}
                                />
                              </form>
                              <SearchIcon className={styles.searchIcon} />
                            </div>
                            <div className={styles.filtersCover}>
                              <div className={styles.centerDropDown}>
                                <div
                                  className={styles.dropdown}
                                  ref={refAccessTypeMenu}
                                >
                                  <button
                                    type="button"
                                    className={styles.dropdownBtn}
                                    onClick={() =>
                                      setaccessTypeMenu(!accessTypeMenu)
                                    }
                                  >
                                    {' '}
                                    {accessType === '' ? (
                                      <span style={{ fontSize: '12px' }}>
                                        {uploadAssetsLabels.filterByAccessType}
                                      </span>
                                    ) : (
                                      accessType
                                    )}
                                    <KeyboardArrowDownIcon
                                      className={`${styles.arrowIcon}  ${
                                        accessTypeMenu
                                          ? styles.arrowIconActive
                                          : ''
                                      }`}
                                    />
                                  </button>
                                  <div
                                    className={`${styles.menuWrap} ${
                                      accessTypeMenu
                                        ? styles.dropdownMenuActive
                                        : styles.dropdownMenu
                                    }`}
                                  >
                                    {accessTypeMenu && (
                                      <>
                                        <MenuItem
                                          value=""
                                          onClick={() => {
                                            handleFilter('accType', 'All');
                                            setaccessTypeMenu(false);
                                          }}
                                        >
                                          All
                                        </MenuItem>
                                        {accessTypeList.map((list: any) => (
                                          <MenuItem
                                            value={list.value}
                                            key={list.id}
                                            onClick={() => {
                                              handleFilter(
                                                'accType',
                                                list.value
                                              );
                                              setaccessTypeMenu(false);
                                            }}
                                          >
                                            {list.value}
                                          </MenuItem>
                                        ))}
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div>
                                <div
                                  className={styles.dropdown}
                                  ref={refAccessDocTypeMenu}
                                >
                                  <button
                                    type="button"
                                    className={styles.dropdownBtn}
                                    style={{ margin: '0 15px' }}
                                    onClick={() =>
                                      setaccessDocTypeMenu(!accessDocTypeMenu)
                                    }
                                  >
                                    {accessDocType === '' ? (
                                      <span style={{ fontSize: '12px' }}>
                                        {uploadAssetsLabels.filterByDocType}
                                      </span>
                                    ) : (
                                      accessDocType
                                    )}
                                    <KeyboardArrowDownIcon
                                      className={`${styles.arrowIcon}  ${
                                        accessTypeMenu
                                          ? styles.arrowIconActive
                                          : ''
                                      }`}
                                    />
                                  </button>
                                  <div
                                    className={`${styles.menuWrap} ${
                                      accessDocTypeMenu
                                        ? styles.dropdownMenuActive
                                        : styles.dropdownMenu
                                    }`}
                                  >
                                    {accessDocTypeMenu && (
                                      <>
                                        <MenuItem
                                          value=""
                                          onClick={() => {
                                            handleFilter('accDocType', 'All');
                                            setaccessDocTypeMenu(false);
                                          }}
                                        >
                                          All
                                        </MenuItem>

                                        {accessDocTypeList &&
                                          accessDocTypeList.map((list: any) => (
                                            <MenuItem
                                              value={list.value}
                                              key={list.id}
                                              onClick={() => {
                                                handleFilter(
                                                  'accDocType',
                                                  list.value
                                                );
                                                setaccessDocTypeMenu(false);
                                              }}
                                            >
                                              {list.value}
                                            </MenuItem>
                                          ))}
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div>
                                <Button
                                  className={styles.searchSide}
                                  onClick={() => {
                                    setOffset(0);
                                    setPage(1);
                                    handleSearch();
                                  }}
                                >
                                  <img src={searchIcon} alt="" />
                                </Button>
                              </div>
                            </div>

                            <div className={styles.assetTableWrap}>
                              <AssetTable
                                // selectedAssetCollectId={selectedAssetCollectId}
                                // setSelectedAssetCollectId={
                                //   setSelectedAssetCollectId
                                // }
                                // selectedAssetCollectativeObj={
                                //   selectedAssetCollectativeObj
                                // }
                                // setSelectedAssetCollectativeObj={
                                //   setSelectedAssetCollectativeObj
                                // }
                                assetData={assetData}
                                setAssetData={setAssetData}
                              />

                              {count > limit && (
                                <Stack
                                  spacing={2}
                                  className={styles.paginationWrap}
                                >
                                  <Pagination
                                    count={Math.ceil(count / limit)}
                                    shape="rounded"
                                    page={page}
                                    onChange={(e, data) =>
                                      handleGetAssetData(e, data)
                                    }
                                  />
                                </Stack>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : null}
                  {!showAssetsTable && (
                    <div className={styles.noAssetsMessage}>
                      {' '}
                      {AssetCollectionLabels.noAssetsMessage}
                    </div>
                  )}
                  <div className={styles.saveButtonContainer}>
                    <SecondaryButton
                      style={{ marginRight: '30px', minWidth: '160px' }}
                      onClick={() => {
                        dirty || isFormEdited
                          ? setShowCloseWarning(true)
                          : cancelHandler();
                      }}
                    >
                      {ButtonLabels.cancel}
                    </SecondaryButton>
                    <PrimaryButton type="submit" style={{ minWidth: '160px' }}>
                      {ButtonLabels.save}
                    </PrimaryButton>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      )}
      {showCloseWarning && (
        <DialogBoxComponent
          title=""
          secondaryContent="Are you sure you want to discard changes made on this page?"
          primaryContent="Unsaved changes"
          primaryButton="Discard"
          secondaryButton="Cancel"
          handleDialogBoxClose={() => setShowCloseWarning(false)}
          handleAgree={() => cancelHandler()}
          show
        />
      )}
      {loading === true && <Loader />}
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
          previewImage={previewImage[previewImageLables.AssetCollectionImage]}
          previewImageLable={previewImageLables.AssetCollectionImage}
          setLoader={() => setLoading(true)}
          clearLoader={() => setLoading(false)}
          setPreviewImage={setPreviewImage}
          setShowCropImage={() => setShowCropImage(false)}
        />
      )}
    </div>
  );
};

export default AssetCollectionForm;
