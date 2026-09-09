import { Metadata } from "next";
import { RegisterForm } from "@/features/auth/components/register-form";

export const metadata: Metadata = {
  title: "Register | Mentis",
  description: "Create a new Mentis account to start your brain training journey.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
