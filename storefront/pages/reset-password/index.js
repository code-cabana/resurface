import MainLayout from "../../layouts/main";
import { SendResetPasswordEmailForm } from "shared/ui";

export default function ResetPassword() {
  return (
    <MainLayout>
      <SendResetPasswordEmailForm />
    </MainLayout>
  );
}
