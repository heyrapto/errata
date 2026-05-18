import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getUserByEmail, upsertUser } from '../db/users';

export const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'dummy-google-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy-google-client-secret',
    }),
    // Credentials provider for simple email/password demo logins
    CredentialsProvider({
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'student@eduagent.ai' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Mock verification - in production, check password hashes in Supabase
        const email = credentials.email.toLowerCase();
        let user = await getUserByEmail(email);

        if (!user) {
          // Auto-register during development
          user = await upsertUser({
            id: crypto.randomUUID(),
            email: email,
            name: email.split('@')[0],
            avatar_url: `https://api.dicebear.com/7.x/adventurer/svg?seed=${email}`,
          });
        }

        if (user) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.avatar_url,
          };
        }
        
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (user.email) {
        // Ensure user is synced with PostgreSQL 'users' table
        await upsertUser({
          id: user.id,
          email: user.email,
          name: user.name || user.email.split('@')[0],
          avatar_url: user.image || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.email}`,
        });
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'super-secret-dev-key',
  pages: {
    signIn: '/login',
    error: '/login',
  },
};
