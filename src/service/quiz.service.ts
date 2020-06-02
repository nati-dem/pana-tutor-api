import { AppConstant } from "../config/constants";
import { QuizDAO } from "../dao/quiz.dao";
import { QuizSubmission } from "../../../pana-tutor-lib/model/course/quiz-submission.interface";
import { Inject } from "typescript-ioc";

export class QuizService {
  @Inject
  private quizDAO: QuizDAO;

  startQuiz = async (req) => {};
  submitQuiz = async (req: QuizSubmission) => {
    const submitquiz = await this.quizDAO.submitQuiz(req);
    return submitquiz;
  };
  submitAnswer = async (req) => {};
}
