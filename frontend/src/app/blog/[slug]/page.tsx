import Link from 'next/link';
import { notFound } from 'next/navigation';
import MarkdownViewer from '@/components/markdown-viewer';

function readingTime(content: string) {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Fetch the specific post
  const res = await fetch(`http://localhost:3005/api/posts/${slug}`, { cache: 'no-store' }).catch(() => null);
  const post = res && res.ok ? await res.json() : null;

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-20 text-center font-sans">
        <h1 className="text-4xl font-black uppercase mb-4 text-foreground">Post not found</h1>
        <Link href="/" className="text-primary hover:bg-black hover:text-white font-bold uppercase border-4 border-black px-6 py-3 shadow-[4px_4px_0px_0px_black] hover:shadow-[6px_6px_0px_0px_black] hover:-translate-x-0.5 hover:-translate-y-0.5 inline-block transition-all">Return Home</Link>
      </div>
    );
  }

  // Fetch all posts to find related ones based on shared tags
  const allPostsRes = await fetch('http://localhost:3005/api/posts', { cache: 'no-store' }).catch(() => null);
  const allPosts = allPostsRes && allPostsRes.ok ? await allPostsRes.json() : [];
  
  // Find related posts (exclude current post)
  const currentTagNames = post.tags?.map((t: any) => t.name) || [];
  const relatedPosts = allPosts
    .filter((p: any) => p.id !== post.id && p.tags?.some((t: any) => currentTagNames.includes(t.name)))
    .slice(0, 3); // Take top 3

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Sticky Top Nav */}
      <header className="border-b-4 border-black bg-secondary sticky top-0 z-50">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between max-w-4xl">
          <Link href="/" className="text-xl font-black uppercase tracking-tighter hover:scale-105 transition-transform origin-left">
            stuff
          </Link>
          <div className="flex gap-4 items-center">
             <span className="hidden sm:inline text-xs font-black uppercase text-muted-foreground truncate max-w-[200px]">{post.title}</span>
             <Link href="/" className="text-xs font-black uppercase px-3 py-1.5 border-2 border-transparent hover:border-black hover:bg-black hover:text-white transition-colors">
               Home
             </Link>
          </div>
        </div>
      </header>

      <article className="container mx-auto px-4 max-w-3xl pt-16 pb-20">
        <div className="flex flex-wrap gap-2 mb-8">
          <span className="text-xs font-black uppercase px-3 py-1 bg-accent text-accent-foreground border-2 border-black shadow-[3px_3px_0px_0px_black]">
             {post.category?.name || 'Uncategorized'}
          </span>
          {post.tags?.map((tag: any) => (
             <span key={tag.id} className="text-xs font-black uppercase px-3 py-1 bg-white border-2 border-black shadow-[3px_3px_0px_0px_black]">
               #{tag.name}
             </span>
          ))}
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-8 border-b-8 border-black pb-8 text-foreground break-words relative">
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-black"></div>
          {post.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 border-b-4 border-black pb-6 mb-16 uppercase font-bold text-sm">
           <span className="bg-primary text-primary-foreground border-2 border-black px-4 py-1.5 shadow-[3px_3px_0px_0px_black]">{post.author?.name || 'Anonymous'}</span>
           <span className="bg-secondary text-secondary-foreground px-4 py-1.5 border-2 border-black shadow-[3px_3px_0px_0px_black]">{new Date(post.createdAt).toLocaleDateString()}</span>
           <span className="bg-muted text-foreground px-4 py-1.5 border-2 border-black shadow-[3px_3px_0px_0px_black]">{readingTime(post.content)} min read</span>
           {post.published && <span className="bg-[#00ff00] text-black px-4 py-1.5 border-2 border-black shadow-[3px_3px_0px_0px_black] ml-auto">PUBLISHED</span>}
        </div>
        
        {/* Markdown Content */}
        <div className="prose prose-lg prose-black max-w-none text-xl leading-relaxed text-foreground prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-a:font-bold prose-a:underline prose-a:decoration-4 prose-a:underline-offset-4 hover:prose-a:bg-primary hover:prose-a:text-primary-foreground">
           <MarkdownViewer source={post.content} />
        </div>
        
        <div className="mt-24 pt-12 border-t-8 border-black">
            <Link href="/" className="font-black uppercase text-2xl hover:translate-x-2 transition-transform inline-flex items-center gap-3 hover:underline decoration-4 underline-offset-4">
                 ← Back to Surface
            </Link>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-24 pt-12 border-t-8 border-black">
            <h3 className="text-4xl font-black uppercase mb-8">Related Material</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((related: any) => (
                <Link href={`/blog/${related.slug}`} key={related.id} className="group block bg-card border-4 border-black p-5 shadow-[4px_4px_0px_0px_black] hover:shadow-[6px_6px_0px_0px_black] hover:-translate-y-1 transition-all">
                  <h4 className="font-black uppercase text-xl leading-tight mb-3 group-hover:underline decoration-4 underline-offset-2">{related.title}</h4>
                  <div className="flex gap-2 text-xs font-bold uppercase text-muted-foreground">
                    <span>{new Date(related.createdAt).toLocaleDateString()}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
      
      {/* Footer */}
      <footer className="border-t-4 border-black bg-foreground text-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl flex justify-between items-center">
          <p className="font-black uppercase tracking-tighter">stuff</p>
          <button 
            onClick={() => {
              'use client';
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
            className="text-xs font-black uppercase hover:underline cursor-pointer"
          >
            ↑ Back to Top
          </button>
        </div>
      </footer>
    </div>
  );
}
