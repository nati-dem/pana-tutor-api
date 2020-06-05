import { AppConstant } from "../config/constants";
import { ErrorCode } from "../../../pana-tutor-lib/enum/constants";
import { QuizDAO } from "../dao/quiz.dao";
import { QuizSubmission } from "../../../pana-tutor-lib/model/course/quiz-submission.interface";
import { QuizInit } from "../../../pana-tutor-lib/model/course/quiz-init.interface";
import { QuizAnsEntry } from "../../../pana-tutor-lib/model/course/quiz-ans-entry.interface";

import { Inject } from "typescript-ioc";

export class QuizService {
  @Inject
  private quizDAO: QuizDAO;

  startQuiz = async (req: QuizInit) => {
    const intQuizFound = await this.quizDAO.getQuizint(
      req.student_id,
      req.quiz_id,
      req.enrollment_id
    );
    let resp = intQuizFound;
    if (intQuizFound.length === 0) {
      resp = this.quizDAO.startQuiz(req);
    } else {
      resp = ErrorCode.ALREADY_EXIST;
    }
    return resp;
  };
  submitAns = async (req: QuizAnsEntry) => {
    const answerfound = await this.quizDAO.getSubmitedAnswer(
      req.quiz_id,
      req.que_id,
      req.student_id
    );
    let resp = answerfound;

    if (answerfound.length === 0) {
      resp = this.quizDAO.submitAnswer(req);
      // } else {
      //   resp = await this.quizDAO.updateSubmitedAns(req);
    } else {
      resp = ErrorCode.ALREADY_EXIST;
    }
    return resp;
  };
  submitQuiz = async (req: QuizSubmission) => {
    const quizfound = await this.quizDAO.getSubmitedQuiz(
      req.quiz_id,
      req.student_id
    );
    let resp = quizfound;

    if (quizfound.length === 0) {
      resp = this.quizDAO.submitQuiz(req);
    } else {
      resp = ErrorCode.ALREADY_EXIST;
    }

    return resp;
  };
}
