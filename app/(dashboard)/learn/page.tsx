import { Metadata } from "next";
import { LearnService } from "@/features/learn/services/learn-service";
import { EmptyState } from "@/components/ui/ui-states";
import { ModuleCatalogView } from "@/features/learn/components/module-catalog-view";

export const metadata: Metadata = {
  title: "Learn | Mentis",
  description: "Browse learning modules, lessons, and mental math shortcuts.",
};

const learnService = new LearnService();

export default async function LearnPage() {
  const modules = await learnService.getModuleLibrary();

  if (!modules || modules.length === 0) {
    return (
      <EmptyState
        title="No Modules Available"
        description="Check back soon for new learning modules and lessons."
      />
    );
  }

  return <ModuleCatalogView modules={modules} initialActiveSlug={modules[0]?.slug || "multiplication"} />;
}
