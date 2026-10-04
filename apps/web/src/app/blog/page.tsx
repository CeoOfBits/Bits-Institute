import React from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight, Sparkles } from 'lucide-react';

async function getBlogPosts() {
  try {
    const res = await fetch('http://localhost:4000/api/public/blog', {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      return data.items || [];
    }
  } catch (err) {}
  return [];
}

export const metadata = {
  title: 'Tech Insights & Cybersecurity Research — BITS Institute Blog',
  description: 'Technical analyses, networking architectures, and cybersecurity insights from BITS faculty.',
};

export default async function BlogIndexPage() {
  const posts = await getBlogPosts();

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#0056D2] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#0056D2]" />
            <span>BITS Institute Faculty Publications</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Technology & Cyber Security Insights
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            In-depth technical guides, enterprise vulnerability analyses, zero-trust architectures, and career strategies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: any) => (
            <article
              key={post.id}
              className="blue-card rounded-2xl p-7 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#0056D2]">
                    {post.category?.name || 'Cyber Security'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#0056D2]" />
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Recent'}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-slate-900 hover:text-[#0056D2] transition-colors leading-snug">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-[#0056D2] text-xs font-bold">
                    {post.author?.user?.firstName?.[0] || 'B'}
                  </div>
                  <span className="text-xs text-slate-700 font-medium">
                    {post.author?.user ? `${post.author.user.firstName} ${post.author.user.lastName}` : 'Faculty Staff'}
                  </span>
                </div>

                <Link
                  href={`/blog/${post.slug}`}
                  className="flex items-center gap-1 text-xs font-bold text-[#0056D2] hover:text-[#0041a8] group"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
