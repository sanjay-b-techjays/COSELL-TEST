/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import { FieldProps } from 'formik';
import { TextField } from '@material-ui/core';
import { TextFieldProps } from '@material-ui/core/TextField/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { FormControlLabelProps } from '@material-ui/core/FormControlLabel/FormControlLabel';
import { CheckboxProps } from '@material-ui/core/Checkbox/Checkbox';

export const RenderTextField: React.FC<FieldProps & TextFieldProps> = ({
  placeholder,
  label,
  error,
  field,
}) => (
  <TextField
    fullWidth
    placeholder={placeholder}
    label={label}
    {...field}
    variant="outlined"
    margin="dense"
    error={error}
  />
);

export const RenderCheckbox: React.FC<
  FieldProps & CheckboxProps & FormControlLabelProps
> = ({ label, checked }) => (
  <FormControlLabel
    control={<Checkbox checked={checked} size="medium" color="primary" />}
    label={label}
  />
);
