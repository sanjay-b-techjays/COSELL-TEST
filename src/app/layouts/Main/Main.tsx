import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';

import { Menubar } from './components';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%',
    display: 'flex',
  },
  content: {
    height: '100%',
  },
  container: {
    width: '80%',
  },
  sibebar: {
    width: '20%',
    background: '#e1e1e1',
    height: '100vh',
    margin: 'auto',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
}));

const Main = (props: any) => {
  const { children } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.sibebar}>
        <Menubar />
      </div>
      <div className={classes.container}>
        <main className={classes.content}>{children}</main>
      </div>
    </div>
  );
};

Main.propTypes = {
  children: PropTypes.node,
};

export default Main;
