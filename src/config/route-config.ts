import { Inject } from "typescript-ioc";
import { CommonRouter } from "../router/common.router";
import { SearchRouter } from "../router/search.router";
import { UsersProfileRouter } from "../router/users-profile.router";
import { CategoriesRouter } from "../router/categories.router";
import { CoursesRouter } from "../router/courses.router";
import { AuthRouter } from "../router/auth.router";
import { QuizRouter } from "../router/quiz.router";
import { TutorGroupRouter } from "../router/tutor-group.router";
import { TutorPostRouter } from "../router/tutor-post.router";
import { TutorAdminRouter } from "../router/tutor-admin.router";
import { ContactusRouter } from "../router/contact-us.router";
import { AuthService } from "../service/auth.service";
import { AppConstant } from "./constants";
import {
  ErrorCode,
  ErrorMessage,
} from "../../../pana-tutor-lib/enum/constants";
import { isEmpty } from "lodash";
import { ExpressConfig } from "./express-config";
import { TutorBookingRouter } from "../router/tutor-booking.router";
import { PaymentRouter } from "../router/payment.router";
const jwtDecode = require("jwt-decode");

export class RouteConfig extends ExpressConfig {
  @Inject
  private authService: AuthService;
  @Inject
  private userRouter: UsersProfileRouter;
  @Inject
  private contactusRouter: ContactusRouter;
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
  @Inject
  private tutorAdminRouter: TutorAdminRouter;
  @Inject
  private tutorBookingRouter: TutorBookingRouter;
  @Inject
  private paymentRouter: PaymentRouter;

  public constructor() {
    super();
    this.initApp();
    this.configureRoutes();
    this.configureErrorhandler();
  }

  protected configureRoutes() {
    this._app.use(`${AppConstant.SERVER_SUB_DIR}/`, this.commonRouter.index);
    this._app.use(
      `${AppConstant.SERVER_SUB_DIR}/auth`,
      this.authRouter.baseRouter
    );
    this._app.use(
      `${AppConstant.SERVER_SUB_DIR}/search`,
      this.searchRouter.index
    );
    this._app.use(
      `${AppConstant.SERVER_SUB_DIR}/contactus`,
      this.contactusRouter.saveMessage
    );
    this._app.use(
      `${AppConstant.SERVER_SUB_DIR}/categories`,
      this.categoriesRouter.getCategories
    );
    this._app.use(
      `${AppConstant.SERVER_SUB_DIR}/users`,
      this.validateToken,
      this.userRouter.index
    );
    this._app.use(
      `${AppConstant.SERVER_SUB_DIR}/courses`,
      this.validateToken,
      this.coursesRouter.index
    );
    this._app.use(
      `${AppConstant.SERVER_SUB_DIR}/quiz`,
      this.validateToken,
      this.quizRouter.index
    );
    this._app.use(
      `${AppConstant.SERVER_SUB_DIR}/tutor-groups`,
      this.validateToken,
      this.tutorGroupRouter.index
    );
    this._app.use(
      `${AppConstant.SERVER_SUB_DIR}/tutor-posts`,
      this.validateToken,
      this.tutorPostRouter.index
    );
    this._app.use(
      `${AppConstant.SERVER_SUB_DIR}/tutor-admin`,
      this.validateToken,
      this.tutorAdminRouter.index
    );
    this._app.use(`${AppConstant.SERVER_SUB_DIR}/tutor-booking`,this.validateToken,this.tutorBookingRouter.index);
    this._app.use(`${AppConstant.SERVER_SUB_DIR}/payment`,this.validateToken,this.paymentRouter.index);
    // this._app.all('*', this.validateToken);
  }

  validateToken = async (req, res, next) => {
    // if ( req.path == '/') return next();
    try {
        const token = req.headers.authorization ? req.headers.authorization.split(" ")[1]: null;
        console.log("@token validation middleware:", token);
        if (token && !isEmpty(token)) {
            const decoded = jwtDecode(token);
            const userId = decoded.data.user.id;
            const isTokenValid = await this.authService.isTokenValid(token, userId);
            if (!isTokenValid) {
                res.status(401).json({
                    code: ErrorCode.INVALID_AUTH,
                    message: ErrorMessage.INVALID_AUTH_TOKEN,
                });
            } else {
                global.userId = userId;
                next();
            }
        } else {
            throw new Error("Unauthorized");
        }
    } catch(e){
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
