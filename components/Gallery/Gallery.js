import { useState, useCallback, useEffect, useRef } from "react";
import classes from "./Gallery.module.css";

import CSSTransition from "react-transition-group/CSSTransition";

export default function gallery({ images }) {
  const [fullscreen, setFullscreen] = useState(false);
  const [index, setIndex] = useState(0);
  const indexRef = useRef(index);

  useEffect(() => {
    indexRef.current = index;
    document.addEventListener("keydown", escFunction, false);
    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [index]);

  const escFunction = useCallback((event) => {
    switch (event.keyCode) {
      case 27:
        disableFullscreen();
        break;
      case 39:
        nextImage();
        break;
      case 37:
        previousImage();
        break;
      default:
        break;
    }
  }, []);

  const nextImage = () => {
    if (indexRef.current !== images.length - 1) {
      setIndex(indexRef.current + 1);
    }
  };

  const previousImage = () => {
    if (indexRef.current !== 0) {
      setIndex(indexRef.current - 1);
    }
  };

  const enableFullscreen = () => {
    document.documentElement.style.overflow = "hidden"; // firefox, chrome
    document.body.scroll = "no"; // ie only
    setFullscreen(true);
  };

  const disableFullscreen = () => {
    document.documentElement.style.overflow = "auto"; // firefox, chrome
    document.body.scroll = "yes"; // ie only
    setFullscreen(false);
  };

  const sliderImages = (
    <>
      {images.map((image, number) => {
        return (
          <img
            key={image.sourceUrl}
            src={image.sourceUrl}
            alt=""
            className={
              number === index ? classes.ActiveImage : classes.InactiveImage
            }
          />
        );
      })}
    </>
  );

  return (
    <>
      <div className={classes.Container}>
        <div className={classes.Gallery}>
          <div className={classes.Images}>{sliderImages}</div>
          <button className={classes.Previous} onClick={previousImage} />
          <button
            className={classes.FullscreenButton}
            onClick={enableFullscreen}
          />
          <button className={classes.Next} onClick={nextImage} />
          <div className={classes.Indicators}>
            {images.map((image, number) => {
              return (
                <button
                  key={image.sourceUrl}
                  onClick={() => setIndex(number)}
                  className={number === index ? classes.Active : null}
                />
              );
            })}
          </div>
        </div>
      </div>
      <CSSTransition
        mountOnEnter
        unmountOnExit
        in={fullscreen}
        timeout={300}
        classNames={{
          enter: classes.FullscreenClosed,
          enterActive: classes.FullscreenOpen,
          exitActive: classes.FullscreenClosed,
        }}
      >
        <div className={classes.Fullscreen}>
          <div className={classes.Images}>{sliderImages}</div>
          <button className={classes.Previous} onClick={previousImage} />
          <button className={classes.Next} onClick={nextImage} />
        </div>
      </CSSTransition>
    </>
  );
}
