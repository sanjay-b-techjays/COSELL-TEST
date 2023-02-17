/* eslint-disable */

import React, { useState, useEffect, useCallback } from 'react';
import styles from './CroppedImage.module.css';
import Cropper from 'react-easy-crop';
import SecondaryButton from 'src/app/components/Button/SecondaryButton/SecondaryButton';
import PrimaryButton from 'src/app/components/Button/PrimaryButton';
import CloseIcon from '@mui/icons-material/Close';
import { Slider } from '@material-ui/core';

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const dataUrl = url.includes('data:image');
    const modifiedSource = `${url}${dataUrl ? '' : `?time=${Date.now()}`}`;
    const image = new Image();

    image.crossOrigin = 'Anonymous';
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));

    image.src = modifiedSource;
  });

function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180;
}

function rotateSize(width, height, rotation) {
  const rotRad = getRadianAngle(rotation);

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

async function getCroppedImg(
  imageSrc,
  fileName,
  pixelCrop,
  rotation = 0,
  flip = { horizontal: false, vertical: false }
) {
  const image: any = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const extension = fileName.split('.').pop();

  if (!ctx) {
    return null;
  }

  const rotRad = getRadianAngle(rotation);

  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );

  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);

  ctx.drawImage(image, 0, 0);

  const data = ctx.getImageData(
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height
  );

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.putImageData(data, 0, 0);

  return canvas.toDataURL(`image/${extension ? extension : 'png'}`);
}

const dataURItoBlob = (dataURI, fileName) => {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  let ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new File([ab], fileName, {
    type: mimeString,
  });
};

const CroppedImage = ({
  previewImage,
  previewImageLable,
  setLoader,
  clearLoader,
  setPreviewImage,
  setShowCropImage,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [objectFit, setObjectFit] = useState<any>(null);
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      setLoader();
      const croppedImg = await getCroppedImg(
        previewImage?.cropped
          ? previewImage?.croppedSource
          : previewImage?.source,
        previewImage?.name,
        croppedAreaPixels,
        rotation
      );
      clearLoader();
      setCroppedImage(croppedImg);
      setPreviewImage({
        type: 'SET_CROPPED_IMAGE',
        payload: {
          key: previewImageLable,
          croppedSource: croppedImg,
          croppedFile: dataURItoBlob(croppedImg, previewImage?.name),
        },
      });
      setZoom(1);
      setRotation(0);
      setShowCropImage();
    } catch (e) {
      console.error(e);
      clearLoader();
      setZoom(1);
      setRotation(0);
      setShowCropImage();
    }
  }, [croppedAreaPixels, rotation]);

  useEffect(() => {
    const bodyOverflowStyle = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      if (bodyOverflowStyle === 'hidden')
        document.body.style.overflow = 'hidden';
      else document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    if (previewImage) {
      const image = new Image();
      image.src = previewImage?.cropped
        ? previewImage?.croppedSource
        : previewImage?.source;
      console.log(previewImage.name);
      console.log(previewImage, 'fsfsds');
      image.onload = () => {
        console.log('image loaded');
        if (image.height >= image.width) setObjectFit('vertical-cover');
        else if (image.height <= image.width) setObjectFit('horizontal-cover');
        else setObjectFit('contain');
      };
    }
  }, [previewImage]);

  return (
    <>
      {previewImage?.name && previewImage?.source && objectFit && (
        <div className={styles.cropBody}>
          <div className={styles.cropContainer}>
            <div className={styles.headerContainer}>
              <p>Edit Image</p>
              <CloseIcon
                className={styles.closeIcon}
                onClick={() => {
                  setShowCropImage();
                }}
              />
            </div>
            <div className={styles.cropImageMainContainer}>
              <div className={styles.cropImageContainer}>
                <Cropper
                  image={
                    previewImage?.cropped
                      ? previewImage?.croppedSource
                      : previewImage?.source
                  }
                  crop={crop}
                  rotation={rotation}
                  zoom={zoom}
                  objectFit={objectFit}
                  aspect={previewImage.aspectRatio}
                  onCropChange={setCrop}
                  onRotationChange={setRotation}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>
            </div>
            <div className={styles.filterContainer}>
              <p>Zoom</p>
              <Slider
                value={zoom}
                min={1}
                max={3}
                step={0.2}
                aria-labelledby="Zoom"
                onChange={(e, zm) => {
                  if (typeof zm == 'number') setZoom(Number(zm));
                }}
              />
              <p>Rotation</p>
              <Slider
                value={rotation}
                min={0}
                max={360}
                step={1}
                aria-labelledby="Rotation"
                onChange={(e, rt) => {
                  if (typeof rt == 'number') setRotation(Number(rt));
                }}
              />
            </div>
            <div className={styles.filterBtnContainer}>
              <SecondaryButton
                onClick={() => {
                  setShowCropImage();
                }}
              >
                CANCEL
              </SecondaryButton>
              <PrimaryButton onClick={showCroppedImage}>CROP</PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(CroppedImage);
