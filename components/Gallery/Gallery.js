import { useState, useCallback, useEffect, useRef } from "react";
import { useSwipeable } from "react-swipeable";
import { motion, useAnimation } from "framer-motion";

import classes from "./Gallery.module.css";

export default function Gallery({ images }) {
  const animationSpeed = 0.4;
  const [index, setIndex] = useState(0);
  const indexRef = useRef(index);
  const ref = useRef(null);
  const controls = [];

  images.map(() => {
    controls.push(useAnimation());
  });

  // Handling swipe
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => nextImage(),
    onSwipedRight: () => previousImage(),
    onSwipedDown: () => disableFullscreen(),
  });

  // Handling keyboard
  useEffect(() => {
    indexRef.current = index;
    document.addEventListener("keydown", keyPressHandler, false);
    return () => {
      document.removeEventListener("keydown", keyPressHandler, false);
    };
  }, [index]);

  const keyPressHandler = useCallback((event) => {
    switch (event.keyCode) {
      case 27:
        // Esc
        disableFullscreen();
        break;
      case 39:
        // Right arrow
        nextImage();
        break;
      case 37:
        // Left arrow
        previousImage();
        break;
      default:
        break;
    }
  }, []);

  const nextImage = async () => {
    if (images.length <= 1) {
      return;
    }
    const currentImage = indexRef.current;
    let nextImage = currentImage + 1;
    if (nextImage == images.length) {
      nextImage = 0;
    }
    setIndex(nextImage);
    await controls[nextImage].start({
      x: "100%",
      transition: { duration: 0 },
    });
    controls[currentImage].start({
      x: "-100%",
      transition: { duration: animationSpeed },
    });
    controls[nextImage].start({
      x: 0,
      transition: { duration: animationSpeed },
    });
  };

  const previousImage = async () => {
    if (images.length <= 1) {
      return;
    }
    const currentImage = indexRef.current;
    let previousImage = currentImage - 1;
    if (previousImage < 0) {
      previousImage = images.length - 1;
    }
    setIndex(previousImage);
    await controls[previousImage].start({
      x: "-100%",
      transition: { duration: 0 },
    });
    controls[currentImage].start({
      x: "100%",
      transition: { duration: animationSpeed },
    });
    controls[previousImage].start({
      x: 0,
      transition: { duration: animationSpeed },
    });
  };

  const indicatorClick = async (number) => {
    const currentImage = indexRef.current;
    setIndex(number);
    if (number < currentImage) {
      await controls[number].start({
        x: "-100%",
        transition: { duration: 0 },
      });
      controls[currentImage].start({
        x: "100%",
        transition: { duration: animationSpeed },
      });
    } else {
      await controls[number].start({
        x: "100%",
        transition: { duration: 0 },
      });
      controls[currentImage].start({
        x: "-100%",
        transition: { duration: animationSpeed },
      });
    }
    controls[number].start({
      x: 0,
      transition: { duration: animationSpeed },
    });
  };

  const sliderImages = (
    <>
      {images.map((image, number) => {
        return (
          <motion.img
            initial={number != index ? { x: "100%" } : null}
            animate={controls[number]}
            ref={ref}
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
      <div className={classes.Container} {...swipeHandlers}>
        <div className={classes.Gallery}>
          <div className={classes.Images}>{sliderImages}</div>
          {images.length > 1 ? (
            <button className={classes.Previous} onClick={previousImage} />
          ) : null}
          {images.length > 1 ? (
            <button className={classes.Next} onClick={nextImage} />
          ) : null}
          {images.length > 1 ? (
            <div className={classes.Indicators}>
              {images.map((image, number) => {
                return (
                  <button
                    key={image.sourceUrl}
                    onClick={() => indicatorClick(number)}
                    className={number === index ? classes.Active : null}
                  />
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
