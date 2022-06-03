import logger from "../lib/logger";
import {
  AuthProvider,
  SessionProvider,
  SwellProductProvider,
  SwellSubProvider,
} from "shared/hooks";
import "shared/styles";
import "../styles/globals.css";

export default function Storefront({ Component, pageProps }) {
  return (
    <Providers>
      <Component {...pageProps} />
    </Providers>
  );
}

function Providers({ children }) {
  return (
    <AuthProvider logger={logger}>
      <SwellSubProvider logger={logger}>
        <SwellProductProvider logger={logger}>
          <SessionProvider logger={logger}>{children}</SessionProvider>
        </SwellProductProvider>
      </SwellSubProvider>
    </AuthProvider>
  );
}
