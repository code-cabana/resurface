import { SendResetPasswordEmailForm } from "../../components/resetPwd";
import MainLayout from "../../layouts/main";

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
