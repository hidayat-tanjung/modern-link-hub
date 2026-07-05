// Adding Google and GitHub OAuth providers

import { convexAuth } from "@convex-dev/auth/server";
import { Anonymous } from "@convex-dev/auth/providers/Anonymous";
import Google from "@auth/core/providers/google";
import GitHub from "@auth/core/providers/github";
import { emailOtp } from "./auth/emailOtp";


export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Google, GitHub, emailOtp, Anonymous],
});