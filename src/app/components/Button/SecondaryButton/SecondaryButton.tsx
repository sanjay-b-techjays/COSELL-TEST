/* eslint-disable linebreak-style */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable linebreak-style */
import Button from '@mui/material/Button';
import React from 'react';
import './secondaryButton.css';

const SecondaryButton = (props: any) => (
  <Button
    href={props.href}
    disabled={props.disabled}
    className={
      !props.disabled
        ? 'cosell-secondary-button'
        : 'cosell-secondary-button-disabled'
    }
    variant="outlined"
    style={props.style}
    onClick={props.onClick}
    type={props.type}
  >
    {props.children}
  </Button>
);

export default SecondaryButton;
