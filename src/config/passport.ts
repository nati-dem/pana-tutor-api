var GoogleStrategy = require("passport-google-oauth20").Strategy;
// import { GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import { DS } from "../dao/data-source";
import { UserSignupRequest } from "../../../pana-tutor-lib/model/user/user-auth.interface";
import { profile } from "console";
import { UserService } from "../service/user.service";
import { UserDAO } from "../dao/user.dao";
import { result } from "lodash";

// module.exports = function (passport) {
passport.use(
  new GoogleStrategy(
    {
      clientID:
        "613115898435-j6e7rm0suoqkevp805v0v6e5fudifhad.apps.googleusercontent.com",
      clientSecret: "KwxGSy-PO60hlY-2qCtzxsUK",
      callbackURL: "/dev/api/auth/google/callback",
    },
    async (accesseToken, refreshTokent, profile, done) => {
      console.log("profile from api", profile);
      console.log("accesToken", accesseToken);
      //   const user = new UserDAO();

      //   const newUser: UserSignupRequest = {
      //     name: profile.displayName,
      //     first_name: profile.name.givenName,
      //     email: profile.emails,
      //     // password: profile.password,
      //     // primary_role: profile.role,
      //     // roles: profile.roles,
      //   };

      //   await user.saveUser(newUser).then((data) => {
      //     console.log(data);
      //   });
    }
  )
);
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  var user = new UserDAO();
  user.getUserById(id);
  console.log(user);
});
// };
