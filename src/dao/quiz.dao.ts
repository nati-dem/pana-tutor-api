import { BaseDAO } from "./base.dao";
import { QuizSubmission } from "../../../pana-tutor-lib/model/course/quiz-submission.interface";
import { QuizAnsEntry } from "../../../pana-tutor-lib/model/course/quiz-ans-entry.interface";
import { QuizInit } from "../../../pana-tutor-lib/model/course/quiz-init.interface";

export class QuizDAO extends BaseDAO {
  getSubmitedQuiz = async (quizId, studentId) => {
    const query = `SELECT  quiz_id, student_id, total_score, date_submit, instructor_feedback, instructor_id FROM quiz_submission WHERE quiz_id = ? AND student_id = ? `;
    const params = [quizId, studentId];
    const caller = "getSubmitedQuiz";
    return this.find(caller, query, params);
  };

  getQuestionbyId = async (queId) => {
    const query = `SELECT * from question WHERE id = ?`;
    const params = [queId];
    const caller = "getQuestionbyId";
    return this.find(caller, query, params);
  };

  getSubmitedAnswer = async (quizId, queId, studentId) => {
    const query = `SELECT  quiz_id, student_id, que_id, marked_for_review, answer, instructor_feedback, is_correct FROM quiz_ans_entry WHERE  quiz_id = ? AND que_id = ? AND student_id = ? `;
    const params = [quizId, queId, studentId];
    const caller = "getSubmitedAnswer";
    return this.find(caller, query, params);
  };

  getQuizint = async (quizId, studentId, enrollmentId) => {
    const query = `SELECT quiz_id, student_id, enrollment_id, timer FROM quiz_init  WHERE quiz_id = ? AND student_id = ? AND enrollment_id = ? `;
    const params = [quizId, studentId, enrollmentId];
    const caller = "getQuizInt";
    return this.find(caller, query, params);
  };

  startQuiz = async (req: QuizInit) => {
    const query = `INSERT INTO quiz_init( quiz_id, student_id, enrollment_id, timer) VALUES (?,?,?,?)`;
    const params = [req.quiz_id, req.student_id, req.enrollment_id, req.timer];
    const caller = "startQuiz";
    return this.insert(caller, query, params);
  };

  submitAnswer = async (req: QuizAnsEntry) => {
    const query = `INSERT INTO quiz_ans_entry( quiz_id, student_id, que_id, marked_for_review, answer, instructor_feedback, is_correct) VALUES (?,?,?,?,?,?,?)`;
    const params = [
      req.quiz_id,
      req.student_id,
      req.que_id,
      req.marked_for_revie
      req.answer,
      req.instructor_feedback,
      req.is_correct,
    ];
    const caller = "submitAnswer";
    return this.insert(caller, query, params);
  };

  submitQuiz = async (req: QuizSubmission) => {
    const query = `INSERT INTO quiz_submission(quiz_id, student_id, total_score, instructor_feedback, instructor_id) VALUES (?,?,?,?,?)`;
    const params = [
      req.quiz_id,
      req.student_id,
      req.total_score,
      req.instructor_feedback,
      req.instructor_id,
    ];
    const caller = "submitQuiz";
    return this.insert(caller, query, params);
  };

  // updateSubmitedAns = async (req: QuizAnsEntry) => {
  //   const query = `UPDATE quiz_ans_entry SET quiz_id = ?, student_id = ?, que_id = ?, marked_for_review = ?, answer = ?, instructor_feedback = ?, is_correct = ? WHERE  quiz_id = ? AND que_id = ? AND  student_id = ? `;
  //   const params = [req.quiz_id, req.que_id, req.student_id];
  //   const caller = "updateSubmitedAns";
  //   return this.update(caller, query, params);
  // };
}
