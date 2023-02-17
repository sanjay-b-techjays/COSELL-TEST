/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */
/* eslint-disable linebreak-style */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import pdf_icon from '../../assets/pdf_icon.svg';
import styles from './AssetCollectionPreview.module.css';
import pdfIcon from '../../assets/pdf_mini.svg';
import pptIcon from '../../assets/ppt_mini.svg';
import imageIcon from '../../assets/img_mini.svg';
import videoIcon from '../../assets/video_mini.svg';
import wordIcon from '../../assets/word_mini.svg';
import excelIcon from '../../assets/excel_mini.svg';
import othersIcon from '../../assets/others_preview.svg';
import {
  selectAssetCollectionResponse,
  setSelectedAssets,
  setSelectedAssetsIds,
} from './AssetCollectionSlice';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  ResponderProvided,
  DraggableProvided,
  DroppableProvided,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';
import reOrderIcon from '../../assets/drag_icon.svg';

import { AssetCollectionAssetInfo } from '../../views/AssetCollection/types';

interface AssetCollectionValues {
  name: string;
  description: string;
  thumbnailImage: string;
  tags: string[];
}
const AssetCollectionPreview = (props: any) => {
  const {
    formValues,
    assetCollectionId,
    selectedAssetCollectativeObj,
    reArrangedAssetIds,
  } = props;

  const dragselectedAssetCollectativeObj = selectedAssetCollectativeObj;
  const dispatch = useDispatch();
  const [thumbnailImage, setThumbnailImage] = useState<string>();
  const [assets, setAssets] = useState([]);
  const assetCollectionStoreData = useSelector(selectAssetCollectionResponse);

  // useEffect(() => {
  //   setAssets(selectedAssetCollectativeObj);
  // }, []);

  // useEffect(() => {
  //   const updatedArrangedId = assets.map((data: any) => data.asset_id);
  //   reArrangedAssetIds(updatedArrangedId);
  // }, [assets]);

  // useEffect(() => {
  //   setAssets(selectedAssetCollectativeObj);
  // }, [selectedAssetCollectativeObj]);

  useEffect(() => {
    if (assetCollectionId) {
      if (formValues) {
        if (formValues.thumbnailImageFile) {
          setThumbnailImage(URL.createObjectURL(formValues.thumbnailImageFile));
        } else {
          setThumbnailImage(formValues.thumbnailImage);
        }
      }
    } else if (
      formValues &&
      formValues.thumbnailImageFile &&
      formValues.thumbnailImageFile !== ''
    ) {
      setThumbnailImage(URL.createObjectURL(formValues.thumbnailImageFile));
    } else {
      setThumbnailImage('');
    }
  }, [formValues]);

  const getDocIcon = (docType: string) => {
    let src = '';
    console.log(docType, 'file_type');
    switch (docType) {
      case 'pdf':
      case 'Pdf':
        src = pdfIcon;
        break;
      case 'ppt':
      case 'pptx':
      case 'Powerpoint':
        src = pptIcon;
        break;
      case 'Video':
      case 'mp4':
      case 'mkv':
      case 'MP4':
      case 'webm':
      case 'MOV':
      case 'mov':
      case 'avi':
        src = videoIcon;
        break;
      case 'PNG':
      case 'png':
      case 'jpg':
      case 'gif':
      case 'Image':
      case 'jpeg':
      case 'webp':
      case 'jfif':
      case 'svg':
        src = imageIcon;
        break;
      case 'Word':
      case 'word':
      case 'docx':
      case 'doc':
        src = wordIcon;
        break;
      case 'Excel':
      case 'xlsx':
      case 'xls':
      case 'csv':
        src = excelIcon;
        break;
      default:
        src = othersIcon;
    }
    return src;
  };

  const reorder = (list, startIndex, endIndex) => {
    let result: AssetCollectionAssetInfo[];
    result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const handleDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    let reorderedAssets: AssetCollectionAssetInfo[] = reorder(
      assetCollectionStoreData.selectedAssets,
      result.source.index,
      result.destination.index
    );

    const reorderedAssetsIds = reorderedAssets.map(
      (data: any) => data.asset_id
    );

    dispatch(
      setSelectedAssets({
        selectedAssets: reorderedAssets,
      })
    );
    dispatch(
      setSelectedAssetsIds({
        selectedAssetsIds: reorderedAssetsIds,
      })
    );
  };

  return (
    <div className={styles.previewContainer}>
      <div className={styles.imageAndContentContainer}>
        <div className={styles.imageContainer}>
          {thumbnailImage && (
            <img src={thumbnailImage} className={styles.image} alt="" />
          )}
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.title}>
            {formValues ? formValues.name : ''}
          </div>
          <div className={styles.description}>
            {formValues ? formValues.description : ''}
          </div>
        </div>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable" direction="vertical">
          {(droppableProvided: DroppableProvided) => (
            <div
              ref={droppableProvided.innerRef}
              {...droppableProvided.droppableProps}
            >
              {assetCollectionStoreData.selectedAssets.length > 0
                ? assetCollectionStoreData.selectedAssets.map(
                    (asset: AssetCollectionAssetInfo, index: number) => (
                      <Draggable
                        key={asset.asset_id}
                        draggableId={asset.asset_id.toString()}
                        index={index}
                      >
                        {(
                          draggableProvided: DraggableProvided,
                          snapshot: DraggableStateSnapshot
                        ) => (
                          <div
                            ref={draggableProvided.innerRef}
                            {...draggableProvided.draggableProps}
                            style={{
                              ...draggableProvided.draggableProps.style,
                              // background: snapshot.isDragging
                              //   ? 'rgba(245,245,245, 0.75)'
                              //   : 'none',
                            }}
                            id={asset.asset_id}
                            className={styles.imageAndAssetsMainContainer}
                          >
                            <div
                              className={styles.imageAndAssetsContentContainer}
                            >
                              <div {...draggableProvided.dragHandleProps}>
                                {/* <ReorderIcon /> */}
                                <img src={reOrderIcon} alt="" />
                              </div>
                              <img
                                className={styles.pfdImage}
                                src={getDocIcon(asset.file.split('.').pop())}
                                alt="img"
                              />
                              <div className={styles.pdfTitle}>
                                {asset.asset_name}
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    )
                  )
                : null}
              {droppableProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default AssetCollectionPreview;
