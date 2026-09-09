import { LearnRepository } from "../repositories/learn-repository";
import { LessonData, ModuleData } from "../types";

export class LearnService {
  private repository: LearnRepository;

  constructor() {
    this.repository = new LearnRepository();
  }

  async getModuleLibrary(): Promise<ModuleData[]> {
    return this.repository.getModules();
  }

  async getModuleDetails(slug: string): Promise<ModuleData | null> {
    return this.repository.getModuleBySlug(slug);
  }

  async getLessonDetails(lessonId: string): Promise<LessonData | null> {
    return this.repository.getLessonById(lessonId);
  }

  async getUserModuleProgress(userId: string, moduleId: string): Promise<number> {
    return this.repository.getUserModuleProgress(userId, moduleId);
  }
}
