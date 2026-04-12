import Link from 'next/link';

export default async function Home() {
  const postsRes = await fetch('http://localhost:3005/api/posts', { cache: 'no-store' }).catch(() => null);
  const posts = postsRes && postsRes.ok ? await postsRes.json() : [];

  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="border-b-2 bg-secondary sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-6xl">
          <Link href="/" className="text-2xl font-black uppercase tracking-tighter hover:scale-105 transition-transform origin-left">
            stuff
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm font-bold uppercase hover:bg-black hover:text-white px-2 py-1 border-2 border-transparent hover:border-black transition-colors">Home</Link>
            <Link href="/dashboard" className="text-sm font-bold uppercase bg-primary text-primary-foreground px-4 py-2 border-2 shadow-brutal shadow-brutal-hover active:shadow-none active:translate-x-1 active:translate-y-1">Dashboard</Link>
            <Link href="/login" className="text-sm font-bold uppercase bg-background px-4 py-2 border-2 shadow-brutal shadow-brutal-hover active:shadow-none active:translate-x-1 active:translate-y-1">Login</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-20 pb-32 max-w-6xl">
        <div className="max-w-3xl mb-24 space-y-8 bg-accent p-8 border-4 shadow-brutal transform -rotate-1 relative">
          <div className="absolute -top-6 -right-6 bg-primary text-white font-bold p-4 border-2 rotate-12 shadow-brutal">
            RAW INSIGHTS!
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
            Digital<br/>Frontier.
          </h1>
          <p className="text-xl font-bold max-w-2xl leading-relaxed">
            Unfiltered, sharp, and brutally honest technology engineering tales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-16">
          {posts.map((post: any) => (
            <Link href={`/blog/${post.slug}`} key={post.id} className="group flex flex-col bg-card border-4 origin-center hover:scale-[1.02] transition-transform duration-100 shadow-brutal shadow-brutal-hover active:shadow-none active:translate-x-1 active:translate-y-1">
              <div className="h-48 bg-primary border-b-4 relative w-full flex items-center justify-center overflow-hidden p-6 text-primary-foreground font-black text-4xl uppercase text-center break-words leading-none">
                 {post.title.substring(0, 20)}
              </div>
              <div className="p-6 flex flex-col flex-grow bg-background">
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags?.map((tag: any) => (
                    <span key={tag.id} className="text-[10px] uppercase font-black bg-white border-2 border-black px-2 py-0.5">#{tag.name}</span>
                  ))}
                  {(!post.tags || post.tags.length === 0) && (
                    <span className="text-[10px] uppercase font-black bg-secondary border-2 border-black px-2 py-0.5">#{post.category?.name || 'Uncategorized'}</span>
                  )}
                </div>
                <h3 className="text-2xl font-black mb-3 leading-tight uppercase group-hover:underline decoration-4 underline-offset-4">{post.title}</h3>
                <p className="font-medium mb-6 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{post.content.replace(/#|!\[.*?\]\(.*?\)|`|\*/g, '').substring(0, 150)}...</p>
                <div className="mt-auto pt-4 border-t-2 flex justify-between items-center text-xs font-black uppercase">
                  <span className="bg-muted px-2 py-1 border">{post.author?.name || 'Anonymous'}</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
          {posts.length === 0 && (
             <div className="col-span-full py-20 bg-muted border-4 shadow-brutal text-center">
                <h3 className="text-4xl font-black uppercase mb-4">No content found</h3>
                <p className="font-bold text-lg">Check back later or hit the dashboard.</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}
