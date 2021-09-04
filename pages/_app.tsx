import React, { Component } from "react";
import ReactDOM from "react-dom";
import App from "next/app";
import Head from "next/head";
import Router from "next/router";

/*  
const fortawesome = require("@fortawesome/fontawesome-free/css/all.min.css")
const scrollbar = require("styles/scrollbar.css")
const tailwind = require("styles/tailwind.css")
*/

import "@fortawesome/fontawesome-free/css/all.min.css";
import '../styles/scrollbar.css';
import '../styles/tailwind.css';

import { PageChange } from "../components/PageChange/PageChange";
import { userService } from "../services/user.service";


export default class MyApp extends App {

  constructor(props: any) {
    super(props);
    
    this.state = {
      authorized: false
    }
    
    Router.events.on("routeChangeStart", (url) => {    
      console.log(`Loading: ${url}`);
      this.state.authorized = false;
      document.body.classList.add("body-page-transition");
      ReactDOM.render(
        <PageChange path={url} />,
        document.getElementById("page-transition")
      );
    });

    Router.events.on("routeChangeComplete", (url) => {
      this.authCheck(url)
      ReactDOM.unmountComponentAtNode(document.getElementById("page-transition"));
      document.body.classList.remove("body-page-transition");
    });

    Router.events.on("routeChangeError", () => {
      ReactDOM.unmountComponentAtNode(document.getElementById("page-transition"));
      document.body.classList.remove("body-page-transition");
    });
  }

  authCheck = (url: string) => {        
    // redirect to login page if accessing a private page and not logged in  
    const publicPaths = ['/auth/login', '/auth/register'];    
    const path = url.split('?')[0];
    
    if (!userService.getUserValue() && !publicPaths.includes(path)) {
      this.state.authorized = false;
      Router.push({
        pathname: '/auth/login',
        query: { returnUrl: Router.asPath }
      });
    } else {
      this.state.authorized = true;
    }
  }

  componentDidMount() {    
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
    this.authCheck(this.props.router.asPath);
  }

  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {      
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }


  render() {
    const { Component, pageProps } = this.props;

    const Layout = Component.layout || (({ children }) => <>{children}</>);

    console.log("state", this.state)
    console.log("props ", this.props)     

    return (
      <React.Fragment>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <title>Notus NextJS by Creative Tim</title>
          {/*  
          <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_KEY_HERE"></script>
          */}
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </React.Fragment>
    );
  }
}
