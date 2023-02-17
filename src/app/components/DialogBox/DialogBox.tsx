/* eslint-disable indent */
/* eslint-disable no-nested-ternary */
/* eslint-disable linebreak-style */

import Dialog from '@mui/material/Dialog';
import { Field } from 'formik';
import PrimaryButton from '../Button/PrimaryButton';
import SecondaryButton from '../Button/SecondaryButton';
import { GenTextField } from '../Form';
import './DialogBox.css';

import { useStyles } from 'src/app/views/SalesHubSite/Styles';

export default function DialogBoxComponent(props: any) {
  const classes = useStyles();
  const {
    title,
    primaryContent,
    secondaryContent,
    secondaryButton = null,
    tertiaryContent = '',
    fieldValue,
    primaryButton,
    handleDialogBoxClose,
    handleAgree,
    fullScreen,
    btnAlign,
    show,
  } = props;

  return (
    <div>
      <Dialog
        open={show}
        maxWidth="md"
        fullWidth={fullScreen || false}
        onClose={handleDialogBoxClose}
        className={fullScreen ? classes.paperScrollPaper : ''}
      >
        {title !== '' && (
          <div className="dialogbox_title_container">
            <div className="dialogbox_title">{title}</div>
          </div>
        )}
        <div className="dialogbox_content_container">
          <div className="dialogbox_content_div">
            <div className="dialogbox_primary_content">{primaryContent}</div>
          </div>
          <div className="dialogbox_content_div">
            <div className="dialogbox_secondary_content">
              {secondaryContent}
            </div>
          </div>
          {tertiaryContent !== '' && (
            <div className="dialogbox_content_div">
              <div className="dialogbox_tertiary_content">
                {tertiaryContent}
                <Field
                  type="password"
                  value={fieldValue}
                  // onChange={handleChange}
                  component={GenTextField}
                />
              </div>
            </div>
          )}
        </div>
        {secondaryButton && (
          <div
            className={`${
              fullScreen
                ? 'dialogbox_button_container_left_sales_force'
                : btnAlign
                ? 'dialogbox_button_container_left'
                : 'dialogbox_button_container'
            }`}
          >
            <SecondaryButton
              style={{ marginRight: '20px' }}
              onClick={handleDialogBoxClose}
            >
              {secondaryButton}
            </SecondaryButton>
            <PrimaryButton onClick={handleAgree} autoFocus>
              {primaryButton}
            </PrimaryButton>
          </div>
        )}
      </Dialog>
    </div>
  );
}
