import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, ArrowLeft } from 'lucide-react';

async function getPost(slug: string) {
  try {
    const res = await fetch(`http://localhost:4000/api/public/blog/${slug}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {}
  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Post Not Found — BITS Blog' };

  return {
    title: `${post.title} — BITS Institute Blog`,
    description: post.metaDescription || post.excerpt,
  };
}

export default async function BlogPostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen py-16">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#0056D2] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Publications</span>
        </Link>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-100 text-[#0056D2]">
              {post.category?.name}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#0056D2]" />
              {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recent'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-700 leading-relaxed italic border-l-4 border-[#0056D2] pl-4 bg-slate-50 py-3 rounded-r-xl">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-4 py-4 border-y border-slate-200 text-xs">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-[#0056D2] text-sm">
              {post.author?.user?.firstName?.[0] || 'B'}
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">
                {post.author?.user ? `${post.author.user.firstName} ${post.author.user.lastName}` : 'Faculty Specialist'}
              </div>
              <div className="text-slate-500">{post.author?.headline || 'BITS Cybersecurity Research Faculty'}</div>
            </div>
          </div>
        </div>

        <div className="prose max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-6">
          {post.content?.paragraphs?.map((p: string, idx: number) => (
            <p key={idx}>{p}</p>
          )) || (
            <p>
              Modern threat operations target distributed enterprise architectures. Organizations must establish strict zero-trust boundary validation, automated credential rotation, and continuous telemetry monitoring to defend against next-generation attack vectors.
            </p>
          )}
        </div>
      </article>
    </div>
  );
}
