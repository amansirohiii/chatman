import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { NextAuthOptions } from "next-auth";
import { db } from "./db";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";

function getGithubProvider() {
  const clientId = process.env.GITHUB_CLIENT_ID || "";
  const clientSecret = process.env.GITHUB_CLIENT_SECRET || "";
  if (clientId === "" || clientSecret === "") {
    throw new Error("GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET must be set");
  }
  return { clientId, clientSecret };
}
function getGoogleProvider() {
  const clientId = process.env.GOOGLE_CLIENT_ID || "";
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
  if (clientId === "" || clientSecret === "") {
    throw new Error("GITHUB_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set");
  }
  return { clientId, clientSecret };
}
export const authOptions: NextAuthOptions = {
  adapter: UpstashRedisAdapter(db),
  providers: [
    Github({
      clientId: getGithubProvider().clientId,
      clientSecret: getGithubProvider().clientSecret,
    }),
    Google({
      clientId: getGoogleProvider().clientId,
      clientSecret: getGoogleProvider().clientSecret,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      const dbUser = (await db.get(`user:${user.id}`)) as User | null;
      if (!dbUser) {
        token.id = user!.id;
        return token;
      }
      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      };
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }
      return session;
    },
    redirect() {
      return "/dashboard";
    },
  },
};
