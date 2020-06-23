import { Inject } from "typescript-ioc";
import { CommonRouter } from "../router/common.router";
import { SearchRouter } from "../router/search.router";
import { UserRouter } from "../router/users.router";
import { CategoriesRouter } from "../router/categories.router";
import { CoursesRouter } from "../router/courses.router";
import { AuthRouter } from "../router/auth.router";
import { QuizRouter } from "../router/quiz.router";
import { TutorGroupRouter } from "../router/tutor-group.router";
import { TutorPostRouter } from "../router/tutor-post.router";
import { AuthService } from "../service/auth.service";
import { AppConstant } from "./constants";
import { isSuccessHttpCode } from "../../../pana-tutor-lib/util/common-helper";
import { ErrorCode,ErrorMessage } from "../../../pana-tutor-lib/enum/constants";
import { isEmpty } from "lodash";
import { ExpressConfig } from "./express-config";

export class RouteConfig extends ExpressConfig {

    @Inject
    private authService: AuthService;
    @Inject
    private userRouter: UserRouter;
    @Inject
    private authRouter: AuthRouter;
    @Inject
    private coursesRouter: CoursesRouter;
    @Inject
    private categoriesRouter: CategoriesRouter;
    @Inject
    private commonRouter: CommonRouter;
    @Inject
    private quizRouter: QuizRouter;
    @Inject
    private searchRouter: SearchRouter;
    @Inject
    private tutorGroupRouter: TutorGroupRouter;
    @Inject
    private tutorPostRouter: TutorPostRouter;

    public constructor() {
        super();
        this.initApp();
        this.configureRoutes();
        this.configureErrorhandler();
    }

    protected configureRoutes() {
        this._app.use(`${AppConstant.SERVER_SUB_DIR}/`,this.commonRouter.index);
        this._app.use(`${AppConstant.SERVER_SUB_DIR}/auth`,this.authRouter.baseRouter);
        this._app.use(`${AppConstant.SERVER_SUB_DIR}/search`,this.searchRouter.index);
        this._app.use(`${AppConstant.SERVER_SUB_DIR}/categories`,this.categoriesRouter.getCategories);
        this._app.use(`${AppConstant.SERVER_SUB_DIR}/users`,this.validateToken,this.userRouter.index);
        this._app.use(`${AppConstant.SERVER_SUB_DIR}/courses`,this.validateToken,this.coursesRouter.index);
        this._app.use(`${AppConstant.SERVER_SUB_DIR}/quiz`,this.validateToken,this.quizRouter.index);
        this._app.use(`${AppConstant.SERVER_SUB_DIR}/tutor-groups`,this.validateToken,this.tutorGroupRouter.index);
        this._app.use(`${AppConstant.SERVER_SUB_DIR}/tutor-posts`,this.validateToken,this.tutorPostRouter.index);
        // this._app.all('*', this.validateToken);
      }

    validateToken = async (req, res, next) => {
        // if ( req.path == '/') return next();
        const token = req.headers.authorization ? req.headers.authorization.split(" ")[1]: "";
        console.log("#token validation:", token);
        if (!isEmpty(token)) {
            const tokenResp = await this.authService.validateToken(token);
            if (!isSuccessHttpCode(tokenResp.status)) {
                res.status(401).json({
                    code: ErrorCode.INVALID_AUTH,
                    message: tokenResp.message,
                });
            } else {
                const userId = await this.authService.getUserIdFromToken(token);
                global.userId = userId;
                next();
            }
        } else {
            res.status(401).json({
            code: ErrorCode.INVALID_AUTH,
            message: ErrorMessage.UNAUTHORIZED,
          });
        }
    };

    private configureErrorhandler() {
        // catch 404 and forward to error handler
        this._app.use((req, res, next) => {
            // next(createError(404));
            res.status(404);
            res.send("Not Found!");
        });
        this._app.use((err, req, res, next) => {
            err.httpStatus = err.httpStatus || 500;
            res.status(err.httpStatus).json({
            code: err.code,
            message: err.message,
            detail: err.detail ? err.detail : "",
            });
        });
    }

}
