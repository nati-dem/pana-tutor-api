import { BaseDAO } from "./base.dao";
import { QuizSubmission } from "../../../pana-tutor-lib/model/course/quiz-submission.interface";
import { QuizAnsEntry } from "../../../pana-tutor-lib/model/course/quiz-ans-entry.interface";
import { QuizInit } from "../../../pana-tutor-lib/model/course/quiz-init.interface";
import {YesNoChoice} from "./../../../pana-tutor-lib/enum/common.enum";

export class QuizDAO extends BaseDAO {

  findUserQuizEntries = async (userId, quizId) => {
    const query = `SELECT init.id as initId, init.quiz_id, init.student_id, init.date_start,
      ans.que_id, ans.answer, ans.is_correct, ans.marked_for_review, sub.total_score, sub.date_submit
      FROM quiz_init init
      LEFT JOIN quiz_ans_entry ans on init.id = ans.quiz_init_id
      LEFT JOIN quiz_submission sub on init.id = sub.quiz_init_id
      where init.student_id = ? AND init.quiz_id = ? `;
    const params = [userId, quizId];
    const caller = "findUserQuizEntries";
    return this.find(caller, query, params);
  };

  getSubmittedQuiz = async (req: QuizSubmission, studentId) => {
    const query = `SELECT  sub.* FROM quiz_submission sub
      INNER JOIN quiz_init init ON sub.quiz_init_id = init.id
      WHERE sub.quiz_init_id=? AND init.student_id = ? `;
    const params = [req.quiz_init_id, studentId];
    const caller = "getSubmittedQuiz";
    return this.find(caller, query, params);
  };

  getQuestionbyId = async (queId) => {
    const query = `SELECT * from question WHERE id = ?`;
    const params = [queId];
    const caller = "getQuestionbyId";
    return this.find(caller, query, params);
  };

  getSubmittedAnswer = async (quizInitId, queId, studId) => {
    const query = `SELECT ans.* FROM quiz_ans_entry ans
      INNER JOIN quiz_init init
      ON ans.quiz_init_id = init.id
      WHERE  ans.quiz_init_id = ? AND ans.que_id = ? AND init.student_id = ?`;
    const params = [quizInitId, queId, studId];
    const caller = "getSubmitedAnswer";
    return this.find(caller, query, params);
  };

  getQuizInit = async (quizId, userId) => {
    const query = `SELECT quiz_id, student_id, enrollment_id, timer FROM quiz_init WHERE quiz_id = ? AND student_id = ? `;
    const params = [quizId, userId];
    const caller = "getQuizInt";
    return this.find(caller, query, params);
  };

  findQuizInitNotSubmitted = async (quizId, userId) => {
    const query = `SELECT init.id, init.quiz_id, init.student_id, init.enrollment_id, init.timer
      FROM quiz_init init
      WHERE init.quiz_id = ? AND init.student_id = ?
      AND init.id NOT IN (select quiz_init_id from quiz_submission where quiz_init_id=init.id ) `;
    const params = [quizId, userId];
    const caller = "findQuizInitNotSubmitted";
    return this.find(caller, query, params);
  };

  startQuiz = async (req: QuizInit, userId) => {
    const query = `INSERT INTO quiz_init( quiz_id, student_id, enrollment_id, timer) VALUES (?,?,?,?)`;
    const params = [req.quiz_id, userId, req.enrollment_id, req.timer];
    const caller = "startQuiz";
    return this.insert(caller, query, params);
  };

  submitAnswer = async (req: QuizAnsEntry) => {
    const query = `INSERT INTO quiz_ans_entry( quiz_init_id, que_id, marked_for_review, answer, is_correct)
      VALUES (?,?,?,?,?)`;
    const params = [
      req.quiz_init_id,
      req.que_id,
      req.marked_for_review,
      req.answer,
      req.is_correct,
    ];
    const caller = "submitAnswer";
    return this.insert(caller, query, params, {que_id:req.que_id,
      quiz_init_id: req.quiz_init_id, is_correct: req.is_correct});
  };

  updateSubmittedAnswer = async (req: QuizAnsEntry, id) => {
    // dont need join with quiz_init since userId was checked by getSubmittedAnswer method
    const query = `UPDATE quiz_ans_entry SET marked_for_review=?, answer=?, is_correct=? WHERE id = ?`;
    const params = [
      req.marked_for_review,
      req.answer,
      req.is_correct,
      id
    ];
    const caller = "updateSubmittedAnswer";
    return this.update(caller, query, params, id, {que_id:req.que_id,
      quiz_init_id: req.quiz_init_id, is_correct: req.is_correct} );
  };

  submitQuiz = async (req: QuizSubmission) => {
    const query = `INSERT INTO quiz_submission(quiz_init_id, total_score)
      VALUES (?,?)`;
    const params = [
      req.quiz_init_id,
      req.total_score
    ];
    const caller = "submitQuiz";
    return this.insert(caller, query, params, { quiz_init_id: req.quiz_init_id, total_score: req.total_score,
      que_id:req.que_id, is_correct: req.is_correct });
  };

  calcTotalScore(req: QuizSubmission, studentId){
    const query = `SELECT COUNT(*) as total_score
      FROM quiz_ans_entry ans
      INNER JOIN quiz_init init ON ans.quiz_init_id = init.id
      WHERE ans.is_correct = ? AND ans.quiz_init_id = ? AND init.student_id = ? `
    const params = [YesNoChoice.yes, req.quiz_init_id, studentId];
    const caller = "getTotalScore";
    return this.find(caller, query, params);
  }

}
