import MainLayout from "../layouts/main";
import { Account } from "../components/account";
import { AuthForm, LoadingStripes } from "shared/ui";
import { resetPasswordPageRel } from "shared/config";
import { useAuth } from "shared/hooks";
import logger from "../lib/logger";
import Link from "next/link";

export default function AccountPage() {
  const { loading, customer } = useAuth();
  const { isLoggedIn } = customer;

  return (
    <MainLayout
      title="Account | Resurface"
      description="Manage your Resurface account and subscription settings"
    >
      {loading && <LoadingStripes overlay />}
      {isLoggedIn ? (
        <Account />
      ) : (
        <AuthForm
          logger={logger}
          disabled={loading}
          resetPasswordLink={
            <Link href={resetPasswordPageRel}>I forgot my password</Link>
          }
        />
      )}
    </MainLayout>
  );
}
