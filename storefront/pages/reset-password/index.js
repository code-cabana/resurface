import MainLayout from "../../layouts/main";
import { SendResetPasswordEmailForm } from "shared/ui";

export default function ResetPassword() {
  return (
    <MainLayout
      title="Reset Password | Resurface"
      description="Reset your Resurface account password"
    >
      <SendResetPasswordEmailForm />
    </MainLayout>
  );
}
