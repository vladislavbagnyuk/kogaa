import Head from "next/head";
import Link from "next/link";

import Layout from "../../components/Layout/Layout";
import ErrorImage from "../../assets/404.svg";

import classes from "./Error.module.css";
import globalClasses from "../../styles/Global.module.css";

export default function Error({ subcategories }) {
  return (
    <Layout
      error
      subcategories={subcategories}
      postSubcategories={[{ name: "error 404" }]}
      hideLine={true}
    >
      <Head>
        <title>KOGAA - Page not found</title>
      </Head>
      <div className={`${classes.Error} ${globalClasses.FadeIn}`}>
        <p className={classes.Top}>
          Congratulations!
          <br />
          You unlocked a hidden chamber!
        </p>
        <ErrorImage />
        <p>
          But seriously, page not found.
          <br />
          Please try again.
        </p>
        <Link href="/">go home</Link>
      </div>
    </Layout>
  );
}
