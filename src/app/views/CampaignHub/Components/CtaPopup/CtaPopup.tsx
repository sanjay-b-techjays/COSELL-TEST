/* eslint-disable linebreak-style */
import { Button } from '@material-ui/core';
import { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import Shimmer from 'src/app/components/Shimmer/Shimmer';
import styles from './CtaPopup.module.css';

const CtaPopup = ({ ctaData, show, fontFamily, onPageView }) => {
  const history = useHistory();
  const [ctaFontFamily, setCtaFontFamily] = useState(fontFamily);
  const [isCtaImageLoaded, setIsCtaImageLoaded] = useState(false);
  const [initialMount, setInitialMount] = useState(true);
  const cbImg3 = () => {
    setIsCtaImageLoaded(true);
  };

  const cbImg2 = () => {
    window.requestAnimationFrame(cbImg3);
  };
  const cbImg1 = () => {
    window.requestAnimationFrame(cbImg2);
  };

  useEffect(() => {
    if (initialMount) setInitialMount(false);
  }, [show]);

  return (
    <>
      <div
        className={`${styles.previewCtaContainer} ${show ? styles.fadeIn : ''}`}
      >
        {ctaData && (
          <div style={{ fontFamily }} className={styles.previewCta}>
            <div className={styles.ImgContainer} id="ImgContainer">
              <Shimmer
                show={isCtaImageLoaded}
                classes={styles.shimmerContainer}
                shimmerclass={styles.shimmer}
              />
              <img
                src={`${
                  ctaData?.image
                    ? `${ctaData?.image}?t=${new Date().getTime()}`
                    : ctaData?.image
                }`}
                alt=""
                className={`${styles.previewCtaImg} ${
                  isCtaImageLoaded ? '' : styles.hidden
                }`}
                onLoad={() => cbImg1()}
              />
            </div>
            <div className={styles.previewCtaheader}>
              {ctaData.header_text?.length > 50
                ? `${ctaData.header_text.slice(0, 50)}...`
                : `${ctaData.header_text.slice(0, 50)}`}
            </div>
            <div className={styles.previewCtaSubheader}>
              {ctaData.sub_header_text?.length > 200
                ? `${ctaData.sub_header_text.slice(0, 200)}...`
                : `${ctaData.sub_header_text.slice(0, 200)}`}
            </div>
            <div className={styles.popUpCtaButtonDiv}>
              <Button
                variant="contained"
                style={{
                  background: 'black',
                  color: 'white',
                  padding: '0.5em 1.5em',
                  marginBottom: '1.75rem',
                  textTransform: 'none',
                  fontFamily: ctaFontFamily,
                }}
                disableElevation
                onClick={() => {
                  onPageView(),
                    history.push({
                      pathname: `/${
                        window.location.pathname.split('/')[1]
                      }/cta`,
                      state: window.location.pathname,
                    });
                }}
              >
                {ctaData.name}
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CtaPopup;
