import { useEffect, useState, Fragment } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion, transform } from "framer-motion";

import { formatDate } from "../../lib/util";
import { fadeIn } from "../../lib/animations";

import Subcategories from "./Subcategories/Subcategories";
import Logo from "../../assets/kogaa-logo.svg";
import Circle from "../../assets/circle.svg";
import Square from "../../assets/square.svg";
import Triangle from "../../assets/triangle.svg";
import Back from "../../assets/back.svg";

import classes from "./Menu.module.css";

const Menu = ({
  currentCategory,
  currentSubcategory,
  subcategories,
  postSubcategories,
  postCategory,
  date,
  error,
}) => {
  const [category, setCategory] = useState(currentCategory);
  const [loading, setLoading] = useState(false);
  const [prevScroll, setPrevScroll] = useState(0);
  const [style, setStyle] = useState({});

  const router = useRouter();
  if (router.events) {
    router.events.on("routeChangeStart", () => setLoading(true));
    router.events.on("routeChangeComplete", () => setLoading(false));
    router.events.on("routeChangeError", () => setLoading(false));
  }

  useEffect(async () => {
    if (currentCategory) {
      setCategory(currentCategory);
    }
  }, [currentCategory]);

  useEffect(async () => {
    if (postCategory) {
      setCategory(postCategory);
    }
  }, [postCategory]);

  // Adding and removing scroll handler
  useEffect(() => {
    window.addEventListener("scroll", onScrollHandler);
    return () => window.removeEventListener("scroll", onScrollHandler);
  });

  // Detecting scroll to bottom of the page
  const onScrollHandler = () => {
    const scrollPosition = window.scrollY;
    console.log(scrollPosition, prevScroll);
    if (scrollPosition > 200) {
      if (scrollPosition < prevScroll) {
        setStyle({
          zIndex: 10,
          transition: "0.1s",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
        });
      } else {
        setStyle({
          zIndex: 10,
          transition: "0.1s",
          position: "fixed",
          top: "-100%",
          left: 0,
          right: 0,
        });
      }
    } else {
      setStyle({ transition: "0.1s" });
    }
    setPrevScroll(scrollPosition);
  };

  let categoryIndex = null;
  switch (category) {
    case "news":
      categoryIndex = "newsCats";
      break;
    case "projects":
      categoryIndex = "projectsCats";
      break;
    default:
      categoryIndex = "aboutCats";
      break;
  }

  const iOS = () => {
    return (
      [
        "iPad Simulator",
        "iPhone Simulator",
        "iPod Simulator",
        "iPad",
        "iPhone",
        "iPod",
      ].includes(navigator.platform) ||
      // iPad on iOS 13 detection
      (navigator.userAgent.includes("Mac") && "ontouchend" in document)
    );
  };

  const setCategoryOnHover = (category) => {
    if (!iOS()) {
      setCategory(category);
    }
  };
  return (
    <div style={style}>
      <motion.div
        className={error ? `${classes.Menu} ${classes.Error}` : classes.Menu}
        layoutId="menu"
        {...fadeIn}
      >
        <div
          onMouseLeave={() =>
            loading ? null : setCategoryOnHover(currentCategory)
          }
        >
          <div className={classes.MainMenu}>
            <Link href="/">
              <a>
                <Logo />
              </a>
            </Link>
            <Link href="/news">
              <a onMouseEnter={() => setCategoryOnHover("news")}>
                <Circle
                  className={category === "news" ? classes.Active : null}
                />
              </a>
            </Link>
            <Link href="/projects">
              <a onMouseEnter={() => setCategoryOnHover("projects")}>
                <Square
                  className={category === "projects" ? classes.Active : null}
                />
              </a>
            </Link>
            <Link href="/about">
              <a onMouseEnter={() => setCategoryOnHover("about")}>
                <Triangle
                  className={category === "about" ? classes.Active : null}
                />
              </a>
            </Link>
          </div>

          {subcategories && category && !postSubcategories ? (
            <Subcategories
              category={category}
              categories={subcategories[categoryIndex].nodes}
              currentSubcategory={currentSubcategory}
              onClick={() => setSelected(true)}
            />
          ) : null}

          <div style={{ background: "white" }}>
            {postSubcategories && !currentCategory ? (
              <motion.div className={classes.PostSubcategories} {...fadeIn}>
                <Back
                  onClick={() => router.back()}
                  style={{ cursor: "pointer" }}
                />
                {error ? (
                  <Link href="/">
                    <a>home</a>
                  </Link>
                ) : (
                  postSubcategories.map((category, index) => {
                    return (
                      <Fragment key={category.name}>
                        <Link href={`/${postCategory}/${category.name}`}>
                          <a>{category.name}</a>
                        </Link>
                        {postSubcategories[index + 1] && "|"}
                      </Fragment>
                    );
                  })
                )}
              </motion.div>
            ) : null}
            {date && !currentCategory ? (
              <motion.div {...fadeIn} className={classes.Date}>
                {formatDate(date)}
              </motion.div>
            ) : null}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Menu;
