/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-multi-spaces */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable linebreak-style */
import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { Button, Link } from '@material-ui/core';
import Slide from '@material-ui/core/Slide';
import CloseIcon from '@material-ui/icons/Close.js';

const SlideTransition = (p: any) => <Slide {...p} direction="left" />;
const isMobile = window.innerWidth < 991;
const SnackbarAlert = (props: any) => (
  <div>
    {props?.color ? (
      <Snackbar
        autoHideDuration={2000}
        style={{ height: '24%', marginLeft: '5%' }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={props.showalert}
        // TransitionComponent={SlideTransition}
        onClose={() => props.handler('', '', false)}
      >
        <Alert
          style={{
            width: '224px',
            justifyContent: 'center',
            fontSize: '16px',
            background: props.color,
            color: '#323C47',
            borderRadius: '10px',
          }}
          icon={false}
        >
          {props.message}
        </Alert>
      </Snackbar>
    ) : props?.btnName ? (
      <Snackbar
        autoHideDuration={null}
        style={{
          width: '100%',
          alignItems: 'unset',
          bottom: 0,
          left: isMobile ? 0 : null,
          right: isMobile ? 0 : null,
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={props.showalert}
        onClose={() => props.handler('', '', false)}
      >
        <Alert
          icon={false}
          action={
            <Button
              style={{
                backgroundColor: 'black',
                color: '#FFFFFF',
                fontFamily: 'Inter',
                fontStyle: 'normal',
                fontWeight: '700',
                fontSize: '12px',
                lineHeight: '20px',
                marginRight: isMobile ? '5px' : '85px',
                width: '82px',
                height: '40px',
              }}
              onClick={() => props.Btnhandler('', '', false)}
            >
              <div style={{ padding: '10px' }}>{props.btnName}</div>
            </Button>
          }
          style={{
            width: '100%',
            transition: 'none',
            justifyContent: 'center',
            backgroundColor: '#FFFFFF',
            fontFamily: 'Inter',
            fontSize: '14px',
            fontWeight: '400px',
            lineHeight: '22px',
            marginLeft: '0px',
            color: '#323C47',
          }}
          severity={props.severity}
        >
          {props.message}
          <span
            style={{
              fontFamily: 'Inter',
              fontSize: '14px',
              fontWeight: '700px !important',
              fontStyle: 'bold',
              lineHeight: '22px',
              color: ' #323C47',
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
            onClickCapture={() => window.open(props.privacyLink, '_blank')}
          >
            <strong>Privacy Policy</strong>
          </span>
        </Alert>
      </Snackbar>
    ) : (
      <Snackbar
        autoHideDuration={3000}
        style={{ height: '24%', marginLeft: '5%' }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={props.showalert}
        TransitionComponent={SlideTransition}
        onClose={() => props.handler('', '', false)}
      >
        <Alert
          action={
            <Button>
              <CloseIcon onClick={() => props.handler('', '', false)} />{' '}
            </Button>
          }
          style={{
            width: '400px',
            justifyContent: 'center',
            fontSize: '18px',
          }}
          severity={props.severity}
        >
          {props.message}
        </Alert>
      </Snackbar>
    )}
  </div>
);

export default SnackbarAlert;
