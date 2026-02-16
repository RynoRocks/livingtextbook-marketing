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
    id: 'loka-1771237807261',
    slug: 'spaced-repetition-language-learning-2026-20260216',
    slugs: {
      ja: 'the-living-textbook--20260216',
    },
    date: '2026-02-16',
    category: 'Learning Science',
    readTime: '8 min read',
    author: 'Ryan Ahamer',
    heroImage: '/images/blog/default-hero.jpg',
  },
  {
    id: 'loka-1771077825805',
    slug: 'interactive-whiteboard-language-teaching-20260215',
    date: '2026-02-14',
    category: 'Platform',
    readTime: '8 min read',
    author: 'Ryan Ahamer',
    heroImage: '/images/blog/default-hero.jpg',
  },];

// Helper: get localized slug or fallback to base slug
export function getLocalizedSlug(post: BlogPostMeta, locale: string): string {
  if (locale === 'en') return post.slug;
  const localizedSlug = post.slugs?.[locale as keyof typeof post.slugs];
  return localizedSlug || post.slug;
}

// Helper: find blog post by slug (supports locale-specific slugs)
export function getBlogPost(slug: string, locale: string): BlogPostMeta | undefined {
  const decodedSlug = decodeURIComponent(slug);
  return blogPosts.find((post) => {
    if (locale === 'en') return post.slug === decodedSlug;
    const localizedSlug = post.slugs?.[locale as keyof typeof post.slugs];
    return localizedSlug === decodedSlug || post.slug === decodedSlug;
  });
}
