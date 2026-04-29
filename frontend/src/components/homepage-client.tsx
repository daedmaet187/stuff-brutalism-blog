'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';

type Tag = { id: number; name: string };
type Post = {
  id: number;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
  tags: Tag[];
  author?: { name: string };
  category?: { name: string };
};

function readingTime(content: string) {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function stripMarkdown(md: string) {
  return md
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\(.*?\)/g, '$1')
    .replace(/#{1,6}\s/g, '')
    .replace(/[*_`~]/g, '')
    .replace(/\n+/g, ' ')
    .trim();
}

export default function HomepageClient({ posts }: { posts: Post[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // Collect all unique tags
  const allTags = useMemo(() => {
    const tagMap = new Map<string, number>();
    posts.forEach(p => p.tags?.forEach(t => tagMap.set(t.name, (tagMap.get(t.name) || 0) + 1)));
    return Array.from(tagMap.entries()).sort((a, b) => b[1] - a[1]);
  }, [posts]);

  const filtered = activeTag
    ? posts.filter(p => p.tags?.some(t => t.name === activeTag))
    : posts;

  const [featured, ...rest] = filtered;

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Nav */}
      <header className="border-b-4 border-black bg-secondary sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-6xl">
          <Link href="/" className="text-2xl font-black uppercase tracking-tighter hover:scale-105 transition-transform origin-left">
            stuff
          </Link>
          <nav className="flex items-center gap-3">
            <Link href="/" className="text-sm font-black uppercase px-3 py-1.5 border-2 border-transparent hover:border-black hover:bg-black hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/dashboard" className="text-sm font-black uppercase bg-primary text-primary-foreground px-4 py-2 border-2 border-black shadow-[3px_3px_0px_0px_black] hover:shadow-[5px_5px_0px_0px_black] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
              Dashboard
            </Link>
            <Link href="/login" className="text-sm font-black uppercase bg-background px-4 py-2 border-2 border-black shadow-[3px_3px_0px_0px_black] hover:shadow-[5px_5px_0px_0px_black] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
              Login
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Hero */}
        <div className="mb-16 relative">
          <div className="bg-accent border-4 border-black shadow-[8px_8px_0px_0px_black] p-10 md:p-16 max-w-3xl transform -rotate-1 relative">
            <div className="absolute -top-5 -right-5 bg-primary text-primary-foreground font-black text-xs px-3 py-2 border-2 border-black rotate-12 shadow-[3px_3px_0px_0px_black] uppercase">
              RAW INSIGHTS!
            </div>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6">
              Digital<br />Frontier.
            </h1>
            <p className="text-lg font-bold leading-relaxed max-w-xl">
              Unfiltered, sharp, and brutally honest technology engineering tales.
            </p>
          </div>
        </div>

        {/* Tag filter */}
        {allTags.length > 0 && (
          <div className="mb-12 flex flex-wrap gap-2 items-center">
            <span className="font-black uppercase text-xs mr-2">Filter:</span>
            <button
              onClick={() => setActiveTag(null)}
              className={`text-xs font-black uppercase px-3 py-1.5 border-2 border-black transition-all ${!activeTag ? 'bg-black text-white shadow-[3px_3px_0px_0px_#888]' : 'bg-background hover:bg-black hover:text-white'}`}
            >
              All ({posts.length})
            </button>
            {allTags.map(([name, count]) => (
              <button
                key={name}
                onClick={() => setActiveTag(activeTag === name ? null : name)}
                className={`text-xs font-black uppercase px-3 py-1.5 border-2 border-black transition-all ${activeTag === name ? 'bg-black text-white shadow-[3px_3px_0px_0px_#888]' : 'bg-background hover:bg-black hover:text-white'}`}
              >
                #{name} ({count})
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20 border-4 border-black bg-muted shadow-[4px_4px_0px_0px_black]">
            <p className="text-3xl font-black uppercase mb-2">No posts found</p>
            <p className="font-bold text-muted-foreground">Try a different tag or check back later.</p>
          </div>
        )}

        {/* Featured post */}
        {featured && (
          <Link href={`/blog/${featured.slug}`} className="group block mb-12">
            <div className="border-4 border-black shadow-[6px_6px_0px_0px_black] hover:shadow-[10px_10px_0px_0px_black] hover:-translate-x-1 hover:-translate-y-1 transition-all bg-card flex flex-col md:flex-row overflow-hidden">
              {/* Left color block */}
              <div className="md:w-2/5 bg-primary border-r-4 border-black flex items-center justify-center p-10 min-h-[220px]">
                <span className="text-primary-foreground font-black text-5xl uppercase text-center leading-none break-words">
                  {featured.title.substring(0, 30)}
                </span>
              </div>
              {/* Content */}
              <div className="flex-1 p-8 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap gap-2 mb-4 items-center">
                    <span className="bg-accent text-accent-foreground text-xs font-black uppercase px-2 py-0.5 border-2 border-black">FEATURED</span>
                    {featured.tags?.map(tag => (
                      <span key={tag.id} className="text-xs font-black uppercase px-2 py-0.5 bg-white border border-black">#{tag.name}</span>
                    ))}
                  </div>
                  <h2 className="text-3xl font-black uppercase leading-tight mb-4 group-hover:underline decoration-4 underline-offset-4">
                    {featured.title}
                  </h2>
                  <p className="text-muted-foreground font-medium leading-relaxed line-clamp-3">
                    {stripMarkdown(featured.content).substring(0, 200)}...
                  </p>
                </div>
                <div className="flex justify-between items-center mt-6 pt-4 border-t-2 border-black text-xs font-black uppercase">
                  <span className="bg-muted px-2 py-1 border border-black">{featured.author?.name || 'Anonymous'}</span>
                  <div className="flex gap-3">
                    <span>{readingTime(featured.content)} min read</span>
                    <span>{new Date(featured.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Post grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rest.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.id} className="group flex flex-col bg-card border-4 border-black shadow-[4px_4px_0px_0px_black] hover:shadow-[8px_8px_0px_0px_black] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
              {/* Card header */}
              <div className="h-40 bg-secondary border-b-4 border-black flex items-center justify-center p-4 relative overflow-hidden">
                {/* Diagonal stripe decoration */}
                <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'repeating-linear-gradient(45deg, black 0, black 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px'}} />
                <span className="font-black text-3xl uppercase text-center leading-none break-words relative z-10">
                  {post.title.substring(0, 24)}
                </span>
              </div>
              {/* Card body */}
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {post.tags?.slice(0, 3).map(tag => (
                    <span key={tag.id} className="text-[10px] uppercase font-black bg-white border border-black px-1.5 py-0.5">#{tag.name}</span>
                  ))}
                </div>
                <h3 className="text-xl font-black uppercase leading-tight mb-3 group-hover:underline decoration-4 underline-offset-2">
                  {post.title}
                </h3>
                <p className="text-sm font-medium text-muted-foreground line-clamp-3 leading-relaxed mb-4">
                  {stripMarkdown(post.content).substring(0, 130)}...
                </p>
                <div className="mt-auto pt-3 border-t-2 border-black flex justify-between items-center text-[10px] font-black uppercase">
                  <span className="bg-muted px-2 py-0.5 border border-black">{post.author?.name || 'Anon'}</span>
                  <div className="flex gap-2">
                    <span>{readingTime(post.content)} min</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-black bg-foreground text-background mt-24">
        <div className="container mx-auto px-4 py-12 max-w-6xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <p className="font-black text-3xl uppercase tracking-tighter">stuff</p>
            <p className="font-bold text-background/60 uppercase text-xs mt-1">Unfiltered technology tales</p>
          </div>
          <div className="flex gap-6 font-black uppercase text-sm">
            <Link href="/" className="hover:text-background/60 transition-colors">Home</Link>
            <Link href="/dashboard" className="hover:text-background/60 transition-colors">Dashboard</Link>
            <Link href="/login" className="hover:text-background/60 transition-colors">Login</Link>
          </div>
          <p className="text-background/40 font-bold text-xs uppercase">
            © {new Date().getFullYear()} stuff
          </p>
        </div>
      </footer>
    </div>
  );
}
