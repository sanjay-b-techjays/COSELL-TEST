/* eslint-disable linebreak-style */
/* eslint-disable react/destructuring-assignment */
import { Button } from '@material-ui/core';
import React from 'react';
import './primaryButton.css';

const PrimaryButton = (props: any) => (
  <Button
    href={props.href}
    disabled={props.disabled}
    className={
      !props.disabled
        ? 'cosell-primary-button'
        : 'cosell-primary-button-disabled'
    }
    variant="contained"
    style={props.style}
    type={props.type || 'button'}
    onClick={props.onClick}
  >
    {props.children}
  </Button>
);

export default PrimaryButton;
