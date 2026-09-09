import { Metadata } from "next";
import { ArithmeticMasteryCenter } from "@/features/arithmetic/components/arithmetic-mastery-center";

export const metadata: Metadata = {
  title: "Basic Arithmetic Mastery | Mentis",
  description:
    "Master fundamental mental arithmetic (Multiplication, Addition, Subtraction, Division, Percentages) for psychometric speed tests.",
};

export default function ArithmeticPage() {
  return <ArithmeticMasteryCenter />;
}
