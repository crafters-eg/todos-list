import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      authorization: {
        params: {
          scope: 'read:user user:email',
        },
      },
    }),
  ],
  // You can add custom pages for sign in, sign out, etc.
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin', // Error code passed in query string as ?error=
  },
  callbacks: {
    async session({ session, token }: any) {
      // Send properties to the client, like user ID from a provider
      if (token && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Enable debug logs
}; 