import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy, Profile, StrategyOptions, VerifyCallback } from "passport-google-oauth20";

import IUser from "../interfaces/user-interface";
import * as userService from "../services/user-service";

dotenv.config();

async function verify(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<void> {
  const email: string = profile?.emails?.[0].value || "";
  const firstName: string = profile?.name?.givenName || "";
  const lastName: string = profile?.name?.familyName || "";

  let existingUser: IUser | null = await userService.getByEmail(email);

  if (!existingUser) {
    return done(null, { email: email, firstName: firstName, lastName: lastName });
  }

  return done(null, existingUser);
}

const strategyOptions: StrategyOptions = {
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: process.env.GOOGLE_CALLBACK!,
};

const googleStrategy: GoogleStrategy = new GoogleStrategy(strategyOptions, verify);

export function start(): void {
  passport.use(googleStrategy);
}
