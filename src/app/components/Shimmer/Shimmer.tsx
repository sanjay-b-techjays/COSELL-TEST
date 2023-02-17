import React from 'react';
import styles from './Shimmer.module.css';

const Shimmer = ({ show, classes = '', shimmerclass = '' }) => {
  return (
    <div
      className={`${classes} ${styles.shimmerContainer}  ${
        show ? styles.FadeOut : ''
      } `}
    >
      <div className={` ${shimmerclass} ${styles.shimmer} `} />
      <div className={styles.shimmerShine} />
    </div>
  );
};

export default Shimmer;
