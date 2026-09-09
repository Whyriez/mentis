import { QuizRepository } from "../repositories/quiz-repository";
import { Question } from "../types";

export class QuizService {
  private repository: QuizRepository;

  constructor() {
    this.repository = new QuizRepository();
  }

  async getDrillQuestions(
    moduleSlug: string = "multiplication",
    difficulty: "Easy" | "Medium" | "Hard" = "Medium",
    count: number = 10
  ): Promise<Question[]> {
    return this.repository.getQuestions(moduleSlug, difficulty, count);
  }
}
