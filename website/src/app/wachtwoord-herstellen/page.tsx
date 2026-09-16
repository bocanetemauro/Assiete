import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/account/PasswordForms";

export const metadata: Metadata = { title: "Nieuw wachtwoord" };

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
