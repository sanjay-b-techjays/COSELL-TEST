/* eslint-disable linebreak-style */
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  root: {
    height: '100vh',
    // width: '100vw',
  },
}));

const Minimal = (props: any) => {
  const { children } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <main>{children}</main>
    </div>
  );
};

Minimal.propTypes = {
  //   children: PropTypes.node,
  // className: PropTypes.string,
};

export default Minimal;
