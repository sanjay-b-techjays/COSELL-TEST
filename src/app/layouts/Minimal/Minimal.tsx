/* eslint-disable linebreak-style */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable linebreak-style */
/* eslint-disable react/require-default-props */
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';

import Loader from 'src/app/components/Loader';
import { Banner } from './components';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%',
    display: 'flex',
  },
  content: {
    height: '100%',
  },
  container: {
    width: '50%',
  },
}));

const Minimal = (props: any) => {
  const { children } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Banner />
      </div>
      <div className={classes.container}>
        <main className={classes.content}>{children}</main>
      </div>
    </div>
  );
};

Minimal.propTypes = {
  children: PropTypes.node,
  // className: PropTypes.string,
};

export default Minimal;
