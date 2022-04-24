import { render } from "preact";
import { AuthProvider, SwellProductProvider } from "shared/hooks";

function Providers({ children }) {
  return (
    <AuthProvider>
      <SwellProductProvider>{children}</SwellProductProvider>
    </AuthProvider>
  );
}

export default function renderWithProviders(Element, domId) {
  render(
    <Providers>
      <Element />
    </Providers>,
    document.getElementById(domId)
  );
}
