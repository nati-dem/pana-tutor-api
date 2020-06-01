import {AppConstant} from '../config/constants';
import {QuizDAO} from '../dao/quiz.dao';
import { Inject } from 'typescript-ioc';

export class QuizService {

    @Inject
    private quizDAO: QuizDAO;

}
