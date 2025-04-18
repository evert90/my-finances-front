import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="pt-BR">
        <Head>
          <meta charSet="utf-8" />
          <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fffbfb"></meta>
          <meta name="theme-color" media="(prefers-color-scheme: dark)" content="black"></meta>
          <link rel="shortcut icon" href="/app/img/brand/favicon.ico" />
          <link
            rel="apple-touch-icon"
            sizes="76x76"
            href="/app/img/icons/icon-144x144.png"
          />
        </Head>
        <body className="antialiased text-blueGray-700">
          <div id="page-transition"></div>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
