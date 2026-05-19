'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { GraduationCap, Globe, Mail, Loader2, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        callbackUrl: '/dashboard',
        redirect: true,
      });
      if (result?.error) {
        setError('Invalid login credentials. Please try again.');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setOauthLoading(true);
    signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4 overflow-hidden bg-neutral-950">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] translate-x-1/2 translate-y-1/2 rounded-full bg-teal-500/10 blur-[120px]" />

      <Card className="relative z-10 w-full max-w-md border-neutral-800 bg-neutral-900/50 backdrop-blur-lg shadow-2xl p-4 sm:p-6">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4 shadow-inner">
            <GraduationCap className="h-7 w-7" />
          </div>
          <CardTitle className="text-2xl font-extrabold text-white tracking-tight">Welcome to EduAgent AI</CardTitle>
          <CardDescription className="text-neutral-450 mt-1.5 text-xs">
            Your personalised AI Tutor. Learn from PDFs or academic topics.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-0">
          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-center text-xs font-semibold text-red-400">
              {error}
            </div>
          )}

          {/* Credentials Form */}
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-450 uppercase tracking-widest">Email Address</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@eduagent.ai"
                required
                className="bg-neutral-950 border-neutral-850 h-10 placeholder:text-neutral-600"
                disabled={loading || oauthLoading}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-450 uppercase tracking-widest">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-neutral-950 border-neutral-850 h-10"
                disabled={loading || oauthLoading}
              />
            </div>

            <Button
              type="submit"
              disabled={loading || oauthLoading || !email || !password}
              className="w-full h-11 font-semibold mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying account...
                </>
              ) : (
                <>
                  Access Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center py-2.5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-850" />
            </div>
            <span className="relative z-10 bg-neutral-900 px-3 text-[9px] font-bold text-neutral-500 uppercase tracking-widest">
              or continue with
            </span>
          </div>

          {/* Google OAuth Login */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignIn}
            disabled={loading || oauthLoading}
            className="w-full h-11 border-neutral-800 hover:bg-neutral-800 text-neutral-200 font-semibold"
          >
            {oauthLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin text-emerald-400" />
            ) : (
              <Globe className="mr-2 h-4 w-4 text-neutral-450 group-hover:text-white" />
            )}
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
