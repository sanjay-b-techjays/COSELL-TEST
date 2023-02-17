/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable linebreak-style */
import LoadingOverlay from 'react-loading-overlay';
import { BounceLoader } from 'react-spinners';
import styles from './Loader.module.css';

const Loader = () => (
  <LoadingOverlay
    active
    spinner={
      <div className={styles.loaderWrap}>
        <BounceLoader size="75px" color="#4C70E3" />
      </div>
    }
  >
    <div className={styles.background} />
  </LoadingOverlay>
);
export default Loader;
