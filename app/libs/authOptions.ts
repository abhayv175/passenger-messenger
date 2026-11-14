import bcrypt from "bcrypt";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import prisma from "@/app/libs/prismadb";

const providers: AuthOptions["providers"] = [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    allowDangerousEmailAccountLinking: true,
  }),
  CredentialsProvider({
    name: "credentials",
    credentials: {
      email: { label: "email", type: "text" },
      password: { label: "password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        throw new Error("Invalid Credentials");
      }

      const cleanEmail = credentials.email.trim();

      const user = await prisma.user.findFirst({
        where: {
          email: { equals: cleanEmail, mode: "insensitive" },
        },
      });

      if (!user || !user?.hashedPassword) {
        throw new Error("Invalid credentials");
      }

      const isCorrectPassword = await bcrypt.compare(
        credentials.password,
        user.hashedPassword
      );

      if (!isCorrectPassword) {
        throw new Error("Invalid credentials");
      }

      return user;
    },
  }),
];

if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
  providers.unshift(
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      allowDangerousEmailAccountLinking: true,
    })
  );
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers,
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      try {
        const urlObj = new URL(url);
        if (
          urlObj.origin === baseUrl ||
          urlObj.hostname === "localhost" ||
          urlObj.hostname === "127.0.0.1"
        ) {
          return url;
        }
      } catch {
        // invalid URL
      }
      return `${baseUrl}/conversations`;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
