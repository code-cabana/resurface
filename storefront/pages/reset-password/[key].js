import { useRouter } from "next/router";
import { ResetPasswordForm } from "shared/ui";
import MainLayout from "../../layouts/main";

// The user returns to this page after clicking the reset password link in their email
export default function ResetPasswordKey() {
  const router = useRouter();
  const { key } = router.query || {};

  return (
    <MainLayout title="Change Password | Resurface" noIndex>
      <ResetPasswordForm resetKey={key} />
    </MainLayout>
  );
}
