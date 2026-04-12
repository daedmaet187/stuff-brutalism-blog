import Link from 'next/link';
import { notFound } from 'next/navigation';
import MarkdownViewer from '@/components/markdown-viewer';

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const res = await fetch(`http://localhost:3005/api/posts/${slug}`, { cache: 'no-store' }).catch(() => null);
  const post = res && res.ok ? await res.json() : null;

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-20 text-center font-sans">
        <h1 className="text-4xl font-black uppercase mb-4 text-foreground">Post not found</h1>
        <Link href="/" className="text-primary hover:bg-black hover:text-white font-bold uppercase border-2 border-black px-4 py-2 shadow-brutal inline-block transition-colors">Return Home</Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-background font-sans pt-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags?.map((tag: any) => (
             <span key={tag.id} className="text-xs font-black uppercase px-3 py-1 bg-white border-2 border-black shadow-[4px_4px_0_0_black]">
               #{tag.name}
             </span>
          ))}
          {(!post.tags || post.tags.length === 0) && (
             <span className="text-xs font-black uppercase px-3 py-1 bg-secondary border-2 border-black shadow-[4px_4px_0_0_black]">
               #{post.category?.name || 'Uncategorized'}
             </span>
          )}
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6 border-b-8 border-black pb-8 text-foreground break-words">
          {post.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 border-b-4 border-black pb-6 mb-12 uppercase font-bold text-sm">
           <span className="bg-primary text-primary-foreground border-2 border-black px-3 py-1 shadow-brutal">{post.author?.name}</span>
           <span className="bg-secondary text-secondary-foreground px-3 py-1 border-2 border-black shadow-brutal">{new Date(post.createdAt).toLocaleDateString()}</span>
           {post.published && <span className="bg-[#00ff00] text-black px-3 py-1 border-2 border-black shadow-brutal">PUBLISHED</span>}
        </div>
        
        <div className="prose prose-lg max-w-none text-xl leading-relaxed text-foreground">
           <MarkdownViewer source={post.content} />
        </div>
        
        <div className="mt-20 py-8 border-t-8 border-black flex justify-between items-center">
            <Link href="/" className="font-black uppercase text-xl hover:translate-x-2 transition-transform inline-flex items-center gap-2 hover:underline">
                 ← Back to Surface
            </Link>
        </div>
      </div>
    </article>
  );
}
