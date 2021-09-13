import "@fortawesome/fontawesome-free/css/all.min.css";
import App from "next/app";
import Head from "next/head";
import Router, { useRouter } from "next/router";
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { LayoutComponent } from "../classes/layout-component";
import { PageChange } from "../components/PageChange/PageChange";
import { userService } from "../services/user.service";
import '../styles/scrollbar.css';
import '../styles/tailwind.css';
import '../styles/utils.scss';
import Providers from "./Providers";

function MyApp({ Component, pageProps }) {

  const componentLayout = Component as LayoutComponent;

  const Layout = componentLayout.layout || (({ children }) => <>{children}</>);

  const router = useRouter();

  useEffect(() => {
    // redirect to home if already logged in
    if (userService.getUserValue()?.token) {
      router.push('/');
    }

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
        authCheck(router.asPath);

}, []);

  const [authorized, setState] = React.useState(false);

    Router.events.on("routeChangeStart", (url) => {
      console.log(`Loading: ${url}`);
      setState(false)
      document.body.classList.add("body-page-transition");
      ReactDOM.render(
        <PageChange path={url} />,
        document.getElementById("page-transition")
      );
    });

    Router.events.on("routeChangeComplete", (url) => {
      authCheck(url)
      ReactDOM.unmountComponentAtNode(document.getElementById("page-transition"));
      document.body.classList.remove("body-page-transition");
    });

    Router.events.on("routeChangeError", () => {
      ReactDOM.unmountComponentAtNode(document.getElementById("page-transition"));
      document.body.classList.remove("body-page-transition");
    });


  const authCheck = (url: string) => {

    // redirect to login page if accessing a private page and not logged in
    const publicPaths = ['/auth/login', '/auth/register'];
    const path = url.split('?')[0];

    if (!userService.getUserValue()?.token && !publicPaths.includes(path)) {
      setState(false)
      Router.push({
        pathname: '/auth/login',
        query: { returnUrl: Router.asPath }
      });
    } else {
      setState(true)
    }
  }

    return (
      <React.Fragment>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <title>Notus NextJS by Creative Tim</title>
          {/* */
          <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_KEY_HERE"></script>
          }
        </Head>
        <Providers>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Providers>
      </React.Fragment>
    );
  }


MyApp.getInitialProps = async (appContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  console.log("INIT")
  const appProps = await App.getInitialProps(appContext);

  return { ...appProps }
}

export default MyApp;
