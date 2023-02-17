/* eslint-disable linebreak-style */
/* eslint-disable object-curly-newline */
/* eslint-disable linebreak-style */
import React, { useState } from 'react';
import Close from '@material-ui/icons/Close';
import ReplayIcon from '@mui/icons-material/Replay';
import CropIcon from '@mui/icons-material/Crop';
import Loader from 'react-spinners/ClipLoader';
import styles from './PreviewImage.module.css';

const PreviewImage = ({
  id,
  src,
  alt,
  CloseHandler,
  showCrop,
  CustomStyles,
  show,
  classes = '',
  CropHandler = () => {},
  UndoHandler = () => {},
}) => {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <>
      {show && (
        <div
          className={`${styles.thumbnailImg_container} ${
            isLoading ? styles.hidden : ''
          }`}
          style={CustomStyles?.ContainerStyle}
        >
          <img
            id={id}
            className={`${classes} ${styles.thumbnailImg}`}
            src={src}
            style={CustomStyles?.ImageStyle}
            alt={alt}
            onLoad={() => setIsLoading(false)}
          />
          <div className={styles.options_container}>
            <div className={styles.close_container} onClick={CloseHandler}>
              <Close className={styles.icon_style} />
              <span>cancel</span>
            </div>
            {showCrop && (
              <>
                <div className={styles.close_container} onClick={CropHandler}>
                  <CropIcon className={styles.icon_style} />
                  <span>crop</span>
                </div>
                <div className={styles.close_container} onClick={UndoHandler}>
                  <ReplayIcon className={styles.icon_style} />
                  <span>undo</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {isLoading && show && (
        <div className={styles.loader_container}>
          <Loader size={20} color="#4C70E3" />
        </div>
      )}
    </>
  );
};

export default PreviewImage;
