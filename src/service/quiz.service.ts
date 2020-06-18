import { AppConstant } from "../config/constants";
import { QuizDAO } from "../dao/quiz.dao";
import { QuizSubmission } from "../../../pana-tutor-lib/model/course/quiz-submission.interface";
import { QuizInit } from "../../../pana-tutor-lib/model/course/quiz-init.interface";
import { QuizAnsEntry } from "../../../pana-tutor-lib/model/course/quiz-ans-entry.interface";
import { Inject } from "typescript-ioc";
import { YesNoChoice, QuizStatus } from "../../../pana-tutor-lib/enum/common.enum";
import {ErrorMessage} from "./../../../pana-tutor-lib/enum/constants";

export class QuizService {

  @Inject
  private quizDAO: QuizDAO;

  startQuiz = async (req: QuizInit) => {
    // TODO - validate if user has permission to start quiz using Enrollment / active Tutor session
    console.log('global UserId::', global.userId)
    const initQuizFound = await this.quizDAO.getQuizInit(req.quiz_id, global.userId);
    let resp = initQuizFound;
    if (initQuizFound.length === 0) {
      resp = this.quizDAO.startQuiz(req, global.userId);
    }
    return resp;
  };

  submitAns = async (req: QuizAnsEntry, queResp) => {
    req.marked_for_review = req.marked_for_review === YesNoChoice.yes ? YesNoChoice.yes: YesNoChoice.no;
    req.is_correct = this.isCorrectAnswer(req, queResp);
    let result = await this.quizDAO.getSubmittedAnswer(req.quiz_init_id, req.que_id, global.userId);
    if (result.length === 0) {
      result = await this.quizDAO.submitAnswer(req);
      console.log('submit-answer---->', result)
    } else if(result && result[0].id){ // update submitted answer
      result = await this.quizDAO.updateSubmittedAnswer(req, result[0].id);
    }

    return result;

  };

  isCorrectAnswer = (req, queResp) => {
    console.log('submit ans::', req.answer)
    const iscorrectAns = req.answer === queResp.data.acf.correct_answer[0] ? YesNoChoice.yes: YesNoChoice.no;
    console.log('iscorrectAns::', iscorrectAns)
    return iscorrectAns;
  }

  submitQuiz = async (req: QuizSubmission) => {
    const submitEntry = await this.quizDAO.getSubmittedQuiz(req, global.userId);
    let result;
    if (submitEntry.length === 0) {
      const score = await this.quizDAO.calcTotalScore(req, global.userId);
      req.total_score = Array.isArray(score) && score[0].total_score ? score[0].total_score : 0;
      result = this.quizDAO.submitQuiz(req);
    } else if(Array.isArray(submitEntry)) {
      result = {
        message: ErrorMessage.DUPLICATE_ENTRY
      }
    }

    return result;
  };
}
