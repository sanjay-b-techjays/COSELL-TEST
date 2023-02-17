/* eslint-disable react/no-this-in-sfc */
/* eslint-disable camelcase */
/* eslint-disable prefer-template */
/* eslint-disable operator-linebreak */
/* eslint-disable func-names */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable linebreak-style */

import * as React from 'react';
import FileViewer from 'react-file-viewer';
import { uploadAssetsLabels } from 'src/strings';
import wordIcon from '../../../assets/word_mini.svg';
import pptIcon from '../../../assets/ppt_mini.svg';
import pdfIcon from '../../../assets/pdf_mini.svg';
import xlsIcon from '../../../assets/excel_mini.svg';
import videoIcon from '../../../assets/video_mini.svg';
import imageIcon from '../../../assets/img_mini.svg';
import othersIcon from '../../../assets/others_preview.svg';

import styles from './AssetPreview.module.css';
import '../components/AssetForm/AssetForm.css';

const AssetPreview = React.memo((props: any) => {
  const { uploadedFile, fileURL, uploadedFileSize, filePath } = props;
  console.log(props, 'props');
  const extension =
    uploadedFile !== ''
      ? uploadedFile.name.substr(uploadedFile.name.lastIndexOf('.') + 1)
      : fileURL.substr(fileURL.lastIndexOf('.') + 1);

  function getFileSize(fileSize: string) {
    const units = ['bytes', 'KB', 'MB', 'GB'];
    let l = 0;
    let n = parseInt(fileSize, 10) || 0;
    while (n >= 1024 && ++l) {
      n /= 1024;
    }
    return n.toFixed(1) + ' ' + units[l];
  }

  const fileIcon = () => {
    let icon = '';
    switch (extension) {
      case 'docx':
      case 'doc':
        icon = wordIcon;
        break;
      case 'TXT':
      case 'txt':
        icon = othersIcon;
        break;
      case 'pdf':
        icon = pdfIcon;
        break;
      case 'pptx':
      case 'ppt':
        icon = pptIcon;
        break;
      case 'xlsx':
      case 'xls':
      case 'csv':
        icon = xlsIcon;
        break;
      case 'mp4':
      case 'mkv':
      case 'MP4':
      case 'webm':
      case 'MOV':
      case 'mov':
        icon = videoIcon;
        break;
      case 'jpeg':
      case 'webp':
      case 'gif':
      case 'jfif':
      case 'jpg':
      case 'png':
      case 'svg':
        icon = imageIcon;
        break;
      default:
        icon = othersIcon;
    }
    return icon;
  };
  return (
    <div>
      {fileIcon() === pdfIcon ? (
        <div className="pdfAssetPreview">
          <FileViewer
            key={
              `${uploadedFile?.toString()}?t=${new Date().getTime()}` ||
              `${filePath?.toString()}?t=${new Date().getTime()}`
            }
            fileType="pdf"
            filePath={
              (uploadedFile && URL.createObjectURL(uploadedFile)) || filePath
            }
          />
        </div>
      ) : (
        <>
          {fileIcon() === imageIcon ? (
            <div className="imageAssetPreview">
              <FileViewer
                key={
                  `${uploadedFile?.toString()}?t=${new Date().getTime()}` ||
                  `${filePath?.toString()}?t=${new Date().getTime()}`
                }
                fileType="png"
                filePath={
                  (uploadedFile && URL.createObjectURL(uploadedFile)) ||
                  filePath
                }
              />
            </div>
          ) : (
            <>
              {fileIcon() === videoIcon ? (
                <div className="videoAssetPreview">
                  <FileViewer
                    key={
                      `${filePath?.toString()}?t=${new Date().getTime()}` ||
                      `${uploadedFile?.toString()}?t=${new Date().getTime()}`
                    }
                    fileType="mp4"
                    filePath={
                      filePath ||
                      (uploadedFile && URL.createObjectURL(uploadedFile))
                    }
                  />
                </div>
              ) : (
                <div id="paper" className={styles.paperShadow}>
                  {/* <p className="noPreview"> No preview available </p> */}
                  {/* <img
                    src={fileIcon()}
                    className={styles.fileIcon}
                    alt="icon"
                  /> */}
                </div>
              )}
            </>
          )}
        </>
      )}
      <div className={styles.type}>
        <img src={fileIcon()} />
      </div>
      <div className={styles.size}>
        {uploadAssetsLabels.size}
        {': '}
        {uploadedFile
          ? getFileSize(uploadedFile.size.toString())
          : uploadedFileSize}
      </div>
    </div>
  );
});
export default AssetPreview;
