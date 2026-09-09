import { Metadata } from "next";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Login | Mentis",
  description: "Log in to your Mentis adaptive brain training account.",
};

export default function LoginPage() {
  return <LoginForm />;
}
