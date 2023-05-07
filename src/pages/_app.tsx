import { MantineProvider } from '@mantine/core';
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import "~/styles/globals.css";
import { Toaster } from "react-hot-toast"
import { api } from "~/utils/api";
import { Notifications } from '@mantine/notifications';


const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {

  return (
    <MantineProvider
      theme={{
        colorScheme: "dark"
      }}
      withGlobalStyles
      withNormalizeCSS
    >
      <Notifications position='top-center' />

      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </MantineProvider>

  );
};

export default api.withTRPC(MyApp);
