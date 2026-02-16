'use client';

import { useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { AnimatedCard, FadeIn } from '@/components/ui/animated-card';
import { BlogThumbnail } from '@/components/blog/BlogThumbnail';
import { getLocalizedSlug, blogCategories, type BlogPost } from '@/lib/blog';

const POSTS_PER_PAGE = 9;

type CategoryFilter = 'All' | typeof blogCategories[number];

interface BlogPostListProps {
  posts: BlogPost[];
  locale: string;
  translations: {
    allCategories: string;
    categories: Record<string, string>;
    readMore: string;
    noPostsInCategory: string;
    pagination: { previous: string; next: string; page: string };
  };
}

export function BlogPostList({ posts, locale, translations }: BlogPostListProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const listRef = useRef<HTMLDivElement>(null);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: posts.length };
    for (const cat of blogCategories) {
      counts[cat] = posts.filter((p) => p.category === cat).length;
    }
    return counts;
  }, [posts]);

  const filteredPosts = useMemo(
    () => activeCategory === 'All' ? posts : posts.filter((p) => p.category === activeCategory),
    [posts, activeCategory]
  );

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  const handleCategoryChange = (cat: CategoryFilter) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const categories: CategoryFilter[] = ['All', ...blogCategories];

  return (
    <div ref={listRef}>
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          const label = cat === 'All' ? translations.allCategories : (translations.categories[cat] || cat);
          const count = categoryCounts[cat] || 0;
          return (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isActive ? 'bg-accent text-accent-foreground' : 'bg-muted text-text hover:bg-accent/10'
              }`}
            >
              {label}
              <span className={`inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full text-xs ${
                isActive ? 'bg-accent-foreground/15 text-accent-foreground' : 'bg-background text-text'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="space-y-8">
        {paginatedPosts.length === 0 && (
          <FadeIn>
            <div className="text-center py-12">
              <p className="text-text text-lg">{translations.noPostsInCategory}</p>
            </div>
          </FadeIn>
        )}
        {paginatedPosts.map((post, index) => (
          <FadeIn key={post.id} delay={index * 100}>
            <Link href={`/${locale}/blog/${getLocalizedSlug(post, locale)}`} className="block">
              <AnimatedCard className="p-6">
                <BlogThumbnail src={post.heroImage} alt={post.title} category={post.category} />
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-small text-accent font-medium">{post.category}</span>
                  <span className="text-small text-text flex items-center gap-1">
                    <Calendar className="w-4 h-4" />{formatDate(post.date)}
                  </span>
                  <span className="text-small text-text flex items-center gap-1">
                    <Clock className="w-4 h-4" />{post.readTime}
                  </span>
                </div>
                <h2 className="text-h3 mb-2 group-hover:text-accent transition-colors">{post.title}</h2>
                <p className="text-text mb-4">{post.excerpt}</p>
                <span className="inline-flex items-center gap-2 text-accent font-medium group-hover:gap-3 transition-all">
                  {translations.readMore}<ArrowRight className="w-4 h-4" />
                </span>
              </AnimatedCard>
            </Link>
          </FadeIn>
        ))}
      </div>

      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-2 mt-12" aria-label="Pagination">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-muted text-text hover:bg-accent/10 disabled:opacity-40 disabled:pointer-events-none">
            {translations.pagination.previous}
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button key={page} onClick={() => handlePageChange(page)} aria-current={page === currentPage ? 'page' : undefined}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                page === currentPage ? 'bg-accent text-accent-foreground' : 'bg-muted text-text hover:bg-accent/10'
              }`}>
              {page}
            </button>
          ))}
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-muted text-text hover:bg-accent/10 disabled:opacity-40 disabled:pointer-events-none">
            {translations.pagination.next}
          </button>
        </nav>
      )}
    </div>
  );
}
