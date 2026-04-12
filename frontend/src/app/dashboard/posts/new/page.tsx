'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MarkdownEditor from '@/components/markdown-editor';

export default function NewPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>, published: boolean) => {
    e.preventDefault();
    setLoading(true);
    const formElement = document.getElementById('post-form') as HTMLFormElement;
    const formData = new FormData(formElement);
    const tags = tagsInput.split(',').map(tag => tag.trim()).filter(Boolean);
    const data = {
      title: formData.get('title'),
      content,
      categoryId: 1,
      authorId: 1,
      published,
      tags
    };
    
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('access_token='))?.split('=')[1];
      const res = await fetch('http://localhost:3005/api/posts', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(data),
      });
      if (res.status === 401) {
         window.location.href = "/login";
         return;
      }
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-black uppercase mb-8 border-b-4 border-black pb-4 inline-block">Create New Story</h1>
      
      <form onSubmit={(e) => e.preventDefault()} id="post-form" className="max-w-4xl space-y-8">
        <div className="space-y-2">
          <Label htmlFor="title" className="font-bold uppercase text-lg">Title</Label>
          <Input id="title" name="title" required className="border-4 border-black shadow-[4px_4px_0px_0px_black] text-lg h-14 font-black" />
        </div>

        <div className="space-y-4">
          <Label className="font-bold uppercase text-lg">Content (Markdown Editor)</Label>
          <MarkdownEditor value={content} onChange={setContent} />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tags" className="font-bold uppercase text-lg mt-6">Tags (comma separated)</Label>
          <Input id="tags" value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="tech, news, web" className="border-4 border-black shadow-[4px_4px_0px_0px_black] text-lg h-14" />
        </div>

        <div className="flex gap-4 pt-8 border-t-4 border-black mt-12 w-full justify-end">
          <Button 
            type="button" 
            disabled={loading} 
            variant="outline" 
            className="h-12 px-8 font-black uppercase text-lg"
            onClick={(e) => handleSubmit(e as any, false)}
          >
            Save Draft
          </Button>
          <Button 
            type="button" 
            disabled={loading} 
            className="h-12 px-8 font-black uppercase text-lg border-2 border-black"
            onClick={(e) => handleSubmit(e as any, true)}
          >
            Publish Now!
          </Button>
        </div>
      </form>
    </div>
  );
}
