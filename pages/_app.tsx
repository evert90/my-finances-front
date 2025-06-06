import 'regenerator-runtime/runtime';
import Head from "next/head";
import Router, { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { createRoot, Root } from 'react-dom/client';
import { LayoutComponent } from "../class/LayoutComponent";
import { PageChange } from "../components/PageChange/PageChange";
import '../styles/scrollbar.css';
import '../styles/global.css';
import '../styles/tooltip.css';
import '../styles/utils.css';
import Providers from "./Providers";
import Script from 'next/script';
import * as gtag from "../helpers/gtag";

import "@fortawesome/fontawesome-free/css/all.min.css";
// This ensures that the icon CSS is loaded immediately before attempting to render icons
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { User } from '../class/User';
import { useToast } from '../components/Toast/ToastProvider';
import { authService } from '../services/auth.service';
import { ModalSessionExpired } from '../components/Modal/ModalSessionExpired';
import { setSessionExpiredHandler } from '../services/session-expired.service';
// Prevent fontawesome from dynamically adding its css since we did it manually above
config.autoAddCss = false;



function MyApp({ Component, pageProps }) {

  const componentLayout = Component as LayoutComponent;

  const Layout = componentLayout.layout || (({ children }) => <>{children}</>);

  const [authorized, setAuthorized] = useState(false);

  const [showModal, setShowModal] = useState<boolean>(false)

  const [queryClient] = useState(() => new QueryClient())

  const router = useRouter();

  const toast = useToast();

  let root: Root;

  useEffect(() => {
    let comment = document.createComment(`
    =========================================================
    * Notus NextJS - v1.1.0 based on Tailwind Starter Kit by Creative Tim
    =========================================================
    * Product Page: https://www.creative-tim.com/product/notus-nextjs
    * Copyright 2021 Creative Tim (https://www.creative-tim.com)
    * Licensed under MIT (https://github.com/creativetimofficial/notus-nextjs/blob/main/LICENSE.md)
    * Tailwind Starter Kit Page: https://www.creative-tim.com/learning-lab/tailwind-starter-kit/presentation
    * Coded by Creative Tim
    =========================================================
    * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
    `);
    document.insertBefore(comment, document.documentElement);

    authService.check(setAuthorized, toast);

    Router.events.on("routeChangeStart", routeChangeStart);

    Router.events.on("routeChangeComplete", routeChangeComplete);

    Router.events.on("routeChangeError", routeChangeError);

    setSessionExpiredHandler(setShowModal);

    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off('routeChangeStart', routeChangeStart);
      router.events.off('routeChangeComplete', routeChangeComplete);
      Router.events.off("routeChangeError", routeChangeError);
    }

  }, []);

  const routeChangeComplete = (url) => {
    root.unmount();
    document.body.classList.remove("body-page-transition");
    gtag.pageview(url)
  }

  const routeChangeStart = (url) => {
    authService.check(setAuthorized, toast);
    document.body.classList.add("body-page-transition");
    root = createRoot(document.getElementById("page-transition"));
    root.render(<PageChange path={url} />);
  }

  const routeChangeError = () => {
    root.unmount();
    document.body.classList.remove("body-page-transition");
  }

  return (
    <React.Fragment>
      <Head>
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        {<link rel="manifest" href="/app/manifest.json" />}
        <link rel="apple-touch-icon" href="/app/img/icons/icon-144x144.png"></link>
        <meta name="theme-color" content="#fff" />
        <title>My Finances</title>
        {/*
            <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_KEY_HERE"></script>
            */}
      </Head>
      <Providers>
        <QueryClientProvider client={queryClient}>
          <Layout>
            {/* Global Site Tag (gtag.js) - Google Analytics */}
            {gtag.GA_TRACKING_ID && [
              <Script
                key="scriptGtag"
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
              />,
              <Script
                key="initGtag"
                id="gtag-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                  __html: `
                    let displayMode = 'browser';
                    const mqStandAlone = '(display-mode: standalone)';
                    if (navigator.standalone || window.matchMedia(mqStandAlone).matches) {
                      displayMode = 'standalone';
                    }
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${gtag.GA_TRACKING_ID}', {'page_path': window.location.pathname});
                    gtag('config', '${gtag.GA_TRACKING_ID}', {
                      'custom_map': {'dimension1': 'display_mode'},
                      'display_mode': displayMode
                    });
                    `,
                }}
              />
            ]}
            {authorized &&
              <Component {...pageProps} />
            }
             {showModal &&
              <ModalSessionExpired setShowModalState={setShowModal}></ModalSessionExpired>
             }
          </Layout>
        </QueryClientProvider>
      </Providers>
    </React.Fragment>
  );
}

//If loads something on server-side
/* MyApp.getInitialProps = async (appContext: AppContext) => {

  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);

  return { ...appProps }
} */

export default MyApp;