import MainLayout from "../layouts/main";
import { AuthForm, Subscriptions } from "shared/ui";
import { useAuth, useSwellProduct } from "shared/hooks";

export default function Subscribe() {
  const { loading, customer } = useAuth();
  const { product } = useSwellProduct();
  const { name: productName } = product || {};
  const { isLoggedIn } = customer;

  return (
    <MainLayout>
      <h1>
        {isLoggedIn
          ? `${productName} subscription`
          : `Subscribe to ${productName}`}
      </h1>
      {isLoggedIn ? <Authenticated /> : <AuthForm />}
      {loading && "LOADING"}
    </MainLayout>
  );
}

function Authenticated() {
  const { customer } = useAuth();
  const { name, ownsResurface, checkoutUrl } = customer;
  return (
    <>
      <p>Hi there {name}</p>
      {ownsResurface ? (
        <>
          <p>You are currently subscribed</p>
          <Subscriptions />
        </>
      ) : (
        <>
          <p>You are not yet subscribed</p>
          <a href={checkoutUrl}>Continue to payment</a>
        </>
      )}
    </>
  );
}
