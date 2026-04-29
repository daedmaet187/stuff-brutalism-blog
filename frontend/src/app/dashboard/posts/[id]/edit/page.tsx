'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MarkdownEditor from '@/components/markdown-editor';

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [published, setPublished] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = document.cookie.split('; ').find(r => r.startsWith('access_token='))?.split('=')[1];
    if (!token) { router.push('/login'); return; }

    // We load by numeric id — fetch all posts and find match
    fetch('http://localhost:3005/api/posts?all=true', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then((posts: any[]) => {
        const post = posts.find((p: any) => String(p.id) === id);
        if (!post) { setError('Post not found'); return; }
        setTitle(post.title || '');
        setContent(post.content || '');
        setTagsInput(post.tags?.map((t: any) => t.name).join(', ') || '');
        setPublished(post.published || false);
      })
      .catch(() => setError('Failed to load post'))
      .finally(() => setFetching(false));
  }, [id, router]);

  const handleSubmit = async (publishedState: boolean) => {
    setLoading(true);
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const token = document.cookie.split('; ').find(r => r.startsWith('access_token='))?.split('=')[1];

    try {
      const res = await fetch(`http://localhost:3005/api/posts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, published: publishedState, tags }),
      });

      if (res.status === 401) { router.push('/login'); return; }
      if (!res.ok) { setError('Failed to update post'); setLoading(false); return; }
      router.push('/dashboard');
    } catch {
      setError('Failed to update post');
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="p-8 max-w-4xl">
        <div className="h-12 w-64 bg-muted border-4 border-black animate-pulse mb-8" />
        <div className="h-14 w-full bg-muted border-4 border-black animate-pulse mb-6" />
        <div className="h-96 w-full bg-muted border-4 border-black animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <p className="text-destructive font-black text-2xl uppercase border-4 border-destructive p-4">{error}</p>
        <Button onClick={() => router.push('/dashboard')} className="mt-4 font-black uppercase">← Back to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="p-0">
      <h1 className="text-4xl font-black uppercase mb-8 border-b-4 border-black pb-4 inline-block">
        Edit Post
      </h1>

      <div className="max-w-4xl space-y-8">
        <div className="space-y-2">
          <Label htmlFor="title" className="font-bold uppercase text-lg">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className="border-4 border-black shadow-[4px_4px_0px_0px_black] text-lg h-14 font-black"
          />
        </div>

        <div className="space-y-4">
          <Label className="font-bold uppercase text-lg">Content (Markdown)</Label>
          <MarkdownEditor value={content} onChange={setContent} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags" className="font-bold uppercase text-lg">Tags (comma separated)</Label>
          <Input
            id="tags"
            value={tagsInput}
            onChange={e => setTagsInput(e.target.value)}
            placeholder="tech, news, web"
            className="border-4 border-black shadow-[4px_4px_0px_0px_black] text-lg h-14"
          />
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-4 p-4 border-4 border-black bg-muted">
          <span className="font-black uppercase text-sm">Current status:</span>
          <span className={`px-3 py-1 border-2 border-black font-black uppercase text-sm ${published ? 'bg-[#00ff00] text-black' : 'bg-destructive text-white'}`}>
            {published ? 'Published' : 'Draft'}
          </span>
        </div>

        <div className="flex flex-wrap gap-4 pt-8 border-t-4 border-black mt-4 justify-end">
          <Button
            variant="outline"
            disabled={loading}
            className="h-12 px-8 font-black uppercase text-lg border-4 border-black shadow-[4px_4px_0px_0px_black]"
            onClick={() => router.push('/dashboard')}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={loading}
            variant="outline"
            className="h-12 px-8 font-black uppercase text-lg border-4 border-black shadow-[4px_4px_0px_0px_black]"
            onClick={() => handleSubmit(false)}
          >
            {loading ? 'Saving...' : 'Save as Draft'}
          </Button>
          <Button
            type="button"
            disabled={loading}
            className="h-12 px-8 font-black uppercase text-lg border-4 border-black shadow-[4px_4px_0px_0px_black]"
            onClick={() => handleSubmit(true)}
          >
            {loading ? 'Saving...' : published ? 'Update & Publish' : 'Publish Now'}
          </Button>
        </div>
      </div>
    </div>
  );
}
