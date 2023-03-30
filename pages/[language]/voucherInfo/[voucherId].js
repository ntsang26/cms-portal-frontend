import Head from "next/head";
import { useEffect, useState } from "react";
import api from "services/api";
import helper from 'services/helper';

export default function Pages({ pageInfo, promotionInfo, language }) {
  const [mount, setMount] = useState(false);
  const { title, name, desc, ui, media, footer } = pageInfo;
  const { html, css = '* { box-sizing: border-box; } ' } = ui || {};
  const siteCss = footer ? css + footer.css : css

  useEffect(() => {
    sessionStorage.setItem("language", language)
  }, [])

  useEffect(() => {
    if (mount) {
      const promotionKeys = Object.keys(promotionInfo)
      console.log(promotionKeys)
      for (const promotionKey of promotionKeys) {
        const currentNodes = document.getElementsByClassName(`promotion-detail-${promotionKey}`)
        for (const currentNode of currentNodes) {
          if (currentNode) {
            if (['img', 'audio', 'source', 'video', 'embed', 'track', 'iframe'].includes(currentNode?.tagName?.toLowerCase())) {
              currentNode.setAttribute("src", promotionInfo[promotionKey]);
            }
            else if (['a', 'area', 'base', 'link'].includes(currentNode?.tagName?.toLowerCase())) {
              // currentNode.setAttribute("href", promotionInfo[promotionKey]);
              const currentHref = currentNode.getAttribute("href")
              const reg = new RegExp(`{{${promotionKey}}}`)
              const newHref = currentHref.replace(reg, promotionInfo[promotionKey])
              currentNode.setAttribute("href", newHref);
            }
            else if (currentNode.getAttribute("data-type") == "date") {
              const date = new Date(promotionInfo[promotionKey])
              const day = date.getDay();
              const month = date.getMonth() + 1;
              const year = date.getFullYear();
              currentNode.innerHTML = `${day}/${month}/${year}`
            } else {
              currentNode.innerHTML = promotionInfo[promotionKey]
            }
          }
        }
      }
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
  );
}

export async function getStaticPaths() {
  try {
    let rs = await api.get("getPromotion")// [{name: "Promotion 1"}]
    if (rs.errorCode != 0) {
      return { paths: [{ params: { page: "404" } }], fallback: false };
    }
    let data = rs.data || []
    const paths = []
    let LANGUAGE = ['en', 'my']
    for (const lan of LANGUAGE) {
      paths.push(...data.map((item) => { return { params: { voucherId: item.sid, language: lan } } }))
    }
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
    let rs = await api.get("getPage", `/voucherDetail-${params.language}`)// get promotion by name

    if (rs.errorCode != 0) return { props: { pageInfo: {} }, revalidate: 60 };

    const pageInfo = rs.data || {}

    let rsPromotion = await api.get("getPromotionDetail", `?promotionId=${params.voucherId}&language=${params.language}`)
    if (rsPromotion.errorCode != 0) return { props: { pageInfo: {} }, revalidate: 60 };

    let promotionInfo = helper.flattenDeepObject(rsPromotion.data)
    return { props: { pageInfo, promotionInfo, language: params.language }, revalidate: 60 };
  } catch (error) {
    console.log(params.page, error)
    return { props: { pageInfo: {}, language: params.language }, revalidate: 60 };
  }
}
