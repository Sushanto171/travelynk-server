import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { BcryptHelper } from "../helpers/bcrypt.helper";
import { Provider, UserRole, UserStatus } from './../../generated/prisma/enums';
import { prisma } from "./prisma.config";

passport.use(
  new LocalStrategy(
    {
      session: false,
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        const user = await prisma.user.findFirst({
          where: {
            email,
            status: UserStatus.ACTIVE
          },
          include: {
            traveler: {
              select: {
                id: true,
              }
            },
            admin: {
              select: {
                id: true,
              }
            },
            auths: {
              select: {
                auth_providers: true,
              },
            },
          },
        });

        if (!user) {
          return done("Invalid email or password");
        }

        if (user.is_deleted) {
          return done("Your account is temporary deleted");
        }

        console.log({ user });
        if (!user.is_verified) {
          return done(["User is not verified", user.email],)
        }

        const hasCredentialProvider = user.auths.some(
          ({ auth_providers }) => auth_providers.provider === Provider.CREDENTIALS
        );

        if (!hasCredentialProvider || !user.password) {
          return done("This account uses Google login. Set a password first.");
        }

        const isMatch = await BcryptHelper.comparePassword(password, user.password);

        if (!isMatch) {
          return done("Invalid email or password");
        }
        const userData = {
          id: "",
          email: user.email,
          role: user.role,
        }
        switch (user.role) {
          case UserRole.ADMIN:
            userData.id = user?.admin?.id as string
            break
          case UserRole.USER:
            userData.id = user?.traveler?.id as string
            break
        }

        return done(null, userData);

      } catch (error) {
        return done(error);
      }
    }
  )
);
