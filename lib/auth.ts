import { NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';

// Only emails/usernames in this list can ever get an "editor" role.
// Move this to a database table if your editor team grows past a few people.
const EDITORS = (process.env.EDITOR_ALLOWLIST || '')
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    // Runs on every sign-in and token refresh. Everyone can sign in
    // (e.g. to track their own progress later), but only allow-listed
    // users get role "editor". Everyone else gets "reader".
    async jwt({ token, profile }) {
      const login = ((profile as any)?.login || token.email || '').toLowerCase();
      token.role = EDITORS.includes(login) ? 'editor' : 'reader';
      return token;
    },
    async session({ session, token }) {
      (session.user as any).role = token.role;
      return session;
    },
  },
  pages: {
    signIn: '/cloud-native-development/studio/signin',
  },
};
