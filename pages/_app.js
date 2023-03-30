import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import '../styles/globals.css'
import Script from 'next/script.js';

// import 'bootstrap/dist/js/popper.min.js';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
  }, [])
  return (
    <>
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GA4_MEASUREMENT_ID}`}
      />
      <Script strategy="lazyOnload">
        {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.GA4_MEASUREMENT_ID}');`
        }
        {
          `(function (w, d, t, u, n, a, m) {
            w['MauticTrackingObject'] = n;
            w[n] = w[n] || function () { (w[n].q = w[n].q || []).push(arguments) }, a = d.createElement(t),
              m = d.getElementsByTagName(t)[0]; a.async = 1; a.src = u; m.parentNode.insertBefore(a, m)
          })(window, document, 'script', 'https://marketing.jitsinnovationlabs.com/mtc.js', 'mt');
          
          mt('send', 'pageview');`
        }
      </Script>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
