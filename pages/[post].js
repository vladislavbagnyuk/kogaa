import React from "react";

import { useRouter } from "next/router";
import Head from "next/head";

import Layout from "../components/Layout/Layout";
import Gallery from "../components/Gallery/Gallery";

// data
import { getAllPostsWithSlug, getPost } from "../lib/api";

// styles
import styles from "../styles/Home.module.css";
import singleStyles from "../styles/Single.module.css";

export default function Post({ postData }) {
  const router = useRouter();

  if ((!router.isFallback && !postData?.slug) || !postData) {
    return <p>hmm... looks like an error</p>;
  }

  const formatDate = (date) => {
    const newDate = new Date(date);
    return `${newDate.getDate()}/${
      newDate.getMonth() + 1
    }/${newDate.getFullYear()}`;
  };

  console.log(postData);
  return (
    <div className={styles.container}>
      <Head>
        <title>{postData.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <h1>{postData.title}</h1>
        {postData.extraPostInfo.gallery ? (
          <Gallery images={postData.extraPostInfo.gallery} />
        ) : null}
        <div dangerouslySetInnerHTML={{ __html: postData.content }}></div>
      </Layout>
    </div>
  );
}

export async function getServerSidePaths() {
  const allPosts = await getAllPostsWithSlug();

  return {
    paths: allPosts.edges.map(({ node }) => `/${node.slug}`) || [],
    fallback: true,
  };
}

export async function getServerSideProps({ params }) {
  const data = await getPost(params.post);
  return {
    props: {
      postData: data.post,
    },
  };
}