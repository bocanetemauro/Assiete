import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/account/PasswordForms";

export const metadata: Metadata = { title: "Wachtwoord vergeten" };

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
