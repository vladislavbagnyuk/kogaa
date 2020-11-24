import { useState, useCallback, useEffect, useRef } from "react";
import classes from "./Gallery.module.css";

export default function gallery({ images }) {
  const [fullscreen, setFullscreen] = useState(false);
  const [index, setIndex] = useState(0);
  const indexRef = useRef(index);

  const escFunction = useCallback((event) => {
    switch (event.keyCode) {
      case 27:
        setFullscreen(false);
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

  useEffect(() => {
    indexRef.current = index;
    document.addEventListener("keydown", escFunction, false);
    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [index]);

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

  return (
    <div className={classes.Gallery}>
      <div className={classes.Images}>
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
      </div>
      <button className={classes.Previous} onClick={previousImage} />
      <button
        className={classes.FullscreenButton}
        onClick={() => setFullscreen(true)}
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
      {fullscreen ? <div className={classes.Fullscreen}></div> : null}
    </div>
  );
}
