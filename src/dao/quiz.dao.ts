import { BaseDAO } from "./base.dao";
import { QuizSubmission } from "../../../pana-tutor-lib/model/course/quiz-submission.interface";

export class QuizDAO extends BaseDAO {
  startQuize = async (quiz_id, student_id, enrollment_id, timer) => {
    const query = `INSERT INTO quiz_init( quiz_id, student_id, enrollment_id, date_start, timer) VALUES (?,?,?,?,?,?)`;
    const params = [quiz_id, student_id, enrollment_id, timer];
    const caller = "startQuize";
    return this.insert(caller, query, params);
  };

  submitAnswer = async (req) => {
    const query = `INSERT INTO quiz_ans_entry( quiz_id, student_id, que_id, marked_for_review, answer, instructor_feedback, is_correct) VALUES (?,?,?,?,?,?,?,?)`;
    const params = [];
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
}
