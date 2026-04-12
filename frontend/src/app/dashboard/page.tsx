'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function DashboardPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('access_token='))?.split('=')[1];
      if (!token) {
        window.location.href = '/login';
        return;
      }
      const res = await fetch('http://localhost:3005/api/posts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) {
         window.location.href = '/login';
         return;
      }
      const data = await res.json();
      setPosts(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('access_token='))?.split('=')[1];
      await fetch(`http://localhost:3005/api/posts/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchPosts();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Posts Analytics</h1>
          <p className="text-muted-foreground mt-1">Manage your blog content and performance.</p>
        </div>
        <Link href="/dashboard/posts/new">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Create New Post</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
          <CardDescription>A list of all your published articles.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading posts...</div>
            ) : posts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No posts found. Create one!</div>
            ) : (
              posts.map((post: any) => (
                <Card key={post.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 border-b-4 bg-muted border-black hover:-translate-y-1 transition-transform">
                  <div>
                    <CardTitle className="text-2xl font-black uppercase mb-2 flex items-center gap-3">
                      {post.title}
                      {post.published ? (
                        <span className="bg-primary text-primary-foreground text-xs px-2 py-1 border-2 border-black">PUBLIC</span>
                      ) : (
                        <span className="bg-destructive text-primary-foreground text-xs px-2 py-1 border-2 border-black">DRAFT</span>
                      )}
                    </CardTitle>
                    <div className="text-sm font-bold uppercase mb-2 space-x-2">
                      <span>{post.category?.name || 'Uncategorized'}</span>
                      <span>•</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {post.tags?.map((tag: any) => (
                         <span key={tag.id} className="text-[10px] uppercase font-black bg-white border border-black px-2 py-0.5">#{tag.name}</span>
                      ))}
                    </div>
                  </div>
                  <Button variant="destructive" onClick={() => deletePost(post.id)} className="mt-4 md:mt-0 px-6 font-black uppercase">
                     DELETE
                  </Button>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
