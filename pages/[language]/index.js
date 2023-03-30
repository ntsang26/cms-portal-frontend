import Head from "next/head";
import React, { useEffect } from "react";
import api from "services/api";

function Home({ pageInfo, language }) {
  const { title, desc, ui, media, footer } = pageInfo;
  const { html, css = '* { box-sizing: border-box; } ' } = ui || {};
  const siteCss = footer ? css + footer.css : css

  useEffect(() => {
    sessionStorage.setItem("language",language)
  }, [])

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={desc} />
        {media ? <link rel="shortcut icon" href={media} /> : null}
      </Head>
      <div
        className="text-container"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {footer ? (
        <div
          className="text-container"
          dangerouslySetInnerHTML={{ __html: footer.html }}
        />
      ) : null}
      <style jsx>{siteCss}</style>
    </>
  );
}

export async function getStaticPaths() {
  try {
    let rs = await api.get("getPath")
    if (rs.errorCode != 0) {
      return { paths: [{ params: { page: "404" } }], fallback: false };
    }
    let paths = rs.data || []
    paths = paths.map((item) => { return { params: { page: item.path, language: item.language } } })
    return {
      paths,
      fallback: false,
    }
  } catch (error) {
    console.log(error);
    return { paths: [{ params: { page: "404" } }], fallback: false };
  }
}

export async function getStaticProps({ params }) {
  try {
    let rs = await api.get("getPage", `/index-${params.language}`)
    if (rs.errorCode != 0) return { props: { pageInfo: {} }, revalidate: 60 };

    const pageInfo = rs.data || {}
    return { props: { pageInfo, language: params.language }, revalidate: 60 };
  } catch (error) {
    console.log(params.page, error)
    return { props: { pageInfo: {}, language: params.language }, revalidate: 60 };
  }
}

// export async function getServerSideProps({ req, res }) {
//   try {
//     res.setHeader(
//       'Cache-Control',
//       'public, s-maxage=10, stale-while-revalidate=59'
//     )
//     let rs = await api.get("getPage", `/index`)
//     if (rs.errorCode != 0) return { props: { pageInfo: {} } };

//     const pageInfo = rs.data || {}
//     return { props: { pageInfo } };
//   } catch (error) {
//     return { props: { pageInfo: {} } };
//   }
// }

export default Home;
