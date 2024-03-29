import Link from "next/link";
import { useState, useRef, useEffect, Fragment, forwardRef } from "react";

import { formatDate, getCategories } from "../../lib/util";

import classes from "./Card.module.css";
import globalClasses from "../../styles/Global.module.css";

const Card = forwardRef(({ post }, ref) => {
  const [loaded, setLoaded] = useState(false);
  const image = useRef();

  const categories = getCategories(post);

  const cardClasses = [classes.Card];
  if (post.contentType.node.name === "about") {
    cardClasses.push(classes.Triangle);
  }
  if (post.contentType.node.name === "news") {
    cardClasses.push(classes.Circle);
  }

  // Load text only when image is loaded for smooth animation of appearing
  useEffect(() => {
    if (image.current.complete) {
      setLoaded(true);
    }
  }, []);

  let cardImage = null;
  if (post.featuredImage) {
    cardImage = (
      <Link href={`/${post.contentType.node.name}/${post.slug}`}>
        <a>
          <img
            ref={image}
            src={post.featuredImage.node.sourceUrl}
            alt={post.title}
            onLoad={() => setLoaded(true)}
          />
        </a>
      </Link>
    );
    if (post.contentType.node.name === "about") {
      cardImage = (
        <div className={classes.TriangleContainer}>
          <div className={classes.TriangleContent}>
            <Link href={`/${post.contentType.node.name}/${post.slug}`}>
              <a>
                <img
                  ref={image}
                  src={post.featuredImage.node.sourceUrl}
                  alt={post.title}
                  onLoad={() => setLoaded(true)}
                />
              </a>
            </Link>
          </div>
        </div>
      );
    }
  }

  return (
    <div ref={ref} className={cardClasses.join(" ")}>
      {cardImage}
      {loaded ? (
        <>
          <div className={[globalClasses.Flex, classes.Info].join(" ")}>
            <p className={classes.Date}>{formatDate(post.date)}</p>
            <div className={classes.Categories}>
              {categories.map((category, index) => {
                return (
                  <Fragment key={category.name}>
                    <Link
                      href={`/${post.contentType.node.name}/${category.name}`}
                    >
                      <a>{category.name}</a>
                    </Link>
                    {categories[index + 1] && "|"}
                  </Fragment>
                );
              })}
            </div>
          </div>
          <Link href={`/${post.contentType.node.name}/${post.slug}`}>
            <a>
              <h2>{post.title}</h2>
            </a>
          </Link>
          <p className={classes.Excerpt}>
            {post.excerpt.replace(/(<([^>]+)>)/gi, "")}
          </p>
        </>
      ) : null}
    </div>
  );
});
export default Card;
