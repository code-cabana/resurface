import MainLayout from "../layouts/main";
import { useAuth } from "shared/hooks";
import { AuthForm, Account, LoadingStripes } from "shared/ui";
import { resetPasswordPageRel } from "shared/config";
import Link from "next/link";

export default function Account() {
  const { loading, customer } = useAuth();
  const { isLoggedIn } = customer;

  return (
    <MainLayout>
      {loading ? (
        <LoadingStripes />
      ) : isLoggedIn ? (
        <Account />
      ) : (
        <AuthForm
          resetPasswordLink={
            <Link href={resetPasswordPageRel}>I forgot my password</Link>
          }
        />
      )}
    </MainLayout>
  );
}

// (
//   <>

//     <p>Hi there {name}</p>
//     {ownsResurface ? (
//       <>
//         <p>You are currently subscribed</p>
//         <Subscriptions />
//       </>
//     ) : (
//       <>
//         <p>You are not yet subscribed</p>
//         <a href={checkoutUrl}>Continue to payment</a>
//       </>
//     )}
//   </>
// );
