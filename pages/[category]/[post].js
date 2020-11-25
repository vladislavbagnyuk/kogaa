import { useWindowSize } from "../../lib/hooks";

import { useRouter } from "next/router";
import Head from "next/head";

import Layout from "../../components/Layout/Layout";
import Gallery from "../../components/Gallery/Gallery";

// data
import { getSlugs, getPost, getGallery } from "../../lib/api/single";

// styles
import styles from "../../styles/Home.module.css";
import singleStyles from "../../styles/Single.module.css";

export default function Post({ postData, gallery }) {
  const windowWidth = useWindowSize().width;
  let images = null;
  if (windowWidth <= 320) {
    images = gallery.gallery320;
  } else if (windowWidth <= 480) {
    images = gallery.gallery480;
  } else if (windowWidth <= 768) {
    images = gallery.gallery768;
  } else if (windowWidth <= 1366) {
    images = gallery.gallery1366;
  } else if (windowWidth <= 1440) {
    images = gallery.gallery1440;
  } else if (windowWidth <= 1920) {
    images = gallery.gallery1920;
  } else if (windowWidth <= 1366) {
    images = gallery.gallery1920;
  } else if (windowWidth > 1366) {
    images = gallery.gallery4k;
  }

  const router = useRouter();
  if ((!router.isFallback && !postData?.slug) || !postData) {
    return <p>post error</p>;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{postData.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        {images ? <Gallery images={images} /> : null}
        <h1>{postData.title}</h1>
        {postData.role ? (
          <p>
            <strong>{postData.role.role}</strong>
          </p>
        ) : null}
        <div
          className={singleStyles.Content}
          dangerouslySetInnerHTML={{ __html: postData.content }}
        ></div>
      </Layout>
    </div>
  );
}

// Get all possible paths
export async function getServerSidePaths() {
  const allPosts = await getSlugs();
  return {
    paths: allPosts.edges.map(({ node }) => `/${node.slug}`) || [],
    fallback: true,
  };
}

// Get data for current post by slug
export async function getServerSideProps({ params }) {
  let [
    data,
    gallery320,
    gallery480,
    gallery768,
    gallery1366,
    gallery1440,
    gallery1920,
    gallery4k,
  ] = await Promise.all([
    getPost(params.post),
    getGallery(params.post, "GALLERY_320"),
    getGallery(params.post, "GALLERY_480"),
    getGallery(params.post, "GALLERY_768"),
    getGallery(params.post, "GALLERY_1366"),
    getGallery(params.post, "GALLERY_1440"),
    getGallery(params.post, "GALLERY_1920"),
    getGallery(params.post, "GALLERY_4K"),
  ]);

  return {
    props: {
      postData: data,
      gallery: {
        gallery320,
        gallery480,
        gallery768,
        gallery1366,
        gallery1440,
        gallery1920,
        gallery4k,
      },
    },
  };
}
