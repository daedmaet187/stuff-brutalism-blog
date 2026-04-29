import HomepageClient from '@/components/homepage-client';

export default async function Home() {
  const postsRes = await fetch('http://localhost:3005/api/posts', { cache: 'no-store' }).catch(() => null);
  const posts = postsRes && postsRes.ok ? await postsRes.json() : [];

  return <HomepageClient posts={posts} />;
}
