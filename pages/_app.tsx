import 'regenerator-runtime/runtime';
import "@fortawesome/fontawesome-free/css/all.min.css";
import Head from "next/head";
import Router, { useRouter } from "next/router";
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { LayoutComponent } from "../class/LayoutComponent";
import { PageChange } from "../components/PageChange/PageChange";
import { userService } from "../services/user.service";
import '../styles/scrollbar.css';
import '../styles/tailwind.css';
import '../styles/tooltip.css';
import '../styles/utils.css';
import Providers from "./Providers";
import Script from 'next/script';
import * as gtag from "../helpers/gtag";

function MyApp({ Component, pageProps }) {

  const componentLayout = Component as LayoutComponent;

  const Layout = componentLayout.layout || (({ children }) => <>{children}</>);

  const [authorized, setAuthorized] = React.useState(false);

  const router = useRouter();

  useEffect(() => {
    console.log("APP EFFECT")

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

    //unregisterServiceWorkers()

    authCheck(router.asPath);

    Router.events.on("routeChangeStart", routeChangeStart);

    Router.events.on("routeChangeComplete", routeChangeComplete);

    Router.events.on("routeChangeError", routeChangeError);

    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off('routeChangeStart', routeChangeStart);
      router.events.off('routeChangeComplete', routeChangeComplete);
      Router.events.off("routeChangeError", routeChangeError);
    }

  }, []);

  const unregisterServiceWorkers = () => {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      console.log("registrations", registrations)
      for(let registration of registrations) {
       registration.unregister()
    } })
  }

  const routeChangeComplete = (url) => {
    authCheck(url)
    ReactDOM.unmountComponentAtNode(document.getElementById("page-transition"));
    document.body.classList.remove("body-page-transition");
    gtag.pageview(url)
  }

  const routeChangeStart = (url) => {
    document.body.classList.add("body-page-transition");
    ReactDOM.render(
      <PageChange path={url} />,
      document.getElementById("page-transition")
    );
  }

  const routeChangeError = () => {
    ReactDOM.unmountComponentAtNode(document.getElementById("page-transition"));
    document.body.classList.remove("body-page-transition");
  }

  const authCheck = (url: string) => {
    // redirect to login page if accessing a private page and not logged in
    const publicPaths = ['/auth/login', '/auth/register'];
    const path = url.split('?')[0];

    if (!userService.getUserValue()?.token && !publicPaths.includes(path)) {
      console.log("Unathorized")
      setAuthorized(false);
      Router.push({
        pathname: '/auth/login',
        query: { returnUrl: Router.asPath }
      });
    } else {
      setAuthorized(true);
    }
  }

  return (
    <React.Fragment>
      <Head>
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        { <link rel="manifest" href="/manifest.json" /> }
        <link rel="apple-touch-icon" href="/img/icons/icon-144x144.png"></link>
        <meta name="theme-color" content="#fff" />
        <title>My Finances</title>
        {/*
        <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_KEY_HERE"></script>
        */}
      </Head>
      <Providers>
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
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gtag.GA_TRACKING_ID}', {'page_path': window.location.pathname});
              `,
            }}
          />
        ]}
          {authorized &&
            <Component {...pageProps} />
          }
        </Layout>
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