/* eslint-disable linebreak-style */
/* eslint-disable comma-dangle */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable operator-linebreak */
/* eslint-disable object-curly-newline */
/* eslint-disable linebreak-style */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Chip from '@material-ui/core/Chip';
import {
  TextField,
  TextFieldProps,
  OutlinedInputProps,
  OutlinedTextFieldProps,
} from '@material-ui/core';
import Downshift from 'downshift';
import styles from './TagsInput.module.css';

export default function TagsInput({ ...props }) {
  const {
    selectedTags,
    placeholder,
    tags,
    selectedChip,
    error,
    setFieldValue,
    ...other
  } = props;
  const [inputValue, setInputValue] = React.useState('');
  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      const newSelectedItem = [...selectedChip];
      const duplicatedValues = newSelectedItem.indexOf(
        event.target.value.trim()
      );

      if (duplicatedValues !== -1) {
        setInputValue('');
        return;
      }
      if (!event.target.value.replace(/\s/g, '').length) return;

      newSelectedItem.push(event.target.value.trim());
      setFieldValue(other.id, newSelectedItem);
      setInputValue('');
    }
    if (
      selectedChip.length &&
      !inputValue.length &&
      event.key === 'Backspace'
    ) {
      setFieldValue(other.id, selectedChip.slice(0, selectedChip.length - 1));
    }
  };
  const handleChange = (item: any) => {
    let newSelectedItem = [...selectedChip];
    if (newSelectedItem.indexOf(item) === -1) {
      newSelectedItem = [...newSelectedItem, item];
    }
    setInputValue('');
    setFieldValue(other.id, newSelectedItem);
  };

  const handleDelete = (item: any) => () => {
    const newSelectedItem = [...selectedChip];
    newSelectedItem.splice(newSelectedItem.indexOf(item), 1);
    setFieldValue(other.id, newSelectedItem);
  };

  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
  };

  return (
    <>
      <Downshift
        id="downshift-multiple"
        inputValue={inputValue}
        onChange={handleChange}
        selectedItem={selectedChip}
      >
        {({ getInputProps }) => {
          const { onBlur, onChange, onFocus, ...inputProps } = getInputProps({
            onKeyDown: handleKeyDown,
            placeholder,
          });
          const customInputProps: any = { ...inputProps };
          return (
            <div>
              <TextField
                className={styles.chipWrap}
                style={{ flexWrap: 'wrap', paddingLeft: 0 }}
                data-value={selectedChip}
                variant="outlined"
                InputProps={{
                  startAdornment: selectedChip?.map((item: string) => (
                    <Chip
                      key={item}
                      tabIndex={-1}
                      label={item}
                      className={styles.chip}
                      variant="outlined"
                      onDelete={handleDelete(item)}
                    />
                  )),
                  onChange: (event) => {
                    handleInputChange(event);
                    // onChange(event);
                  },
                  inputProps: customInputProps,
                }}
                {...other}
              />
            </div>
          );
        }}
      </Downshift>
    </>
  );
}
TagsInput.defaultProps = {
  tags: [],
};
TagsInput.propTypes = {
  selectedTags: PropTypes.func.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string),
};
