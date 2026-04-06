/**
 * Next.js Document
 * Custom document to include global styles
 */

import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="description" content="Mongolian Table Tennis Federation - Official Platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>MTTF - Mongolian Table Tennis Federation</title>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
