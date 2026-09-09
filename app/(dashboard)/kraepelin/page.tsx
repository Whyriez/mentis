import { Metadata } from "next";
import { KraepelinTestContainer } from "@/features/kraepelin/components/kraepelin-test-container";

export const metadata: Metadata = {
  title: "Tes Kraepelin & Pauli (Tes Koran) | Mentis",
  description:
    "Simulasi psikotes tes koran digital (Kraepelin & Pauli) adaptif untuk melatih kecepatan, ketelitian, kestabilan, dan ketahanan kalkulasi mental.",
};

export default function KraepelinPage() {
  return <KraepelinTestContainer />;
}
