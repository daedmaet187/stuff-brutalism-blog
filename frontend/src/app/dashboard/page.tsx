'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function PostSkeleton() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 border-4 border-black bg-muted animate-pulse gap-4">
      <div className="flex-1 space-y-3">
        <div className="h-7 bg-black/10 w-2/3" />
        <div className="h-4 bg-black/10 w-1/3" />
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-black/10" />
          <div className="h-5 w-16 bg-black/10" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="h-10 w-20 bg-black/10" />
        <div className="h-10 w-20 bg-black/10" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('access_token='))?.split('=')[1];
      if (!token) { window.location.href = '/login'; return; }
      const res = await fetch('http://localhost:3005/api/posts?all=true', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) { window.location.href = '/login'; return; }
      const data = await res.json();
      setPosts(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id: number) => {
    if (!confirm('Delete this post? This cannot be undone.')) return;
    const token = document.cookie.split('; ').find(row => row.startsWith('access_token='))?.split('=')[1];
    await fetch(`http://localhost:3005/api/posts/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchPosts();
  };

  const publishedPosts = posts.filter(p => p.published);
  const draftPosts = posts.filter(p => !p.published);

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-4 border-black pb-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">Posts</h1>
          <p className="font-bold text-muted-foreground uppercase text-sm mt-1">Manage your content</p>
        </div>
        <Link href="/dashboard/posts/new">
          <Button className="font-black uppercase border-4 border-black shadow-[4px_4px_0px_0px_black] hover:shadow-[6px_6px_0px_0px_black] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all text-base h-12 px-6">
            + New Post
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total', value: posts.length, color: 'bg-primary text-primary-foreground' },
          { label: 'Published', value: publishedPosts.length, color: 'bg-[#00ff00] text-black' },
          { label: 'Drafts', value: draftPosts.length, color: 'bg-secondary text-secondary-foreground' },
        ].map(stat => (
          <div key={stat.label} className={`${stat.color} border-4 border-black shadow-[4px_4px_0px_0px_black] p-5`}>
            <div className="text-4xl font-black">{loading ? '—' : stat.value}</div>
            <div className="font-black uppercase text-sm mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Post list */}
      <div className="space-y-4">
        {loading ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 border-4 border-black bg-muted shadow-[4px_4px_0px_0px_black]">
            <p className="text-3xl font-black uppercase mb-3">No posts yet</p>
            <p className="font-bold text-muted-foreground">Hit "New Post" to get started.</p>
          </div>
        ) : (
          posts.map((post: any) => (
            <div key={post.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 border-4 border-black bg-card shadow-[4px_4px_0px_0px_black] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_black] transition-all gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h2 className="text-xl font-black uppercase truncate">{post.title}</h2>
                  <span className={`text-xs font-black uppercase px-2 py-0.5 border-2 border-black flex-shrink-0 ${post.published ? 'bg-[#00ff00] text-black' : 'bg-destructive text-white'}`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div className="text-xs font-bold uppercase text-muted-foreground mb-3">
                  {new Date(post.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  {post.category?.name && <> · {post.category.name}</>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags?.map((tag: any) => (
                    <span key={tag.id} className="text-[10px] uppercase font-black bg-accent text-accent-foreground border border-black px-2 py-0.5">#{tag.name}</span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 flex-shrink-0">
                <Link href={`/dashboard/posts/${post.id}/edit`}>
                  <Button variant="outline" className="font-black uppercase border-2 border-black h-10 px-4">
                    Edit
                  </Button>
                </Link>
                <Link href={`/blog/${post.slug}`} target="_blank">
                  <Button variant="outline" className="font-black uppercase border-2 border-black h-10 px-4">
                    View ↗
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  onClick={() => deletePost(post.id)}
                  className="font-black uppercase border-2 border-black h-10 px-4"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
