import MainLayout from "../layouts/main";
import { Account } from "../components/account";
import { AuthForm, LoadingStripes } from "shared/ui";
import { resetPasswordPageRel } from "shared/config";
import { useAuth } from "shared/hooks";
import Link from "next/link";

export default function AccountPage() {
  const { loading, customer } = useAuth();
  const { isLoggedIn } = customer;

  return (
    <MainLayout>
      {loading && <LoadingStripes overlay />}
      {isLoggedIn ? (
        <Account />
      ) : (
        <AuthForm
          disabled={loading}
          resetPasswordLink={
            <Link href={resetPasswordPageRel}>I forgot my password</Link>
          }
        />
      )}
    </MainLayout>
  );
}
