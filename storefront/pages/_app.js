import {
  AuthProvider,
  SessionProvider,
  SwellProductProvider,
} from "shared/hooks";
import "shared/styles";
import { SwellSubProvider } from "../../shared/src/hooks";
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
    <AuthProvider>
      <SwellSubProvider>
        <SwellProductProvider>
          <SessionProvider>{children}</SessionProvider>
        </SwellProductProvider>
      </SwellSubProvider>
    </AuthProvider>
  );
}
