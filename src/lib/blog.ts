// Blog post metadata - managed by n8n workflow
// New posts are prepended to the array (newest first)

export interface BlogPostMeta {
  id: string;        // Unique ID, format: "loka-{timestamp}"
  slug: string;      // URL-safe slug, e.g., "interactive-whiteboard-teaching-20260215"
  slugs?: {          // Optional locale-specific slugs for AI SEO
    ja?: string;
    ko?: string;
  };
  date: string;      // ISO date, e.g., "2026-02-15"
  category: string;  // One of: "Platform", "Learning Science", "AI", "Teaching", "Assessment", "Technology", "Trending"
  readTime: string;  // e.g., "8 min read"
  author: string;    // e.g., "Loka Team"
  heroImage?: string; // Optional AI-generated hero image URL
}

export interface BlogPost extends BlogPostMeta {
  title: string;
  excerpt: string;
  content: string;
}

export interface BlogMessages {
  blog: {
    pageTitle: string;
    pageSubtitle: string;
    backToBlog: string;
    readMore: string;
    noPosts?: string;
    posts: {
      [id: string]: {
        title: string;
        excerpt: string;
        content: string;
      };
    };
  };
}

// Blog posts array - n8n workflow prepends new posts here
// DO NOT manually edit - changes will be overwritten by automation
export const blogPosts: BlogPostMeta[] = [
  {
    id: 'loka-1771297210445',
    slug: 'ai-language-teaching-assistant-2026-20260217',
    date: '2026-02-17',
    category: 'AI',
    readTime: '9 min read',
    author: 'Ryan Ahamer',
    heroImage: 'https://tskaeijjtjnbjofecpiz.supabase.co/storage/v1/object/public/blog-images/heroes/loka-1771297210445.png',
  },
  {
    id: 'loka-1771237807261',
    slug: 'spaced-repetition-language-learning-2026-20260216',
    slugs: {
      ko: 'the-living-textbook--20260216',
      ja: 'the-living-textbook--20260216',
    },
    date: '2026-02-16',
    category: 'Learning Science',
    readTime: '8 min read',
    author: 'Ryan Ahamer',
  },
  {
    id: 'loka-1771077825805',
    slug: 'interactive-whiteboard-language-teaching-20260215',
    date: '2026-02-14',
    category: 'Platform',
    readTime: '8 min read',
    author: 'Ryan Ahamer',
  },
];

// LTB blog categories — product and learning science focused
export const blogCategories = ['Platform', 'Learning Science', 'AI', 'Teaching', 'Assessment', 'Technology', 'Trending'] as const;
export type BlogCategory = typeof blogCategories[number];

// Helper: get localized slug or fallback to base slug
export function getLocalizedSlug(post: BlogPostMeta, locale: string): string {
  if (locale === 'en') return post.slug;
  const localizedSlug = post.slugs?.[locale as keyof typeof post.slugs];
  return localizedSlug || post.slug;
}

// Helper: find which locale a slug belongs to
export function findSlugLocale(slug: string): { post: BlogPostMeta; locale: string } | undefined {
  const decodedSlug = decodeURIComponent(slug);
  for (const post of blogPosts) {
    if (post.slug === decodedSlug) return { post, locale: 'en' };
    if (post.slugs?.ja === decodedSlug) return { post, locale: 'ja' };
    if (post.slugs?.ko === decodedSlug) return { post, locale: 'ko' };
  }
  return undefined;
}

// Helper: get full blog post with content from messages
export function getFullBlogPost(slug: string, messages: BlogMessages, locale?: string): BlogPost | undefined {
  const decodedSlug = decodeURIComponent(slug);

  const meta = blogPosts.find(post => {
    if (locale === 'ja' && post.slugs?.ja === decodedSlug) return true;
    if (locale === 'ko' && post.slugs?.ko === decodedSlug) return true;
    return post.slug === decodedSlug;
  });
  if (!meta) return undefined;

  const postContent = messages.blog?.posts?.[meta.id];
  if (!postContent) return undefined;

  return { ...meta, ...postContent };
}

// Helper: get all blog posts with content
export function getAllBlogPosts(messages: BlogMessages): BlogPost[] {
  return blogPosts
    .map(meta => {
      const postContent = messages.blog?.posts?.[meta.id];
      if (!postContent) return null;
      return { ...meta, ...postContent };
    })
    .filter((post): post is BlogPost => post !== null);
}

// Helper: get blog posts filtered by category
export function getBlogPostsByCategory(category: string, messages: BlogMessages): BlogPost[] {
  return getAllBlogPosts(messages).filter(post => post.category === category);
}
