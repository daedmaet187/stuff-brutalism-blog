'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const form = new FormData(e.currentTarget);
    const email = form.get('email');
    const password = form.get('password');
    
    try {
      const res = await fetch('http://localhost:3005/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        document.cookie = `access_token=${data.access_token}; path=/; max-age=86400`;
        router.push('/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed');
    }
  }

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
       <div className="max-w-md w-full bg-white border-4 border-black shadow-[8px_8px_0px_0px_black] p-8 -rotate-1 hover:rotate-0 transition-transform">
          <h1 className="text-4xl font-black uppercase mb-6 text-center border-b-4 border-black pb-4">Login</h1>
          {error && <div className="bg-destructive text-white p-3 font-bold uppercase mb-4 border-2 border-black animate-pulse">{error}</div>}
          <form onSubmit={onSubmit} className="space-y-6">
             <div className="space-y-2">
                <Label className="font-bold uppercase tracking-wider">Email (Username)</Label>
                <Input name="email" type="email" defaultValue="admin@admin.com" className="border-4 border-black shadow-[4px_4px_0px_0px_black] h-14 font-medium text-lg focus-visible:ring-0 focus-visible:translate-x-1 focus-visible:translate-y-1 focus-visible:shadow-none transition-all" />
             </div>
             <div className="space-y-2">
                <Label className="font-bold uppercase tracking-wider">Password</Label>
                <Input name="password" type="password" defaultValue="admin" className="border-4 border-black shadow-[4px_4px_0px_0px_black] h-14 font-medium text-lg focus-visible:ring-0 focus-visible:translate-x-1 focus-visible:translate-y-1 focus-visible:shadow-none transition-all" />
             </div>
             <Button type="submit" className="w-full h-14 text-lg mt-8 bg-primary">
                AUTHENTICATE
             </Button>
          </form>
          <div className="mt-8 text-center border-t-4 border-black pt-4">
             <a href="/" className="font-bold uppercase text-sm hover:bg-black hover:text-white px-2 py-1 transition-colors">← Back to Site</a>
          </div>
       </div>
    </div>
  )
}
