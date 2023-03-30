import Head from "next/head";
import { useEffect, useState } from "react";
import api from "services/api";

export default function Pages({ pageInfo, language }) {
  const [mount, setMount] = useState(false);
  const { title, desc, ui, media, footer } = pageInfo;
  const { html, css = '* { box-sizing: border-box; } ' } = ui || {};
  const siteCss = footer ? css + footer.css : css

  useEffect(() => {
    sessionStorage.setItem("language",language)
  }, [])

  useEffect(() => {
    if (mount) {
      if (!!window.IntersectionObserver) {
        let observer = new IntersectionObserver(
          (entries, observer) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && entry.target.dataset.src) {
                entry.target.src = entry.target.dataset.src;
                observer.unobserve(entry.target);
              }
            });
          },
          {
            threshold: 0.7,
          }
        );
        document.querySelectorAll("img").forEach((img) => {
          observer.observe(img);
        });
      }
    }
    if (!mount) setMount(true);
  }, [mount]);

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
	)
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
    let rs = await api.get("getPage", `/${params.page}?language=${params.language}`)
    if (rs.errorCode != 0) return { props: { pageInfo: {} }, revalidate: 60 };

    const pageInfo = rs.data || {}
    return { props: { pageInfo, language: params.language }, revalidate: 60 };
  } catch (error) {
    console.log(params.page, error)
    return { props: { pageInfo: {}, language: params.language }, revalidate: 60 };
  }
}
