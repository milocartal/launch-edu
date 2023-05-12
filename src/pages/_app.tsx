import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes"

import { api } from "~/utils/api";

import "~/styles/globals.css";
import 'react-quill/dist/quill.snow.css'
import Head from "next/head";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    
    <SessionProvider session={session}>
      <ThemeProvider attribute="class">
        <Head>
          <link rel="icon" href="/okto.png" />
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter&display=swap');
          </style>
        </Head>
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
