import { Metadata } from "next";
import { LearnService } from "@/features/learn/services/learn-service";
import { LessonViewer } from "@/features/learn/components/lesson-viewer";
import { EmptyState } from "@/components/ui/ui-states";

interface LessonPageProps {
  params: Promise<{
    moduleId: string;
    lessonId: string;
  }>;
}

const learnService = new LearnService();

export async function generateMetadata({
  params,
}: LessonPageProps): Promise<Metadata> {
  const { lessonId } = await params;
  const lesson = await learnService.getLessonDetails(lessonId);
  return {
    title: lesson ? `${lesson.title} | Mentis Learn` : "Lesson | Mentis",
    description: lesson?.description,
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug, lessonId } = await parseParams(params);

  const moduleData = await learnService.getModuleDetails(slug);
  const lesson = await learnService.getLessonDetails(lessonId);

  if (!moduleData || !lesson) {
    return (
      <EmptyState
        title="Lesson Not Found"
        description="The requested lesson module could not be found or has been moved."
      />
    );
  }

  const lessons = moduleData.lessons;
  const currentIdx = lessons.findIndex((l) => l.id === lesson.id);

  const prevLessonId = currentIdx > 0 ? lessons[currentIdx - 1].id : undefined;
  const nextLessonId =
    currentIdx >= 0 && currentIdx < lessons.length - 1 ? lessons[currentIdx + 1].id : undefined;

  return (
    <LessonViewer
      lesson={lesson}
      totalLessons={lessons.length}
      prevLessonId={prevLessonId}
      nextLessonId={nextLessonId}
    />
  );
}

async function parseParams(params: Promise<{ moduleId: string; lessonId: string }>) {
  const resolved = await params;
  return {
    slug: resolved.moduleId,
    lessonId: resolved.lessonId,
  };
}
